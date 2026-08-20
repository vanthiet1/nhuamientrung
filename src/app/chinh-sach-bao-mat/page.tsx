import Link from "next/link";
import { Metadata } from "next";
import { company } from "@/lib/data/company";
import { Lock, EyeOff, FileText, CheckCircle2, ChevronRight, PhoneCall } from "lucide-react";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật Thông Tin | Bao Bì Thành Phát",
  description:
    "Cam kết bảo mật tuyệt đối thông tin cá nhân, thông tin doanh nghiệp và dữ liệu đơn hàng tại Bao Bì Thành Phát.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="container-home">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-800">Chính sách bảo mật</span>
        </nav>

        {/* Header Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-[#051355] via-[#102a78] to-[#1e40af] p-8 sm:p-12 text-white shadow-xl mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm mb-4">
            <Lock className="h-4 w-4 text-brand-300" />
            Bảo Mật Dữ Liệu Khách Hàng
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Chính Sách Bảo Mật Thông Tin
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Bao Bì Thành Phát tôn trọng và cam kết bảo vệ tuyệt đối dữ liệu cá nhân, thông tin doanh nghiệp và bản quyền file thiết kế của Quý khách hàng.
          </p>
        </div>

        {/* Policy Content Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm space-y-10">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-extrabold text-sm">1</span>
              Mục Đích Thu Thập Thông Tin
            </h2>
            <div className="space-y-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              <p>
                Chúng tôi thu thập thông tin khi Quý khách điền mẫu yêu cầu báo giá, đăng ký tư vấn hoặc liên hệ trực tiếp với <strong>{company.name}</strong> bao gồm:
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 pt-2">
                <li className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span>Họ tên cá nhân, tên doanh nghiệp / cơ sở sản xuất.</span>
                </li>
                <li className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span>Số điện thoại, Zalo, địa chỉ email liên hệ.</span>
                </li>
                <li className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span>Địa điểm giao hàng, thông tin xuất hóa đơn VAT.</span>
                </li>
                <li className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <span>File mẫu thiết kế logo/bao bì do Quý khách đính kèm.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-extrabold text-sm">2</span>
              Phạm Vi Sử Dụng Thông Tin & Cam Kết Không Chia Sẻ
            </h2>
            <div className="space-y-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              <p>Thông tin thu thập chỉ được dùng trong nội bộ Thành Phát cho các mục đích sau:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Gửi bảng báo giá chi tiết, tiến độ sản xuất và tư vấn quy cách bao bì phù hợp.</li>
                <li>Xử lý đơn hàng, lập hợp đồng mua bán, xuất hóa đơn chứng từ và giao hàng tận nơi.</li>
                <li>Hỗ trợ xử lý bảo hành, đổi trả sản phẩm khi có yêu cầu.</li>
              </ul>
              <div className="rounded-2xl bg-slate-900 p-5 text-white space-y-2 mt-4">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <EyeOff className="h-5 w-5" />
                  CAM KẾT TỰM BẢO MẬT & BẢO HÀNH BẢN QUYỀN THIẾT KẾ
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Thành Phát tuyệt đối không bán, chia sẻ hay tiết lộ thông tin cá nhân và dữ liệu thiết kế logo/bao bì của khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại. Mọi file in ấn ống đồng của khách hàng đều được lưu trữ bảo mật trong cơ sở dữ liệu nhà máy.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-extrabold text-sm">3</span>
              Thời Gian Lưu Trữ & Quyền Của Khách Hàng
            </h2>
            <div className="space-y-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              <p>
                Thông tin khách hàng được lưu trữ an toàn trên hệ thống máy chủ nội bộ trong suốt thời gian hợp tác. Quý khách hàng có quyền yêu cầu tra cứu, điều chỉnh hoặc xóa bỏ toàn bộ dữ liệu cá nhân của mình bất kỳ lúc nào bằng cách liên hệ với bộ phận Quản trị dữ liệu của Thành Phát.
              </p>
            </div>
          </section>

          {/* CTA Box */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-[#051355]">Ý kiến thắc mắc về chính sách bảo mật?</h3>
              <p className="text-sm text-slate-600 mt-1">Gửi email hỗ trợ trực tiếp đến ban quản trị Bao Bì Thành Phát.</p>
            </div>
            <a
              href={`mailto:${company.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-700 transition"
            >
              <FileText className="h-4 w-4" />
              <span>{company.email}</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
