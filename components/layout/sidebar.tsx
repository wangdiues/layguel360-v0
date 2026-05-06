import { SidebarClient } from "@/components/layout/sidebar-client";
import { getCurrentUserDisplay } from "@/lib/supabase/queries.server";

export async function Sidebar() {
  const user = (await getCurrentUserDisplay()) ?? {
    name: "Account",
    role: "Member",
    email: "",
    initials: "?",
  };

  return <SidebarClient user={{ name: user.name, role: user.role, initials: user.initials }} />;
}
