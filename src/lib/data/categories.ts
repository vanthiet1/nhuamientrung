export type Category = {
  slug: string;
  name: string;
  description: string;
  children?: Category[];
};

export const categories: Category[] = [
  {
    slug: "mang-co-pvc",
    name: "Màng co PVC",
    description:
      "Màng co PVC trong suốt, co nhiệt tốt, dùng bọc chai nước, giỏ quà, thực phẩm và nhiều sản phẩm khác.",
    children: [
      {
        slug: "mang-co-pvc-nuoc-giai-khat",
        name: "Màng co PVC Nước giải khát",
        description: "Màng co PVC chuyên dụng cho chai nước ngọt, nước suối, lon nước giải khát.",
      },
      {
        slug: "mang-co-pvc-theo-yeu-cau",
        name: "Màng co PVC theo yêu cầu",
        description: "Sản xuất màng co PVC kích thước, độ dày theo yêu cầu khách hàng.",
      },
      {
        slug: "mang-co-pvc-van-phong-pham",
        name: "Màng co PVC văn phòng phẩm",
        description: "Màng co PVC bọc sách vở, văn phòng phẩm gọn đẹp.",
      },
      {
        slug: "mang-co-pvc-hoa-my-pham",
        name: "Màng co PVC hóa mỹ phẩm",
        description: "Màng co PVC bảo vệ sản phẩm hóa mỹ phẩm, tăng thẩm mỹ bao bì.",
      },
      {
        slug: "mang-co-pvc-duoc-pham",
        name: "Màng co PVC dược phẩm",
        description: "Màng co PVC đóng gói dược phẩm an toàn, chuyên nghiệp.",
      },
      {
        slug: "mang-co-pvc-thuc-pham",
        name: "Màng co PVC thực phẩm",
        description: "Màng co PVC bọc thực phẩm, bảo quản và trưng bày tốt.",
      },
    ],
  },
  {
    slug: "mang-co-pe",
    name: "Màng co PE",
    description:
      "Màng co PE bền chắc, dùng đóng lốc nước, pallet và bao bì công nghiệp.",
    children: [
      {
        slug: "mang-co-pe-hoa-my-pham",
        name: "Màng co PE hóa mỹ phẩm",
        description: "Màng co PE đóng gói hóa mỹ phẩm, độ bền cao.",
      },
      {
        slug: "mang-co-pe-thuc-pham",
        name: "Màng co PE thực phẩm",
        description: "Màng co PE an toàn cho đóng gói thực phẩm.",
      },
      {
        slug: "mang-co-pe-dong-loc",
        name: "Màng co PE đóng lốc",
        description: "Màng co PE đóng lốc nước ngọt, bia, nước mắm, nước tương.",
      },
    ],
  },
  {
    slug: "mang-co-pof",
    name: "Màng co POF",
    description:
      "Màng co POF thân thiện môi trường, trong suốt, phù hợp thực phẩm và hàng tiêu dùng.",
    children: [
      {
        slug: "mang-co-pof-theo-yeu-cau",
        name: "Màng co POF theo yêu cầu",
        description: "Gia công màng co POF theo kích thước và độ dày mong muốn.",
      },
      {
        slug: "mang-co-pof-van-phong-pham",
        name: "Màng co POF văn phòng phẩm",
        description: "Màng co POF bọc sách vở, quà tặng văn phòng.",
      },
      {
        slug: "mang-co-pof-hoa-my-pham",
        name: "Màng co POF hóa mỹ phẩm",
        description: "Màng co POF tăng thẩm mỹ bao bì mỹ phẩm.",
      },
      {
        slug: "mang-co-pof-duoc-pham",
        name: "Màng co POF dược phẩm",
        description: "Màng co POF đóng gói dược phẩm an toàn.",
      },
      {
        slug: "mang-co-pof-thuc-pham",
        name: "Màng co POF thực phẩm",
        description: "Màng co POF an toàn thực phẩm, độ trong cao.",
      },
    ],
  },
  {
    slug: "mang-co-pet",
    name: "Màng co PET",
    description: "Màng co PET độ bền cao, in sắc nét, dùng cho chai nhựa và nhãn co nhiệt.",
  },
  {
    slug: "mang-opp-bopp",
    name: "Màng OPP - BOPP",
    description: "Màng OPP/BOPP in ấn bao bì, nhãn chai nước, đóng gói hàng tiêu dùng.",
  },
  {
    slug: "mang-co-in-nhiet",
    name: "Màng co in nhiệt",
    description: "Dịch vụ in màng co nhiệt logo thương hiệu trên PVC, PE, POF, PET, OPP.",
    children: [
      {
        slug: "mang-in-chat-lieu-opp",
        name: "Màng in chất liệu OPP",
        description: "In màng OPP chất lượng cao, màu sắc bền đẹp.",
      },
      {
        slug: "mang-co-in-chat-lieu-pof",
        name: "Màng co in chất liệu POF",
        description: "In màng co POF theo yêu cầu thương hiệu.",
      },
      {
        slug: "mang-co-in-chat-lieu-pe",
        name: "Màng co in chất liệu PE",
        description: "In màng co PE đóng lốc, branding sản phẩm.",
      },
      {
        slug: "mang-co-in-chat-lieu-pvc",
        name: "Màng co in chất liệu PVC tem nhãn",
        description: "In tem nhãn màng co PVC 360 độ cho chai nước.",
      },
      {
        slug: "mang-co-in-chat-lieu-pet",
        name: "Màng co in chất liệu PET",
        description: "In màng co PET sắc nét, độ bền cao.",
      },
    ],
  },
  {
    slug: "mang-phuc-hop",
    name: "Màng phức hợp",
    description: "Bao bì màng phức hợp cho gạo, bánh kẹo, thủy sản, trà cà phê, phân bón.",
    children: [
      {
        slug: "bao-bi-tui-dung-gao",
        name: "Bao bì túi đựng gạo",
        description: "Túi màng phức hợp đựng gạo chắc chắn, in logo.",
      },
      {
        slug: "bao-bi-banh-keo",
        name: "Bao bì bánh kẹo",
        description: "Bao bì màng phức hợp bánh kẹo đẹp, bảo quản tốt.",
      },
      {
        slug: "bao-bi-thuy-san",
        name: "Bao bì thủy sản",
        description: "Bao bì chuyên dụng cho thủy sản đông lạnh, xuất khẩu.",
      },
      {
        slug: "bao-bi-tra-ca-phe",
        name: "Bao bì trà và cà phê",
        description: "Túi zip, túi màng phức hợp trà cà phê giữ hương.",
      },
      {
        slug: "bao-bi-phan-bon",
        name: "Bao bì phân bón thuốc trừ sâu",
        description: "Bao bì bền chắc cho phân bón và hóa chất nông nghiệp.",
      },
    ],
  },
];

export function getAllCategoriesFlat(): Category[] {
  const result: Category[] = [];
  for (const cat of categories) {
    result.push(cat);
    if (cat.children) {
      result.push(...cat.children);
    }
  }
  return result;
}

export function findCategory(slug: string): {
  category: Category;
  parent?: Category;
} | null {
  for (const cat of categories) {
    if (cat.slug === slug) {
      return { category: cat };
    }
    if (cat.children) {
      const child = cat.children.find((c) => c.slug === slug);
      if (child) {
        return { category: child, parent: cat };
      }
    }
  }
  return null;
}

export function getParentCategories(): Category[] {
  return categories;
}
