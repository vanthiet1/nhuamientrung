import Link from "next/link";
import { Metadata } from "next";
import { company } from "@/lib/data/company";
import { Truck, MapPin, Clock, ShieldCheck, CheckCircle2, ChevronRight, PhoneCall } from "lucide-react";

export const metadata: Metadata = {
  title: "Chính Sách Vận Chuyển & Giao Hàng | Bao Bì Thành Phát",
  description:
    "Phương thức giao hàng toàn quốc, thời gian vận chuyển, cước phí và chính sách miễn phí giao hàng màng co bao bì tại Bao Bì Thành Phát.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="container-home">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-800">Chính sách vận chuyển</span>
        </nav>

        {/* Header Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-[#051355] via-[#102a78] to-[#1e40af] p-8 sm:p-12 text-white shadow-xl mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm mb-4">
            <Truck className="h-4 w-4 text-brand-300" />
            Giao Hàng Nhanh Toàn Quốc
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Chính Sách Vận Chuyển & Giao Hàng
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Phủ sóng giao hàng tận nơi tại Đà Nẵng, các tỉnh Miền Trung - Tây Nguyên và hỗ trợ vận chuyển toàn quốc qua hệ thống xe tải, chành xe uy tín.
          </p>
        </div>

        {/* Policy Content Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm space-y-10">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-extrabold text-sm">1</span>
              Phạm Vi & Phương Thức Giao Hàng
            </h2>
            <div className="grid sm:grid-cols-3 gap-5 pt-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <MapPin className="h-5 w-5 text-brand-600 shrink-0" />
                  Nội Thành Đà Nẵng
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Đội xe tải & xe máy của Thành Phát giao trực tiếp tận kho nhà máy/xưởng sản xuất của khách hàng. Miễn phí vận chuyển cho các đơn hàng đạt giá trị tối thiểu.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Truck className="h-5 w-5 text-brand-600 shrink-0" />
                  Khu Vực Miền Trung - Tây Nguyên
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Gửi qua hệ thống chành xe uy tín (Quảng Nam, Quảng Ngãi, Bình Định, Huế, Quảng Trị, Gia Lai, Đắk Lắk...) hoặc điều xe tải riêng cho đơn hàng lớn.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Clock className="h-5 w-5 text-brand-600 shrink-0" />
                  Toàn Quốc & Bưu Chính
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Đối với hàng mẫu hoặc số lượng nhỏ, Thành Phát hỗ trợ gửi qua Viettel Post, GHTK, VNPost đảm bảo đúng hẹn.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-extrabold text-sm">2</span>
              Thời Gian Giao Hàng Dự Kiến
            </h2>
            <div className="space-y-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span><strong>Hàng có sẵn kho (Màng quấn pallet, xốp hơi, băng keo):</strong> Giao trong vòng 2 - 24 giờ tại Đà Nẵng; 1 - 2 ngày làm việc cho các tỉnh lân cận.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span><strong>Hàng sản xuất theo quy cách / cắt cuộn riêng:</strong> Giao hàng từ 3 - 5 ngày làm việc kể từ khi chốt cọc.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span><strong>Hàng in ấn màng co / bao bì màng ghép ống đồng:</strong> Giao hàng từ 7 - 12 ngày làm việc cho đơn in mới (bao gồm thời gian khắc ống đồng).</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-extrabold text-sm">3</span>
              Quy Trình Kiểm Tra & Bàn Giao Hàng Hóa
            </h2>
            <div className="space-y-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              <p>
                Khi nhận hàng từ nhân viên giao vận của Thành Phát hoặc chành xe, Quý khách hàng vui lòng thực hiện các bước kiểm tra:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>Kiểm tra số lượng cuộn/kiện/túi theo biên bản giao hàng.</li>
                <li>Kiểm tra màng bọc bảo vệ bên ngoài kiện hàng đảm bảo nguyên vẹn, không dính nước hay rách vỡ.</li>
                <li>Ký xác nhận biên bản giao nhận và giữ 01 bản để đối chiếu thanh toán.</li>
              </ol>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <span>Nếu phát hiện kiện hàng bị méo móp, ướt sũng do vận chuyển, vui lòng lập biên bản tại chỗ với đơn vị vận chuyển và thông báo ngay cho Hotline Thành Phát để được hỗ trợ bồi hoàn.</span>
              </div>
            </div>
          </section>

          {/* CTA Box */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-[#051355]">Cần tra cứu tiến độ chuyến xe hoặc lịch giao hàng?</h3>
              <p className="text-sm text-slate-600 mt-1">Liên hệ ngay điều phối vận tải Bao Bì Thành Phát.</p>
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
