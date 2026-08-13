import { revalidatePath } from "next/cache";
import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import {
  deleteBanner,
  getBannerById,
  updateBanner,
} from "@/lib/cms/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    const item = await getBannerById(id);
    if (!item) throw new Error("Không tìm thấy banner");
    return jsonOk(item);
  });
}

export async function PUT(request: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    const body = await request.json();
    const item = await updateBanner(id, {
      title: body.title,
      subtitle: body.subtitle,
      badge: body.badge,
      cta: body.cta,
      href: body.href,
      image: body.image,
      gradient: body.gradient,
      isActive: body.isActive,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
    });
    return jsonOk(item);
  });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  return withAdmin(async () => {
    const { id } = await ctx.params;
    await deleteBanner(id);
    return jsonOk({ ok: true });
  });
}
