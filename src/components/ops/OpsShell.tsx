import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, LayoutGrid, PlaneTakeoff, Radio, Users, Pause, Play } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useOps } from "@/lib/ops/store";
import { fmtClock } from "@/lib/ops/format";
import { HUB } from "@/lib/ops/dataset";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: Activity },
  { to: "/dashboard/flights", label: "Flights", icon: PlaneTakeoff },
  { to: "/dashboard/gates", label: "Gates", icon: LayoutGrid },
  { to: "/dashboard/resources", label: "Resources", icon: Users },
] as const;

const SPEEDS = [1, 60, 300];

export function OpsShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { now, running, setRunning, speed, setSpeed, alerts } = useOps();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const critical = alerts.filter((a) => a.severity === "critical").length;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-[210px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="border-b border-sidebar-border px-5 py-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Radio className="h-4 w-4 text-primary" />
            <span className="font-display text-sm tracking-tight">AOCC</span>
          </Link>
          <p className="mono-num mt-1 text-[10px] tracking-widest text-muted-foreground uppercase">
            {HUB} Control Center
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {NAV.map((item) => {
            const active = path === item.to || (item.to === "/dashboard" && path === "/dashboard/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--color-primary)]"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <p className="text-[10px] tracking-widest text-muted-foreground uppercase">Feed status</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span
              className={cn(
                "pulse-dot h-2 w-2 rounded-full",
                running ? "bg-ok text-ok" : "bg-muted-foreground text-muted-foreground",
              )}
            />
            <span className="text-foreground">{running ? "Live ingest" : "Feed paused"}</span>
          </div>
          <p className="mono-num mt-2 text-[11px] text-muted-foreground">
            {critical} critical open
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate text-base tracking-tight sm:text-lg">
              Airport Operations Control Center
            </h1>
            <p className="mono-num truncate text-[11px] text-muted-foreground">
              {HUB} · integrated flight, gate, baggage, security & resource picture
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1 rounded-sm border border-border bg-surface p-0.5 sm:flex">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={cn(
                    "mono-num rounded-[3px] px-2 py-1 text-[11px] transition-colors",
                    speed === s
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s}x
                </button>
              ))}
            </div>
            <button
              onClick={() => setRunning(!running)}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-surface-raised"
            >
              {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {running ? "Pause" : "Resume"}
            </button>
            <div className="rounded-sm border border-primary/40 bg-primary/10 px-3 py-1.5 text-right">
              <span className="mono-num block text-sm leading-none text-accent">
                {mounted ? fmtClock(now) : "--:--:--"}
              </span>
              <span className="block text-[9px] tracking-widest text-muted-foreground uppercase">
                Ops time
              </span>
            </div>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-surface px-4 py-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "shrink-0 rounded-sm px-3 py-1.5 text-xs",
                path === item.to || (item.to === "/dashboard" && path === "/dashboard/")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="grid-backdrop min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
