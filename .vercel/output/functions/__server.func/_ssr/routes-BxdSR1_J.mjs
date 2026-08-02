import { o as __toESM } from "../_runtime.mjs";
import { d as require_react, u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ShieldCheck, c as Radio, g as ChevronDown, u as Plane, x as Activity, y as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as useScroll, r as motion, t as useTransform } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BxdSR1_J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Catches WebGL / Three.js errors and renders the provided fallback.
* This ensures the CTA is always reachable even without 3D support.
*/
var WebGLErrorBoundary = class extends import_react.Component {
	state = { hasError: false };
	static getDerivedStateFromError() {
		return { hasError: true };
	}
	componentDidCatch(error) {
		console.warn("[AOCC] 3D scene unavailable, using static fallback:", error.message);
	}
	render() {
		if (this.state.hasError) return this.props.fallback;
		return this.props.children;
	}
};
/**
* Static gradient hero with a CSS-animated airplane silhouette.
* Shown when WebGL is unsupported or the 3D scene fails to load.
*/
function StaticPlaneFallback() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 flex items-center justify-center overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, {
			className: "h-20 w-20 -rotate-12 animate-[landing-fly_6s_ease-in-out_infinite] text-primary/20 sm:h-28 sm:w-28",
			fill: "currentColor",
			strokeWidth: 0
		})
	});
}
var PlaneSceneLazy = (0, import_react.lazy)(() => import("./PlaneScene-wBa-hR8Y.mjs").then((m) => ({ default: m.PlaneScene })));
function LandingPage() {
	const containerRef = (0, import_react.useRef)(null);
	const [isClient, setIsClient] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setIsClient(true), []);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"]
	});
	const textOpacity = useTransform(scrollYProgress, [0, .3], [1, 0], { clamp: true });
	const textY = useTransform(scrollYProgress, [0, .3], [0, -60], { clamp: true });
	const chevronOpacity = useTransform(scrollYProgress, [0, .15], [1, 0], { clamp: true });
	const runwayOpacity = useTransform(scrollYProgress, [.55, .75], [0, 1], { clamp: true });
	const ctaOpacity = useTransform(scrollYProgress, [.7, .88], [0, 1], { clamp: true });
	const ctaY = useTransform(scrollYProgress, [.7, .88], [40, 0], { clamp: true });
	const overlayOpacity = useTransform(scrollYProgress, [.4, .75], [0, .35], { clamp: true });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: "relative",
		style: { height: "300vh" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-0 landing-gradient",
				children: isClient ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebGLErrorBoundary, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaticPlaneFallback, {}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: null,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaneSceneLazy, { progress: scrollYProgress })
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaticPlaneFallback, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "pointer-events-none fixed inset-0 z-[1] bg-background",
				style: { opacity: overlayOpacity }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative z-10 flex h-screen flex-col items-center justify-center px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					className: "flex flex-col items-center text-center",
					style: {
						opacity: textOpacity,
						y: textY
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-sans font-black text-6xl tracking-[0.12em] uppercase bg-gradient-to-r from-slate-100 via-sky-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(56,189,248,0.35)] sm:text-8xl md:text-9xl",
							children: "AOCC"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mono-num mt-3 text-xs tracking-[0.25em] text-sky-200/80 uppercase sm:text-sm font-semibold",
							children: "Airport Operations Control Center"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap justify-center gap-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-full border border-border/80 bg-surface/50 px-3.5 py-1.5 text-muted-foreground backdrop-blur-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-3.5 w-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mono-num text-[11px] tracking-wider uppercase",
										children: "Real-Time Ingest"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-full border border-border/80 bg-surface/50 px-3.5 py-1.5 text-muted-foreground backdrop-blur-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-ok" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mono-num text-[11px] tracking-wider uppercase",
										children: "Conflict Detection"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-full border border-border/80 bg-surface/50 px-3.5 py-1.5 text-muted-foreground backdrop-blur-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mono-num text-[11px] tracking-wider uppercase",
										children: "Live Telemetry"
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					className: "absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2",
					style: { opacity: chevronOpacity },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mono-num text-[10px] tracking-widest text-muted-foreground uppercase",
						children: "Scroll to land"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-6 w-6 animate-bounce text-accent" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 h-screen",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 flex h-[50vh] items-end justify-center pb-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					className: "w-full max-w-3xl px-4",
					style: { opacity: runwayOpacity },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-between px-2",
							children: Array.from({ length: 16 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-2 w-2 rounded-full bg-accent",
								style: { boxShadow: "0 0 10px var(--color-accent)" }
							}, `t${i}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "runway-line mx-auto mt-4 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex justify-between px-2",
							children: Array.from({ length: 16 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-2 w-2 rounded-full bg-accent",
								style: { boxShadow: "0 0 10px var(--color-accent)" }
							}, `b${i}`))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 flex h-[50vh] flex-col items-center justify-center px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					className: "flex flex-col items-center rounded-2xl border border-border/80 bg-surface/90 p-8 sm:p-12 text-center backdrop-blur-xl max-w-xl shadow-2xl",
					style: {
						opacity: ctaOpacity,
						y: ctaY
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 rounded-full bg-accent/10 p-3 border border-accent/30 text-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl sm:text-3xl text-foreground",
							children: "Operational Picture Active"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground max-w-sm",
							children: "Integrated flight board, gate stand timeline, baggage flow, and resource roster."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/dashboard",
								className: "glow-cta inline-flex items-center gap-3 rounded-xl border border-accent/40 bg-accent px-8 py-4 font-display text-base tracking-tight text-accent-foreground transition-all hover:scale-105 sm:text-lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enter Control Center" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-5 w-5" })]
							})
						})
					]
				})
			})
		]
	});
}
//#endregion
export { LandingPage as component };
