"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2, UserCircle2 } from "lucide-react";
import toast from "react-hot-toast";

type Review = {
  id: string;
  name: string;
  content: string;
  rating: number;
  created_at: string;
};

export default function ProductReviews({
  productId,
  initialReviews,
}: {
  productId: string;
  initialReviews: Review[];
}) {
  const [reviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic Validation
    if (!name.trim()) return toast.error("Vui lòng nhập tên của bạn");
    if (!content.trim()) return toast.error("Vui lòng nhập nội dung đánh giá");
    
    // Check email if provided
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error("Email không hợp lệ");
    }
    
    // Check phone if provided
    if (phone && !/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone)) {
      return toast.error("Số điện thoại không hợp lệ");
    }

    // Check word count
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount > 500) {
      return toast.error("Nội dung đánh giá không được vượt quá 500 từ");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          name,
          email,
          phone,
          content,
          rating,
        }),
      });

      if (!res.ok) throw new Error("Lỗi khi gửi");
      
      setSubmitted(true);
      toast.success("Gửi đánh giá thành công! Đánh giá đang chờ duyệt.");
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setContent("");
      setRating(5);
    } catch (error) {
      toast.error("Không thể gửi đánh giá lúc này, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* List Reviews */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Đánh giá từ khách hàng ({reviews.length})
        </h3>
        
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                      <UserCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{r.name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(r.created_at).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < r.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {r.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
            Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Viết đánh giá của bạn</h3>
        <p className="text-sm text-slate-500 mb-6">
          Email và số điện thoại của bạn sẽ được bảo mật, không hiển thị công khai.
        </p>

        {submitted ? (
          <div className="rounded-xl bg-emerald-50 p-6 text-center text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="mx-auto h-12 w-12 mb-3 text-emerald-500" />
            <p className="font-bold text-lg">Cảm ơn bạn đã đánh giá!</p>
            <p className="text-sm mt-1">Đánh giá của bạn đã được ghi nhận và đang chờ quản trị viên phê duyệt.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-4 text-sm font-semibold underline hover:text-emerald-700"
            >
              Gửi đánh giá khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Đánh giá của bạn *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-100 text-slate-200 hover:fill-amber-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ và tên..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email (không bắt buộc)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số điện thoại (không bắt buộc)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nội dung đánh giá * (tối đa 500 từ)</label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              />
              <p className="text-right text-xs text-slate-400 mt-1">
                {content.trim().split(/\s+/).filter(Boolean).length}/500 từ
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              {isSubmitting ? (
                "Đang gửi..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Gửi đánh giá
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
