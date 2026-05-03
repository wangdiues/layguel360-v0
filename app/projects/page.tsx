import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectsClient } from "@/components/projects/ProjectsClient";
import { getProjects, Project } from "@/lib/supabase/data";
import { FolderKanban, TrendingUp, LayoutList, AlertTriangle } from "lucide-react";

export default async function ProjectsPage() {
  let projects: Project[] = [];
  let total = 0;
  let active = 0;
  let planning = 0;
  let highPriority = 0;

  try {
    projects = await getProjects();
    total = projects.length;
    active = projects.filter((p) => p.status === "Active").length;
    planning = projects.filter((p) => p.status === "Planning").length;
    highPriority = projects.filter(
      (p) => p.priority === "High" || p.priority === "Critical"
    ).length;
  } catch {
    // graceful fallback
  }

  const statCards = [
    {
      label: "Total Projects",
      value: total,
      icon: FolderKanban,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      border: "border-l-primary",
    },
    {
      label: "Active",
      value: active,
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      border: "border-l-emerald-500",
    },
    {
      label: "Planning",
      value: planning,
      icon: LayoutList,
      iconColor: "text-violet-400",
      iconBg: "bg-violet-500/10",
      border: "border-l-violet-500",
    },
    {
      label: "High Priority",
      value: highPriority,
      icon: AlertTriangle,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10",
      border: "border-l-amber-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar />
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Projects
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Manage project plans, deadlines, priorities, and progress.
              </p>
            </div>
            <CreateProjectDialog />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.label}
                  className={`rounded-xl border border-border border-l-4 ${item.border} bg-card shadow-sm`}
                >
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        {item.value}
                      </p>
                    </div>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}
                    >
                      <Icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <ProjectsClient projects={projects} />
        </main>
      </div>
    </div>
  );
}
