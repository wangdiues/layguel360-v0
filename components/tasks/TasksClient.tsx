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
  status: string;
  priority: string;
  due_date: string;
  assignee: string;
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
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Task List</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-full sm:w-56"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusOption)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
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

      <CardContent>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckSquare className="mb-4 h-10 w-10 text-slate-300" />
            <h3 className="mb-1 text-base font-semibold text-slate-700">
              No tasks found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter to find what you are looking
              for.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((task) => {
                const project = projects.find((p) => p.id === task.project_id);
                return (
                  <TableRow
                    key={task.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell>
                      <Link
                        href={`/tasks/${task.id}`}
                        className="font-medium text-slate-800 hover:text-indigo-600 hover:underline underline-offset-4 transition-colors"
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
                    <TableCell className="text-sm text-slate-600">
                      {task.due_date}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
