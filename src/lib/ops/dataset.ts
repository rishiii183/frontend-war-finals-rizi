import type {
  BaggageRecord,
  Dataset,
  Flight,
  FlightStatus,
  GateEvent,
  GateOccupancy,
  MaintenanceLog,
  RetailTxn,
  SecurityLane,
  StaffShift,
} from "./types";

/**
 * Deterministic mock dataset standing in for the provided CSV tables
 * (flights.csv, gate_events.csv, baggage.csv, passengers.csv,
 * security_screening.csv, maintenance_logs.csv, staff_shifts.csv,
 * retail_transactions.csv). Swap `buildDataset()` for a CSV parser later —
 * the shapes in ./types.ts are the contract the whole UI depends on.
 */

// Fixed anchor so server render and client hydration agree.
export const DAY_START = Date.UTC(2026, 7, 2, 0, 0, 0);
export const SIM_START = DAY_START + 6 * 3600_000; // 06:00 ops day start
const MIN = 60_000;

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry(20260802);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)] as T;
const int = (min: number, max: number) => min + Math.floor(rnd() * (max - min + 1));

const AIRLINES = [
  ["Vistara Air", "VA"],
  ["IndiGo", "6E"],
  ["Lufthansa", "LH"],
  ["Emirates", "EK"],
  ["Singapore Airlines", "SQ"],
  ["Qatar Airways", "QR"],
  ["Air France", "AF"],
  ["British Airways", "BA"],
] as const;

const CITIES = [
  "DXB",
  "SIN",
  "LHR",
  "FRA",
  "DOH",
  "CDG",
  "JFK",
  "BOM",
  "DEL",
  "BLR",
  "HKG",
  "AMS",
  "IST",
  "ZRH",
  "SYD",
];

const AIRCRAFT = ["A320neo", "A321", "B737-800", "B787-9", "A350-900", "B777-300ER", "ATR 72"];
const TERMINALS = ["T1", "T2", "T3"];
export const HUB = "AXR";

export const GATES = TERMINALS.flatMap((t, ti) =>
  Array.from({ length: 8 }, (_, i) => ({ gate: `${t.replace("T", "")}${String.fromCharCode(65 + ti)}${i + 1}`, terminal: t })),
);

const FIRST = ["Aarav", "Meera", "Rohan", "Sana", "Kabir", "Anaya", "Dev", "Priya", "Imran", "Nikhil", "Farah", "Tara", "Vikram", "Zoya", "Arjun", "Lea", "Marco", "Yuki"];
const LAST = ["Sharma", "Iyer", "Khan", "Rao", "Menon", "Gupta", "Fernandes", "Bose", "Nair", "Chopra", "Reddy", "Silva", "Tanaka", "Weber"];
const name = () => `${pick(FIRST)} ${pick(LAST)}`;

function statusFor(scheduled: number, delay: number, direction: Flight["direction"]): FlightStatus {
  const r = rnd();
  if (r < 0.03) return "Cancelled";
  if (r < 0.05) return "Diverted";
  if (delay >= 15) return "Delayed";
  if (scheduled < SIM_START) return direction === "Arrival" ? "Landed" : "Departed";
  if (scheduled < SIM_START + 45 * MIN) return direction === "Arrival" ? "En Route" : "Boarding";
  return "Scheduled";
}

function buildFlights(): Flight[] {
  const flights: Flight[] = [];
  for (let i = 0; i < 96; i++) {
    const [airline, code] = pick(AIRLINES);
    const direction: Flight["direction"] = rnd() > 0.5 ? "Arrival" : "Departure";
    const scheduled = SIM_START - 3 * 3600_000 + i * int(6, 14) * MIN;
    const delay = rnd() < 0.32 ? int(10, 145) : int(0, 8);
    const status = statusFor(scheduled, delay, direction);
    // Round-robin stand allocation, with a deliberate double-booking every 17th
    // rotation so the conflict detector has realistic (not overwhelming) input.
    const g = GATES[(i % 17 === 16 ? i - 1 : i) % GATES.length]!;
    const city = pick(CITIES);
    const booked = int(64, 340);
    flights.push({
      flight_id: `${code}${int(100, 999)}-${i}`,
      airline,
      airline_code: code,
      flight_no: `${code} ${int(100, 999)}`,
      direction,
      origin: direction === "Arrival" ? city : HUB,
      destination: direction === "Arrival" ? HUB : city,
      aircraft: pick(AIRCRAFT),
      terminal: g.terminal,
      gate: g.gate,
      stand: `S${int(10, 78)}`,
      scheduled,
      estimated: scheduled + delay * MIN,
      status,
      delay_min: status === "Cancelled" ? 0 : delay,
      pax_booked: booked,
      pax_checked_in: Math.max(0, booked - int(0, 40)),
      bags: Math.round(booked * (0.7 + rnd() * 0.6)),
      belt: `B${int(1, 9)}`,
      priority: rnd() < 0.12 ? "High" : "Normal",
    });
  }
  return flights.sort((a, b) => a.scheduled - b.scheduled);
}

function buildOccupancy(flights: Flight[]): GateOccupancy[] {
  const byGate = new Map<string, GateOccupancy[]>();
  const rows: GateOccupancy[] = [];
  for (const f of flights) {
    if (f.status === "Cancelled") continue;
    const from = f.estimated - (f.direction === "Departure" ? 55 * MIN : 0);
    const to = from + int(40, 70) * MIN;
    const list = byGate.get(f.gate) ?? [];
    const conflict = list.some((o) => from < o.to && to > o.from);
    const row: GateOccupancy = {
      gate: f.gate,
      terminal: f.terminal,
      flight_id: f.flight_id,
      from,
      to,
      conflict,
    };
    if (conflict) list.forEach((o) => (o.conflict = o.from < to && o.to > from ? true : o.conflict));
    list.push(row);
    byGate.set(f.gate, list);
    rows.push(row);
  }
  return rows;
}

