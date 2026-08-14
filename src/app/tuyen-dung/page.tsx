import type { Metadata } from "next";
import Link from "next/link";
import { 
  MapPin, 
  Briefcase, 
  Banknote, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  Heart, 
  ShieldCheck, 
  GraduationCap, 
  ClipboardCheck, 
  MessageCircle, 
  UserPlus, 
  CheckCircle2 
} from "lucide-react";
import PageBanner from "@/components/PageBanner";
import EmptyState from "@/components/EmptyState";
import { loadCareers } from "@/lib/data/public";
import { company } from "@/lib/data/company";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tuyển dụng & Việc làm Bao Bì Thành Phát tại Đà Nẵng",
  description: `Môi trường làm việc năng động, phúc lợi hấp dẫn tại ${company.shortName}. Đang tuyển dụng các vị trí kỹ thuật in, vận hành máy màng co, kinh doanh bao bì tại Đà Nẵng.`,
  keywords: [
    "tuyển dụng bao bì Đà Nẵng",
    "việc làm màng co",
    "tuyển dụng Bao Bì Thành Phát",
    "việc làm khu công nghiệp Đà Nẵng",
    "tuyển kỹ thuật vận hành máy in",
    "tuyển nhân viên kinh doanh bao bì"
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://baobithanhphat.com"}/tuyen-dung`,
  },
};

export default async function CareersPage() {
  const jobs = await loadCareers();

  return (
    <>
      <PageBanner
        title="Tuyển dụng"
        breadcrumbs={[{ label: "Tuyển dụng" }]}
        subtitle={`Gia nhập đội ngũ ${company.shortName}`}
      />

      <section className="section container-page">
        {/* Why Choose Us */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-brand-600">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">Môi trường năng động</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Đội ngũ trẻ trung, sáng tạo, đề cao tinh thần làm việc nhóm và tôn trọng sự khác biệt của mỗi cá nhân.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">Phúc lợi hấp dẫn</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Lương thưởng cạnh tranh, BHXH đầy đủ, khám sức khỏe định kỳ, du lịch hàng năm và các khoản phụ cấp đa dạng.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">Lộ trình thăng tiến</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Được đào tạo bài bản về kiến thức bao bì đóng gói. Cơ hội thăng tiến rõ ràng cho người có năng lực.
            </p>
          </div>
        </div>

        {/* Hiring Process */}
        <div className="mb-12 rounded-3xl bg-slate-50 p-6 sm:p-10">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">Quy trình tuyển dụng</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm">
                <ClipboardCheck className="h-7 w-7" />
              </div>
              <h4 className="mb-1 font-bold text-slate-900">1. Nộp hồ sơ</h4>
              <p className="text-xs text-slate-500">Gửi CV qua Email/Zalo</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm">
                <MessageCircle className="h-7 w-7" />
              </div>
              <h4 className="mb-1 font-bold text-slate-900">2. Phỏng vấn</h4>
              <p className="text-xs text-slate-500">Trao đổi trực tiếp 1-1</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm">
                <UserPlus className="h-7 w-7" />
              </div>
              <h4 className="mb-1 font-bold text-slate-900">3. Nhận việc</h4>
              <p className="text-xs text-slate-500">Thỏa thuận lương thưởng</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-500 shadow-sm">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h4 className="mb-1 font-bold text-slate-900">4. Đào tạo</h4>
              <p className="text-xs text-slate-500">Hội nhập văn hóa công ty</p>
            </div>
          </div>
        </div>

        <div className="card mb-8 p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            Cơ hội nghề nghiệp đang mở
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Chúng tôi chào đón ứng viên nhiệt huyết tham gia phát triển ngành công nghiệp sản xuất bao bì – đóng
            gói tại miền Trung. Gửi CV ngay về{" "}
            <a
              href={`mailto:${company.email}`}
              className="font-bold text-brand-600 hover:text-sky-600"
            >
              {company.email}
            </a>{" "}
            hoặc gọi điện thoại trực tiếp đến phòng nhân sự{" "}
            <a
              href={`tel:${company.phoneRaw}`}
              className="font-bold text-brand-600 hover:text-sky-600"
            >
              {company.phone}
            </a>
            .
          </p>
        </div>

        {jobs.length === 0 ? (
          <EmptyState type="careers" />
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <article key={job.id} className="card-hover p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-brand-700">
                      {job.title}
                    </h3>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {[
                        { icon: MapPin, text: job.location },
                        { icon: Briefcase, text: job.type },
                        { icon: Banknote, text: job.salary },
                      ].map((m) => (
                        <span
                          key={m.text}
                          className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                          <m.icon className="h-3.5 w-3.5 text-sky-500" />
                          {m.text}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={`/lien-he?chu-de=Tuyen+dung+-+${encodeURIComponent(job.title)}`}
                    className="btn-primary"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.75rem" }}
                  >
                    Ứng tuyển
                  </Link>
                </div>
                {job.description && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {job.description}
                  </p>
                )}
                {job.requirements?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-bold text-slate-900">Yêu cầu:</h4>
                    <ul className="mt-2 space-y-1.5">
                      {job.requirements.map((req) => (
                        <li
                          key={req}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
          <p className="text-slate-600">
            Không thấy vị trí phù hợp? Gửi CV tự do — chúng tôi lưu hồ sơ và liên
            hệ khi có cơ hội.
          </p>
          <Link href="/lien-he" className="btn-dark mt-5">
            Gửi hồ sơ
          </Link>
        </div>
      </section>
    </>
  );
}
