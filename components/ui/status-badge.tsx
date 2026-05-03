import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Active:        "bg-emerald-50 text-emerald-700 border-emerald-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Planning:      "bg-violet-50 text-violet-700 border-violet-200",
  Pending:       "bg-amber-50 text-amber-700 border-amber-200",
  Review:        "bg-purple-50 text-purple-700 border-purple-200",
  Completed:     "bg-slate-100 text-slate-600 border-slate-200",
  "On Hold":     "bg-orange-50 text-orange-700 border-orange-200",
};

const priorityStyles: Record<string, string> = {
  Critical: "bg-red-50 text-red-700 border-red-200",
  High:     "bg-orange-50 text-orange-700 border-orange-200",
  Medium:   "bg-amber-50 text-amber-700 border-amber-200",
  Low:      "bg-slate-100 text-slate-500 border-slate-200",
};

type Props = {
  value: string;
  type?: "status" | "priority";
  className?: string;
};

export function StatusBadge({ value, type = "status", className }: Props) {
  const styles = type === "priority" ? priorityStyles[value] : statusStyles[value];

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles ?? "bg-slate-100 text-slate-600 border-slate-200",
        className
      )}
    >
      {value}
    </Badge>
  );
}
