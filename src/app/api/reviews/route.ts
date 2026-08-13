import { NextResponse } from "next/server";
import { submitReview } from "@/lib/cms/reviews";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, name, email, phone, content, rating } = body;

    // Simple validation (detailed validation on client side)
    if (!product_id || !name || !content) {
      return NextResponse.json({ error: "Thiếu trường bắt buộc" }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: "Nội dung quá dài" }, { status: 400 });
    }

    await submitReview({
      product_id,
      name,
      email: email || null,
      phone: phone || null,
      content,
      rating: rating || 5,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lỗi API gửi đánh giá:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi hệ thống" }, { status: 500 });
  }
}
