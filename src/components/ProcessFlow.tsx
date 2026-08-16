import React from 'react';

const steps = [
  {
    num: "01",
    title: "Tiếp nhận yêu cầu",
    desc: "Sản phẩm, kích thước, số lượng và điều kiện sử dụng."
  },
  {
    num: "02",
    title: "Tư vấn quy cách",
    desc: "Đề xuất vật liệu, cấu trúc và phương án in phù hợp."
  },
  {
    num: "03",
    title: "Thiết kế & duyệt mẫu",
    desc: "Hoàn thiện nội dung, màu sắc và mẫu trước sản xuất."
  },
  {
    num: "04",
    title: "Sản xuất",
    desc: "Thực hiện theo mẫu và quy cách hai bên đã thống nhất."
  },
  {
    num: "05",
    title: "Giao hàng",
    desc: "Đóng gói, bàn giao và hỗ trợ theo khu vực."
  }
];

export default function ProcessFlow() {
  return (
    <section className="bg-white py-16 sm:py-24 border-t border-slate-100 overflow-hidden">
      <div className="container-home">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16 lg:mb-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[2px] w-12 bg-brand-500"></div>
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-[#1a2a4b]">
                Quy trình phối hợp
              </span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#1a2a4b] sm:text-5xl lg:text-[3rem] xl:text-[3.5rem] lg:leading-[1.1]">
              TỪ YÊU CẦU ĐẾN <br className="hidden sm:block" />
              <span className="text-brand-500 font-normal">SẢN PHẨM HOÀN THIỆN</span>
            </h2>
          </div>
          <div className="max-w-sm lg:pb-3">
            <p className="text-base text-slate-500 leading-relaxed">
              Quy trình rõ ràng để khách doanh nghiệp biết mình cần chuẩn bị gì và bước tiếp theo là gì.
            </p>
          </div>
        </div>

        {/* Steps container */}
        <div className="relative mt-12">
          
          <style>{`
            @keyframes process-run {
              0% { width: 0%; opacity: 0; }
              2% { width: 0%; opacity: 1; }
              23% { opacity: 1; }
              25% { width: 100%; opacity: 0; }
              100% { width: 100%; opacity: 0; }
            }
            .animate-process-run {
              /* Total cycle is 4 seconds (1s per arrow for 4 arrows) */
              animation: process-run 4s linear infinite backwards;
            }
          `}</style>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={step.num} 
                className={`relative pt-10 pb-8 px-4 lg:px-6 ${index !== steps.length - 1 ? 'border-b md:border-b-0 md:border-r border-slate-200/80' : ''}`}
              >
                {/* Arrow pointing to the next block (Desktop only) */}
                {index !== steps.length - 1 && (
                  <div className="hidden lg:block absolute top-0 left-6 -right-3 h-[4px] bg-slate-200 z-0">
                    {/* Gray Arrowhead */}
                    <div className="absolute -right-[12px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-slate-200"></div>
                    
                    {/* Animated process running inside */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-brand-500 animate-process-run"
                      style={{ animationDelay: `${index * 1}s` }}
                    >
                      {/* Colored Arrowhead moving with the process */}
                      <div className="absolute -right-[12px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-brand-500"></div>
                    </div>
                  </div>
                )}

                {/* Dot */}
                <div className="absolute -top-[2px] lg:-top-[3px] left-6 w-[10px] h-[10px] bg-brand-500 rounded-full ring-[6px] ring-white z-10"></div>
                
                <div className="text-[#1a2a4b] font-extrabold text-base mb-6 mt-2 relative z-10">{step.num}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 relative z-10">{step.title}</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
