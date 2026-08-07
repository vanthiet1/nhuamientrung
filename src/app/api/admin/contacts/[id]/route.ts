import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import {
  deleteContactMessage,
  getContactMessageById,
  updateContactMessage,
} from "@/lib/cms/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    const item = await getContactMessageById(id);
    if (!item) throw new Error("Không tìm thấy yêu cầu liên hệ");
    return jsonOk(item);
  });
}

export async function PATCH(request: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    const body = await request.json();
    const item = await updateContactMessage(id, {
      isRead: body.isRead === true || body.isRead === false ? body.isRead : undefined,
    });
    return jsonOk(item);
  });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    await deleteContactMessage(id);
    return jsonOk({ ok: true });
  });
}
