import { revalidatePath } from "next/cache";
import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/cms/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    const item = await getProductById(id);
    if (!item) throw new Error("Không tìm thấy sản phẩm");
    return jsonOk(item);
  });
}

export async function PUT(request: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    const body = await request.json();
    const item = await updateProduct(id, body);
    revalidatePath("/", "layout");
    return jsonOk(item);
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    await deleteProduct(id);
    revalidatePath("/", "layout");
    return jsonOk({ ok: true });
  });
}
