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
    <div className="rounded-sm border border-border bg-background p-2.5">
      <p className="text-[10px] tracking-widest text-muted-foreground uppercase">{label}</p>
      <p className="mono-num mt-1 text-sm">{value}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close detail"
        onClick={onClose}
        className="flex-1 bg-background/70 backdrop-blur-sm"
      />
      <aside className="flip-in flex h-full w-full max-w-[440px] flex-col overflow-y-auto border-l border-border bg-surface">
        <header className="sticky top-0 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-border bg-surface px-5 py-4">
          <div className="min-w-0">
            <p className="mono-num text-lg leading-tight font-semibold">{flight.flight_no}</p>
            <p className="truncate text-xs text-muted-foreground">
              {flight.airline} · {flight.aircraft} · {flight.origin} → {flight.destination}
            </p>
            <div className="mt-2">
              <StatusChip status={flight.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-sm border border-border p-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="grid grid-cols-2 gap-2 p-5 sm:grid-cols-3">
          <Stat label="Scheduled" value={fmtTime(flight.scheduled)} />
          <Stat label="Estimated" value={fmtTime(flight.estimated)} />
          <Stat label="Delay" value={`${flight.delay_min}m`} />
          <Stat label="Gate / Stand" value={`${flight.gate} · ${flight.stand}`} />
          <Stat label="Terminal" value={flight.terminal} />
          <Stat label="Belt" value={flight.belt} />
        </div>

        <Section icon={Luggage} title="Baggage linkage">
          <p className="text-xs text-muted-foreground">
            {flight.bags} bags manifested · {bags.length} tracked on belt {flight.belt} ·{" "}
            <span className={mishandled ? "text-crit" : "text-ok"}>{mishandled} mishandled</span>
          </p>
          <div className="mt-2 flex gap-1">
            {(["Check-in", "Screening", "Sorting", "Loading", "Delivered"] as const).map((s) => {
              const n = bags.filter((b) => b.stage === s).length;
              return (
                <div key={s} className="min-w-0 flex-1 rounded-sm bg-background p-1.5 text-center">
                  <p className="mono-num text-xs">{n}</p>
                  <p className="truncate text-[9px] text-muted-foreground">{s}</p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section icon={ShieldCheck} title="Screening pressure">
          <p className="text-xs text-muted-foreground">
            {flight.terminal} average wait{" "}
            <span className={avgWait > 20 ? "text-warn" : "text-ok"}>{avgWait} min</span> across{" "}
            {lanes.filter((l) => l.open).length} open lanes · {flight.pax_checked_in} pax checked in
            of {flight.pax_booked}.
          </p>
        </Section>

        <Section icon={Users} title="Crew on shift">
          <p className="text-xs text-muted-foreground">
            {crew.length} personnel on duty in {flight.terminal}.
          </p>
          <ul className="mt-2 space-y-1">
            {crew.slice(0, 4).map((c) => (
              <li key={c.shift_id} className="flex justify-between gap-2 text-xs">
                <span className="truncate">{c.name}</span>
                <span className="shrink-0 text-muted-foreground">{c.role}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Wrench} title="Gate events & maintenance">
          <ul className="space-y-1.5">
            {events.map((e) => (
              <li key={e.event_id} className="flex gap-2 text-xs">
                <span className="mono-num shrink-0 text-muted-foreground">{fmtTime(e.ts)}</span>
                <span className="truncate">{e.event_type}</span>
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
    <section className="border-t border-border px-5 py-4">
      <h3 className="mb-2 flex items-center gap-2 text-[11px] tracking-widest uppercase">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {title}
      </h3>
      {children}
    </section>
  );
}