function buildGateEvents(flights: Flight[]): GateEvent[] {
  const types: GateEvent["event_type"][] = [
    "Aircraft On Block",
    "Doors Open",
    "Boarding Started",
    "Boarding Closed",
    "Pushback",
    "Cleaning",
    "Fueling",
    "Gate Change",
  ];
  const events: GateEvent[] = [];
  flights.forEach((f, idx) => {
    const n = int(1, 3);
    for (let i = 0; i < n; i++) {
      const t = pick(types);
      events.push({
        event_id: `GE-${idx}-${i}`,
        gate: f.gate,
        flight_id: f.flight_id,
        event_type: t,
        ts: f.estimated - int(-20, 70) * MIN,
        note:
          t === "Gate Change"
            ? `Reassigned from ${pick(GATES).gate}`
            : `${f.flight_no} · ${f.aircraft}`,
      });
    }
  });
  return events.sort((a, b) => b.ts - a.ts);
}

function buildBaggage(flights: Flight[]): BaggageRecord[] {
  const stages: BaggageRecord["stage"][] = [
    "Check-in",
    "Screening",
    "Sorting",
    "Loading",
    "Delivered",
    "Mishandled",
  ];
  const rows: BaggageRecord[] = [];
  flights.forEach((f, i) => {
    for (let b = 0; b < 6; b++) {
      const stage = rnd() < 0.04 ? "Mishandled" : pick(stages.slice(0, 5));
      rows.push({
        bag_id: `BG${100000 + i * 6 + b}`,
        flight_id: f.flight_id,
        belt: f.belt,
        stage,
        dwell_min: stage === "Mishandled" ? int(60, 240) : int(2, 48),
      });
    }
  });
  return rows;
}

function buildSecurity(): SecurityLane[] {
  return TERMINALS.flatMap((t) =>
    Array.from({ length: 5 }, (_, i) => {
      const open = rnd() > 0.15;
      const queue = open ? int(4, 120) : 0;
      const tp = open ? int(140, 260) : 0;
      return {
        lane_id: `${t}-L${i + 1}`,
        terminal: t,
        open,
        queue,
        throughput_pph: tp,
        wait_min: tp ? Math.round((queue / tp) * 60) : 0,
        alarms: int(0, 7),
      };
    }),
  );
}

function buildMaintenance(): MaintenanceLog[] {
  const systems: MaintenanceLog["system"][] = [
    "Jet Bridge",
    "Baggage Belt",
    "HVAC",
    "Runway Lighting",
    "Elevator",
    "Fuel Hydrant",
  ];
  return Array.from({ length: 26 }, (_, i) => {
    const sev = pick(["Low", "Medium", "High", "Critical"] as const);
    const system = pick(systems);
    return {
      log_id: `MX-${2100 + i}`,
      asset: `${system.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase()}-${int(10, 99)}`,
      system,
      location: `${pick(TERMINALS)} · ${pick(GATES).gate}`,
      severity: sev,
      status: pick(["Open", "In Progress", "Resolved"] as const),
      opened: SIM_START - int(20, 900) * MIN,
      eta_min: sev === "Critical" ? int(10, 60) : int(30, 480),
      technician: name(),
    };
  });
}

function buildStaff(): StaffShift[] {
  const roles: StaffShift["role"][] = [
    "Ground Crew",
    "Gate Agent",
    "Security",
    "Baggage",
    "Maintenance",
    "Ops Controller",
  ];
  return Array.from({ length: 48 }, (_, i) => {
    const start = DAY_START + pick([4, 6, 8, 12, 14, 20]) * 3600_000;
    return {
      shift_id: `SH-${500 + i}`,
      name: name(),
      role: pick(roles),
      terminal: pick(TERMINALS),
      start,
      end: start + 8 * 3600_000,
      status: pick(["On Duty", "On Duty", "Break", "Off Duty", "Overtime"] as const),
    };
  });
}

function buildRetail(): RetailTxn[] {
  const outlets = [
    ["Skyline Coffee", "Food & Beverage"],
    ["Aero Duty Free", "Duty Free"],
    ["Terminal Books", "Retail"],
    ["Runway Grill", "Food & Beverage"],
    ["Luxe Perfumery", "Duty Free"],
    ["Fast Lane Spa", "Services"],
    ["Gadget Port", "Retail"],
  ] as const;
  return Array.from({ length: 320 }, (_, i) => {
    const [outlet, category] = pick(outlets);
    return {
      txn_id: `TX-${9000 + i}`,
      outlet,
      category: category as RetailTxn["category"],
      terminal: pick(TERMINALS),
      amount: Math.round((5 + rnd() * 240) * 100) / 100,
      ts: DAY_START + int(5, 22) * 3600_000 + int(0, 59) * MIN,
    };
  });
}

let cache: Dataset | null = null;

export function buildDataset(): Dataset {
  if (cache) return cache;
  const flights = buildFlights();
  cache = {
    flights,
    occupancy: buildOccupancy(flights),
    gateEvents: buildGateEvents(flights),
    baggage: buildBaggage(flights),
    security: buildSecurity(),
    maintenance: buildMaintenance(),
    staff: buildStaff(),
    retail: buildRetail(),
    gates: GATES,
  };
  return cache;
}
