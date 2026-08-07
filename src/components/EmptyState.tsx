import { Newspaper, Briefcase, Inbox, type LucideIcon } from "lucide-react";

const presets = {
  news: {
    icon: Newspaper,
    title: "Tạm thời chưa có thông tin tin tức",
    description:
      "Nội dung tin tức đang được cập nhật. Vui lòng quay lại sau hoặc liên hệ chúng tôi để được hỗ trợ.",
  },
  careers: {
    icon: Briefcase,
    title: "Tạm thời chưa có thông tin tuyển dụng",
    description:
      "Hiện chưa có vị trí tuyển dụng. Bạn vẫn có thể gửi CV tự do — chúng tôi sẽ liên hệ khi có cơ hội phù hợp.",
  },
  default: {
    icon: Inbox,
    title: "Tạm thời chưa có thông tin",
    description: "Nội dung đang được cập nhật. Vui lòng quay lại sau.",
  },
} as const;

export default function EmptyState({
  type = "default",
  title,
  description,
  icon: IconProp,
}: {
  type?: keyof typeof presets;
  title?: string;
  description?: string;
  icon?: LucideIcon;
}) {
  const preset = presets[type] || presets.default;
  const Icon = IconProp || preset.icon;

  return (
    <div className="card flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 ring-8 ring-brand-50/50">
        <Icon className="h-10 w-10 text-brand-600" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
        {title || preset.title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
        {description || preset.description}
      </p>
    </div>
  );
}
