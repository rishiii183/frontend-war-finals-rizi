import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Kpi, Panel } from "@/components/ops/Panel";
import { GateTimeline } from "@/components/ops/GateTimeline";
import { StatusChip } from "@/components/ops/StatusChip";
import { useOps } from "@/lib/ops/store";
import { fmtTime } from "@/lib/ops/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/gates")({
  head: () => ({
    meta: [
      { title: "Gate & Stand Plan — AOCC Airport Operations" },
      {
        name: "description",
        content:
          "Rolling gate occupancy timeline with overlap conflict detection, live gate events and terminal-level resource pressure.",
      },
      { property: "og:title", content: "Gate & Stand Plan — AOCC" },
      {
        property: "og:description",
        content: "Terminal gate timeline, conflicts and live gate event log.",
      },
    ],
  }),
  component: Gates,
});

import { motion } from "framer-motion";

const TERMINALS = ["T1", "T2", "T3"];

function Gates() {
  const { data, now } = useOps();
  const [terminal, setTerminal] = useState("T1");

  const conflicts = useMemo(
    () => data.occupancy.filter((o) => o.conflict && o.terminal === terminal),
    [data.occupancy, terminal],
  );
  const gatesInTerminal = data.gates.filter((g) => g.terminal === terminal).length;
  const occupiedNow = data.occupancy.filter(
    (o) => o.terminal === terminal && now >= o.from && now <= o.to,
  ).length;
  const events = data.gateEvents.filter((e) => e.ts <= now).slice(0, 18);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Gates in terminal"
          value={gatesInTerminal}
          delta={`${terminal} stand inventory`}
        />
        <Kpi
          label="Occupied now"
          value={occupiedNow}
          delta={`${Math.round((occupiedNow / gatesInTerminal) * 100)}% utilisation`}
          tone={occupiedNow / gatesInTerminal > 0.8 ? "warn" : "ok"}
        />
        <Kpi
          label="Conflicts"
          value={conflicts.length}
          tone={conflicts.length ? "crit" : "ok"}
          delta="Overlapping assignments"
        />
        <Kpi
          label="Events logged"
          value={events.length}
          delta="Last operational hour window"
        />
      </div>

      <Panel
        title="Stand occupancy timeline"
        subtitle="Conflict-aware gate plan"
        action={
          <div className="relative flex gap-1 rounded-sm border border-border bg-surface p-0.5">
            {TERMINALS.map((t) => {
              const active = terminal === t;
              return (
                <button
                  key={t}
                  onClick={() => setTerminal(t)}
                  className={cn(
                    "relative rounded-[3px] px-2.5 py-1 text-xs transition-colors z-10",
                    active
                      ? "text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                  {active && (
                    <motion.span
                      layoutId="activeTerminalTab"
                      className="absolute inset-0 bg-primary rounded-[3px] -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        }
      >
        <GateTimeline terminal={terminal} />
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel
          title="Conflict register"
          subtitle={`${conflicts.length} overlapping windows in ${terminal}`}
          bodyClassName="max-h-[320px] overflow-y-auto p-0"
        >
          {conflicts.length ? (
            <ul className="divide-y divide-border">
              {conflicts.map((c) => {
                const f = data.flights.find((x) => x.flight_id === c.flight_id);
                return (
                  <li key={c.flight_id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="mono-num w-12 shrink-0 text-xs text-crit">{c.gate}</span>
                    <div className="min-w-0 flex-1">
                      <p className="mono-num truncate text-xs">{f?.flight_no}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {fmtTime(c.from)}–{fmtTime(c.to)} · {f?.aircraft}
                      </p>
                    </div>
                    <StatusChip status="Critical" />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="p-4 text-sm text-muted-foreground">No conflicts in {terminal}.</p>
          )}
        </Panel>

        <Panel
          title="Gate event log"
          subtitle="Turnaround milestones as they are recorded"
          bodyClassName="max-h-[320px] overflow-y-auto p-0"
        >
          <ul className="divide-y divide-border">
            {events.map((e) => (
              <li key={e.event_id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="mono-num w-12 shrink-0 text-xs text-muted-foreground">
                  {fmtTime(e.ts)}
                </span>
                <span className="mono-num w-12 shrink-0 text-xs text-accent">{e.gate}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs">{e.event_type}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{e.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
