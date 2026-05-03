import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  // Project / task statuses
  Active: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
  Planning: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50",
  Pending: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  Review: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50",
  Completed: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100",
  "On Hold": "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50",
};

const priorityStyles: Record<string, string> = {
  Critical: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  High: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50",
  Medium: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  Low: "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100",
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
        "rounded-full px-3 py-0.5 text-xs font-medium",
        styles ?? "bg-slate-100 text-slate-600 border-slate-200",
        className
      )}
    >
      {value}
    </Badge>
  );
}
