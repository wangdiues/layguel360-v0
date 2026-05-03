import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileArchive,
  FileSpreadsheet,
  FileText,
  Files,
  HardDrive,
  FolderKanban,
  CalendarDays,
  Plus,
  Download,
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
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
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
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
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
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
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
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
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
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
];

const stats = [
  { label: "Total Documents", value: "5",      icon: Files,        iconColor: "text-primary",      iconBg: "bg-primary/10",       border: "border-l-primary" },
  { label: "Total Size",      value: "26.3 MB", icon: HardDrive,    iconColor: "text-sky-400",      iconBg: "bg-sky-500/10",       border: "border-l-sky-500" },
  { label: "Projects Covered",value: "4",       icon: FolderKanban, iconColor: "text-violet-400",   iconBg: "bg-violet-500/10",    border: "border-l-violet-500" },
  { label: "This Month",      value: "5",       icon: CalendarDays, iconColor: "text-emerald-400",  iconBg: "bg-emerald-500/10",   border: "border-l-emerald-500" },
];

export default function DocumentsPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="min-h-screen lg:pl-72">
        <Topbar />

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Documents
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Project files, reports, and supporting attachments.
              </p>
            </div>
            <Button className="w-fit gap-2">
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.label}
                  className={`rounded-xl border border-border border-l-4 ${item.border} bg-card shadow-sm`}
                >
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                        {item.value}
                      </p>
                    </div>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}
                    >
                      <Icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Document list */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base font-semibold">All Documents</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {documents.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <div
                      key={doc.id}
                      className="flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${doc.iconBg}`}
                        >
                          <Icon className={`h-5 w-5 ${doc.iconColor}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doc.name}</p>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {doc.type} · {doc.size}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="rounded-full text-xs font-medium"
                            >
                              {doc.project}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {doc.uploadedBy}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.uploadDate}
                          </p>
                        </div>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
