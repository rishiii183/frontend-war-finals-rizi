import { X, Luggage, ShieldCheck, Wrench, Users } from "lucide-react";
import { useOps } from "@/lib/ops/store";
import { fmtTime } from "@/lib/ops/format";
import type { Flight } from "@/lib/ops/types";
import { StatusChip } from "./StatusChip";

/** Cross-table drill-down: flight → gate events → baggage → screening → crew. */
export function FlightDetail({ flight, onClose }: { flight: Flight | null; onClose: () => void }) {
  const { data } = useOps();
  if (!flight) return null;

  const events = data.gateEvents.filter((e) => e.flight_id === flight.flight_id).slice(0, 6);
  const bags = data.baggage.filter((b) => b.flight_id === flight.flight_id);
  const mishandled = bags.filter((b) => b.stage === "Mishandled").length;
  const lanes = data.security.filter((l) => l.terminal === flight.terminal);
  const avgWait = lanes.length
    ? Math.round(lanes.reduce((s, l) => s + l.wait_min, 0) / lanes.length)
    : 0;
  const crew = data.staff.filter((s) => s.terminal === flight.terminal && s.status === "On Duty");
  const mx = data.maintenance.filter(
    (m) => m.location.includes(flight.gate) && m.status !== "Resolved",
  );

  const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-md border border-border/60 bg-background/50 p-2.5">
      <p className="text-[9px] tracking-widest text-muted-foreground uppercase font-medium">{label}</p>
      <p className="mono-num mt-0.5 text-xs font-semibold text-foreground">{value}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        aria-label="Close detail"
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog Card */}
      <aside className="relative flex flex-col w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-accent/20 bg-surface-raised/95 backdrop-blur-xl shadow-2xl z-10 transition-all duration-300">
        <header className="sticky top-0 z-20 flex items-start justify-between border-b border-border bg-surface-raised px-6 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <p className="mono-num text-lg font-bold leading-tight text-foreground">{flight.flight_no}</p>
              <StatusChip status={flight.status} />
            </div>
            <p className="truncate text-xs text-muted-foreground mt-1.5">
              {flight.airline} · {flight.aircraft} · {flight.origin} → {flight.destination}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-surface"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Modal Content - 2 Column Grid */}
        <div className="p-6 grid gap-5 md:grid-cols-2 overflow-y-auto">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="mb-2 text-[10px] tracking-widest text-muted-foreground uppercase font-semibold">Core metrics</h3>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Scheduled" value={fmtTime(flight.scheduled)} />
                <Stat label="Estimated" value={fmtTime(flight.estimated)} />
                <Stat label="Delay" value={`${flight.delay_min}m`} />
                <Stat label="Gate / Stand" value={`${flight.gate} · ${flight.stand}`} />
                <Stat label="Terminal" value={flight.terminal} />
                <Stat label="Belt" value={flight.belt} />
              </div>
            </div>

            <Section icon={Luggage} title="Baggage linkage">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {flight.bags} bags manifested · {bags.length} tracked on belt {flight.belt} ·{" "}
                <span className={mishandled ? "text-crit" : "text-ok"}>{mishandled} mishandled</span>
              </p>
              <div className="mt-2.5 flex gap-1">
                {(["Check-in", "Screening", "Sorting", "Loading", "Delivered"] as const).map((s) => {
                  const n = bags.filter((b) => b.stage === s).length;
                  return (
                    <div key={s} className="min-w-0 flex-1 rounded-sm bg-background/40 p-1.5 text-center border border-border/40">
                      <p className="mono-num text-xs font-semibold text-foreground">{n}</p>
                      <p className="truncate text-[8px] text-muted-foreground mt-0.5">{s}</p>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <Section icon={ShieldCheck} title="Screening pressure">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {flight.terminal} average wait{" "}
                <span className={avgWait > 20 ? "text-warn font-semibold" : "text-ok font-semibold"}>{avgWait} min</span> across{" "}
                {lanes.filter((l) => l.open).length} open lanes · {flight.pax_checked_in} pax checked in of {flight.pax_booked}.
              </p>
            </Section>

            <Section icon={Users} title="Crew on shift">
              <p className="text-xs text-muted-foreground">
                {crew.length} personnel on duty in {flight.terminal}.
              </p>
              <ul className="mt-2 space-y-1.5">
                {crew.slice(0, 4).map((c) => (
                  <li key={c.shift_id} className="flex justify-between gap-2 text-xs border-b border-border/30 pb-1 last:border-0 last:pb-0">
                    <span className="truncate text-foreground/90">{c.name}</span>
                    <span className="shrink-0 text-muted-foreground font-mono text-[10px]">{c.role}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={Wrench} title="Gate events & maintenance">
              <ul className="space-y-1.5">
                {events.map((e) => (
                  <li key={e.event_id} className="flex gap-2 text-xs">
                    <span className="mono-num shrink-0 text-muted-foreground">{fmtTime(e.ts)}</span>
                    <span className="truncate text-foreground/80">{e.event_type}</span>
                  </li>
                ))}
                {mx.map((m) => (
                  <li key={m.log_id} className="flex gap-2 text-xs text-warn">
                    <span className="mono-num shrink-0">{m.log_id}</span>
                    <span className="truncate">
                      {m.system} · {m.severity}
                    </span>
                  </li>
                ))}
                {!events.length && !mx.length && (
                  <li className="text-xs text-muted-foreground">No events logged for this rotation.</li>
                )}
              </ul>
            </Section>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border/60 bg-surface/30 p-4">
      <h3 className="mb-2.5 flex items-center gap-2 text-[10px] tracking-widest uppercase font-semibold text-primary">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </h3>
      {children}
    </section>
  );
}
