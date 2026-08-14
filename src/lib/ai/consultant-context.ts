import { company } from "@/lib/data/company";
import { getCategories, getProducts, getSubcategories } from "@/lib/cms/store";
import type { ProductRecord } from "@/lib/cms/types";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s: string) {
  return norm(s)
    .split(" ")
    .filter((w) => w.length >= 2);
}

const STOP = new Set([
  "toi",
  "ban",
  "cho",
  "voi",
  "cua",
  "la",
  "va",
  "the",
  "nao",
  "gi",
  "can",
  "muon",
  "hoi",
  "ve",
  "dung",
  "duoc",
  "nhung",
  "san",
  "pham",
  "loai",
  "hang",
  "mang",
  "co",
  "nhiet",
  "bao",
  "bi",
]);

/** Điểm khớp sản phẩm theo từ khóa khách hỏi */
function scoreProduct(p: ProductRecord, qTokens: string[]) {
  const hay = norm(
    `${p.name} ${p.sku || ""} ${p.description || ""} ${p.content || ""}`
  );
  let score = 0;
  for (const t of qTokens) {
    if (hay.includes(t)) score += t.length >= 4 ? 3 : 2;
  }
  const name = norm(p.name);
  for (const t of qTokens) {
    if (name.includes(t)) score += 2;
  }
  return score;
}

export type CatalogSnapshot = {
  cats: { name: string; slug: string; children: string[] }[];
  products: ProductRecord[];
};

/** Kiến thức ứng dụng — trả lời “dùng cho sản phẩm nào?” */
const MATERIAL_GUIDE: Record<
  string,
  {
    title: string;
    uses: string[];
    traits: string[];
    note?: string;
    match: RegExp;
  }
> = {
  pvc: {
    title: "Màng co PVC",
    match: /\bpvc\b|polivinyl|polyvinyl/,
    traits: [
      "Trong suốt, bóng đẹp sau khi co nhiệt",
      "Co tốt, ôm sát chai/lon",
      "Phù hợp in tem nhãn, áo bình, niêm phong nắp",
    ],
    uses: [
      "Chai nước ngọt, nước suối, lon nước giải khát",
      "Nắp chai (nước mắm, tương ớt, gia vị) — niêm phong chống mở",
      "Áo bình / bọc ngoài bình nước",
      "Tem nhãn co nhiệt (cuộn phóng nhãn hoặc cắt rời)",
      "Bao bọc sản phẩm cần độ bóng, trong suốt cao",
    ],
    note: "Không phải lựa chọn tối ưu cho mọi thực phẩm tiếp xúc trực tiếp — khi cần độ mềm/dai cao thường xem thêm POF.",
  },
  pe: {
    title: "Màng co PE",
    match: /\bpe\b|polyethylene|polyetylen/,
    traits: [
      "Dày dai, chịu lực tốt",
      "Ít rách khi vận chuyển",
      "Hay dùng đóng lốc / bó nhóm hàng",
    ],
    uses: [
      "Đóng lốc chai nước, lon, hộp",
      "Bọc nhóm hàng hóa cần độ bền",
      "Hàng hóa mỹ phẩm, hàng khô cần dai",
      "Ứng dụng cần chịu va đập tốt hơn PVC mỏng",
    ],
  },
  pof: {
    title: "Màng co POF",
    match: /\bpof\b|polyolefin|polyolephin/,
    traits: [
      "Mềm, dai, co đều, bám đẹp",
      "Thẩm mỹ cao, góc co mịn",
      "Phù hợp thực phẩm & hàng cần nhìn đẹp trên kệ",
    ],
    uses: [
      "Hộp thực phẩm, bánh kẹo, đồ khô",
      "Hàng hóa cần bọc đẹp (mỹ phẩm, quà tặng)",
      "Dạng cuộn / túi / ép cong theo hình sản phẩm",
      "Sản phẩm nhiều góc cạnh cần màng mềm, ít rách",
    ],
  },
  pet: {
    title: "Màng co / film PET",
    match: /\bpet\b/,
    traits: ["Độ cứng/cứng cáp hơn một số màng co mềm", "Ứng dụng chuyên biệt theo quy cách"],
    uses: [
      "Một số ứng dụng bọc/nhãn chuyên dụng",
      "Theo yêu cầu kỹ thuật khách hàng",
    ],
  },
};

