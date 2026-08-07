import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import { createProduct, getProducts } from "@/lib/cms/store";

export async function GET() {
  return withAdmin(async () => jsonOk(await getProducts()));
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    const body = await request.json();
    if (!body.name?.trim()) throw new Error("Tên sản phẩm là bắt buộc");
    if (!body.categoryId) throw new Error("Chọn danh mục");
    const item = await createProduct(body);
    return jsonOk(item, 201);
  });
}
