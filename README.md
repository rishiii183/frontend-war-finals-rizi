# AOCC — Airport Operations Control Center

An operational dashboard for airport operations control teams at Indira Gandhi International Airport (DEL).

## Key Features
- **3D Hero Landing Page**: Interactive scroll-driven 3D commercial airliner landing scene powered by `@react-three/fiber` and Three.js.
- **Ops Overview Dashboard**: Live situational awareness unifying flights, gate stand occupancy, baggage flow, security screening queues, maintenance work orders, staff roster, and retail transactions.
- **Flight Board**: Real-time arrival and departure flight monitoring with delay tracking, aircraft registrations, gate assignments, and priority badges.
- **Gate & Stand Timeline**: Interactive gate occupancy timeline with conflict detection and turnaround event logs.
- **Resources & Roster**: Equipment maintenance tracking, technician dispatches, and staff shift schedules.

## Technology Stack
- **Framework**: React 19 + TypeScript + Vite
- **Routing**: TanStack Router (file-based routing)
- **3D Graphics**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Animations**: `framer-motion`
- **Data Visualizations**: `recharts`
- **Data Tables**: `@tanstack/react-table`
- **Icons**: `lucide-react`
- **Date & Time**: `date-fns`

## Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Production build
npm run build
```
