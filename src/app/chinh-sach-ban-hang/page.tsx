import Link from "next/link";
import { Metadata } from "next";
import { company } from "@/lib/data/company";
import { ShieldCheck, FileText, RefreshCw, PhoneCall, CheckCircle2, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Chính Sách Bán Hàng & Đặt Hàng | Bao Bì Thành Phát",
  description:
    "Chính sách bán hàng, quy trình đặt hàng B2B, nguyên tắc kiểm định chất lượng và quy định bảo hành đổi trả tại Bao Bì Thành Phát.",
};

export default function SalesPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="container-home">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-800">Chính sách bán hàng</span>
        </nav>

        {/* Header Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-[#051355] via-[#102a78] to-[#1e40af] p-8 sm:p-12 text-white shadow-xl mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm mb-4">
            <ShieldCheck className="h-4 w-4 text-brand-300" />
            Bao Bì Thành Phát B2B
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Chính Sách Bán Hàng & Đặt Hàng
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Cam kết chất lượng ổn định, giá gốc tận xưởng sản xuất, giao hàng đúng tiến độ và chính sách bảo hành rõ ràng cho mọi doanh nghiệp.
          </p>
        </div>

        {/* Policy Content Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm space-y-10">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-extrabold text-sm">1</span>
              Nguyên Tắc Bán Hàng B2B
            </h2>
            <div className="space-y-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              <p>
                <strong className="text-slate-800">{company.name}</strong> là đơn vị chuyên sản xuất, gia công và cung cấp các sản phẩm bao bì màng co (PVC, PE, POF, PET), màng ghép phức hợp, băng keo và vật liệu đóng gói trực tiếp đến các nhà máy, xưởng sản xuất và đại lý thương mại.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 pt-2">
                <li className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span><strong>Giá gốc trực tiếp:</strong> Giá xuất xưởng không qua trung gian, ưu đãi chiết khấu theo số lượng.</span>
                </li>
                <li className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span><strong>Đúng quy cách kỹ thuật:</strong> Đảm bảo độ dày, khổ màng, độ dai co màng đúng thỏa thuận.</span>
                </li>
                <li className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span><strong>Hóa đơn chứng từ đầy đủ:</strong> Cung cấp hóa đơn GTGT (VAT), hợp đồng mua bán và biên bản giao nhận.</span>
                </li>
                <li className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span><strong>Hỗ trợ mẫu thử:</strong> Cung cấp mẫu màng co/bao bì thử nghiệm trên dây chuyền trước khi sản xuất hàng loạt.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-extrabold text-sm">2</span>
              Quy Trình Đặt Hàng & Sản Xuất
            </h2>
            <div className="grid gap-4 sm:grid-cols-4 pt-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-2">
                <div className="text-xs font-bold text-brand-600 uppercase tracking-wider">Bước 1</div>
                <div className="font-bold text-slate-900 text-base">Tư Vấn & Báo Giá</div>
                <p className="text-xs text-slate-600 leading-relaxed">Tiếp nhận thông tin sản phẩm, số lượng, khổ màng, độ dày và yêu cầu in ấn.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-2">
                <div className="text-xs font-bold text-brand-600 uppercase tracking-wider">Bước 2</div>
                <div className="font-bold text-slate-900 text-base">Duyệt Mẫu & Ký Hợp Đồng</div>
                <p className="text-xs text-slate-600 leading-relaxed">Gửi mẫu thử, duyệt ma-két in (nếu có in logo) và chốt hợp đồng đặt hàng.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-2">
                <div className="text-xs font-bold text-brand-600 uppercase tracking-wider">Bước 3</div>
                <div className="font-bold text-slate-900 text-base">Đặt Cọc & Sản Xuất</div>
                <p className="text-xs text-slate-600 leading-relaxed">Khách hàng tạm ứng cọc, nhà máy chạy cuộn/cắt túi/in ống đồng theo tiến độ.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-2">
                <div className="text-xs font-bold text-brand-600 uppercase tracking-wider">Bước 4</div>
                <div className="font-bold text-slate-900 text-base">Giao Hàng & Nghiệm Thu</div>
                <p className="text-xs text-slate-600 leading-relaxed">Kiểm tra QC xuất xưởng, đóng gói đán tem, giao tận kho và thanh toán phần còn lại.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-extrabold text-sm">3</span>
              Chính Sách Đổi Trả & Bảo Hành Lỗi Sản Xuất
            </h2>
            <div className="space-y-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              <p>
                Thành Phát cam kết đổi trả hoặc bồi hoàn 100% chi phí cho khách hàng trong các trường hợp lỗi kỹ thuật xuất phát từ nhà sản xuất:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Màng co bị bục hông, rách mối hàn nắp/đáy vượt quá tỷ lệ hao hụt cho phép.</li>
                <li>In ấn sai màu so với bản ma-két đã duyệt, hình in bị nhòe bong tróc mực.</li>
                <li>Kích thước sai lệch nghiêm trọng không thể đưa vào máy đóng gói tự động.</li>
                <li>Hàng bị hư hỏng, ẩm mốc trong quá trình vận chuyển do lỗi đóng gói của Thành Phát.</li>
              </ul>
              <p className="text-xs text-slate-500 italic pt-2">
                * Lưu ý: Khách hàng vui lòng phản hồi về bộ phận QC của chúng tôi trong vòng 7 ngày kể từ khi nhận hàng để được giải quyết nhanh nhất.
              </p>
            </div>
          </section>

          {/* CTA Box */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-[#051355]">Bạn cần tư vấn chi tiết về quy cách & giá sỉ?</h3>
              <p className="text-sm text-slate-600 mt-1">Đội ngũ kinh doanh Thành Phát sẵn sàng hỗ trợ trực tiếp 24/7.</p>
            </div>
            <a
              href={`tel:${company.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-700 transition"
            >
              <PhoneCall className="h-4 w-4" />
              <span>HOTLINE: {company.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
