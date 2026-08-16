"use client";
import React, { useState, useRef } from 'react';
import { Phone, Mail, FileCheck2, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef(Date.now());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File tải lên không được vượt quá 5MB");
        e.target.value = '';
        setFileName("");
        return;
      }
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("_t", openedAt.current.toString());

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra, vui lòng thử lại sau.");
      }

      toast.success("Gửi yêu cầu báo giá thành công! Chúng tôi sẽ liên hệ lại sớm nhất.");
      form.reset();
      setFileName("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-t border-slate-100" id="bao-gia">
      <div className="container-home">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column - Copy */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-[2px] w-8 bg-brand-500"></div>
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-brand-600">
                Form báo giá B2B
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#1a2a4b] leading-[1.2] tracking-tight mb-6">
              Gửi đúng thông tin.<br />
              <span className="text-brand-500 font-normal">Nhận tư vấn đúng quy cách.</span>
            </h2>
            
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg mb-10">
              Khách có thể điền nhanh thông tin cơ bản hoặc bổ sung chi tiết kỹ thuật để đội ngũ tư vấn nắm yêu cầu ngay từ lần liên hệ đầu tiên.
            </p>
            
            <div className="flex flex-col gap-6 mb-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="font-bold text-[#1a2a4b] border-b border-slate-100 pb-3 mb-2">Ưu tiên cần trao đổi ngay?</div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-6">
                <a href="tel:0935909747" className="group flex items-start gap-3">
                  <div className="mt-0.5 bg-brand-50 text-brand-600 p-2 rounded-lg group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 mb-0.5 whitespace-nowrap">HOTLINE / ZALO</div>
                    <div className="text-[#1a2a4b] font-bold text-lg group-hover:text-brand-600 transition-colors whitespace-nowrap">0935 909 747</div>
                  </div>
                </a>
                <a href="mailto:contact@baobithanhphat.com" className="group flex items-start gap-3">
                  <div className="mt-0.5 bg-brand-50 text-brand-600 p-2 rounded-lg group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-400 mb-0.5 whitespace-nowrap">EMAIL</div>
                    <div className="text-[#1a2a4b] font-bold text-base group-hover:text-brand-600 transition-colors truncate">contact@baobithanhphat.com</div>
                  </div>
                </a>
              </div>
            </div>
            
            <div>
              <div className="font-bold text-[#1a2a4b] text-lg mb-4 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-brand-500" />
                Thông tin nên chuẩn bị
              </div>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                  <span>Mẫu sản phẩm hoặc hình ảnh tham khảo</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                  <span>Kích thước và số lượng dự kiến</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                  <span>Yêu cầu in, vật liệu và điều kiện sử dụng</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                  <span>Địa điểm, thời gian cần nhận hàng</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right Column - Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
              <div className="bg-[#1a2a4b] p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-brand-300 text-sm font-medium tracking-wider uppercase mb-1">Bước đầu tiên</div>
                  <h3 className="text-2xl font-bold">Yêu cầu tư vấn & báo giá</h3>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-full text-xs text-brand-100 border border-white/20">
                  Phản hồi theo thông tin khách cung cấp
                </div>
              </div>
              
              <form 
                ref={formRef}
                className="p-6 sm:p-8"
                onSubmit={handleSubmit}
              >
                {/* Honeypot */}
                <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

                {/* 1. Thông tin liên hệ */}
                <fieldset className="mb-8">
                  <legend className="text-lg font-bold text-[#1a2a4b] mb-4 pb-2 border-b border-slate-100 w-full">1. Thông tin liên hệ</legend>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                      <input required placeholder="Nguyễn Văn Anh" autoComplete="name" name="name" className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên doanh nghiệp</label>
                      <input placeholder="Công ty / cơ sở sản xuất" autoComplete="organization" name="company" className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Số điện thoại / Zalo <span className="text-red-500">*</span></label>
                      <input type="tel" required placeholder="09xx xxx xxx" autoComplete="tel" pattern="[0-9 +()-]{9,15}" name="phone" className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                      <input type="email" placeholder="email@congty.vn" autoComplete="email" name="email" className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                    </div>
                  </div>
                </fieldset>

                {/* 2. Sản phẩm cần báo giá */}
                <fieldset className="mb-8">
                  <legend className="text-lg font-bold text-[#1a2a4b] mb-4 pb-2 border-b border-slate-100 w-full">2. Sản phẩm cần báo giá</legend>
                  
                  <div className="grid sm:grid-cols-3 gap-3 mb-6">
                    <label className="relative flex flex-col p-4 cursor-pointer rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 [&:has(:checked)]:border-brand-500 [&:has(:checked)]:bg-brand-50/50 transition-all">
                      <input type="radio" required name="product" value="in-mang-co" className="sr-only" defaultChecked />
                      <span className="font-bold text-[#1a2a4b] mb-1">In màng co</span>
                      <span className="text-xs text-slate-500">Toàn quốc</span>
                    </label>
                    <label className="relative flex flex-col p-4 cursor-pointer rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 [&:has(:checked)]:border-brand-500 [&:has(:checked)]:bg-brand-50/50 transition-all">
                      <input type="radio" required name="product" value="mang-ghep" className="sr-only" />
                      <span className="font-bold text-[#1a2a4b] mb-1">Bao bì màng ghép</span>
                      <span className="text-xs text-slate-500">Toàn quốc</span>
                    </label>
                    <label className="relative flex flex-col p-4 cursor-pointer rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 [&:has(:checked)]:border-brand-500 [&:has(:checked)]:bg-brand-50/50 transition-all">
                      <input type="radio" required name="product" value="vat-lieu" className="sr-only" />
                      <span className="font-bold text-[#1a2a4b] mb-1">Vật liệu đóng gói</span>
                      <span className="text-xs text-slate-500">Miền Trung</span>
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Ngành hàng</label>
                      <select name="industry" defaultValue="" className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all appearance-none">
                        <option value="" disabled>Chọn ngành hàng</option>
                        <option value="Nước uống & đồ uống">Nước uống & đồ uống</option>
                        <option value="Thực phẩm & nông sản">Thực phẩm & nông sản</option>
                        <option value="Mỹ phẩm & hóa mỹ phẩm">Mỹ phẩm & hóa mỹ phẩm</option>
                        <option value="Dược phẩm">Dược phẩm</option>
                        <option value="Hàng tiêu dùng">Hàng tiêu dùng</option>
                        <option value="Ngành hàng khác">Ngành hàng khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Số lượng dự kiến <span className="text-red-500">*</span></label>
                      <input required placeholder="Ví dụ: 50.000 tem / 500 kg" name="quantity" className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Kích thước / quy cách</label>
                      <input placeholder="Dài × rộng × cao / khổ màng" name="dimensions" className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Vật liệu / độ dày</label>
                      <input placeholder="Nếu đã xác định" name="material" className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Số màu in</label>
                      <input placeholder="Ví dụ: 6 màu" name="colors" className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Thời gian cần hàng</label>
                      <input type="date" name="deadline" className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Địa điểm giao hàng <span className="text-red-500">*</span></label>
                      <input required placeholder="Quận/huyện, tỉnh/thành" name="destination" className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                    </div>
                  </div>
                </fieldset>

                {/* 3. Mô tả thêm */}
                <fieldset className="mb-6">
                  <legend className="text-lg font-bold text-[#1a2a4b] mb-4 pb-2 border-b border-slate-100 w-full">3. Mô tả thêm</legend>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Yêu cầu và điều kiện sử dụng</label>
                      <textarea name="details" rows={3} placeholder="Mô tả sản phẩm cần đóng gói, cách sử dụng, yêu cầu bề mặt/in ấn hoặc thông tin cần tư vấn…" className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"></textarea>
                    </div>
                    
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-xl p-6 cursor-pointer transition-colors group text-center">
                      <input type="file" accept="image/*,.pdf,.ai,.cdr" name="reference" onChange={handleFileChange} className="hidden" />
                      <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-400 group-hover:text-brand-500 mb-3 transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-[#1a2a4b] mb-1">
                        {fileName ? fileName : "Đính kèm mẫu / file thiết kế"}
                      </span>
                      <span className="text-xs text-slate-500">Ảnh, PDF, AI hoặc CDR — Tối đa 5MB</span>
                    </label>
                  </div>
                </fieldset>

                <label className="flex items-start gap-3 mb-8 cursor-pointer group">
                  <div className="pt-0.5">
                    <input type="checkbox" required checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                    Tôi đồng ý để Bao Bì Thành Phát liên hệ tư vấn theo thông tin đã cung cấp.
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button disabled={isSubmitting || !isAgreed} type="submit" className="w-full sm:w-auto btn-primary !rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 font-bold text-[15px] shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        Gửi yêu cầu báo giá
                        <span className="text-lg leading-none mt-[-2px]">↗</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
