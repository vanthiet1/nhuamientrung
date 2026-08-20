import Link from "next/link";
import { Metadata } from "next";
import { company } from "@/lib/data/company";
import { CreditCard, Building2, Wallet, CheckCircle2, ChevronRight, PhoneCall } from "lucide-react";

export const metadata: Metadata = {
  title: "Chính Sách Thanh Toán | Bao Bì Thành Phát",
  description:
    "Hình thức thanh toán linh hoạt, hướng dẫn chuyển khoản ngân hàng và quy định tạm ứng đặt cọc đơn hàng tại Bao Bì Thành Phát.",
};

export default function PaymentPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="container-home">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-800">Chính sách thanh toán</span>
        </nav>

        {/* Header Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-[#051355] via-[#102a78] to-[#1e40af] p-8 sm:p-12 text-white shadow-xl mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm mb-4">
            <CreditCard className="h-4 w-4 text-brand-300" />
            Thanh Toán An Toàn & Minh Bạch
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Chính Sách Thanh Toán
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Cung cấp đầy đủ các phương thức thanh toán chuyển khoản doanh nghiệp, tiền mặt và linh hoạt theo thỏa thuận hợp đồng.
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm space-y-10">
          {/* Bank Account Info Highlight Box */}
          <div className="rounded-2xl border-2 border-brand-200 bg-brand-50/40 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-brand-800 font-bold text-lg border-b border-brand-200/60 pb-3">
              <Building2 className="h-6 w-6 text-brand-600 shrink-0" />
              <span>THÔNG TIN TÀI KHOẢN NGÂN HÀNG CHÍNH THỨC</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-slate-700 text-sm sm:text-base">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Tên đơn vị thụ hưởng:</p>
                <p className="font-bold text-slate-900">{company.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Mã số thuế:</p>
                <p className="font-bold text-slate-900">{company.taxCode}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Số tài khoản (VND):</p>
                <p className="font-mono text-xl font-extrabold text-brand-700">{company.bankAccount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Mở tại Ngân hàng:</p>
                <p className="font-bold text-slate-900">{company.bankName}</p>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-extrabold text-sm">1</span>
              Các Hình Thức Thanh Toán Hợp Lệ
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Building2 className="h-5 w-5 text-brand-600" />
                  Chuyển Khoản Ngân Hàng (Khuyên dùng)
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Áp dụng cho tất cả các đơn hàng doanh nghiệp B2B, đơn hàng in ấn theo yêu cầu hoặc mua buôn màng co số lượng lớn. Cú pháp chuyển khoản: <em className="font-semibold text-slate-800">[Tên Công Ty/SĐT] thanh toan HD [Số hợp đồng/báo giá]</em>.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Wallet className="h-5 w-5 text-brand-600" />
                  Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Áp dụng cho các đơn hàng quy chuẩn sẵn có (màng quấn pallet, xốp hơi, băng keo...) giao trực tiếp tại khu vực Đà Nẵng hoặc thanh toán tại văn phòng xưởng sản xuất Thành Phát.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-extrabold text-sm">2</span>
              Quy Định Đặt Cọc & Tiến Độ Thanh Toán
            </h2>
            <div className="space-y-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span><strong>Đơn hàng gia công / sản xuất theo quy cách riêng:</strong> Khách hàng tạm ứng cọc 30% - 50% giá trị hợp đồng ngay sau khi chốt thiết kế và hợp đồng.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span><strong>Thanh toán phần còn lại:</strong> 50% - 70% còn lại được thanh toán ngay sau khi nhận đủ hàng hóa, hóa đơn GTGT và biên bản bàn giao.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span><strong>Đối với khách hàng đại lý / đối tác lâu năm:</strong> Được áp dụng chính sách công nợ theo kỳ (15 - 30 ngày) dựa trên thỏa thuận hợp đồng nguyên tắc.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA Box */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-[#051355]">Cần hỗ trợ xác nhận thanh toán hoặc xuất hóa đơn VAT?</h3>
              <p className="text-sm text-slate-600 mt-1">Liên hệ bộ phận Kế toán / Chăm sóc khách hàng Thành Phát.</p>
            </div>
            <a
              href={`tel:${company.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-700 transition"
            >
              <PhoneCall className="h-4 w-4" />
              <span>{company.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
