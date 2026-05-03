import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "In Progress": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Planning: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Review: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Completed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  "On Hold": "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const priorityStyles: Record<string, string> = {
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

type Props = {
  value: string;
  type?: "status" | "priority";
  className?: string;
};

export function StatusBadge({ value, type = "status", className }: Props) {
  const styles =
    type === "priority"
      ? priorityStyles[value]
      : statusStyles[value];

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles ?? "bg-slate-500/20 text-slate-400 border-slate-500/30",
        className
      )}
    >
      {value}
    </Badge>
  );
}