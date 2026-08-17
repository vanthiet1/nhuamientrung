import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { company } from "@/lib/data/company";
import { siteUrl } from "@/lib/seo/keywords";

/**
 * Khối liên hệ cuối bài chi tiết sản phẩm (mẫu từ đối thủ, thay bằng info Thành Phát)
 */
export default function ProductContactBox() {
  const website =
    siteUrl.replace(/^https?:\/\//, "") || "baobithanhphat.com";

  return (
    <div className="mt-8 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/80 via-white to-sky-50/50 p-5 sm:p-6">
      <p className="text-sm font-semibold leading-relaxed text-slate-800 sm:text-[15px]">
        Khi Quý Công ty có nhu cầu hợp tác hoặc muốn biết thông tin chi tiết các
        sản phẩm xin vui lòng liên hệ với chúng tôi theo thông tin sau:
      </p>

      <div className="mt-4 space-y-3 text-sm text-slate-700 sm:text-[15px]">
        <p className="flex items-start gap-2.5 font-extrabold text-brand-800">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <span>{company.name}</span>
        </p>

        <p className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
          <span>
            <span className="font-semibold text-slate-800">Địa chỉ: </span>
            {company.address}
          </span>
        </p>

        <p className="flex items-start gap-2.5">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            <span className="font-semibold text-slate-800">Điện thoại: </span>
            <a
              href={`tel:${company.phoneRaw}`}
              className="font-bold text-brand-600 hover:underline"
            >
              {company.phone}
            </a>
            <span className="mx-1.5 text-slate-300">|</span>
            <span className="font-semibold text-slate-800">Hotline: </span>
            <a
              href={`tel:${company.phoneRaw}`}
              className="font-bold text-brand-600 hover:underline"
            >
              {company.hotline}
            </a>
          </span>
        </p>



        <p className="flex items-start gap-2.5">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
          <span className="min-w-0">
            <span className="font-semibold text-slate-800">Email: </span>
            <a
              href={`mailto:${company.email}`}
              className="font-semibold text-brand-600 hover:underline break-all"
            >
              {company.email}
            </a>
            <span className="mx-1.5 text-slate-300">–</span>
            <span className="font-semibold text-slate-800">Website: </span>
            <Link
              href="/"
              className="font-semibold text-brand-600 hover:underline"
            >
              {website}
            </Link>
          </span>
        </p>


      </div>
    </div>
  );
}
