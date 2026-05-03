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
  description: string;
  status: string;
  priority: string;
  start_date: string;
  end_date: string;
  department: string;
  manager: string;
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
      p.description.toLowerCase().includes(q)
    );
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Project List</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen className="mb-4 h-12 w-12 text-slate-300" />
            <h3 className="text-base font-semibold text-slate-700">
              No projects found
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              No projects match your search. Try a different keyword.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((project) => (
                <TableRow
                  key={project.id}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <TableCell>
                    <div>
                      <Link
                        href={`/projects/${project.id}`}
                        className="font-medium text-slate-900 hover:text-indigo-600"
                      >
                        {project.title}
                      </Link>
                      <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                        {project.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={project.status} type="status" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={project.priority} type="priority" />
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {project.end_date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
