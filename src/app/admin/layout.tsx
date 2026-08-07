import type { Metadata } from "next";
import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: {
    default: "Admin | Bao Bì Thành Phát",
    template: "%s | Admin Thành Phát",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const session = verifySessionToken(store.get(ADMIN_COOKIE)?.value);

  // Login page uses bare layout without shell
  // We detect via children route using a client-less approach:
  // layout always wraps; login page will not use shell by having its own full page.
  // Instead: only wrap with shell when authenticated.
  if (!session.ok) {
    return <>{children}</>;
  }

  return <AdminShell username={session.username}>{children}</AdminShell>;
}
