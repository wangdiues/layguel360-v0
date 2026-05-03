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
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { mockProjects } from "@/lib/mock-data";

export default function ProjectsPage() {
  const total = mockProjects.length;
  const active = mockProjects.filter((p) => p.status === "Active").length;
  const planning = mockProjects.filter((p) => p.status === "Planning").length;
  const highPriority = mockProjects.filter(
    (p) => p.priority === "High" || p.priority === "Critical"
  ).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col">
        <Topbar />

        <section className="space-y-6 p-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Project List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div>
                          <Link
                            href={`/projects/${project.id}`}
                            className="font-medium hover:text-indigo-600 hover:underline"
                          >
                            {project.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {project.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{project.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{project.priority}</Badge>
                      </TableCell>
                      <TableCell>{project.end_date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
