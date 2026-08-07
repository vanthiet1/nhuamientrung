import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import {
  deleteCareer,
  getCareerById,
  updateCareer,
} from "@/lib/cms/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    const item = await getCareerById(id);
    if (!item) throw new Error("Không tìm thấy tin tuyển dụng");
    return jsonOk(item);
  });
}

export async function PUT(request: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    const body = await request.json();
    const item = await updateCareer(id, body);
    return jsonOk(item);
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    await deleteCareer(id);
    return jsonOk({ ok: true });
  });
}
