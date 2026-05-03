import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockProjects, mockTasks } from "@/lib/mock-data";

export default function DashboardPage() {
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter((p) => p.status === "Active").length;
  const pendingTasks = mockTasks.filter((t) => t.status !== "Completed").length;
  const completedTasks = mockTasks.filter((t) => t.status === "Completed").length;

  const recentProjects = mockProjects.slice(0, 5);
  const recentTasks = mockTasks.slice(0, 5);

  const stats = [
    { title: "Total Projects", value: totalProjects },
    { title: "Active Projects", value: activeProjects },
    { title: "Pending Tasks", value: pendingTasks },
    { title: "Completed Tasks", value: completedTasks },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col">
        <Topbar />

        <section className="space-y-6 p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Project Overview</h1>
            <p className="text-muted-foreground">
              Summary of projects, tasks, and recent activities.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <Card key={item.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>
                          <StatusBadge value={project.status} type="status" />
                        </TableCell>
                        <TableCell>{project.end_date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>
                          <StatusBadge value={task.status} type="status" />
                        </TableCell>
                        <TableCell>
                          <StatusBadge value={task.priority} type="priority" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
