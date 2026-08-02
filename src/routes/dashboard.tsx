import { createFileRoute, Outlet } from "@tanstack/react-router";
import { OpsProvider } from "@/lib/ops/store";
import { OpsShell } from "@/components/ops/OpsShell";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <OpsProvider>
      <OpsShell>
        <Outlet />
      </OpsShell>
    </OpsProvider>
  );
}
