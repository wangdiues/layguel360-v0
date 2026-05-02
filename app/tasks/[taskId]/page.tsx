@'
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  Clock,
  FileText,
  FolderKanban,
  MessageSquare,
  Paperclip,
  User,
} from "lucide-react";

const task = {
  id: "task-001",
  title: "Prepare project implementation timeline",
  description:
    "Develop a clear implementation timeline for the project, including priority milestones, responsible officials, expected outputs, and reporting dates.",
  status: "In Progress",
  priority: "High",
  dueDate: "15 May 2026",
  linkedProject: "Digital Forestry Service Improvement",
  assignee: "Wangdi",
  createdDate: "02 May 2026",
  lastUpdated: "02 May 2026",
};

const comments = [
  {
    id: 1,
    author: "Wangdi",
    initials: "W",
    time: "Today, 9:40 AM",
    text: "Initial timeline structure prepared. Need to align activities with available staff and field priorities.",
  },
  {
    id: 2,
    author: "Planning Team",
    initials: "PT",
    time: "Today, 10:15 AM",
    text: "Please include expected outputs for each milestone before final review.",
  },
];

const attachments = [
  {
    id: 1,
    name: "Draft implementation timeline.docx",
    type: "Word document",
    size: "248 KB",
  },
  {
    id: 2,
    name: "Project activity matrix.xlsx",
    type: "Spreadsheet",
    size: "312 KB",
  },
];

const activityNotes = [
  {
    id: 1,
    icon: FileText,
    title: "Task created",
    detail: "Task was created under Digital Forestry Service Improvement.",
    time: "02 May 2026, 9:20 AM",
  },
  {
    id: 2,
    icon: Clock,
    title: "Status updated",
    detail: "Status changed from Pending to In Progress.",
    time: "02 May 2026, 9:35 AM",
  },
  {
    id: 3,
    icon: MessageSquare,
    title: "Comment added",
    detail: "A clarification comment was added by the Planning Team.",
    time: "02 May 2026, 10:15 AM",
  },
];

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
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {taskId}
                </Badge>
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

            <div className="flex gap-2">
              <Button variant="outline">Edit Task</Button>
              <Button>Update Status</Button>
            </div>
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
                          {task.dueDate}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Linked Project
                        </TableCell>
                        <TableCell className="font-medium">
                          {task.linkedProject}
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
                        <TableCell>{task.createdDate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          Last Updated
                        </TableCell>
                        <TableCell>{task.lastUpdated}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{comment.initials}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 rounded-2xl border bg-muted/30 p-4">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-medium">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {comment.time}
                          </p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full">
                    Add Comment
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Paperclip className="h-4 w-4" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between rounded-2xl border bg-background p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-muted p-2">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {attachment.type} · {attachment.size}
                          </p>
                        </div>
                      </div>

                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full">
                    Upload Attachment
                  </Button>
                </CardContent>
              </Card>
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
                      <p className="font-medium">{task.dueDate}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Linked Project
                      </p>
                      <p className="font-medium">{task.linkedProject}</p>
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

              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Activity Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {activityNotes.map((activity, index) => {
                    const Icon = activity.icon;

                    return (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="rounded-full border bg-background p-2">
                            <Icon className="h-4 w-4" />
                          </div>
                          {index !== activityNotes.length - 1 && (
                            <div className="mt-2 h-10 w-px bg-border" />
                          )}
                        </div>

                        <div className="space-y-1 pb-2">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm leading-5 text-muted-foreground">
                            {activity.detail}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
'@ | Set-Content -Path "app\tasks\`[taskId`]\page.tsx" -Encoding UTF8