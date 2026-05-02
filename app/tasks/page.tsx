import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus } from "lucide-react"

const tasks = [
  {
    title: "Prepare database schema",
    project: "ལས་འགུལ་360",
    status: "In Progress",
    priority: "High",
    dueDate: "10 May 2026",
  },
  {
    title: "Design dashboard UI",
    project: "ལས་འགུལ་360",
    status: "Review",
    priority: "Medium",
    dueDate: "08 May 2026",
  },
  {
    title: "Upload project documents",
    project: "NWFP Digital Platform",
    status: "To Do",
    priority: "Low",
    dueDate: "15 May 2026",
  },
  {
    title: "Prepare field monitoring plan",
    project: "Cordyceps Collection Monitoring",
    status: "To Do",
    priority: "High",
    dueDate: "25 May 2026",
  },
  {
    title: "Generate project progress summary",
    project: "Forest Carbon Mapping",
    status: "Done",
    priority: "Medium",
    dueDate: "01 May 2026",
  },
]

export default function TasksPage() {
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

            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Total Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">5</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  To Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">2</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1</p>
              </CardContent>
            </Card>
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
                  {tasks.map((task) => (
                    <TableRow key={task.title}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.project}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{task.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.priority}</Badge>
                      </TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
