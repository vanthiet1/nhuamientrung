/**
 * Markdown link helpers + auto map "Xem thêm" CTAs → internal URLs
 */

export type ContentLink = {
  /** full match e.g. [text](url) */
  raw: string;
  text: string;
  href: string;
  start: number;
  end: number;
};

const MD_LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Cleans up raw text from database scrapes, mostly dealing with broken "rn" (carriage returns).
 * @param content The raw content string
 * @param asHtml If true, keeps <br /> tags. If false, converts them back to \n
 */
export function cleanRawContent(content: string, asHtml: boolean = false): string {
  if (!content) return "";
  
  let s = content;

  // 1. Normalize literal "rn" (broken \r\n from old scrapes)
  // Must run BEFORE HTML tag logic so we catch all positions
  s = s
    // rn between tags: <tag>rn<tag> → <tag><tag>
    .replace(/>\s*rn\s*</g, '><')
    // rn right before a closing tag: rn</tag> → </tag>
    .replace(/rn(<\/)/g, '$1')
    // rn right after opening tag: >rn → >
    .replace(/(>)rn/g, '$1')
    // remaining rn sequences → newline (we'll convert later)
    .replace(/rnrn+/g, '\n\n')
    .replace(/rn/g, '\n');

  // 2. Strip outer wrapper divs that were scraped from the source CMS
  // e.g. <div class="main-tit">...</div> <div class="content">...</div>
  s = s
    .replace(/<div[^>]*class=["'][^"']*main-tit[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi, '$1')
    .replace(/<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi, '$1');

  // 3. Clean up HTML entities left over
  s = s
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');

  // 4. Remove multiple blank lines
  s = s.replace(/\n{3,}/g, '\n\n').trim();

  if (asHtml) {
    // Convert \n to <br /> for HTML output
    s = s.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />');
  }
  
  return s;
}

/** Keyword → internal path (order matters: more specific first) */
const KEYWORD_ROUTES: { test: RegExp; href: string }[] = [
  { test: /màng\s*co\s*pvc.*bọc\s*quà|bọc\s*quà.*pvc|giỏ\s*quà/i, href: "/danh-muc/mang-co-pvc" },
  { test: /màng\s*co\s*pe.*thực\s*phẩm|pe\s*cho\s*thực\s*phẩm|màng\s*co\s*pe/i, href: "/danh-muc/mang-co-pe" },
  { test: /màng\s*co\s*pof|pof/i, href: "/danh-muc/mang-co-pof" },
  { test: /màng\s*co\s*pet|pet/i, href: "/danh-muc/mang-co-pet" },
  { test: /in\s*nhiệt|in\s*màng\s*co|logo/i, href: "/danh-muc/mang-co-in-nhiet" },
  { test: /phức\s*hợp|túi\s*đựng|gạo/i, href: "/danh-muc/mang-phuc-hop" },
  { test: /opp|bopp/i, href: "/danh-muc/mang-opp-mang-bopp" },
  { test: /màng\s*co\s*pvc|pvc/i, href: "/danh-muc/mang-co-pvc" },
  { test: /báo\s*giá|liên\s*hệ|tư\s*vấn/i, href: "/lien-he" },
  { test: /màng\s*co|bao\s*bì|đóng\s*gói/i, href: "/danh-muc" },
];

export function resolveInternalHref(text: string): string {
  const t = text.trim();
  for (const rule of KEYWORD_ROUTES) {
    if (rule.test.test(t)) return rule.href;
  }
  return "/danh-muc";
}

export function extractMarkdownLinks(content: string): ContentLink[] {
  const links: ContentLink[] = [];
  const re = new RegExp(MD_LINK_RE.source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    links.push({
      raw: m[0],
      text: m[1],
      href: m[2],
      start: m.index,
      end: m.index + m[0].length,
    });
  }
  return links;
}

/** Replace href of i-th markdown link in content */
export function updateLinkHref(
  content: string,
  index: number,
  newHref: string
): string {
  const links = extractMarkdownLinks(content);
  const link = links[index];
  if (!link) return content;
  const safe = newHref.trim() || "/";
  const replacement = `[${link.text}](${safe})`;
  return content.slice(0, link.start) + replacement + content.slice(link.end);
}

export function updateLinkText(
  content: string,
  index: number,
  newText: string
): string {
  const links = extractMarkdownLinks(content);
  const link = links[index];
  if (!link) return content;
  const text = newText.trim() || link.text;
  const replacement = `[${text}](${link.href})`;
  return content.slice(0, link.start) + replacement + content.slice(link.end);
}

export function removeLink(content: string, index: number): string {
  const links = extractMarkdownLinks(content);
  const link = links[index];
  if (!link) return content;
  // keep visible text only
  return content.slice(0, link.start) + link.text + content.slice(link.end);
}

/**
 * Convert plain "▷▷▷ Xem thêm: ..." lines into markdown internal links.
 * Skip if already a markdown link.
 */
export function autoLinkXemThem(content: string): string {
  if (!content) return content;
  return content
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      // already linked
      if (/\[.*Xem thêm.*\]\(/i.test(trimmed)) return line;
      // match variants
      const m = trimmed.match(
        /^(?:▷+\s*)?(?:\*\*)?Xem thêm:\s*(.+?)(?:\*\*)?\.?\s*$/i
      );
      if (!m) return line;
      let labelText = m[1].replace(/\*+/g, "").replace(/\s+/g, " ").trim();
      // strip trailing junk
      labelText = labelText.replace(/\.+$/, "").trim();
      const display = `▷▷▷ Xem thêm: ${labelText}`;
      const href = resolveInternalHref(labelText);
      // preserve leading indent if any
      const indent = line.match(/^\s*/)?.[0] || "";
      return `${indent}[${display}](${href})`;
    })
    .join("\n");
}

/** Escape HTML */
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Convert markdown-ish inline content to safe HTML with internal links.
 * Supports: [text](url), **bold**, auto plain Xem thêm lines
 */
export function inlineToHtml(text: string): string {
  // First auto-link plain xem them if still plain
  let s = text;
  // markdown links → <a>
  s = s.replace(MD_LINK_RE, (_full, label: string, href: string) => {
    const safeHref = href.startsWith("/") || href.startsWith("http")
      ? href
      : `/${href}`;
    const isInternal = safeHref.startsWith("/");
    const rel = isInternal ? "" : ' rel="noopener noreferrer" target="_blank"';
    return `<a href="${esc(safeHref)}" class="font-bold text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-accent-600"${rel}>${esc(label)}</a>`;
  });
  // bold
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return s;
}

/** Process full article content blocks for display */
export function enhanceContentForDisplay(content: string): string {
  return autoLinkXemThem(content || "");
}
