import flightsRaw from "../../../public/data/dataset/flights.csv?raw";
import gateEventsRaw from "../../../public/data/dataset/gate_events.csv?raw";
import baggageRaw from "../../../public/data/dataset/baggage.csv?raw";
import securityRaw from "../../../public/data/dataset/security_screening.csv?raw";
import maintenanceRaw from "../../../public/data/dataset/maintenance_logs.csv?raw";
import staffRaw from "../../../public/data/dataset/staff_shifts.csv?raw";
import retailRaw from "../../../public/data/dataset/retail_transactions.csv?raw";

import {
  parseBaggageCSV,
  parseFlightsCSV,
  parseGateEventsCSV,
  parseMaintenanceCSV,
  parseRetailCSV,
  parseSecurityCSV,
  parseStaffCSV,
} from "./csv-parser";
import type { Dataset, GateOccupancy, OpsAlert } from "./types";

/**
 * Loads the real Indira Gandhi International Airport (DEL) competition dataset from
 * public/data/dataset/*.csv using Vite's static ?raw import so it works on both SSR and Client Hydration.
 */

export const DAY_START = Date.UTC(2026, 7, 2, 0, 0, 0);
export const SIM_START = DAY_START + 6 * 3600_000;
export const HUB = "DEL";

export function buildDataset(): Dataset {
  const flights = parseFlightsCSV(flightsRaw || "");
  const gateEvents = parseGateEventsCSV(gateEventsRaw || "");
  const baggage = parseBaggageCSV(baggageRaw || "");
  const security = parseSecurityCSV(securityRaw || "");
  const maintenance = parseMaintenanceCSV(maintenanceRaw || "");
  const staff = parseStaffCSV(staffRaw || "");
  const retail = parseRetailCSV(retailRaw || "");

  // Extract unique gates from flights and gate_events
  const gateSet = new Set<string>();
  flights.forEach((f) => f.gate && gateSet.add(`${f.terminal}-${f.gate}`));
  if (gateSet.size === 0) {
    ["T1", "T2", "T3"].forEach((t) => {
      for (let i = 1; i <= 12; i++) gateSet.add(`${t}-B${i}`);
    });
  }

  const gates = Array.from(gateSet).map((g) => {
    const parts = g.split("-");
    return { terminal: parts[0] || "T3", gate: parts[1] || g };
  });

  // Calculate real gate occupancy timeline
  const occupancy: GateOccupancy[] = flights.slice(0, 40).map((f, i) => {
    const from = f.scheduled - 45 * 60_000;
    const to = f.scheduled + 45 * 60_000;
    return {
      gate: f.gate || `B${(i % 12) + 1}`,
      terminal: f.terminal || "T3",
      flight_id: f.flight_no,
      from,
      to,
      conflict: f.delay_min > 45,
    };
  });

  return {
    flights,
    gateEvents,
    occupancy,
    baggage,
    security,
    maintenance,
    staff,
    retail,
    gates,
  };
}

export function buildInitialAlerts(dataset: Dataset): OpsAlert[] {
  const alerts: OpsAlert[] = [];
  const now = SIM_START;

  // Generate critical alerts from real delayed flights
  dataset.flights
    .filter((f) => f.delay_min > 30)
    .slice(0, 5)
    .forEach((f, i) => {
      alerts.push({
        id: `ALT-FL-${i + 1}`,
        ts: now - (i * 7 + 2) * 60_000,
        severity: f.delay_min > 60 ? "critical" : "warning",
        domain: "Flight",
        title: `${f.flight_no} (${f.airline}) Delayed ${f.delay_min}m`,
        detail: `${f.direction} ${f.origin} ➔ ${f.destination} at Gate ${f.gate} (${f.terminal}). Aircraft ${f.aircraft}.`,
        ref: f.flight_no,
      });
    });

  // Generate maintenance alerts from real critical/high maintenance logs
  dataset.maintenance
    .filter((m) => m.severity === "Critical" || m.severity === "High")
    .slice(0, 4)
    .forEach((m, i) => {
      alerts.push({
        id: `ALT-MTC-${i + 1}`,
        ts: now - (i * 12 + 5) * 60_000,
        severity: m.severity === "Critical" ? "critical" : "warning",
        domain: "Maintenance",
        title: `${m.system} Work Order ${m.log_id}`,
        detail: `Location: ${m.location}. Assigned technician: ${m.technician}. ETA: ${m.eta_min}m.`,
        ref: m.log_id,
      });
    });

  // General operational info alert
  alerts.push({
    id: "ALT-SYS-1",
    ts: now - 30 * 60_000,
    severity: "info",
    domain: "Staff",
    title: "Indira Gandhi Intl Airport (DEL) Competition Dataset Operational",
    detail: `Ingested ${dataset.flights.length} flights, ${dataset.baggage.length} baggage records, ${dataset.staff.length} staff shifts, and ${dataset.retail.length} retail transactions.`,
  });

  return alerts.sort((a, b) => b.ts - a.ts);
}
