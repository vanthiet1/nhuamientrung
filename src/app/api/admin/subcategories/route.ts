import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import { createSubcategory, getSubcategories } from "@/lib/cms/store";

export async function GET() {
  return withAdmin(async () => jsonOk(await getSubcategories()));
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    const body = await request.json();
    if (!body.name?.trim()) throw new Error("Tên danh mục con là bắt buộc");
    if (!body.categoryId) throw new Error("Chọn danh mục cha");
    const item = await createSubcategory(body);
    return jsonOk(item, 201);
  });
}
