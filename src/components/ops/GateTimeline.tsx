import { useMemo } from "react";
import { liveStatus, useOps } from "@/lib/ops/store";
import { fmtTime } from "@/lib/ops/format";
import { cn } from "@/lib/utils";

const MIN = 60_000;
const WINDOW = 6 * 3600_000; // 6-hour rolling stand plan

export function GateTimeline({ terminal }: { terminal: string }) {
  const { data, now } = useOps();
  const start = now - 1 * 3600_000;
  const end = start + WINDOW;

  const gates = data.gates.filter((g) => g.terminal === terminal);
  const flights = useMemo(
    () => new Map(data.flights.map((f) => [f.flight_id, f])),
    [data.flights],
  );

  const ticks = Array.from({ length: 7 }, (_, i) => start + i * 3600_000);

  return (
    <div className="min-w-0 overflow-x-auto">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-[64px_minmax(0,1fr)] border-b border-border">
          <div />
          <div className="relative h-7">
            {ticks.map((t) => (
              <span
                key={t}
                className="mono-num absolute top-1 -translate-x-1/2 text-[10px] text-muted-foreground"
                style={{ left: `${((t - start) / WINDOW) * 100}%` }}
              >
                {fmtTime(t)}
              </span>
            ))}
          </div>
        </div>

        {gates.map((g) => {
          const rows = data.occupancy
            .filter((o) => o.gate === g.gate && o.to > start && o.from < end)
            .sort((a, b) => a.from - b.from);
          // Stack overlapping assignments into two lanes so conflicts stay legible.
          const laneEnds: number[] = [];
          const placed = rows.map((o) => {
            let lane = laneEnds.findIndex((e) => e <= o.from);
            if (lane === -1) lane = Math.min(laneEnds.length, 1);
            laneEnds[lane] = o.to;
            return { o, lane };
          });
          return (
            <div
              key={g.gate}
              className="grid grid-cols-[64px_minmax(0,1fr)] border-b border-border/60"
            >
              <div className="mono-num flex items-center px-3 py-2 text-xs text-muted-foreground">
                {g.gate}
              </div>
              <div className="relative h-12">
                <div className="absolute inset-0 flex">
                  {ticks.map((t) => (
                    <span key={t} className="flex-1 border-l border-border/40" />
                  ))}
                </div>
                <span
                  className="absolute inset-y-0 z-10 w-px bg-accent"
                  style={{ left: `${((now - start) / WINDOW) * 100}%` }}
                />
                {placed.map(({ o, lane }) => {
                  const f = flights.get(o.flight_id);
                  const left = Math.max(0, ((o.from - start) / WINDOW) * 100);
                  const width = Math.min(100 - left, ((o.to - o.from) / WINDOW) * 100);
                  const active = now >= o.from && now <= o.to;
                  return (
                    <div
                      key={o.flight_id}
                      title={`${f?.flight_no} · ${fmtTime(o.from)}–${fmtTime(o.to)}${o.conflict ? " · CONFLICT" : ""}`}
                      className={cn(
                        "absolute z-20 flex h-5 items-center overflow-hidden rounded-sm border px-1.5 text-[10px] whitespace-nowrap",
                        o.conflict
                          ? "border-crit bg-crit/30 text-crit"
                          : active
                            ? "border-accent bg-accent/20 text-accent"
                            : "border-primary/50 bg-primary/15 text-foreground",
                      )}
                      style={{
                        left: `${left}%`,
                        width: `${Math.max(width, 3)}%`,
                        top: lane === 0 ? 4 : 26,
                      }}
                    >
                      <span className="mono-num truncate">
                        {f ? `${f.flight_no} ${liveStatus(f, now)}` : o.flight_id}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="px-3 pt-3 text-[11px] text-muted-foreground">
        Rolling {WINDOW / 3600_000}h stand plan · red blocks indicate overlapping assignments
        requiring reallocation · vertical marker is current ops time ({Math.round(WINDOW / MIN)} min
        window).
      </p>
    </div>
  );
}
