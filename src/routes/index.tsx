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
      {/* ── Floating Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-background/20 border-b border-border/10">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Radio className="h-4.5 w-4.5 text-primary" />
          <span className="font-sans font-black tracking-wider text-sm">AOCC</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="rounded-lg border border-accent/20 bg-surface/50 hover:bg-surface-raised px-4.5 py-2 text-xs font-semibold text-foreground backdrop-blur-sm transition-all"
          >
            Dashboard
          </Link>
          <Link
            to="/dashboard"
            className="rounded-lg bg-accent px-4.5 py-2 text-xs font-semibold text-accent-foreground hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,242,254,0.25)]"
          >
            Live Analytics
          </Link>
        </div>
      </header>

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
          {/* Main Title with Gradient & Ambient Glow */}
          <h1 className="font-sans font-black text-6xl tracking-[0.12em] uppercase bg-gradient-to-r from-slate-100 via-sky-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(56,189,248,0.35)] sm:text-8xl md:text-9xl">
            AOCC
          </h1>

          {/* Subtitle */}
          <p className="mono-num mt-3 text-xs tracking-[0.25em] text-sky-200/80 uppercase sm:text-sm font-semibold">
            Airport Operations Control Center
          </p>

          {/* Feature Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs">
            <div className="flex items-center gap-2 rounded-full border border-border/80 bg-surface/50 px-3.5 py-1.5 text-muted-foreground backdrop-blur-sm">
              <Radio className="h-3.5 w-3.5 text-accent" />
              <span className="mono-num text-[11px] tracking-wider uppercase">Real-Time Ingest</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/80 bg-surface/50 px-3.5 py-1.5 text-muted-foreground backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-ok" />
              <span className="mono-num text-[11px] tracking-wider uppercase">Conflict Detection</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/80 bg-surface/50 px-3.5 py-1.5 text-muted-foreground backdrop-blur-sm">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span className="mono-num text-[11px] tracking-wider uppercase">Live Telemetry</span>
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
          className="runway-container w-full max-w-3xl px-4"
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
        <div
          className="flex flex-col items-center rounded-2xl border border-border/80 bg-surface/90 p-8 sm:p-12 text-center backdrop-blur-xl max-w-xl shadow-2xl"
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

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard"
              className="glow-cta inline-flex items-center justify-center gap-2.5 rounded-xl border border-accent/40 bg-accent px-6 py-3.5 font-display text-sm tracking-tight text-accent-foreground transition-all hover:scale-105"
            >
              <span>Enter Control Center</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-border/80 bg-surface/50 px-6 py-3.5 font-display text-sm tracking-tight text-foreground hover:bg-surface-raised transition-all hover:scale-105"
            >
              <span>View Live Analytics</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
