import { cn } from "@/lib/utils";
import type { Flight } from "@/lib/ops/types";

const MAP: Record<string, string> = {
  Scheduled: "text-muted-foreground border-border bg-muted/40",
  Boarding: "text-accent border-accent/40 bg-accent/10",
  "En Route": "text-info border-info/40 bg-info/10",
  Departed: "text-ok border-ok/40 bg-ok/10",
  Landed: "text-ok border-ok/40 bg-ok/10",
  Delayed: "text-warn border-warn/40 bg-warn/10",
  Diverted: "text-warn border-warn/40 bg-warn/10",
  Cancelled: "text-crit border-crit/40 bg-crit/10",
  Open: "text-warn border-warn/40 bg-warn/10",
  "In Progress": "text-info border-info/40 bg-info/10",
  Resolved: "text-ok border-ok/40 bg-ok/10",
  Critical: "text-crit border-crit/40 bg-crit/10",
  High: "text-warn border-warn/40 bg-warn/10",
  Medium: "text-info border-info/40 bg-info/10",
  Low: "text-muted-foreground border-border bg-muted/40",
  "On Duty": "text-ok border-ok/40 bg-ok/10",
  Break: "text-warn border-warn/40 bg-warn/10",
  "Off Duty": "text-muted-foreground border-border bg-muted/40",
  Overtime: "text-crit border-crit/40 bg-crit/10",
};

export function StatusChip({
  status,
  className,
}: {
  status: Flight["status"] | string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        MAP[status] ?? MAP["Scheduled"],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
