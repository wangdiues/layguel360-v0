import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { TasksClient } from "@/components/tasks/TasksClient";
import { mockTasks, mockProjects } from "@/lib/mock-data";

export default function TasksPage() {
  const total = mockTasks.length;
  const pending = mockTasks.filter((t) => t.status === "Pending").length;
  const inProgress = mockTasks.filter((t) => t.status === "In Progress").length;
  const completed = mockTasks.filter((t) => t.status === "Completed").length;

  const projectList = mockProjects.map((p) => ({ id: p.id, title: p.title }));

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar />
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
              <p className="text-muted-foreground">
                Track assigned work, deadlines, status, and task priority.
              </p>
            </div>
            <CreateTaskDialog projects={projectList} />
          </div>

          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Tasks", value: total },
              { label: "Pending", value: pending },
              { label: "In Progress", value: inProgress },
              { label: "Completed", value: completed },
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

          {/* Filterable task table — client component */}
          <TasksClient tasks={mockTasks} projects={projectList} />
        </main>
      </div>
    </div>
  );
}
