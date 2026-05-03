import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectsClient } from "@/components/projects/ProjectsClient";
import { mockProjects } from "@/lib/mock-data";

export default function ProjectsPage() {
  const total = mockProjects.length;
  const active = mockProjects.filter((p) => p.status === "Active").length;
  const planning = mockProjects.filter((p) => p.status === "Planning").length;
  const highPriority = mockProjects.filter(
    (p) => p.priority === "High" || p.priority === "Critical"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar />
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
              <p className="text-muted-foreground">
                Manage project plans, deadlines, priorities, and progress.
              </p>
            </div>
            <CreateProjectDialog />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Projects", value: total },
              { label: "Active", value: active },
              { label: "Planning", value: planning },
              { label: "High Priority", value: highPriority },
            ].map((item) => (
              <Card key={item.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <ProjectsClient projects={mockProjects} />
        </main>
      </div>
    </div>
  );
}
