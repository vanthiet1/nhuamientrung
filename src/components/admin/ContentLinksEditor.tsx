"use client";

import { useMemo, useRef, useState } from "react";
import { Link2, Plus, Trash2, Wand2 } from "lucide-react";
import { Field, inputClass, textareaClass } from "@/components/admin/FormField";
import {
  autoLinkXemThem,
  extractMarkdownLinks,
  removeLink,
  updateLinkHref,
  updateLinkText,
} from "@/lib/cms/content-links";

type Props = {
  name?: string;
  label?: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
};

export default function ContentLinksEditor({
  name = "content",
  label = "Nội dung",
  defaultValue = "",
  rows = 12,
  hint,
}: Props) {
  const [content, setContent] = useState(defaultValue);
  const [selText, setSelText] = useState("");
  const [selHref, setSelHref] = useState("/san-pham");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const links = useMemo(() => extractMarkdownLinks(content), [content]);

  function onSelect() {
    const el = taRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start !== end) {
      setSelText(content.slice(start, end));
    }
  }

  function insertLink() {
    const el = taRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end) || selText || "Xem thêm";
    const href = selHref.trim() || "/san-pham";
    const md = `[${selected}](${href})`;
    const next = content.slice(0, start) + md + content.slice(end);
    setContent(next);
    setSelText("");
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + md.length;
      el.setSelectionRange(pos, pos);
    });
  }

  function applyAutoLinks() {
    setContent((c) => autoLinkXemThem(c));
  }

  return (
    <div className="space-y-3">
      <Field
        label={label}
        hint={
          hint ||
          "Hỗ trợ link markdown: [nội dung](/san-pham/...). Dòng “Xem thêm: …” có thể tự gắn backlink."
        }
      >
        <textarea
          ref={taRef}
          name={name}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onSelect={onSelect}
          onKeyUp={onSelect}
          onMouseUp={onSelect}
          className={textareaClass}
          rows={rows}
        />
      </Field>

      {/* Quick insert */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <Link2 className="h-4 w-4 text-brand-600" />
            Chèn / sửa link nội bộ
          </p>
          <button
            type="button"
            onClick={applyAutoLinks}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Tự gắn link “Xem thêm”
          </button>
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            type="text"
            value={selText}
            onChange={(e) => setSelText(e.target.value)}
            placeholder="Bôi đen chữ trong nội dung hoặc gõ nhãn link"
            className={inputClass}
          />
          <input
            type="text"
            value={selHref}
            onChange={(e) => setSelHref(e.target.value)}
            placeholder="/san-pham/mang-co-pvc"
            className={inputClass}
            list="internal-routes"
          />
          <datalist id="internal-routes">
            <option value="/san-pham" />
            <option value="/san-pham/mang-co-pvc" />
            <option value="/san-pham/mang-co-pe" />
            <option value="/san-pham/mang-co-pof" />
            <option value="/san-pham/mang-co-pet" />
            <option value="/san-pham/mang-co-in-nhiet" />
            <option value="/san-pham/mang-phuc-hop" />
            <option value="/san-pham/mang-opp-mang-bopp" />
            <option value="/lien-he" />
            <option value="/tin-tuc" />
            <option value="/gioi-thieu" />
          </datalist>
          <button
            type="button"
            onClick={insertLink}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-brand-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Chèn link
          </button>
        </div>

        {/* Editable existing links */}
        {links.length > 0 ? (
          <ul className="mt-4 space-y-2 border-t border-slate-200 pt-3">
            <li className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              {links.length} link trong bài — sửa URL bên dưới
            </li>
            {links.map((link, i) => (
              <li
                key={`${link.start}-${i}`}
                className="grid gap-2 rounded-xl border border-slate-200 bg-white p-2.5 sm:grid-cols-[1fr_1.2fr_auto]"
              >
                <input
                  type="text"
                  value={link.text}
                  onChange={(e) =>
                    setContent((c) => updateLinkText(c, i, e.target.value))
                  }
                  className={inputClass}
                  title="Nhãn hiển thị"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) =>
                    setContent((c) => updateLinkHref(c, i, e.target.value))
                  }
                  className={inputClass}
                  title="Đường dẫn nội bộ"
                  list="internal-routes"
                />
                <button
                  type="button"
                  onClick={() => setContent((c) => removeLink(c, i))}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-red-600 hover:border-red-300 hover:bg-red-50"
                  title="Gỡ link (giữ chữ)"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs text-slate-500">
            Chưa có link markdown. Bôi đen đoạn chữ → chọn URL →{" "}
            <strong>Chèn link</strong>, hoặc bấm{" "}
            <strong>Tự gắn link “Xem thêm”</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
