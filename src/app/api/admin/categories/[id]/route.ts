import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/lib/cms/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    const item = await getCategoryById(id);
    if (!item) throw new Error("Không tìm thấy danh mục");
    return jsonOk(item);
  });
}

export async function PUT(request: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    const body = await request.json();
    const item = await updateCategory(id, body);
    return jsonOk(item);
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    await deleteCategory(id);
    return jsonOk({ ok: true });
  });
}
