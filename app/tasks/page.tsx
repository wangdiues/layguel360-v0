import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { mockTasks, mockProjects } from "@/lib/mock-data";

export default function TasksPage() {
  const total = mockTasks.length;
  const pending = mockTasks.filter((t) => t.status === "Pending").length;
  const inProgress = mockTasks.filter((t) => t.status === "In Progress").length;
  const completed = mockTasks.filter((t) => t.status === "Completed").length;

  const projectList = mockProjects.map((p) => ({ id: p.id, title: p.title }));

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col">
        <Topbar />

        <section className="space-y-6 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
              <p className="text-muted-foreground">
                Track assigned work, deadlines, status, and task priority.
              </p>
            </div>
            <CreateTaskDialog projects={projectList} />
          </div>

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

          <Card>
            <CardHeader>
              <CardTitle>Task List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTasks.map((task) => {
                    const project = mockProjects.find(
                      (p) => p.id === task.project_id
                    );
                    return (
                      <TableRow key={task.id}>
                        <TableCell>
                          <Link
                            href={`/tasks/${task.id}`}
                            className="font-medium hover:text-indigo-600 hover:underline"
                          >
                            {task.title}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {project?.title ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{task.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{task.priority}</Badge>
                        </TableCell>
                        <TableCell>{task.due_date}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
