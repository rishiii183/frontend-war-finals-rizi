export type FlightStatus =
  | "Scheduled"
  | "Boarding"
  | "Departed"
  | "En Route"
  | "Landed"
  | "Delayed"
  | "Diverted"
  | "Cancelled";

export interface Flight {
  flight_id: string;
  airline: string;
  airline_code: string;
  flight_no: string;
  direction: "Arrival" | "Departure";
  origin: string;
  destination: string;
  aircraft: string;
  terminal: string;
  gate: string;
  stand: string;
  scheduled: number; // epoch ms
  estimated: number;
  status: FlightStatus;
  delay_min: number;
  pax_booked: number;
  pax_checked_in: number;
  bags: number;
  belt: string;
  priority: "Normal" | "High";
}

export interface GateEvent {
  event_id: string;
  gate: string;
  flight_id: string;
  event_type:
    | "Aircraft On Block"
    | "Doors Open"
    | "Boarding Started"
    | "Boarding Closed"
    | "Pushback"
    | "Cleaning"
    | "Fueling"
    | "Gate Change";
  ts: number;
  note: string;
}

export interface GateOccupancy {
  gate: string;
  terminal: string;
  flight_id: string;
  from: number;
  to: number;
  conflict: boolean;
}

export interface BaggageRecord {
  bag_id: string;
  flight_id: string;
  belt: string;
  stage: "Check-in" | "Screening" | "Sorting" | "Loading" | "Delivered" | "Mishandled";
  dwell_min: number;
}

export interface SecurityLane {
  lane_id: string;
  terminal: string;
  open: boolean;
  queue: number;
  throughput_pph: number;
  wait_min: number;
  alarms: number;
}

export interface MaintenanceLog {
  log_id: string;
  asset: string;
  system: "Jet Bridge" | "Baggage Belt" | "HVAC" | "Runway Lighting" | "Elevator" | "Fuel Hydrant";
  location: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved";
  opened: number;
  eta_min: number;
  technician: string;
}

export interface StaffShift {
  shift_id: string;
  name: string;
  role: "Ground Crew" | "Gate Agent" | "Security" | "Baggage" | "Maintenance" | "Ops Controller";
  terminal: string;
  start: number;
  end: number;
  status: "On Duty" | "Break" | "Off Duty" | "Overtime";
}

export interface RetailTxn {
  txn_id: string;
  outlet: string;
  category: "Food & Beverage" | "Duty Free" | "Retail" | "Services";
  terminal: string;
  amount: number;
  ts: number;
}

export interface OpsAlert {
  id: string;
  ts: number;
  severity: "info" | "warning" | "critical";
  domain: "Flight" | "Gate" | "Baggage" | "Security" | "Maintenance" | "Staff";
  title: string;
  detail: string;
  ref?: string;
}

export interface Dataset {
  flights: Flight[];
  gateEvents: GateEvent[];
  occupancy: GateOccupancy[];
  baggage: BaggageRecord[];
  security: SecurityLane[];
  maintenance: MaintenanceLog[];
  staff: StaffShift[];
  retail: RetailTxn[];
  gates: { gate: string; terminal: string }[];
}
