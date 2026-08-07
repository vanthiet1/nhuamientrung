import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import { getContactMessages } from "@/lib/cms/store";

export async function GET() {
  return withAdmin(async () => {
    const list = await getContactMessages();
    return jsonOk(list);
  });
}
