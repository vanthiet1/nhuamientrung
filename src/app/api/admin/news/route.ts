import { revalidatePath } from "next/cache";
import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import { createNews, getNews } from "@/lib/cms/store";

export async function GET() {
  return withAdmin(async () => jsonOk(await getNews(true)));
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    const body = await request.json();
    if (!body.title?.trim()) throw new Error("Tiêu đề là bắt buộc");
    const item = await createNews(body);
    return jsonOk(item, 201);
  });
}
