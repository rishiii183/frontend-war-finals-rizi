import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel flex min-w-0 flex-col overflow-hidden", className)}>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-2.5">
        <div className="min-w-0">
          <h2 className="truncate text-[13px] tracking-wide uppercase">{title}</h2>
          {subtitle && <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className={cn("min-w-0 flex-1", bodyClassName ?? "p-4")}>{children}</div>
    </section>
  );
}

export function Kpi({
  label,
  value,
  unit,
  delta,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  tone?: "neutral" | "ok" | "warn" | "crit";
}) {
  const toneClass = {
    neutral: "text-foreground",
    ok: "text-ok",
    warn: "text-warn",
    crit: "text-crit",
  }[tone];
  return (
    <div className="panel relative overflow-hidden p-4">
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-px",
          tone === "crit"
            ? "bg-crit"
            : tone === "warn"
              ? "bg-warn"
              : tone === "ok"
                ? "bg-ok"
                : "bg-primary",
        )}
      />
      <p className="text-[10px] leading-tight tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <p className={cn("mono-num mt-2 text-2xl leading-none font-semibold", toneClass)}>
        {value}
        {unit && <span className="ml-1 text-xs text-muted-foreground">{unit}</span>}
      </p>
      {delta && <p className="mt-1.5 truncate text-[11px] text-muted-foreground">{delta}</p>}
    </div>
  );
}
