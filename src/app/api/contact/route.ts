import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/cms/store";
import {
  MIN_FORM_MS,
  checkRateLimit,
  formatPhoneDisplay,
  isSpammyContent,
  isValidVietnamPhone,
  phoneErrorMessage,
} from "@/lib/contact-validation";
import {
  DOCUMENTS_BUCKET,
  uploadToStorage,
} from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_CV_BYTES = 5 * 1024 * 1024; // 5MB


function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function saveCvPdf(
  file: File
): Promise<{ url: string; fileName: string }> {
  const name = file.name || "cv.pdf";
  const lower = name.toLowerCase();
  if (!lower.endsWith(".pdf") && file.type !== "application/pdf") {
    throw new Error("CV chỉ chấp nhận file PDF");
  }
  if (file.size > MAX_CV_BYTES) {
    throw new Error("File CV tối đa 5MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  // magic %PDF
  if (buffer.length < 5 || buffer.subarray(0, 4).toString("utf8") !== "%PDF") {
    throw new Error("File không phải PDF hợp lệ");
  }

  const safeBase = name
    .replace(/\.pdf$/i, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 60);
  const fileName = `${safeBase || "cv"}-${randomUUID().slice(0, 8)}.pdf`;
  const storagePath = `cv/${new Date().toISOString().slice(0, 10)}/${fileName}`;

  // Prefer Supabase Storage
  try {
    const up = await uploadToStorage({
      bucket: DOCUMENTS_BUCKET,
      path: storagePath,
      body: buffer,
      contentType: "application/pdf",
      upsert: false,
    });
    return { url: up.publicUrl, fileName: name };
  } catch (e) {
    console.warn(
      "[contact] CV storage fallback local:",
      e instanceof Error ? e.message : e
    );
  }

  // Local fallback
  const dir = path.join(process.cwd(), "public", "uploads", "cv");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), buffer);
  return { url: `/uploads/cv/${fileName}`, fileName: name };
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: Record<string, unknown> = {};
    let cvFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      body = {
        name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email"),
        subject: form.get("subject"),
        content: form.get("content"),
        type: form.get("type"),
        website: form.get("website"),
        _t: form.get("_t"),
      };
      const f = form.get("cv");
      if (f instanceof File && f.size > 0) cvFile = f;
    } else {
      body = await request.json();
    }

    // Honeypot
    const honey = String(body.website || body.company_url || body._hp || "").trim();
    if (honey) {
      return NextResponse.json({ ok: true, id: "ok" }, { status: 201 });
    }

    const openedAt = Number(body._t || 0);
    if (openedAt > 0) {
      const elapsed = Date.now() - openedAt;
      if (elapsed < MIN_FORM_MS) {
        return NextResponse.json(
          { error: "Vui lòng chờ giây lát rồi gửi lại." },
          { status: 429 }
        );
      }
      if (elapsed > 24 * 60 * 60 * 1000) {
        return NextResponse.json(
          { error: "Phiên form đã hết hạn. Vui lòng tải lại trang." },
          { status: 400 }
        );
      }
    }

    const name = String(body.name || "").trim();
    const phoneRaw = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const content = String(body.content || "").trim();
    const typeRaw = String(body.type || "contact").trim();
    const type = typeRaw === "career" ? "career" : "contact";

    if (!name || !phoneRaw || !content) {
      return NextResponse.json(
        { error: "Vui lòng nhập họ tên, số điện thoại và nội dung" },
        { status: 400 }
      );
    }

    const phoneErr = phoneErrorMessage(phoneRaw);
    if (phoneErr || !isValidVietnamPhone(phoneRaw)) {
      return NextResponse.json(
        { error: phoneErr || "Số điện thoại không hợp lệ" },
        { status: 400 }
      );
    }
    const phone = formatPhoneDisplay(phoneRaw);

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email không đúng định dạng" },
        { status: 400 }
      );
    }

    const spamErr = isSpammyContent({ name, email, subject, content });
    if (spamErr) {
      return NextResponse.json({ error: spamErr }, { status: 400 });
    }

    if (type === "career" && !cvFile) {
      return NextResponse.json(
        { error: "Vui lòng đính kèm CV định dạng PDF" },
        { status: 400 }
      );
    }

    const ip = clientIp(request);
    const rateErr = checkRateLimit(ip, phone);
    if (rateErr) {
      return NextResponse.json({ error: rateErr }, { status: 429 });
    }

    let cvUrl = "";
    let cvFileName = "";
    if (type === "career" && cvFile) {
      try {
        const saved = await saveCvPdf(cvFile);
        cvUrl = saved.url;
        cvFileName = saved.fileName;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload CV thất bại";
        return NextResponse.json({ error: msg }, { status: 400 });
      }
    }

    const finalSubject =
      subject ||
      (type === "career" ? "Ứng tuyển / Gửi CV" : "Yêu cầu liên hệ");

    const item = await createContactMessage({
      name,
      phone,
      email,
      subject: finalSubject,
      content,
      type,
      cvUrl,
      cvFileName,
    });

    return NextResponse.json({ ok: true, id: item.id, type }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lỗi gửi liên hệ";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
