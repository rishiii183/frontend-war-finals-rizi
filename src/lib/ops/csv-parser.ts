import type {
  BaggageRecord,
  Flight,
  FlightStatus,
  GateEvent,
  MaintenanceLog,
  RetailTxn,
  SecurityLane,
  StaffShift,
} from "./types";

/**
 * CSV parser helper for the Indira Gandhi International Airport (DEL) competition dataset.
 * Parses public/data/dataset/*.csv into typed AOCC Dataset records.
 */

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function parseTimestamp(tsStr?: string): number {
  if (!tsStr) return Date.now();
  const cleaned = tsStr.replace(" ", "T");
  const parsed = Date.parse(cleaned);
  return isNaN(parsed) ? Date.now() : parsed;
}

export function parseFlightsCSV(csvText: string): Flight[] {
  if (!csvText) return [];
  const lines = csvText.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const firstLine = lines[0] || "";
  const startIndex = firstLine.startsWith("0,") || firstLine.startsWith('"0",') ? 1 : 0;
  const flights: Flight[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = parseCSVLine(line);
    if (cols.length < 18) continue;

    const flight_no = cols[0] || `FL-${i}`;
    const airline = cols[1] || "Airlines";
    const airline_code = cols[2] || "AI";
    const origin = cols[3] || "DEL";
    const destination = cols[4] || "BOM";
    const schedDep = parseTimestamp(cols[5]);
    const estDep = parseTimestamp(cols[6]);
    const schedArr = parseTimestamp(cols[7]);
    const estArr = parseTimestamp(cols[8]);
    const aircraft = cols[9] || "A320";
    const capacity = parseInt(cols[11] || "180", 10) || 180;
    const pax_checked_in = parseInt(cols[12] || "150", 10) || 150;
    const rawStatus = cols[13] || "Scheduled";
    const delay_min = parseInt(cols[14] || "0", 10) || 0;
    const terminal = cols[16] || "T3";
    const gate = cols[17] || "B1";

    const direction: "Arrival" | "Departure" = origin === "DEL" ? "Departure" : "Arrival";
    const scheduled = direction === "Departure" ? schedDep : schedArr;
    const estimated = direction === "Departure" ? estDep : estArr;

    let status: FlightStatus = "Scheduled";
    if (rawStatus === "Cancelled") status = "Cancelled";
    else if (rawStatus === "Diverted") status = "Diverted";
    else if (delay_min >= 15) status = "Delayed";
    else if (rawStatus === "Departed") status = "Departed";
    else if (rawStatus === "Arrived" || rawStatus === "Landed") status = "Landed";
    else if (rawStatus === "Boarding") status = "Boarding";
    else if (rawStatus === "En Route") status = "En Route";

    flights.push({
      flight_id: flight_no,
      airline,
      airline_code,
      flight_no,
      direction,
      origin,
      destination,
      aircraft,
      terminal,
      gate,
      stand: gate,
      scheduled,
      estimated,
      status,
      delay_min,
      pax_booked: capacity,
      pax_checked_in,
      bags: Math.round(pax_checked_in * 1.1),
      belt: `Belt ${((i % 6) + 1)}`,
      priority: delay_min > 30 ? "High" : "Normal",
    });
  }

  return flights;
}

export function parseGateEventsCSV(csvText: string): GateEvent[] {
  if (!csvText) return [];
  const lines = csvText.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const firstLine = lines[0] || "";
  const startIndex = firstLine.startsWith("0,") || firstLine.startsWith('"0",') ? 1 : 0;
  const events: GateEvent[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = parseCSVLine(line);
    if (cols.length < 6) continue;

    const event_id = cols[0] || `EVT-${i}`;
    const flight_id = cols[1] || `FL-${i}`;
    const gate = cols[2] || "B1";
    const rawType = cols[4] || "Boarding Started";
    const ts = parseTimestamp(cols[5]);
    const note = cols[8] || "Routine operation";

    let event_type: GateEvent["event_type"] = "Boarding Started";
    if (rawType.includes("Start") || rawType.includes("Boarding")) event_type = "Boarding Started";
    else if (rawType.includes("Close") || rawType.includes("Doors")) event_type = "Boarding Closed";
    else if (rawType.includes("Pushback")) event_type = "Pushback";
    else if (rawType.includes("Block")) event_type = "Aircraft On Block";
    else if (rawType.includes("Clean")) event_type = "Cleaning";
    else if (rawType.includes("Fuel")) event_type = "Fueling";

    events.push({
      event_id,
      flight_id,
      gate,
      event_type,
      ts,
      note,
    });
  }

  return events;
}

export function parseBaggageCSV(csvText: string): BaggageRecord[] {
  if (!csvText) return [];
  const lines = csvText.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const firstLine = lines[0] || "";
  const startIndex = firstLine.startsWith("0,") || firstLine.startsWith('"0",') ? 1 : 0;
  const records: BaggageRecord[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = parseCSVLine(line);
    if (cols.length < 8) continue;

    const bag_id = cols[0] || `BAG-${i}`;
    const flight_id = cols[2] || `FL-${i}`;
    const rawStage = cols[6] || "";
    const rawStatus = cols[11] || "";
    const belt = cols[7] || `Carousel ${(i % 5) + 1}`;

    let stage: BaggageRecord["stage"] = "Check-in";
    if (rawStatus.includes("Loaded") || rawStage.includes("Load")) stage = "Loading";
    else if (rawStatus.includes("Screen") || rawStage.includes("Screen")) stage = "Screening";
    else if (rawStatus.includes("Sort") || rawStage.includes("Sort")) stage = "Sorting";
    else if (rawStatus.includes("Deliver") || rawStage.includes("Deliver")) stage = "Delivered";
    else if (rawStatus.includes("Mishand") || rawStage.includes("Mishand")) stage = "Mishandled";
    else if (i % 6 === 1) stage = "Screening";
    else if (i % 6 === 2) stage = "Sorting";
    else if (i % 6 === 3) stage = "Loading";
    else if (i % 6 === 4) stage = "Delivered";
    else if (i % 100 === 0) stage = "Mishandled";

    records.push({
      bag_id,
      flight_id,
      belt,
      stage,
      dwell_min: (i % 25) + 5,
    });
  }

  return records;
}

