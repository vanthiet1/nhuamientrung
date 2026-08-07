"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Send,
  Loader2,
  FileText,
  Upload,
  X,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import {
  MIN_FORM_MS,
  formatPhoneDisplay,
  phoneErrorMessage,
} from "@/lib/contact-validation";

type RequestType = "contact" | "career";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneHint, setPhoneHint] = useState<string | null>(null);
  const [openedAt, setOpenedAt] = useState(0);
  const [requestType, setRequestType] = useState<RequestType>("contact");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOpenedAt(Date.now());
  }, []);

  function onPhoneChange(value: string) {
    setPhone(value);
    if (!value.trim()) {
      setPhoneHint(null);
      return;
    }
    setPhoneHint(phoneErrorMessage(value));
  }

  function onPhoneBlur() {
    if (!phone.trim()) return;
    const err = phoneErrorMessage(phone);
    setPhoneHint(err);
    if (!err) setPhone(formatPhoneDisplay(phone));
  }

  function onCvPick(file: File | null) {
    setCvError(null);
    if (!file) {
      setCvFile(null);
      return;
    }
    const okType =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!okType) {
      setCvFile(null);
      setCvError("Chỉ chấp nhận file PDF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvFile(null);
      setCvError("File CV tối đa 5MB");
      return;
    }
    setCvFile(file);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    setCvError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const phoneVal = String(data.get("phone") || "");
    const pErr = phoneErrorMessage(phoneVal);
    if (pErr) {
      setPhoneHint(pErr);
      setStatus("error");
      setMessage(pErr);
      return;
    }

    if (requestType === "career" && !cvFile) {
      setCvError("Vui lòng đính kèm CV (PDF)");
      setStatus("error");
      setMessage("Vui lòng đính kèm file CV định dạng PDF");
      return;
    }

    const elapsed = Date.now() - openedAt;
    if (openedAt > 0 && elapsed < MIN_FORM_MS) {
      await new Promise((r) => setTimeout(r, MIN_FORM_MS - elapsed + 50));
    }

    const fd = new FormData();
    fd.set("name", String(data.get("name") || ""));
    fd.set("phone", formatPhoneDisplay(phoneVal));
    fd.set("email", String(data.get("email") || ""));
    fd.set("subject", String(data.get("subject") || ""));
    fd.set("content", String(data.get("content") || ""));
    fd.set("type", requestType);
    fd.set("website", String(data.get("website") || ""));
    fd.set("_t", String(openedAt));
    if (requestType === "career" && cvFile) {
      fd.set("cv", cvFile);
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error || "Gửi thất bại, vui lòng thử lại.");
        return;
      }
      setStatus("ok");
      setMessage(
        requestType === "career"
          ? "Cảm ơn bạn đã gửi CV! Bộ phận nhân sự sẽ liên hệ nếu hồ sơ phù hợp."
          : "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất."
      );
      form.reset();
      setPhone("");
      setPhoneHint(null);
      setCvFile(null);
      setRequestType("contact");
      setOpenedAt(Date.now());
      if (cvInputRef.current) cvInputRef.current.value = "";
    } catch {
      setStatus("error");
      setMessage(
        "Không gửi được yêu cầu. Vui lòng gọi hotline hoặc thử lại sau."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot */}
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden
        tabIndex={-1}
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      {/* Request type */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">
          Loại yêu cầu <span className="text-accent-500">*</span>
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setRequestType("contact");
              setCvError(null);
            }}
            className={`flex items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition ${
              requestType === "contact"
                ? "border-brand-400 bg-brand-50 ring-2 ring-brand-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                requestType === "contact"
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-900">
                Yêu cầu liên hệ
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Báo giá, tư vấn sản phẩm, hỗ trợ khác
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRequestType("career")}
            className={`flex items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition ${
              requestType === "career"
                ? "border-violet-400 bg-violet-50 ring-2 ring-violet-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                requestType === "career"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <Briefcase className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-900">
                Gửi CV tuyển dụng
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Ứng tuyển — đính kèm CV PDF
              </span>
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Họ và tên <span className="text-accent-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={80}
            className="input-field"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Số điện thoại <span className="text-accent-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            onBlur={onPhoneBlur}
            className={`input-field ${
              phoneHint
                ? "border-red-300 focus:border-red-400 focus:ring-red-500/15"
                : ""
            }`}
            placeholder="0901234567"
            aria-invalid={Boolean(phoneHint)}
          />
          {phoneHint ? (
            <p className="mt-1 text-xs font-medium text-red-600">{phoneHint}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-400">
              Di động 10 số (09x, 03x…) hoặc máy bàn 02x
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Email {requestType === "career" && <span className="text-accent-500">*</span>}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required={requestType === "career"}
            className="input-field"
            placeholder="email@example.com"
            autoComplete="email"
            maxLength={120}
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            {requestType === "career" ? "Vị trí ứng tuyển" : "Chủ đề"}
          </label>
          <input
            id="subject"
            name="subject"
            className="input-field"
            placeholder={
              requestType === "career"
                ? "VD: Nhân viên kinh doanh"
                : "Báo giá bao bì, tư vấn đóng gói..."
            }
            maxLength={200}
            autoComplete="off"
          />
        </div>
      </div>

      {/* CV upload — only career */}
      {requestType === "career" && (
        <div>
          <p className="mb-1.5 text-sm font-semibold text-slate-700">
            CV (PDF) <span className="text-accent-500">*</span>
          </p>
          <input
            ref={cvInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => onCvPick(e.target.files?.[0] || null)}
          />
          {!cvFile ? (
            <button
              type="button"
              onClick={() => cvInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/50 px-4 py-8 text-center transition hover:border-violet-400 hover:bg-violet-50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
                <Upload className="h-6 w-6" />
              </span>
              <span className="text-sm font-bold text-slate-800">
                Chọn file CV (PDF)
              </span>
              <span className="text-xs text-slate-500">Tối đa 5MB · chỉ .pdf</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
              <FileText className="h-8 w-8 shrink-0 text-violet-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">
                  {cvFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(cvFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCvFile(null);
                  if (cvInputRef.current) cvInputRef.current.value = "";
                }}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-red-600"
                aria-label="Xóa file"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => cvInputRef.current?.click()}
                className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-700 hover:bg-violet-50"
              >
                Đổi file
              </button>
            </div>
          )}
          {cvError && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{cvError}</p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="content"
          className="mb-1.5 block text-sm font-semibold text-slate-700"
        >
          {requestType === "career" ? "Giới thiệu bản thân" : "Nội dung"}{" "}
          <span className="text-accent-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={5}
          maxLength={5000}
          minLength={5}
          className="input-field resize-y min-h-[120px]"
          placeholder={
            requestType === "career"
              ? "Kinh nghiệm, kỹ năng, lý do ứng tuyển..."
              : "Mô tả nhu cầu của bạn..."
          }
        />
      </div>

      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            status === "error"
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading" || Boolean(phoneHint && phone.trim())}
        className="btn-primary"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {requestType === "career" ? "Gửi CV ứng tuyển" : "Gửi liên hệ"}
          </>
        )}
      </button>
    </form>
  );
}
