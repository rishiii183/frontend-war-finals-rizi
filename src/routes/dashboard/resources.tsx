import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Kpi, Panel } from "@/components/ops/Panel";
import { StatusChip } from "@/components/ops/StatusChip";
import { useOps } from "@/lib/ops/store";
import { fmtMoney, fmtTime } from "@/lib/ops/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Staff, Maintenance & Retail | AOCC" },
      {
        name: "description",
        content:
          "Shift coverage by role and terminal, open maintenance work orders by severity, and terminal retail performance in one operational view.",
      },
      { property: "og:title", content: "Resources — Staff, Maintenance & Retail | AOCC" },
      {
        property: "og:description",
        content: "Crew coverage, maintenance work orders and retail revenue for airport operations.",
      },
    ],
  }),
  component: Resources,
});

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function Resources() {
  const { data, now } = useOps();
  const [sev, setSev] = useState("All");

  const coverage = useMemo(() => {
    const roles = Array.from(new Set(data.staff.map((s) => s.role)));
    return roles.map((role) => ({
      role,
      onDuty: data.staff.filter((s) => s.role === role && s.status === "On Duty").length,
      offDuty: data.staff.filter((s) => s.role === role && s.status !== "On Duty").length,
    }));
  }, [data.staff]);

  const retail = useMemo(() => {
    const cats = Array.from(new Set(data.retail.map((r) => r.category)));
    return cats.map((c) => ({
      name: c,
      value: Math.round(
        data.retail.filter((r) => r.category === c).reduce((s, r) => s + r.amount, 0),
      ),
    }));
  }, [data.retail]);

  const revenue = data.retail.reduce((s, r) => s + r.amount, 0);
  const logs = data.maintenance.filter((m) => (sev === "All" ? true : m.severity === sev));
  const openMx = data.maintenance.filter((m) => m.status !== "Resolved").length;
  const onDuty = data.staff.filter((s) => s.status === "On Duty").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Personnel on duty" value={onDuty} delta={`${data.staff.length} rostered`} />
        <Kpi
          label="Open work orders"
          value={openMx}
          tone={openMx > 12 ? "warn" : "ok"}
          delta={`${data.maintenance.filter((m) => m.severity === "Critical").length} critical`}
        />
        <Kpi label="Retail revenue" value={fmtMoney(revenue)} delta="Ops day to date" />
        <Kpi
          label="Avg basket"
          value={fmtMoney(revenue / data.retail.length)}
          delta={`${data.retail.length} transactions`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panel title="Shift coverage by role" subtitle="On duty vs. off roster right now">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coverage} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="role" stroke="var(--color-muted-foreground)" fontSize={10} />
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
                <Bar dataKey="onDuty" stackId="a" fill="var(--color-chart-2)" />
                <Bar dataKey="offDuty" stackId="a" fill="var(--color-muted)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Retail mix" subtitle="Revenue share by category">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={retail}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={2}
                  stroke="var(--color-background)"
                >
                  {retail.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface-raised)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-1 grid grid-cols-2 gap-1">
            {retail.map((r, i) => (
              <li key={r.name} className="flex items-center gap-1.5 text-[11px]">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="truncate text-muted-foreground">{r.name}</span>
                <span className="mono-num ml-auto shrink-0">{fmtMoney(r.value)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="Maintenance work orders"
        subtitle="Asset faults affecting operational capability"
        bodyClassName="p-0"
        action={
          <div className="flex gap-1 rounded-sm border border-border bg-surface p-0.5">
            {["All", "Critical", "High", "Medium", "Low"].map((s) => (
              <button
                key={s}
                onClick={() => setSev(s)}
                className={cn(
                  "rounded-[3px] px-2 py-1 text-[11px] transition-colors",
                  sev === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] tracking-widest text-muted-foreground uppercase">
                <th className="px-4 py-2 text-left font-semibold">Order</th>
                <th className="px-3 py-2 text-left font-semibold">System / Asset</th>
                <th className="px-3 py-2 text-left font-semibold">Location</th>
                <th className="px-3 py-2 text-left font-semibold">Opened</th>
                <th className="px-3 py-2 text-left font-semibold">ETA</th>
                <th className="px-3 py-2 text-left font-semibold">Technician</th>
                <th className="px-3 py-2 text-left font-semibold">Severity</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((m) => (
                <tr key={m.log_id} className="border-b border-border/60 hover:bg-surface-raised">
                  <td className="mono-num px-4 py-2.5 text-xs">{m.log_id}</td>
                  <td className="px-3 py-2.5 text-xs">
                    {m.system}
                    <span className="mono-num ml-1.5 text-muted-foreground">{m.asset}</span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{m.location}</td>
                  <td className="mono-num px-3 py-2.5 text-xs text-muted-foreground">
                    {fmtTime(m.opened)}
                  </td>
                  <td className="mono-num px-3 py-2.5 text-xs">{m.eta_min}m</td>
                  <td className="px-3 py-2.5 text-xs">{m.technician}</td>
                  <td className="px-3 py-2.5">
                    <StatusChip status={m.severity} />
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusChip status={m.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Roster" subtitle={`Shift board as of ${fmtTime(now)}`} bodyClassName="p-0">
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {data.staff.slice(0, 24).map((s) => (
            <div
              key={s.shift_id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 bg-surface px-4 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm">{s.name}</p>
                <p className="mono-num truncate text-[11px] text-muted-foreground">
                  {s.role} · {s.terminal} · {fmtTime(s.start)}–{fmtTime(s.end)}
                </p>
              </div>
              <StatusChip status={s.status} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
