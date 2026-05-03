import { notFound } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommentList } from "@/components/comments/CommentList";
import { AttachmentList } from "@/components/uploads/AttachmentList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CalendarDays, FolderKanban, User } from "lucide-react";
import {
  mockTasks,
  mockProjects,
  mockComments,
  mockAttachments,
} from "@/lib/mock-data";

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className="rounded-full px-3 py-1" variant="secondary">
      {status}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge className="rounded-full px-3 py-1" variant="outline">
      {priority}
    </Badge>
  );
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;

  const task = mockTasks.find((t) => t.id === taskId);
  if (!task) notFound();

  const project = mockProjects.find((p) => p.id === task.project_id);
  const comments = mockComments[taskId] ?? [];
  const attachments = mockAttachments[taskId] ?? [];

  const created = new Date(task.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />

      <main className="min-h-screen lg:pl-72">
        <Topbar />

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border bg-background p-6 shadow-sm md:flex-row md:items-start">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {task.title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {task.description}
                </p>
              </div>
            </div>
            <Button variant="outline">Edit Task</Button>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FolderKanban className="h-4 w-4" />
                    Task Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="w-48 text-muted-foreground">
                          Status
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={task.status} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Priority
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={task.priority} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Due Date
                        </TableCell>
                        <TableCell className="font-medium">
                          {task.due_date}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Linked Project
                        </TableCell>
                        <TableCell className="font-medium">
                          {project?.title ?? "—"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Assignee
                        </TableCell>
                        <TableCell className="font-medium">
                          {task.assignee}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Created
                        </TableCell>
                        <TableCell>{created}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <CommentList initialComments={comments} />
              <AttachmentList initialAttachments={attachments} />
            </div>

            <div className="space-y-6">
              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{task.due_date}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Project</p>
                      <p className="font-medium">{project?.title ?? "—"}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Assignee</p>
                      <p className="font-medium">{task.assignee}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
