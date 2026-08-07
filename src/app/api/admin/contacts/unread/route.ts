import { withAdmin, jsonOk } from "@/lib/cms/api-helpers";
import { countUnreadContactMessages } from "@/lib/cms/store";

export async function GET() {
  return withAdmin(async () => {
    const count = await countUnreadContactMessages();
    return jsonOk({ count });
  });
}
