import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/ops/Panel";
import { FlightBoard } from "@/components/ops/FlightBoard";

export const Route = createFileRoute("/dashboard/flights")({
  head: () => ({
    meta: [
      { title: "Flight Monitoring — AOCC Airport Operations" },
      {
        name: "description",
        content:
          "Search, filter and drill into every arrival and departure with live status, gate assignment, passenger and baggage linkage.",
      },
      { property: "og:title", content: "Flight Monitoring — AOCC" },
      {
        property: "og:description",
        content: "Full flight board with search, filters, sorting and per-flight drill-down.",
      },
    ],
  }),
  component: Flights,
});

function Flights() {
  return (
    <Panel
      title="Flight board"
      subtitle="All movements · click any row for cross-table drill-down"
      bodyClassName=""
      className="min-h-[70vh]"
    >
      <FlightBoard />
    </Panel>
  );
}
