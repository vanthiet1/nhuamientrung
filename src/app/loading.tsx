import BrandLogo from "@/components/BrandLogo";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center space-y-6">
      <div className="animate-pulse">
        <BrandLogo href={null} variant="header" className="h-16 sm:h-20 w-auto opacity-80" />
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-600 [animation-delay:-0.3s]"></div>
        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-500 [animation-delay:-0.15s]"></div>
        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-400"></div>
      </div>
      <p className="text-sm font-medium text-slate-500 animate-pulse">
        Đang tải dữ liệu...
      </p>
    </div>
  );
}
