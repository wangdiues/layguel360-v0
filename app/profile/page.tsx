import { redirect } from "next/navigation";
import { Mail, FolderKanban, CheckSquare, CheckCircle2 } from "lucide-react";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getProjects, getTasks } from "@/lib/supabase/queries.server";

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const [profile, projects, tasks] = await Promise.all([
    getProfile(user.id),
    getProjects(),
    getTasks(),
  ]);

  const displayName = profile?.name ?? user.email ?? "Account";
  const displayEmail = profile?.email ?? user.email ?? "";
  const displayRole = profile?.role ?? "Member";
  const displayDepartment = profile?.department ?? "";
  const displayBio = profile?.bio ?? "";

  const activeProjects = projects.filter((p) => p.status === "Active").length;
  const openTasks = tasks.filter((t) => t.status !== "Completed").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;

  const stats = [
    {
      label: "Active Projects",
      value: activeProjects,
      icon: FolderKanban,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Open Tasks",
      value: openTasks,
      icon: CheckSquare,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10",
    },
    {
      label: "Completed Tasks",
      value: completedTasks,
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="min-h-screen lg:pl-72">
        <Topbar />

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          {/* Profile hero */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-md">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                <AvatarFallback className="bg-primary/15 text-2xl font-bold text-primary">
                  {initialsOf(displayName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {displayName}
                </h1>
                <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{displayEmail}</span>
                </div>
                <div className="mt-3">
                  <Badge className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/15">
                    {displayRole}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <ProfileForm
              defaultName={profile?.name ?? ""}
              defaultEmail={displayEmail}
              defaultRole={profile?.role ?? ""}
              defaultDepartment={displayDepartment}
              defaultBio={displayBio}
            />

            <div className="space-y-4">
              <Card>
                <CardHeader className="border-b border-white/[0.08] pb-4">
                  <CardTitle className="text-base font-semibold">Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/[0.06]">
                    {stats.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="flex items-center justify-between px-5 py-4"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconBg}`}
                            >
                              <Icon className={`h-4 w-4 ${item.iconColor}`} />
                            </div>
                            <p className="text-sm font-medium text-foreground">{item.label}</p>
                          </div>
                          <p className="text-lg font-bold text-foreground">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b border-white/[0.08] pb-4">
                  <CardTitle className="text-base font-semibold">Role</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <p className="text-sm font-medium text-foreground">{displayRole}</p>
                  {displayDepartment && (
                    <p className="mt-1 text-sm text-muted-foreground">{displayDepartment}</p>
                  )}
                  {displayBio && (
                    <p className="mt-3 text-sm text-muted-foreground">{displayBio}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
