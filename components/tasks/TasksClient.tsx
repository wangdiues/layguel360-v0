"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, CheckSquare } from "lucide-react";

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

type Task = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  assignee: string | null;
  created_at: string;
};

type Project = {
  id: string;
  title: string;
};

type Props = {
  tasks: Task[];
  projects: Project[];
};

const STATUS_OPTIONS = ["All", "Pending", "In Progress", "Completed"] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

export function TasksClient({ tasks, projects }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusOption>("All");

  const filtered = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader className="border-b border-white/[0.08] pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">Task List</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-full sm:w-56"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusOption)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckSquare className="mb-4 h-10 w-10 text-muted-foreground/30" />
            <h3 className="mb-1 text-base font-semibold text-foreground">
              No tasks found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter to find what you are looking for.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/[0.06]">
                  <TableHead className="pl-6 text-[11px] font-semibold uppercase tracking-wide">Task</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide">Project</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide">Priority</TableHead>
                  <TableHead className="pr-6 text-[11px] font-semibold uppercase tracking-wide">Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((task) => {
                  const project = projects.find((p) => p.id === task.project_id);
                  return (
                    <TableRow
                      key={task.id}
                      className="border-white/[0.06] transition-colors hover:bg-white/[0.04]"
                    >
                      <TableCell className="pl-6">
                        <Link
                          href={`/tasks/${task.id}`}
                          className="font-medium text-foreground transition-colors hover:text-primary"
                        >
                          {task.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {project?.title ?? "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge value={task.status} type="status" />
                      </TableCell>
                      <TableCell>
                        <StatusBadge value={task.priority} type="priority" />
                      </TableCell>
                      <TableCell className="pr-6 text-sm text-muted-foreground">
                        {task.due_date || "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
