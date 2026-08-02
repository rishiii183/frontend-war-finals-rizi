import { Component, type ReactNode } from "react";
import { Plane } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches WebGL / Three.js errors and renders the provided fallback.
 * This ensures the CTA is always reachable even without 3D support.
 */
export class WebGLErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    console.warn(
      "[AOCC] 3D scene unavailable, using static fallback:",
      error.message,
    );
  }

  override render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/**
 * Static gradient hero with a CSS-animated airplane silhouette.
 * Shown when WebGL is unsupported or the 3D scene fails to load.
 */
export function StaticPlaneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <Plane
        className="h-20 w-20 -rotate-12 animate-[landing-fly_6s_ease-in-out_infinite] text-primary/20 sm:h-28 sm:w-28"
        fill="currentColor"
        strokeWidth={0}
      />
    </div>
  );
}
