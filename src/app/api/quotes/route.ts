import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { createQuoteRequest } from "@/lib/cms/store";
import {
  MIN_FORM_MS,
  checkRateLimit,
  isSpammyContent,
  isValidVietnamPhone,
  phoneErrorMessage,
  formatPhoneDisplay,
} from "@/lib/contact-validation";
import { QUOTES_BUCKET, uploadToStorage } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function saveReferenceFile(file: File): Promise<{ url: string; fileName: string }> {
  const name = file.name || "reference_file";
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("File đính kèm tối đa 5MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const safeBase = name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 60);
  const fileName = `${safeBase || "file"}-${randomUUID().slice(0, 8)}`;
  const storagePath = `quotes/${new Date().toISOString().slice(0, 10)}/${fileName}`;

  try {
    const up = await uploadToStorage({
      bucket: QUOTES_BUCKET,
      path: storagePath,
      body: buffer,
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    return { url: up.publicUrl, fileName: name };
  } catch (e) {
    console.warn("[quotes] Storage fallback local:", e instanceof Error ? e.message : e);
  }

  // Local fallback
  const dir = path.join(process.cwd(), "public", "uploads", "quotes");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), buffer);
  return { url: `/uploads/quotes/${fileName}`, fileName: name };
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const form = await request.formData();
    const body = {
      name: form.get("name")?.toString() || "",
      company_name: form.get("company")?.toString() || "",
      phone: form.get("phone")?.toString() || "",
      email: form.get("email")?.toString() || "",
      product_type: form.get("product")?.toString() || "",
      industry: form.get("industry")?.toString() || "",
      quantity_expected: form.get("quantity")?.toString() || "",
      dimensions: form.get("dimensions")?.toString() || "",
      material: form.get("material")?.toString() || "",
      print_colors: form.get("colors")?.toString() || "",
      deadline: form.get("deadline")?.toString() || "",
      delivery_destination: form.get("destination")?.toString() || "",
      details: form.get("details")?.toString() || "",
      _t: form.get("_t")?.toString() || "0",
      _hp: form.get("_hp")?.toString() || "",
    };

    const refFile = form.get("reference");
    let fileObj: File | null = null;
    if (refFile instanceof File && refFile.size > 0) {
      fileObj = refFile;
    }

    // Honeypot
    if (body._hp.trim()) {
      return NextResponse.json({ ok: true, id: "ok" }, { status: 201 });
    }

    const openedAt = Number(body._t);
    if (openedAt > 0) {
      const elapsed = Date.now() - openedAt;
      if (elapsed < MIN_FORM_MS) {
        return NextResponse.json({ error: "Vui lòng chờ giây lát rồi gửi lại." }, { status: 429 });
      }
      if (elapsed > 24 * 60 * 60 * 1000) {
        return NextResponse.json({ error: "Phiên form đã hết hạn. Vui lòng tải lại trang." }, { status: 400 });
      }
    }

    // Validation
    const name = body.name.trim();
    const phoneRaw = body.phone.trim();
    const productType = body.product_type.trim();
    const quantity = body.quantity_expected.trim();
    const destination = body.delivery_destination.trim();

    if (!name || !phoneRaw || !productType || !quantity || !destination) {
      return NextResponse.json({ error: "Vui lòng nhập đầy đủ các trường bắt buộc (*)" }, { status: 400 });
    }

    const phoneErr = phoneErrorMessage(phoneRaw);
    if (phoneErr || !isValidVietnamPhone(phoneRaw)) {
      return NextResponse.json({ error: phoneErr || "Số điện thoại không hợp lệ" }, { status: 400 });
    }
    const phone = formatPhoneDisplay(phoneRaw);

    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Email không đúng định dạng" }, { status: 400 });
    }

    // Check rate limit
    const ip = clientIp(request);
    const rateErr = checkRateLimit(ip, phone);
    if (rateErr) {
      return NextResponse.json({ error: rateErr }, { status: 429 });
    }

    // Process file upload if present
    let reference_file_url = "";
    let reference_file_name = "";
    if (fileObj) {
      try {
        const saved = await saveReferenceFile(fileObj);
        reference_file_url = saved.url;
        reference_file_name = saved.fileName;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload file đính kèm thất bại";
        return NextResponse.json({ error: msg }, { status: 400 });
      }
    }

    // Create record
    const item = await createQuoteRequest({
      name,
      companyName: body.company_name,
      phone,
      email: body.email,
      productType,
      industry: body.industry,
      quantityExpected: quantity,
      dimensions: body.dimensions,
      material: body.material,
      printColors: body.print_colors,
      deadline: body.deadline || null,
      deliveryDestination: destination,
      details: body.details,
      referenceFileUrl: reference_file_url,
      referenceFileName: reference_file_name,
    });

    return NextResponse.json({ ok: true, id: item.id }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lỗi gửi yêu cầu báo giá";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
