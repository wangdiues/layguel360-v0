import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileArchive,
  FileSpreadsheet,
  FileText,
  Plus,
} from "lucide-react";

const documents = [
  {
    id: 1,
    name: "Project Implementation Plan.pdf",
    project: "Digital Forestry Service Improvement",
    type: "PDF document",
    size: "3.2 MB",
    uploadedBy: "Karma Wangchuk",
    uploadDate: "28 Apr 2026",
    icon: FileText,
  },
  {
    id: 2,
    name: "Field Activity Matrix.xlsx",
    project: "Cordyceps Collection Monitoring",
    type: "Spreadsheet",
    size: "1.1 MB",
    uploadedBy: "Pema Lhamo",
    uploadDate: "25 Apr 2026",
    icon: FileSpreadsheet,
  },
  {
    id: 3,
    name: "Site Survey Photos.zip",
    project: "Forest Carbon Mapping",
    type: "Compressed archive",
    size: "18.4 MB",
    uploadedBy: "Wangdi",
    uploadDate: "20 Apr 2026",
    icon: FileArchive,
  },
  {
    id: 4,
    name: "Stakeholder Mapping Report.pdf",
    project: "Digital Forestry Service Improvement",
    type: "PDF document",
    size: "2.7 MB",
    uploadedBy: "Tshering Dorji",
    uploadDate: "18 Apr 2026",
    icon: FileText,
  },
  {
    id: 5,
    name: "Conflict Risk Analysis.xlsx",
    project: "Human–Elephant Conflict Mapping",
    type: "Spreadsheet",
    size: "890 KB",
    uploadedBy: "Sonam Tobgay",
    uploadDate: "15 Apr 2026",
    icon: FileSpreadsheet,
  },
];

const stats = [
  { label: "Total Documents", value: "5" },
  { label: "Total Size", value: "26.3 MB" },
  { label: "Projects Covered", value: "4" },
  { label: "Uploaded This Month", value: "5" },
];

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="min-h-screen lg:pl-72">
        <Topbar />

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Documents
              </h1>
              <p className="text-sm text-muted-foreground">
                Project files, reports, and supporting attachments.
              </p>
            </div>

            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <Card key={item.label} className="rounded-2xl shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">All Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map((doc) => {
                const Icon = doc.icon;
                return (
                  <div
                    key={doc.id}
                    className="flex flex-col gap-3 rounded-2xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {doc.type} · {doc.size}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="rounded-full text-xs"
                          >
                            {doc.project}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium">{doc.uploadedBy}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.uploadDate}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
