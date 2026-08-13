import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Briefcase, Banknote } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import EmptyState from "@/components/EmptyState";
import { loadCareers } from "@/lib/data/public";
import { company } from "@/lib/data/company";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tuyển dụng Bao Bì Thành Phát Đà Nẵng",
  description: `Tuyển dụng tại ${company.shortName} — Đà Nẵng. Gửi CV ${company.email} hoặc gọi ${company.phone}.`,
  keywords: [
    "tuyển dụng bao bì Đà Nẵng",
    "việc làm màng co",
    "tuyển dụng Bao Bì Thành Phát",
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
        <div className="card mb-8 max-w-3xl p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            Cơ hội nghề nghiệp
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Chúng tôi chào đón ứng viên nhiệt huyết trong lĩnh vực bao bì – đóng
            gói. Gửi CV về{" "}
            <a
              href={`mailto:${company.email}`}
              className="font-bold text-brand-600 hover:text-sky-600"
            >
              {company.email}
            </a>{" "}
            hoặc gọi{" "}
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
