import { ChevronDown, FileText } from "lucide-react";
import { cleanRawContent } from "@/lib/cms/content-links";

/**
 * Render product content: plain text + auto tables from scraped pipe layout
 * e.g.
 *   ĐỘ DÀY |
 *   CHIỀU DÀI/CUỘN |
 *   12µm |
 *   1.667 m/cuộn |
 */

function norm(line: string) {
  return line.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

/** Line is a table cell from scrape (has | and real text) */
function isPipeCell(line: string): boolean {
  const t = norm(line);
  if (!t || /^[|.\-\s]+$/.test(t)) return false;
  return t.includes("|") && t.replace(/\|/g, "").trim().length > 0;
}

function cleanCell(line: string): string {
  return norm(line)
    .replace(/\|/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Lone junk lines from scrape */
function isJunkLine(line: string): boolean {
  const t = norm(line);
  return !t || t === "|" || /^[|.\-\s]+$/.test(t);
}

type Block =
  | { type: "table2"; headers: [string, string]; rows: [string, string][] }
  | { type: "tableKV"; rows: [string, string][] }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

function parseContent(content: string): Block[] {
  let cleanStr = cleanRawContent(content, false)
    .replace(/\[caption[^\]]*\]/g, "")
    .replace(/\[\/caption\]/g, "");

  const lines = cleanStr.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    if (isJunkLine(lines[i])) {
      i++;
      continue;
    }

    // ── 2-column pipe table (header pair + value pairs) ──
    if (isPipeCell(lines[i])) {
      const cells: string[] = [];
      let j = i;
      while (j < lines.length) {
        if (isJunkLine(lines[j])) {
          j++;
          continue;
        }
        if (isPipeCell(lines[j])) {
          cells.push(cleanCell(lines[j]));
          j++;
          continue;
        }
        break;
      }

      if (cells.length >= 4 && cells.length % 2 === 0) {
        const headers: [string, string] = [cells[0], cells[1]];
        const rows: [string, string][] = [];
        for (let k = 2; k < cells.length; k += 2) {
          rows.push([cells[k], cells[k + 1]]);
        }
        // Heuristic: first row looks like headers if both short / uppercase-ish
        blocks.push({ type: "table2", headers, rows });
        i = j;
        continue;
      }

      // Not enough cells — fall through as paragraphs
      for (const c of cells) {
        blocks.push({ type: "paragraph", text: c });
      }
      i = j;
      continue;
    }

    // ── Key–value table: label + value (value may have |) ──
    // e.g. "Tỷ trọng" / "961 Kg/m3"  or  "Khả năng kéo giãn" / "100 - 110% |"
    if (
      i + 1 < lines.length &&
      !isJunkLine(lines[i]) &&
      !isPipeCell(lines[i]) &&
      !isJunkLine(lines[i + 1]) &&
      (isPipeCell(lines[i + 1]) || looksLikeSpecValue(lines[i + 1]))
    ) {
      const rows: [string, string][] = [];
      let j = i;
      while (j + 1 < lines.length) {
        // skip blanks
        while (j < lines.length && isJunkLine(lines[j])) j++;
        if (j >= lines.length) break;

        const labelLine = lines[j];
        if (isPipeCell(labelLine)) break; // leave for pipe table parser

        // find next non-junk as value
        let k = j + 1;
        while (k < lines.length && isJunkLine(lines[k])) k++;
        if (k >= lines.length) break;

        const valueLine = lines[k];
        if (
          !isPipeCell(valueLine) &&
          !looksLikeSpecValue(valueLine)
        ) {
          break;
        }
        // label shouldn't look like a long paragraph
        const label = norm(labelLine);
        if (label.length > 80 || /[.!?]$/.test(label) && label.length > 40) {
          break;
        }

        rows.push([
          label,
          isPipeCell(valueLine) ? cleanCell(valueLine) : norm(valueLine),
        ]);
        j = k + 1;
      }

      if (rows.length >= 2) {
        blocks.push({ type: "tableKV", rows });
        i = j;
        continue;
      }
    }

    // ── Bullet list ──
    const t = norm(lines[i]);
    if (/^[•·▪\-\*]\s*/.test(t) || /^[•·]/.test(t)) {
      const items: string[] = [];
      let j = i;
      while (j < lines.length) {
        if (isJunkLine(lines[j])) {
          j++;
          // allow one blank between bullets
          if (j < lines.length && /^[•·▪\-\*]/.test(norm(lines[j]))) continue;
          // peek if next is still bullet after blank
          let k = j;
          while (k < lines.length && isJunkLine(lines[k])) k++;
          if (k < lines.length && /^[•·▪\-\*]/.test(norm(lines[k]))) {
            j = k;
            continue;
          }
          break;
        }
        const lt = norm(lines[j]);
        if (/^[•·▪\-\*]\s*/.test(lt) || /^[•·]/.test(lt)) {
          items.push(lt.replace(/^[•·▪\-\*]+\s*/, "").trim());
          j++;
          continue;
        }
        break;
      }
      if (items.length) {
        blocks.push({ type: "list", items });
        i = j;
        continue;
      }
    }

    // ── Heading (ALL CAPS short line or known titles) ──
    if (
      t.length > 3 &&
      t.length < 100 &&
      !t.includes("|") &&
      (t === t.toUpperCase() ||
        /^(BẢNG|QUY CÁCH|CÔNG DỤNG|ĐẶC ĐIỂM|THÔNG SỐ|CÁCH )/i.test(t))
    ) {
      // not all-caps vietnamese if mixed - still allow known prefixes
      const letters = t.replace(/[^A-Za-zÀ-ỹ]/g, "");
      const upperRatio =
        letters.length > 0
          ? [...letters].filter((c) => c === c.toUpperCase() && c !== c.toLowerCase()).length /
            letters.length
          : 0;
      if (upperRatio > 0.6 || /^(BẢNG|QUY CÁCH|CÔNG DỤNG|ĐẶC ĐIỂM|THÔNG SỐ|CÁCH )/i.test(t)) {
        blocks.push({ type: "heading", text: t });
        i++;
        continue;
      }
    }

    // ── Paragraph (merge consecutive non-special lines) ──
    const para: string[] = [];
    let j = i;
    while (j < lines.length) {
      if (isJunkLine(lines[j])) {
        if (para.length) break;
        j++;
        continue;
      }
      if (isPipeCell(lines[j])) break;
      if (/^[•·▪\-\*]/.test(norm(lines[j]))) break;
      para.push(norm(lines[j]));
      j++;
      // stop at blank after content
      if (j < lines.length && isJunkLine(lines[j])) break;
    }
    if (para.length) {
      blocks.push({ type: "paragraph", text: para.join(" ") });
      i = j + (j < lines.length && isJunkLine(lines[j]) ? 1 : 0);
      continue;
    }

    i++;
  }

  return blocks;
}

function looksLikeSpecValue(line: string): boolean {
  const t = norm(line);
  if (!t || t.length > 60) return false;
  // numbers / units / short technical values
  return (
    /\d/.test(t) &&
    (/[%°℃]|N\/m|Kg\/m|µm|mm|m\/|g\/cm|kg/i.test(t) || t.length < 40)
  );
}

function TableWrap({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption?: string;
}) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      {caption && (
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          {caption}
        </div>
      )}
      <table className="w-full min-w-[280px] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export default function ProductContent({ content }: { content: string }) {
  if (!content?.trim()) return null;

  // Simple heuristic: if it contains HTML tags, render directly.
  const hasHtml = /<\/[a-z]+>|<[a-z]+\s*\/>/i.test(content) || /<[a-z]+[^>]*>/i.test(content);

  if (hasHtml) {
    // Cleanup old scraped artifacts like rn, rnrn, and WordPress shortcodes
    const cleanStr = cleanRawContent(content, true)
      .replace(/\[caption[^\]]*\]/g, "")
      .replace(/\[\/caption\]/g, "");

    return (
      <div 
        className="product-content mt-6 text-sm leading-relaxed text-slate-600 sm:text-[15px] prose prose-slate max-w-none prose-img:rounded-xl prose-img:m-0 [&>h2]:text-base [&>h2]:font-extrabold [&>h2]:text-slate-900 [&>h2]:sm:text-lg [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-slate-900"
        dangerouslySetInnerHTML={{ __html: cleanStr }} 
      />
    );
  }

  const blocks = parseContent(content);

  return (
    <div className="product-content mt-6 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
      {blocks.map((b, i) => {
        if (b.type === "heading") {
          return (
            <h3
              key={i}
              className="mt-6 mb-2 text-base font-extrabold text-slate-900 sm:text-lg first:mt-0"
            >
              {b.text}
            </h3>
          );
        }
        if (b.type === "paragraph") {
          return (
            <p key={i} className="text-slate-600">
              {b.text}
            </p>
          );
        }
        if (b.type === "list") {
          return (
            <ul key={i} className="my-2 list-disc space-y-1.5 pl-5 text-slate-600">
              {b.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        if (b.type === "table2") {
          return (
            <TableWrap key={i}>
              <thead>
                <tr className="bg-brand-600 text-white">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide sm:text-sm">
                    {b.headers[0]}
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide sm:text-sm">
                    {b.headers[1]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className={
                      ri % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50/90"
                    }
                  >
                    <td className="border-t border-slate-100 px-4 py-2.5 font-semibold text-slate-800">
                      {row[0]}
                    </td>
                    <td className="border-t border-slate-100 px-4 py-2.5 text-slate-700">
                      {row[1]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          );
        }
        if (b.type === "tableKV") {
          return (
            <TableWrap key={i} caption="Thông số kỹ thuật">
              <thead>
                <tr className="bg-brand-600 text-white">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide sm:text-sm">
                    Đặc tính
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide sm:text-sm">
                    Giá trị
                  </th>
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className={ri % 2 === 0 ? "bg-white" : "bg-slate-50/90"}
                  >
                    <td className="border-t border-slate-100 px-4 py-2.5 font-semibold text-slate-800">
                      {row[0]}
                    </td>
                    <td className="border-t border-slate-100 px-4 py-2.5 text-slate-700">
                      {row[1]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          );
        }
        return null;
      })}
    </div>
  );
}