export function parseSecurityCSV(csvText: string): SecurityLane[] {
  if (!csvText) return [];
  const lines = csvText.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const firstLine = lines[0] || "";
  const startIndex = firstLine.startsWith("0,") || firstLine.startsWith('"0",') ? 1 : 0;
  const lanesMap = new Map<string, SecurityLane>();

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = parseCSVLine(line);
    if (cols.length < 13) continue;

    const lane_id = cols[11] || `XRAY-${(i % 12) + 1}`;
    const wait_min = parseInt(cols[12] || "10", 10) || 10;
    const queue = parseInt(cols[17] || "25", 10) || Math.round(wait_min * 2.5);

    if (!lanesMap.has(lane_id)) {
      lanesMap.set(lane_id, {
        lane_id,
        terminal: "T3",
        open: true,
        queue,
        throughput_pph: 180,
        wait_min,
        alarms: (i % 3),
      });
    }
  }

  return Array.from(lanesMap.values());
}

export function parseMaintenanceCSV(csvText: string): MaintenanceLog[] {
  if (!csvText) return [];
  const lines = csvText.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const firstLine = lines[0] || "";
  const startIndex = firstLine.startsWith("0,") || firstLine.startsWith('"0",') ? 1 : 0;
  const logs: MaintenanceLog[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = parseCSVLine(line);
    if (cols.length < 10) continue;

    const log_id = cols[0] || `WO-${i}`;
    const asset = cols[1] || `VT-DEL`;
    const rawSys = cols[3] || "Jet Bridge";
    const location = cols[4] || "Terminal 3";
    const opened = parseTimestamp(cols[5]);
    const eta_min = parseInt(cols[7] || "45", 10) || 45;
    const technician = cols[12] || `Tech-${(i % 10) + 1}`;
    const rawSev = parseInt(cols[11] || "2", 10) || 2;

    let system: MaintenanceLog["system"] = "Jet Bridge";
    if (rawSys.includes("Belt") || rawSys.includes("Baggage")) system = "Baggage Belt";
    else if (rawSys.includes("HVAC")) system = "HVAC";
    else if (rawSys.includes("Light")) system = "Runway Lighting";
    else if (rawSys.includes("Elevator")) system = "Elevator";
    else if (rawSys.includes("Fuel")) system = "Fuel Hydrant";

    let severity: MaintenanceLog["severity"] = "Medium";
    if (rawSev >= 4) severity = "Critical";
    else if (rawSev === 3) severity = "High";
    else if (rawSev === 1) severity = "Low";

    logs.push({
      log_id,
      asset,
      system,
      location,
      severity,
      status: i % 4 === 0 ? "Resolved" : i % 2 === 0 ? "In Progress" : "Open",
      opened,
      eta_min,
      technician,
    });
  }

  return logs;
}

export function parseStaffCSV(csvText: string): StaffShift[] {
  if (!csvText) return [];
  const lines = csvText.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const firstLine = lines[0] || "";
  const startIndex = firstLine.startsWith("0,") || firstLine.startsWith('"0",') ? 1 : 0;
  const shifts: StaffShift[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = parseCSVLine(line);
    if (cols.length < 8) continue;

    const shift_id = cols[0] || `STAFF-${i}`;
    const name = cols[1] || "Ops Personnel";
    const rawRole = cols[3] || "Gate Agent";
    const start = parseTimestamp(cols[5]);
    const end = parseTimestamp(cols[6]);
    const terminal = cols[7] || "T3";

    let role: StaffShift["role"] = "Gate Agent";
    if (rawRole.includes("Ground")) role = "Ground Crew";
    else if (rawRole.includes("Security")) role = "Security";
    else if (rawRole.includes("Baggage")) role = "Baggage";
    else if (rawRole.includes("Maintenance")) role = "Maintenance";
    else if (rawRole.includes("Ops") || rawRole.includes("Controller")) role = "Ops Controller";

    shifts.push({
      shift_id,
      name,
      role,
      terminal,
      start,
      end,
      status: i % 5 === 0 ? "Overtime" : i % 4 === 0 ? "Off Duty" : "On Duty",
    });
  }

  return shifts;
}

export function parseRetailCSV(csvText: string): RetailTxn[] {
  if (!csvText) return [];
  const lines = csvText.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const firstLine = lines[0] || "";
  const startIndex = firstLine.startsWith("0,") || firstLine.startsWith('"0",') ? 1 : 0;
  const txns: RetailTxn[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = parseCSVLine(line);
    if (cols.length < 10) continue;

    const txn_id = cols[0] || `TXN-${i}`;
    const outlet = cols[2] || "Duty Free";
    const rawCat = cols[3] || "Retail";
    const ts = parseTimestamp(cols[6]);
    const amount = parseFloat(cols[9] || "1250") || 1250;
    const terminal = cols[14] || "T3";

    let category: RetailTxn["category"] = "Retail";
    if (rawCat.includes("Food") || rawCat.includes("Beverage")) category = "Food & Beverage";
    else if (rawCat.includes("Duty")) category = "Duty Free";
    else if (rawCat.includes("Service")) category = "Services";

    txns.push({
      txn_id,
      outlet,
      category,
      terminal,
      amount,
      ts,
    });
  }

  return txns;
}
