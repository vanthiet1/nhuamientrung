import { revalidatePath } from "next/cache";
import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import { createCategory, getCategories } from "@/lib/cms/store";

export async function GET() {
  return withAdmin(async () => jsonOk(await getCategories()));
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    const body = await request.json();
    if (!body.name?.trim()) throw new Error("Tên danh mục là bắt buộc");
    const item = await createCategory(body);
    revalidatePath("/", "layout");
    return jsonOk(item, 201);
  });
}
