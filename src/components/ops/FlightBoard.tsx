import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import { liveStatus, useOps } from "@/lib/ops/store";
import { fmtTime } from "@/lib/ops/format";
import type { Flight } from "@/lib/ops/types";
import { StatusChip } from "./StatusChip";
import { FlightDetail } from "./FlightDetail";
import { CustomSelect } from "./CustomSelect";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SortKey = "scheduled" | "delay_min" | "flight_no";

export function FlightBoard({ compact = false }: { compact?: boolean }) {
  const { data, now } = useOps();
  const [q, setQ] = useState("");
  const [dir, setDir] = useState<"All" | "Arrival" | "Departure">("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState<SortKey>("scheduled");
  const [selected, setSelected] = useState<Flight | null>(null);

  const rows = useMemo(() => {
    const list = data.flights
      .map((f) => ({ ...f, status: liveStatus(f, now) }))
      .filter((f) => (dir === "All" ? true : f.direction === dir))
      .filter((f) => (status === "All" ? true : f.status === status))
      .filter((f) => {
        if (!q.trim()) return true;
        const s = q.toLowerCase();
        return (
          f.flight_no.toLowerCase().includes(s) ||
          f.airline.toLowerCase().includes(s) ||
          f.origin.toLowerCase().includes(s) ||
          f.destination.toLowerCase().includes(s) ||
          f.gate.toLowerCase().includes(s)
        );
      });
    list.sort((a, b) =>
      sort === "flight_no"
        ? a.flight_no.localeCompare(b.flight_no)
        : sort === "delay_min"
          ? b.delay_min - a.delay_min
          : a.scheduled - b.scheduled,
    );
    if (!compact) return list;
    const idx = list.findIndex((f) => f.estimated >= now - 15 * 60_000);
    return list.slice(Math.max(0, idx), Math.max(0, idx) + 8);
  }, [data.flights, now, q, dir, status, sort, compact]);

  const STATUSES = ["All", "Boarding", "En Route", "Delayed", "Landed", "Departed", "Cancelled"];

  return (
    <div className="flex min-w-0 flex-col">
      {!compact && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <div className="relative min-w-[180px] flex-1">
            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search flight, airline, city or gate"
              className="w-full rounded-sm border border-input bg-background py-1.5 pr-3 pl-8 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
          <div className="relative flex items-center gap-1 rounded-sm border border-border bg-surface p-0.5">
            {(["All", "Arrival", "Departure"] as const).map((d) => {
              const active = dir === d;
              return (
                <button
                  key={d}
                  onClick={() => setDir(d)}
                  className={cn(
                    "relative rounded-[3px] px-2.5 py-1 text-xs transition-colors z-10",
                    active
                      ? "text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {d}
                  {active && (
                    <motion.span
                      layoutId="activeDirectionTab"
                      className="absolute inset-0 bg-primary rounded-[3px] -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <CustomSelect
            value={status}
            onChange={(val) => setStatus(val)}
            options={STATUSES.map((s) => ({ value: s, label: s === "All" ? "All statuses" : s }))}
            className="w-36"
          />
          <CustomSelect
            value={sort}
            onChange={(val) => setSort(val as SortKey)}
            options={[
              { value: "scheduled", label: "Sort: schedule" },
              { value: "delay_min", label: "Sort: delay" },
              { value: "flight_no", label: "Sort: flight no." },
            ]}
            className="w-36"
          />
        </div>
      )}

      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] tracking-widest text-muted-foreground uppercase">
              <th className="px-4 py-2 text-left font-semibold">Flight</th>
              <th className="px-3 py-2 text-left font-semibold">Route</th>
              <th className="px-3 py-2 text-left font-semibold">Sched</th>
              <th className="px-3 py-2 text-left font-semibold">Est</th>
              <th className="px-3 py-2 text-left font-semibold">Gate</th>
              <th className="px-3 py-2 text-left font-semibold">Pax</th>
              <th className="px-4 py-2 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr
                key={f.flight_id}
                onClick={() => setSelected(f)}
                className="cursor-pointer border-b border-border/60 transition-colors hover:bg-surface-raised"
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {f.direction === "Arrival" ? (
                      <ArrowDownLeft className="h-3.5 w-3.5 shrink-0 text-info" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-accent" />
                    )}
                    <div className="min-w-0">
                      <p className="mono-num text-[13px] font-semibold">{f.flight_no}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{f.airline}</p>
                    </div>
                  </div>
                </td>
                <td className="mono-num px-3 py-2.5 text-xs">
                  {f.origin} → {f.destination}
                </td>
                <td className="mono-num px-3 py-2.5 text-xs text-muted-foreground">
                  {fmtTime(f.scheduled)}
                </td>
                <td
                  className={cn(
                    "mono-num px-3 py-2.5 text-xs",
                    f.delay_min >= 15 ? "text-warn" : "text-foreground",
                  )}
                >
                  {fmtTime(f.estimated)}
                  {f.delay_min >= 15 && <span className="ml-1">+{f.delay_min}m</span>}
                </td>
                <td className="mono-num px-3 py-2.5 text-xs">
                  {f.gate}
                  <span className="ml-1 text-muted-foreground">{f.terminal}</span>
                </td>
                <td className="mono-num px-3 py-2.5 text-xs text-muted-foreground">
                  {f.pax_checked_in}/{f.pax_booked}
                </td>
                <td className="px-4 py-2.5">
                  <StatusChip status={f.status} />
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No flights match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <FlightDetail flight={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
