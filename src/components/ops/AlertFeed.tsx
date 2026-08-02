import { AlertTriangle, Info, ShieldAlert, X } from "lucide-react";
import { useOps } from "@/lib/ops/store";
import { fmtTime } from "@/lib/ops/format";
import { cn } from "@/lib/utils";

const ICON = { critical: ShieldAlert, warning: AlertTriangle, info: Info } as const;
const TONE = {
  critical: "border-l-crit text-crit",
  warning: "border-l-warn text-warn",
  info: "border-l-info text-info",
} as const;

export function AlertFeed({ limit = 12 }: { limit?: number }) {
  const { alerts, acknowledge } = useOps();
  const shown = alerts.slice(0, limit);

  if (!shown.length) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        No active exceptions. All monitored systems nominal.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {shown.map((a) => {
        const Icon = ICON[a.severity];
        return (
          <li
            key={a.id}
            className={cn(
              "flip-in grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 border-l-2 px-4 py-3",
              TONE[a.severity],
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{a.title}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{a.detail}</p>
              <p className="mono-num mt-1 text-[10px] tracking-wider text-muted-foreground uppercase">
                {fmtTime(a.ts)} · {a.domain}
              </p>
            </div>
            <button
              onClick={() => acknowledge(a.id)}
              aria-label="Acknowledge alert"
              className="shrink-0 rounded-sm border border-border p-1 text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
