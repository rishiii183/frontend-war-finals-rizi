import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight, ShieldCheck, Activity, Radio } from "lucide-react";
import {
  WebGLErrorBoundary,
  StaticPlaneFallback,
} from "@/components/landing/WebGLFallback";

/* Lazy-load the 3D scene so Three.js is never imported during SSR. */
const PlaneSceneLazy = lazy(() =>
  import("@/components/landing/PlaneScene").then((m) => ({
    default: m.PlaneScene,
  })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AOCC — Airport Operations Control Center" },
      {
        name: "description",
        content:
          "Real-time airport operations control center. Monitor flights, gates, and resources in one unified dashboard.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* ── Scroll-driven opacity / position values ── */

  // Hero text fades out early
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0], {
    clamp: true,
  });
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -60], {
    clamp: true,
  });

  // Scroll chevron fades even faster
  const chevronOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0], {
    clamp: true,
  });

  // Runway fades in as plane approaches
  const runwayOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1], {
    clamp: true,
  });

  // CTA fades in last
  const ctaOpacity = useTransform(scrollYProgress, [0.7, 0.88], [0, 1], {
    clamp: true,
  });
  const ctaY = useTransform(scrollYProgress, [0.7, 0.88], [40, 0], {
    clamp: true,
  });

  // Background darkens progressively (simulates tarmac transition)
  const overlayOpacity = useTransform(scrollYProgress, [0.4, 0.75], [0, 0.35], {
    clamp: true,
  });

  return (
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      {/* ── Fixed 3D canvas backdrop ── */}
      <div className="fixed inset-0 z-0 landing-gradient">
        {isClient ? (
          <WebGLErrorBoundary fallback={<StaticPlaneFallback />}>
            <Suspense fallback={null}>
              <PlaneSceneLazy progress={scrollYProgress} />
            </Suspense>
          </WebGLErrorBoundary>
        ) : (
          <StaticPlaneFallback />
        )}
      </div>

      {/* Dark overlay — increases as the plane descends to simulate tarmac */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[1] bg-background"
        style={{ opacity: overlayOpacity }}
      />

      {/* ─────────────── Hero section ─────────────── */}
      <section className="relative z-10 flex h-screen flex-col items-center justify-center px-4">
        <motion.div
          className="flex flex-col items-center text-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          {/* Status Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-surface/80 px-4 py-1.5 backdrop-blur-md">
            <span className="pulse-dot h-2 w-2 rounded-full bg-accent" />
            <span className="mono-num text-xs tracking-widest text-accent uppercase">
              Operational Command · Hub Control
            </span>
          </div>

          <h1 className="font-display text-6xl tracking-tight text-foreground drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] sm:text-8xl md:text-9xl">
            AOCC
          </h1>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground sm:text-xl font-medium">
            Airport Operations Control Center
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground/80">
            <div className="flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-accent" />
              <span>Real-Time Ingest</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-ok" />
              <span>Conflict Detection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span>Live Exception Telemetry</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: chevronOpacity }}
        >
          <span className="mono-num text-[10px] tracking-widest text-muted-foreground uppercase">
            Scroll to land
          </span>
          <ChevronDown className="h-6 w-6 animate-bounce text-accent" />
        </motion.div>
      </section>

      {/* ─────── Scroll spacer (plane descends through this zone) ─────── */}
      <section className="relative z-10 h-screen" aria-hidden="true" />

      {/* ─────────── Runway transition ─────────── */}
      <section className="relative z-10 flex h-[50vh] items-end justify-center pb-12">
        <motion.div
          className="w-full max-w-3xl px-4"
          style={{ opacity: runwayOpacity }}
        >
          {/* Edge lights — top row */}
          <div className="flex justify-between px-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={`t${i}`}
                className="h-2 w-2 rounded-full bg-accent"
                style={{ boxShadow: "0 0 10px var(--color-accent)" }}
              />
            ))}
          </div>

          {/* Center dashes */}
          <div className="runway-line mx-auto mt-4 w-full" />

          {/* Edge lights — bottom row */}
          <div className="mt-4 flex justify-between px-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={`b${i}`}
                className="h-2 w-2 rounded-full bg-accent"
                style={{ boxShadow: "0 0 10px var(--color-accent)" }}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ────────────── CTA section ────────────── */}
      <section className="relative z-10 flex h-[50vh] flex-col items-center justify-center px-4">
        <motion.div
          className="flex flex-col items-center rounded-2xl border border-border/80 bg-surface/90 p-8 sm:p-12 text-center backdrop-blur-xl max-w-xl shadow-2xl"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <div className="mb-4 rounded-full bg-accent/10 p-3 border border-accent/30 text-accent">
            <Radio className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-foreground">
            Operational Picture Active
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Integrated flight board, gate stand timeline, baggage flow, and resource roster.
          </p>

          <div className="mt-6">
            <Link
              to="/dashboard"
              className="glow-cta inline-flex items-center gap-3 rounded-xl border border-accent/40 bg-accent px-8 py-4 font-display text-base tracking-tight text-accent-foreground transition-all hover:scale-105 sm:text-lg"
            >
              <span>Enter Control Center</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
