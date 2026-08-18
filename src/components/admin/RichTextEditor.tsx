"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { Field } from "@/components/admin/FormField";
import { Code, Type } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false, 
  loading: () => <div className="h-[300px] animate-pulse bg-slate-50 rounded-b-xl border-t border-slate-200"></div> 
});

// We will move modules inside the component to use refs/toast

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "link",
  "image",
  "video",
  "color",
  "background",
  "align",
];

type Props = {
  name?: string;
  label?: string;
  defaultValue?: string;
  hint?: string;
};

export default function RichTextEditor({
  name = "content",
  label = "Nội dung",
  defaultValue = "",
  hint,
}: Props) {
  const [content, setContent] = useState(defaultValue);
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const quillRef = useRef<any>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "news");

      const loadingToast = toast.loading("Đang tải ảnh lên...");

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        
        if (res.ok) {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, "image", data.url);
          }
          toast.success("Tải ảnh thành công!", { id: loadingToast });
        } else {
          toast.error(data.error || "Lỗi tải ảnh", { id: loadingToast });
        }
      } catch (err) {
        toast.error("Lỗi tải ảnh", { id: loadingToast });
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  return (
    <div className="space-y-2">
      <Field label={label} hint={hint}>
      
      {/* Hidden input to ensure native form submission picks up the data */}
      <input type="hidden" name={name} value={content} />
      
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-shadow">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 p-1.5 px-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMode("visual")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                mode === "visual" 
                  ? "bg-white text-brand-700 shadow-sm ring-1 ring-slate-200" 
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <Type className="h-4 w-4" />
              Giao diện trực quan
            </button>
            <button
              type="button"
              onClick={() => setMode("html")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                mode === "html" 
                  ? "bg-white text-brand-700 shadow-sm ring-1 ring-slate-200" 
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <Code className="h-4 w-4" />
              Mã HTML
            </button>
          </div>
        </div>
        
        <div className="p-0">
          {mode === "visual" ? (
            <ReactQuill
              // @ts-expect-error Next.js dynamic component strips ref type but forwards it at runtime
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
            />
          ) : (
             <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="block w-full min-h-[400px] border-none bg-slate-900 p-4 font-mono text-sm text-slate-50 focus:ring-0 resize-y"
              placeholder="<!-- Nhập hoặc dán mã HTML tại đây -->"
            />
          )}
        </div>
      </div>
      </Field>
      
      {/* Global overrides to make Quill match the UI theme */}
      <style dangerouslySetInnerHTML={{__html: `
        .ql-toolbar.ql-snow { 
          border: none !important; 
          border-bottom: 1px solid #e2e8f0 !important; 
          background-color: white; 
          padding: 12px 16px !important; 
        }
        .ql-container.ql-snow { 
          border: none !important; 
          min-height: 400px; 
          font-family: inherit !important; 
          font-size: 16px !important; 
        }
        .ql-editor { 
          min-height: 400px; 
          padding: 1.5rem !important; 
          line-height: 1.7 !important;
        }
        /* Prose styling within editor for better preview */
        .ql-editor h2 { font-size: 1.5em; font-weight: 700; margin-bottom: 0.5em; }
        .ql-editor h3 { font-size: 1.25em; font-weight: 700; margin-bottom: 0.5em; }
        .ql-editor p { margin-bottom: 1em; }
        .ql-editor img { border-radius: 0.5rem; max-width: 100%; height: auto; margin: 1rem 0; }
        .ql-editor a { color: #0284c7; text-decoration: underline; }
      `}} />
    </div>
  );
}
