import { revalidatePath } from "next/cache";
import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import { createBanner, getBanners } from "@/lib/cms/store";

export async function GET() {
  return withAdmin(async () => jsonOk(await getBanners(true)));
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    const body = await request.json();
    if (!body.title?.trim()) throw new Error("Tiêu đề banner là bắt buộc");
    const item = await createBanner(body);
    revalidatePath("/", "layout");
    revalidatePath("/admin/banners");
    return jsonOk(item, 201);
  });
}
