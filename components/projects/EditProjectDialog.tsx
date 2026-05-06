"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import { updateProject, deleteProject } from "@/app/projects/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

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

type Props = { project: Project };

export function EditProjectDialog({ project }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProject(project.id, formData);
      if (result?.ok === false) {
        setError(result.error);
        return;
      }
      router.refresh();
      setOpen(false);
    });
  }

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteProject(project.id);
      if (result?.ok === false) setError(result.error);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 shrink-0">
          <Pencil className="h-3.5 w-3.5" />
          Edit Project
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ep-title">Title *</Label>
            <Input
              id="ep-title"
              name="title"
              defaultValue={project.title}
              placeholder="Project title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ep-description">Description</Label>
            <Textarea
              id="ep-description"
              name="description"
              defaultValue={project.description ?? ""}
              placeholder="Brief description of the project"
              className="resize-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ep-status">Status</Label>
              <select
                id="ep-status"
                name="status"
                defaultValue={project.status}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
              >
                <option>Planning</option>
                <option>Active</option>
                <option>On Hold</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ep-priority">Priority</Label>
              <select
                id="ep-priority"
                name="priority"
                defaultValue={project.priority}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ep-start_date">Start Date</Label>
              <Input
                id="ep-start_date"
                name="start_date"
                type="date"
                defaultValue={project.start_date ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ep-end_date">End Date</Label>
              <Input
                id="ep-end_date"
                name="end_date"
                type="date"
                defaultValue={project.end_date ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ep-department">Department</Label>
              <Input
                id="ep-department"
                name="department"
                defaultValue={project.department ?? ""}
                placeholder="e.g. Department of Forests"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ep-manager">Manager</Label>
              <Input
                id="ep-manager"
                name="manager"
                defaultValue={project.manager ?? ""}
                placeholder="Project manager name"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>

        <Separator className="bg-white/[0.08]" />

        <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Delete project</p>
            <p className="text-xs text-muted-foreground">
              Permanently removes this project and all its tasks.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1.5" disabled={deleting}>
                <Trash2 className="h-3.5 w-3.5" />
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete &ldquo;{project.title}&rdquo;?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the project and all associated tasks, comments, and
                  attachments. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  Yes, delete project
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