function detectMaterial(t: string): keyof typeof MATERIAL_GUIDE | null {
  if (MATERIAL_GUIDE.pvc.match.test(t)) return "pvc";
  if (MATERIAL_GUIDE.pof.match.test(t)) return "pof";
  if (MATERIAL_GUIDE.pe.match.test(t)) return "pe";
  if (MATERIAL_GUIDE.pet.match.test(t)) return "pet";
  return null;
}

function isUseCaseQuestion(t: string) {
  return (
    /\bdung\s*(duoc\s*)?(cho|de)\b/.test(t) ||
    /\bung\s*dung\b/.test(t) ||
    /\bphu\s*hop\b/.test(t) ||
    /\bsan\s*pham\s*nao\b/.test(t) ||
    /\bhang\s*nao\b/.test(t) ||
    /\bdung\s*lam\s*gi\b/.test(t) ||
    /\bco\s*the\s*boc\b/.test(t) ||
    /\bboc\s*duoc\b/.test(t) ||
    /\bdung\s*duoc\b/.test(t) ||
    /\bcho\s*nhung\b/.test(t)
  );
}

function relatedProducts(
  catalog: CatalogSnapshot,
  material: string,
  limit = 4
): ProductRecord[] {
  const key = material.toLowerCase();
  // \bpe\b tránh khớp nhầm "pet"
  const re =
    key === "pe"
      ? /(^|[^a-z])pe([^a-z]|$)/
      : key === "pet"
        ? /(^|[^a-z])pet([^a-z]|$)/
        : new RegExp(key, "i");
  return catalog.products
    .filter((p) => {
      const h = norm(`${p.name} ${p.sku || ""}`);
      return re.test(h);
    })
    .slice(0, limit);
}

function formatProductLinks(products: ProductRecord[]) {
  if (!products.length) return "";
  return (
    `\n\n**Một số SP ${company.shortName} liên quan:**\n` +
    products
      .map((p) => {
        const label = `${p.name}${p.sku ? ` · ${p.sku}` : ""}`;
        return `• [${label}](/san-pham/${p.slug})`;
      })
      .join("\n")
  );
}

export async function loadCatalog(): Promise<CatalogSnapshot> {
  const [cats, subs, products] = await Promise.all([
    getCategories(),
    getSubcategories(),
    getProducts(),
  ]);
  return {
    cats: cats.map((c) => ({
      name: c.name,
      slug: c.slug,
      children: subs
        .filter((s) => s.categoryId === c.id)
        .map((s) => s.name),
    })),
    products: products.filter((p) => p.isActive !== false),
  };
}

/**
 * ChatBot tư vấn free — rule + catalog (PVC/PE/POF, giá, giao hàng, tìm SP).
 */
