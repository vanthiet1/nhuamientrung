export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
};

export const newsItems: NewsItem[] = [
  {
    slug: "mang-co-pvc-giai-phap-dong-goi-toi-uu",
    title: "Màng co PVC – Giải pháp đóng gói tối ưu cho mọi ngành hàng",
    excerpt:
      "Màng co PVC đang là lựa chọn hàng đầu giúp doanh nghiệp bảo vệ sản phẩm, tăng thẩm mỹ và tối ưu chi phí đóng gói.",
    content: `Màng co PVC (Polyvinyl Chloride) là loại màng nhựa có khả năng co rút khi gặp nhiệt độ cao. Đây là giải pháp đóng gói phổ biến trong ngành nước giải khát, thực phẩm, mỹ phẩm và quà tặng.

**Ưu điểm nổi bật:**
- Độ trong cao, hiển thị sản phẩm rõ nét
- Co nhiệt đều, ôm sát sản phẩm
- Giá thành hợp lý, phù hợp sản xuất số lượng lớn
- In ấn logo, nhãn mác sắc nét

**Ứng dụng phổ biến:**
- Bọc chai nước suối, nước ngọt
- Bọc giỏ quà Tết, giỏ trái cây
- Đóng gói thực phẩm, dược phẩm, hóa mỹ phẩm

Công ty TNHH Thương mại và Dịch vụ Bao Bì Thành Phát cung cấp màng co PVC đa dạng kích thước, độ dày, hỗ trợ tư vấn chọn loại phù hợp và giao hàng nhanh tại Đà Nẵng và toàn quốc.`,
    date: "2026-03-15",
  },
  {
    slug: "so-sanh-mang-co-pe-va-pvc",
    title: "So sánh màng co PE và PVC: Khi nào dùng loại nào?",
    excerpt:
      "Hiểu rõ sự khác biệt giữa màng co PE và PVC giúp doanh nghiệp chọn đúng vật liệu, tối ưu chi phí và hiệu quả đóng gói.",
    content: `Màng co PE và màng co PVC đều là vật liệu đóng gói co nhiệt, nhưng mỗi loại có đặc tính riêng.

**Màng co PVC:**
- Trong suốt, thẩm mỹ cao
- Co nhiệt ở nhiệt độ thấp hơn
- Phù hợp bọc chai, giỏ quà, tem nhãn

**Màng co PE:**
- Độ bền cơ học cao, dai
- Thích hợp đóng lốc nước, pallet, hàng nặng
- Chịu va đập tốt khi vận chuyển

**Khuyến nghị:**
- Cần thẩm mỹ trưng bày → chọn PVC
- Cần độ bền đóng lốc / công nghiệp → chọn PE
- Ưu tiên thân thiện môi trường → cân nhắc POF

Liên hệ Bao Bì Thành Phát để được tư vấn chọn màng co phù hợp với sản phẩm của bạn.`,
    date: "2026-02-28",
  },
  {
    slug: "mang-co-pof-than-thien-moi-truong",
    title: "Màng co POF – Giải pháp đóng gói thân thiện môi trường",
    excerpt:
      "Màng co POF ngày càng được ưa chuộng nhờ độ trong, độ bền và tính an toàn với thực phẩm cũng như môi trường.",
    content: `Màng co POF (Polyolefin) là loại màng co nhiệt đa năng, được nhiều doanh nghiệp lựa chọn thay thế PVC trong một số ứng dụng.

**Đặc điểm:**
- Không chứa clo, thân thiện hơn với môi trường khi xử lý
- Độ trong cao, bề mặt bóng đẹp
- An toàn cho đóng gói thực phẩm
- Co đều 2 chiều, ôm sát sản phẩm

**Ứng dụng:**
- Thực phẩm, bánh kẹo
- Mỹ phẩm, dược phẩm
- Văn phòng phẩm, quà tặng

Bao Bì Thành Phát cung cấp màng co POF dạng cuộn và dạng túi, sản xuất theo yêu cầu kích thước.`,
    date: "2026-02-10",
  },
  {
    slug: "dich-vu-in-mang-co-nhiet-logo",
    title: "Dịch vụ in màng co nhiệt logo – Nâng tầm nhận diện thương hiệu",
    excerpt:
      "In logo trực tiếp lên màng co giúp sản phẩm nổi bật trên kệ, chống hàng giả và tăng giá trị thương hiệu.",
    content: `In màng co nhiệt là giải pháp branding 360° cho chai nước, lốc sản phẩm và nhiều bao bì khác.

**Lợi ích:**
- Nhận diện thương hiệu rõ ràng
- Bảo vệ chống giả mạo
- Thẩm mỹ chuyên nghiệp
- Thông tin sản phẩm đầy đủ trên bao bì

**Chất liệu in:**
- PVC tem nhãn chai nước
- PE đóng lốc
- POF, PET, OPP/BOPP

Chúng tôi nhận in theo file thiết kế của khách hàng, hỗ trợ tư vấn layout và màu sắc in ấn.`,
    date: "2026-01-20",
  },
  {
    slug: "bao-bi-mang-phuc-hop-thuc-pham",
    title: "Bao bì màng phức hợp cho ngành thực phẩm và nông sản",
    excerpt:
      "Màng phức hợp giúp bảo quản gạo, bánh kẹo, thủy sản, trà cà phê lâu dài với khả năng chống ẩm, chống oxy hóa.",
    content: `Bao bì màng phức hợp là sự kết hợp nhiều lớp vật liệu (PE, PET, PA, AL…) nhằm tối ưu bảo quản sản phẩm.

**Ứng dụng tại Thành Phát:**
- Túi đựng gạo in logo
- Bao bì bánh kẹo
- Bao bì thủy sản đông lạnh
- Túi trà, cà phê giữ hương
- Bao bì phân bón, thuốc trừ sâu

Chúng tôi tư vấn cấu trúc màng phù hợp từng ngành hàng, in ấn đa màu và giao hàng đúng tiến độ.`,
    date: "2026-01-05",
  },
  {
    slug: "chon-mang-co-dong-goi-tet",
    title: "Kinh nghiệm chọn màng co bọc giỏ quà Tết đẹp, bền",
    excerpt:
      "Mùa Tết, màng co PVC bọc giỏ quà giúp sản phẩm sang trọng, gọn gàng và bảo vệ tốt trong quá trình vận chuyển.",
    content: `Giỏ quà Tết cần màng co có độ trong cao, co đều và không bị rách khi vận chuyển.

**Gợi ý chọn màng:**
- Ưu tiên màng co PVC trong suốt khổ lớn
- Chọn độ dày phù hợp trọng lượng giỏ
- Có thể in logo công ty trên màng để tăng chuyên nghiệp

Bao Bì Thành Phát có sẵn màng co PVC bọc giỏ quà, giỏ trái cây với nhiều khổ, hỗ trợ tư vấn và giao hàng nhanh dịp cao điểm Tết.`,
    date: "2025-12-15",
  },
];

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return newsItems.find((n) => n.slug === slug);
}
