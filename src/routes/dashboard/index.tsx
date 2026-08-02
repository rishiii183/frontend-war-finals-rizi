import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Kpi, Panel } from "@/components/ops/Panel";
import { AlertFeed } from "@/components/ops/AlertFeed";
import { FlightBoard } from "@/components/ops/FlightBoard";
import { liveStatus, useOps } from "@/lib/ops/store";
import { fmtTime } from "@/lib/ops/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Ops Overview — AOCC Airport Operations Control Center" },
      {
        name: "description",
        content:
          "Airport-wide situational awareness: on-time performance, gate conflicts, screening queues, baggage flow and a live exception feed.",
      },
      { property: "og:title", content: "Ops Overview — AOCC" },
      {
        property: "og:description",
        content: "Live airport-wide status, KPIs and exception feed for operations controllers.",
      },
    ],
  }),
  component: Overview,
});

const MIN = 60_000;

function Overview() {
  const { data, now } = useOps();

  const stats = useMemo(() => {
    const live = data.flights.map((f) => ({ ...f, status: liveStatus(f, now) }));
    const active = live.filter((f) => f.status !== "Cancelled");
    const delayed = active.filter((f) => f.delay_min >= 15);
    const onTime = active.length ? Math.round((1 - delayed.length / active.length) * 100) : 100;
    const conflicts = new Set(data.occupancy.filter((o) => o.conflict).map((o) => o.gate)).size;
    const openLanes = data.security.filter((l) => l.open);
    const wait = openLanes.length
      ? Math.round(openLanes.reduce((s, l) => s + l.wait_min, 0) / openLanes.length)
      : 0;
    const mishandled = data.baggage.filter((b) => b.stage === "Mishandled").length;
    const pax = active.reduce((s, f) => s + f.pax_checked_in, 0);
    const critMx = data.maintenance.filter(
      (m) => m.severity === "Critical" && m.status !== "Resolved",
    ).length;
    return {
      total: active.length,
      delayed: delayed.length,
      onTime,
      conflicts,
      wait,
      mishandled,
      pax,
      critMx,
      cancelled: live.length - active.length,
    };
  }, [data, now]);

  const throughput = useMemo(() => {
    const bucketsMap = new Map<number, { arrivals: number; departures: number; totalDelay: number; count: number }>();
    for (let h = 0; h < 24; h += 2) {
      bucketsMap.set(h, { arrivals: 0, departures: 0, totalDelay: 0, count: 0 });
    }

    data.flights.forEach((f) => {
      const h = new Date(f.estimated).getHours();
      const bucketHour = Math.floor(h / 2) * 2;
      const b = bucketsMap.get(bucketHour);
      if (b) {
        if (f.direction === "Arrival") b.arrivals++;
        else b.departures++;
        b.totalDelay += f.delay_min;
        b.count++;
      }
    });

    return Array.from(bucketsMap.entries()).map(([h, b]) => ({
      t: `${String(h).padStart(2, "0")}:00`,
      arrivals: b.arrivals,
      departures: b.departures,
      delay: b.count ? Math.round(b.totalDelay / b.count) : 0,
    }));
  }, [data.flights]);

  const bagFlow = useMemo(() => {
    const stages = ["Check-in", "Screening", "Sorting", "Loading", "Delivered", "Mishandled"];
    return stages.map((s) => ({
      stage: s,
      count: data.baggage.filter((b) => b.stage === s).length,
    }));
  }, [data.baggage]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-8">
        <Kpi label="Active movements" value={stats.total} delta={`${stats.cancelled} cancelled`} />
        <Kpi
          label="On-time perf."
          value={stats.onTime}
          unit="%"
          tone={stats.onTime > 80 ? "ok" : stats.onTime > 65 ? "warn" : "crit"}
          delta={`${stats.delayed} flights ≥15m late`}
        />
        <Kpi
          label="Gate conflicts"
          value={stats.conflicts}
          tone={stats.conflicts ? "crit" : "ok"}
          delta="Overlapping stand windows"
        />
        <Kpi
          label="Avg screening wait"
          value={stats.wait}
          unit="min"
          tone={stats.wait > 20 ? "warn" : "ok"}
          delta={`${data.security.filter((l) => l.open).length} lanes open`}
        />
        <Kpi label="Pax checked in" value={stats.pax.toLocaleString()} delta="Across T1–T3" />
        <Kpi
          label="Mishandled bags"
          value={stats.mishandled}
          tone={stats.mishandled > 20 ? "warn" : "ok"}
          delta="Requires reconciliation"
        />
        <Kpi
          label="Critical maintenance"
          value={stats.critMx}
          tone={stats.critMx ? "crit" : "ok"}
          delta="Open work orders"
        />
        <Kpi
          label="Crew on duty"
          value={data.staff.filter((s) => s.status === "On Duty").length}
          delta={`${data.staff.filter((s) => s.status === "Overtime").length} on overtime`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel
          title="Movement throughput"
          subtitle="±4h around ops time · arrivals, departures and average delay"
        >
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughput} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface-raised)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "var(--color-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="arrivals"
                  stroke="var(--color-chart-1)"
                  fill="url(#ga)"
                />
                <Area
                  type="monotone"
                  dataKey="departures"
                  stroke="var(--color-chart-2)"
                  fill="url(#gd)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Live exception feed"
          subtitle="Auto-generated from cross-table conditions"
          bodyClassName="max-h-[290px] overflow-y-auto"
        >
          <AlertFeed limit={14} />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel title="Baggage flow" subtitle="Bags by handling stage across the belt system">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bagFlow} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="stage" stroke="var(--color-muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip
                  cursor={{ fill: "var(--color-surface-raised)" }}
                  contentStyle={{
                    background: "var(--color-surface-raised)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Security screening lanes" subtitle="Queue depth and projected wait by lane">
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {data.security.slice(0, 12).map((l) => (
              <li
                key={l.lane_id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-sm border border-border bg-background px-2.5 py-1.5"
              >
                <div className="min-w-0">
                  <p className="mono-num truncate text-xs">{l.lane_id}</p>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <span
                      className={cn(
                        "block h-full",
                        l.wait_min > 25 ? "bg-crit" : l.wait_min > 15 ? "bg-warn" : "bg-ok",
                      )}
                      style={{ width: `${Math.min(100, (l.queue / 120) * 100)}%` }}
                    />
                  </div>
                </div>
                <span
                  className={cn(
                    "mono-num shrink-0 text-xs",
                    !l.open
                      ? "text-muted-foreground"
                      : l.wait_min > 25
                        ? "text-crit"
                        : "text-foreground",
                  )}
                >
                  {l.open ? `${l.wait_min}m` : "closed"}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="Next movements"
        subtitle={`Nearest rotations to ${fmtTime(now)} · select a row for full drill-down`}
        bodyClassName=""
      >
        <FlightBoard compact />
      </Panel>
      <p className="pb-2 text-[11px] text-muted-foreground">
        Simulated ops clock advances {MIN / MIN} minute per tick at 60x. Data source: mock
        multi-table airport dataset (flights, gate_events, baggage, passengers, security_screening,
        maintenance_logs, staff_shifts, retail_transactions).
      </p>
    </div>
  );
}