export function freeConsultantReply(
  userText: string,
  catalog: CatalogSnapshot
): string {
  const raw = userText.trim();
  if (!raw) {
    return `Bạn muốn hỏi gì về bao bì? Ví dụ: “Màng co PVC dùng cho sản phẩm nào?”, báo giá, giao hàng…`;
  }

  const t = norm(raw);
  const phone = company.phone;
  const zalo = company.zaloUrl;
  const qTokens = tokens(raw).filter((w) => !STOP.has(w));
  const material = detectMaterial(t);

  // ── Chào hỏi ──
  if (
    /^(xin chao|chao|hello|hi|hey)\b/.test(t) ||
    (t.length < 12 && /chao|hello|hi/.test(t))
  ) {
    return `Xin chào! Mình là **ChatBot tư vấn** của ${company.shortName}. Bạn có thể hỏi về các sản phẩm: Màng co (PVC/PE/POF), Màng phức hợp, In bao bì, Xốp hơi, Băng keo, báo giá, giao hàng…`;
  }

  // ── Liên hệ ──
  if (
    /\bzalo\b|\bhotline\b|\blien\s*he\b|\bsdt\b|\bso\s*dien\s*thoai\b|\bemail\b|\bgoi\s*dien\b/.test(
      t
    )
  ) {
    return (
      `**Liên hệ ${company.shortName}:**\n` +
      `• Hotline: ${phone}\n` +
      `• Zalo: ${zalo}\n` +
      `• Email: ${company.email}\n` +
      `• Địa chỉ: ${company.address}\n` +
      `• Form: /lien-he`
    );
  }

  // ── Giao hàng (trước báo giá — tránh "giao"/"gia") ──
  if (
    /\bgiao\b|\bgiao\s*hang\b|\bship\b|\bvan\s*chuyen\b|\btoan\s*quoc\b|\bthoi\s*gian\b|\bmat\s*bao\s*lau\b|\bbao\s*lau\b/.test(
      t
    ) &&
    !/\bbao\s*gia\b/.test(t)
  ) {
    return (
      `${company.shortName} tại **${company.address}**.\n\n` +
      `• Giao **Đà Nẵng & toàn quốc**\n` +
      `• Nội thành Đà Nẵng: thường **trong ngày – 1 ngày** (sau xác nhận)\n` +
      `• Tỉnh khác: thường **1–3 ngày** (tùy khu vực / số lượng)\n\n` +
      `Cần giao gấp? Gọi **${phone}** hoặc Chat Zalo.`
    );
  }

  // ── Báo giá ──
  if (
    /\bbao\s*gia\b|\bbao\s*nhieu\b|\bcost\b|\bprice\b/.test(t) ||
    (/\bgia\b/.test(t) && !/\bgiao\b/.test(t))
  ) {
    return (
      `Báo giá bao bì **phụ thuộc quy cách** (độ dày, khổ, số lượng, in logo…), không có giá niêm yết cố định.\n\n` +
      `Bạn cho mình: loại màng (PVC/PE/POF), kích thước, số lượng — hoặc gọi **${phone}** / Zalo để **báo giá miễn phí**.`
    );
  }

  // ── Ứng dụng: "PVC dùng cho sản phẩm nào?" ──
  if (material && (isUseCaseQuestion(t) || t.split(" ").length <= 8)) {
    // nếu chỉ hỏi ngắn "mang co pvc" hoặc có "dung cho" → ưu tiên kiến thức ứng dụng
    const onlyMaterialChatty =
      isUseCaseQuestion(t) ||
      (material &&
        qTokens.filter((w) => !["pvc", "pe", "pof", "pet", "mang", "co"].includes(w))
          .length <= 2);

    if (isUseCaseQuestion(t) || onlyMaterialChatty) {
      const g = MATERIAL_GUIDE[material];
      const rel = relatedProducts(catalog, material, 4);
      return (
        `**${g.title}** dùng được cho các nhóm sản phẩm sau:\n\n` +
        g.uses.map((u) => `• ${u}`).join("\n") +
        `\n\n**Đặc điểm:** ${g.traits.join("; ")}.` +
        (g.note ? `\n\n*Lưu ý:* ${g.note}` : "") +
        formatProductLinks(rel) +
        `\n\nCần khớp đúng chai/hộp của bạn? Gọi **${phone}** để tư vấn quy cách — miễn phí.`
      );
    }
  }

  // ── So sánh PVC vs PE vs POF ──
  if (
    /\bnen\s*chon\b|\bkhac\s*gi\b|\bso\s*sanh\b|\bloai\s*nao\b/.test(t) ||
    (/\bpvc\b/.test(t) && /\bpe\b/.test(t)) ||
    (/\bpvc\b/.test(t) && /\bpof\b/.test(t)) ||
    (/\bpe\b/.test(t) && /\bpof\b/.test(t))
  ) {
    return (
      `So sánh nhanh để chọn màng:\n\n` +
      `• **PVC** → chai nước, lon, nắp chai, tem nhãn, áo bình (trong suốt, bóng)\n` +
      `• **PE** → đóng lốc / bó nhóm, cần dai chịu lực\n` +
      `• **POF** → thực phẩm, hàng cần đẹp trên kệ, ép cong/túi theo hình\n\n` +
      `Bạn đang bọc **chai / lốc / hộp thực phẩm**? Nói mình biết để chốt loại phù hợp, hoặc gọi **${phone}**.`
    );
  }

  // ── Hỏi về 1 loại màng (không phải "dùng cho") vẫn trả lời ứng dụng ngắn + SP ──
  if (material && !isUseCaseQuestion(t)) {
    const g = MATERIAL_GUIDE[material];
    const rel = relatedProducts(catalog, material, 3);
    // nếu query quá chung, vẫn đưa use cases
    if (qTokens.length <= 4) {
      return (
        `**${g.title}** thường dùng cho:\n` +
        g.uses
          .slice(0, 4)
          .map((u) => `• ${u}`)
          .join("\n") +
        formatProductLinks(rel) +
        `\n\nHỏi thêm: “${g.title} dùng cho sản phẩm nào?” hoặc gọi **${phone}**.`
      );
    }
  }

  // ── Tìm sản phẩm theo tên/mô tả ──
  const scored = catalog.products
    .map((p) => ({
      p,
      s: scoreProduct(p, qTokens.length ? qTokens : tokens(raw)),
    }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 4);

  if (scored.length > 0 && (scored[0].s >= 6 || qTokens.length >= 3)) {
    const lines = scored.map(({ p }) => {
      const desc = (p.description || "").replace(/\s+/g, " ").slice(0, 90);
      const label = `${p.name}${p.sku ? ` · ${p.sku}` : ""}`;
      return `• [${label}](/san-pham/${p.slug})${desc ? `\n  ${desc}…` : ""}`;
    });
    return (
      `Theo catalog ${company.shortName}, các sản phẩm gần với câu hỏi của bạn:\n\n` +
      lines.join("\n\n") +
      `\n\nBấm tên để xem chi tiết, hoặc gọi **${phone}** / Zalo.`
    );
  }

  if (scored.length > 0 && scored[0].s >= 3) {
    const lines = scored.slice(0, 3).map(({ p }) => {
      const label = `${p.name}${p.sku ? ` · ${p.sku}` : ""}`;
      return `• [${label}](/san-pham/${p.slug})`;
    });
    return (
      `Gợi ý sản phẩm:\n${lines.join("\n")}\n\n` +
      `Cần giải thích dùng cho hàng gì? Hỏi dạng: “Màng co PVC dùng cho sản phẩm nào?”`
    );
  }

  // ── Danh mục ──
  if (/\bdanh\s*muc\b|\bco\s*gi\b|\bban\s*gi\b/.test(t)) {
    const catList = catalog.cats
      .slice(0, 8)
      .map((c) => `• ${c.name}`)
      .join("\n");
    return (
      `**Danh mục chính** của ${company.shortName}:\n${catList || "• Đang cập nhật"}\n\n` +
      `Bạn có thể hỏi: “POF dùng cho gì?”, “PVC bọc chai nước được không?”…`
    );
  }

  // ── Công ty ──
  if (/\bcong\s*ty\b|\bthanh\s*phat\b|\bdia\s*chi\b|\bmst\b|\bgioi\s*thieu\b/.test(t)) {
    return (
      `**${company.name}**\n` +
      `• Địa chỉ: ${company.address}\n` +
      `• MST: ${company.taxCode}\n` +
      `• Hotline: ${phone}\n` +
      `• ${company.description}`
    );
  }

  // ── Default ──
  return (
    `Mình chưa chắc ý bạn. Bạn thử hỏi rõ hơn, ví dụ:\n` +
    `• “Màng co PVC dùng cho những sản phẩm nào?”\n` +
    `• “Nên chọn PE hay POF?”\n` +
    `• “Giao hàng Đà Nẵng mất bao lâu?”\n` +
    `• “Báo giá màng co”\n\n` +
    `Hoặc gọi **${phone}** / Chat Zalo — tư vấn trực tiếp.`
  );
}
