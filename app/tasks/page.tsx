"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { TasksClient } from "@/components/tasks/TasksClient";
import { mockTasks, mockProjects } from "@/lib/mock-data";
import { CheckSquare, Clock, Loader2, CheckCircle2 } from "lucide-react";

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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;

  const projectList = mockProjects.map((p) => ({ id: p.id, title: p.title }));

  function handleAdd(task: Task) {
    setTasks((prev) => [task, ...prev]);
  }

  const statCards = [
    {
      label: "Total Tasks",
      value: total,
      icon: CheckSquare,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      border: "border-l-primary",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10",
      border: "border-l-amber-500",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Loader2,
      iconColor: "text-sky-400",
      iconBg: "bg-sky-500/10",
      border: "border-l-sky-500",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      border: "border-l-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-72">
        <Topbar />
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Tasks
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Track assigned work, deadlines, status, and task priority.
              </p>
            </div>
            <CreateTaskDialog projects={projectList} onAdd={handleAdd} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className={`border-l-4 ${item.border}`}>
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
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

          <TasksClient tasks={tasks} projects={projectList} />
        </main>
      </div>
    </div>
  );
}
