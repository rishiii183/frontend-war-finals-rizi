import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { buildDataset, SIM_START } from "./dataset";
import type { Dataset, Flight, OpsAlert } from "./types";

const MIN = 60_000;

interface OpsValue {
  data: Dataset;
  now: number;
  running: boolean;
  speed: number;
  alerts: OpsAlert[];
  setRunning: (v: boolean) => void;
  setSpeed: (v: number) => void;
  acknowledge: (id: string) => void;
}

const OpsContext = createContext<OpsValue | null>(null);

/** Derives a live status from the static row + simulated clock. */
export function liveStatus(f: Flight, now: number): Flight["status"] {
  if (f.status === "Cancelled" || f.status === "Diverted") return f.status;
  const t = f.estimated;
  if (f.direction === "Departure") {
    if (now >= t + 5 * MIN) return "Departed";
    if (now >= t - 25 * MIN) return "Boarding";
    return f.delay_min >= 15 ? "Delayed" : "Scheduled";
  }
  if (now >= t) return "Landed";
  if (now >= t - 60 * MIN) return "En Route";
  return f.delay_min >= 15 ? "Delayed" : "Scheduled";
}

function seedAlerts(data: Dataset, now: number): OpsAlert[] {
  const out: OpsAlert[] = [];
  data.occupancy
    .filter((o) => o.conflict)
    .slice(0, 4)
    .forEach((o, i) =>
      out.push({
        id: `conf-${o.gate}-${i}`,
        ts: now - i * 3 * MIN,
        severity: "critical",
        domain: "Gate",
        title: `Gate conflict at ${o.gate}`,
        detail: "Two aircraft assigned to overlapping stand windows.",
        ref: o.flight_id,
      }),
    );
  data.maintenance
    .filter((m) => m.severity === "Critical" && m.status !== "Resolved")
    .slice(0, 3)
    .forEach((m, i) =>
      out.push({
        id: `mx-${m.log_id}`,
        ts: now - (i + 2) * 5 * MIN,
        severity: "critical",
        domain: "Maintenance",
        title: `${m.system} failure · ${m.asset}`,
        detail: `${m.location} — ETA ${m.eta_min}m, ${m.technician} assigned.`,
      }),
    );
  data.security
    .filter((l) => l.wait_min > 25)
    .slice(0, 3)
    .forEach((l, i) =>
      out.push({
        id: `sec-${l.lane_id}`,
        ts: now - (i + 1) * 7 * MIN,
        severity: "warning",
        domain: "Security",
        title: `Queue breach · lane ${l.lane_id}`,
        detail: `${l.queue} pax waiting, ${l.wait_min} min projected wait.`,
      }),
    );
  return out.sort((a, b) => b.ts - a.ts);
}

const ROTATION: Array<(d: Dataset, now: number) => OpsAlert | null> = [
  (d, now) => {
    const f = d.flights.find((x) => x.delay_min > 30 && x.status !== "Cancelled");
    return f
      ? {
          id: `d-${now}`,
          ts: now,
          severity: "warning",
          domain: "Flight",
          title: `${f.flight_no} delay revised to ${f.delay_min}m`,
          detail: `${f.origin} → ${f.destination} · stand ${f.stand}, gate ${f.gate}.`,
          ref: f.flight_id,
        }
      : null;
  },
  (d, now) => {
    const b = d.baggage.find((x) => x.stage === "Mishandled");
    return b
      ? {
          id: `b-${now}`,
          ts: now,
          severity: "warning",
          domain: "Baggage",
          title: `Mishandled bag ${b.bag_id}`,
          detail: `Belt ${b.belt} · dwell ${b.dwell_min} min, reconciliation required.`,
        }
      : null;
  },
  (d, now) => ({
    id: `s-${now}`,
    ts: now,
    severity: "info",
    domain: "Staff",
    title: "Shift handover window open",
    detail: `${d.staff.filter((s) => s.status === "On Duty").length} personnel on duty across T1–T3.`,
  }),
  (d, now) => {
    const e = d.gateEvents[Math.floor(now / MIN) % d.gateEvents.length];
    return e
      ? {
          id: `g-${now}`,
          ts: now,
          severity: "info",
          domain: "Gate",
          title: `${e.event_type} · ${e.gate}`,
          detail: e.note,
          ref: e.flight_id,
        }
      : null;
  },
];

export function OpsProvider({ children }: { children: ReactNode }) {
  const data = useMemo(() => buildDataset(), []);
  const [now, setNow] = useState(SIM_START + 4 * 3600_000);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(60); // simulated seconds per real second
  const [alerts, setAlerts] = useState<OpsAlert[]>(() =>
    seedAlerts(data, SIM_START + 4 * 3600_000),
  );
  const tick = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setNow((n) => n + speed * 1000);
      tick.current += 1;
      if (tick.current % 6 === 0) {
        setNow((n) => {
          const gen = ROTATION[(tick.current / 6) % ROTATION.length];
          const a = gen?.(data, n);
          if (a) setAlerts((prev) => [a, ...prev].slice(0, 40));
          return n;
        });
      }
    }, 1000);
    return () => clearInterval(id);
  }, [running, speed, data]);

  const value = useMemo<OpsValue>(
    () => ({
      data,
      now,
      running,
      speed,
      alerts,
      setRunning,
      setSpeed,
      acknowledge: (id) => setAlerts((prev) => prev.filter((a) => a.id !== id)),
    }),
    [data, now, running, speed, alerts],
  );

  return <OpsContext.Provider value={value}>{children}</OpsContext.Provider>;
}

export function useOps() {
  const ctx = useContext(OpsContext);
  if (!ctx) throw new Error("useOps must be used inside OpsProvider");
  return ctx;
}
