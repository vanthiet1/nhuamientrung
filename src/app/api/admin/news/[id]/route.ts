import { revalidatePath } from "next/cache";
import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import { deleteNews, getNewsById, updateNews } from "@/lib/cms/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    const item = await getNewsById(id);
    if (!item) throw new Error("Không tìm thấy tin tức");
    return jsonOk(item);
  });
}

export async function PUT(request: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    const body = await request.json();
    const item = await updateNews(id, body);
    revalidatePath("/", "layout");
    revalidatePath("/tin-tuc");
    return jsonOk(item);
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    await deleteNews(id);
    revalidatePath("/", "layout");
    revalidatePath("/tin-tuc");
    return jsonOk({ ok: true });
  });
}
