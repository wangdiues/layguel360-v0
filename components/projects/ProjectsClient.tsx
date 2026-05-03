"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  start_date: string | null;
  end_date: string | null;
  department: string | null;
  manager: string | null;
};

type Props = {
  projects: Project[];
};

export function ProjectsClient({ projects }: Props) {
  const [query, setQuery] = useState("");

  const filtered = projects.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      (p.description?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">Project List</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-base font-semibold text-foreground">
              No projects found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No projects match your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground w-[40%]">
                    Project
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Priority
                  </TableHead>
                  <TableHead className="pr-6 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Due Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((project) => (
                  <TableRow
                    key={project.id}
                    className="border-border transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="pl-6">
                      <div>
                        <Link
                          href={`/projects/${project.id}`}
                          className="font-medium text-foreground transition-colors hover:text-primary"
                        >
                          {project.title}
                        </Link>
                        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                          {project.description || "No description"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={project.status} type="status" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={project.priority} type="priority" />
                    </TableCell>
                    <TableCell className="pr-6 text-sm text-muted-foreground">
                      {project.end_date || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
