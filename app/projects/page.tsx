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

const projects = [
  {
    name: "Forest Carbon Mapping",
    description: "Mapping forest carbon stocks and sequestration potential.",
    status: "Active",
    priority: "High",
    dueDate: "30 Jun 2026",
  },
  {
    name: "Cordyceps Collection Monitoring",
    description: "Monitoring field activities during cordyceps collection season.",
    status: "Planning",
    priority: "Medium",
    dueDate: "15 Jul 2026",
  },
  {
    name: "NWFP Digital Platform",
    description: "Static website for non-wood forest products and management plans.",
    status: "Active",
    priority: "Medium",
    dueDate: "20 May 2026",
  },
  {
    name: "Human–Elephant Conflict Mapping",
    description: "Spatial analysis and reporting of elephant conflict risk areas.",
    status: "On Hold",
    priority: "Critical",
    dueDate: "30 Sep 2026",
  },
]

export default function ProjectsPage() {
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

            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Total Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">4</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">2</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  High Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">2</p>
              </CardContent>
            </Card>
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
                  {projects.map((project) => (
                    <TableRow key={project.name}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{project.name}</p>
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
                      <TableCell>{project.dueDate}</TableCell>
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
