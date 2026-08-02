import { o as __toESM } from "../_runtime.mjs";
import { d as require_react, u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, r as fmtClock, s as useOps, t as OpsProvider } from "./utils-BruFI2qy.mjs";
import { c as Radio, d as PlaneTakeoff, f as Pause, l as Play, m as LayoutGrid, r as Users, x as Activity } from "../_libs/lucide-react.mjs";
import { r as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CgEGu8kE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/dashboard",
		label: "Overview",
		icon: Activity
	},
	{
		to: "/dashboard/flights",
		label: "Flights",
		icon: PlaneTakeoff
	},
	{
		to: "/dashboard/gates",
		label: "Gates",
		icon: LayoutGrid
	},
	{
		to: "/dashboard/resources",
		label: "Resources",
		icon: Users
	}
];
var SPEEDS = [
	1,
	60,
	300
];
function OpsShell({ children }) {
	const path = useRouterState({ select: (r) => r.location.pathname });
	const { now, running, setRunning, speed, setSpeed, alerts } = useOps();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	const critical = alerts.filter((a) => a.severity === "critical").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "sticky top-0 hidden h-screen w-[210px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-sidebar-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2 hover:opacity-80 transition-opacity",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-sm tracking-tight",
							children: "AOCC"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mono-num mt-1 text-[10px] tracking-widest text-muted-foreground uppercase",
						children: ["DEL", " Control Center"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-1 flex-col gap-0.5 p-3",
					children: NAV.map((item) => {
						const active = path === item.to || item.to === "/dashboard" && path === "/dashboard/";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--color-primary)]" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: item.label
							})]
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-sidebar-border p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] tracking-widest text-muted-foreground uppercase",
							children: "Feed status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("pulse-dot h-2 w-2 rounded-full", running ? "bg-ok text-ok" : "bg-muted-foreground text-muted-foreground") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: running ? "Live ingest" : "Feed paused"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mono-num mt-2 text-[11px] text-muted-foreground",
							children: [critical, " critical open"]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate text-base tracking-tight sm:text-lg",
							children: "Airport Operations Control Center"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mono-num truncate text-[11px] text-muted-foreground",
							children: ["DEL", " · integrated flight, gate, baggage, security & resource picture"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 sm:gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative hidden items-center gap-1 rounded-sm border border-border bg-surface p-0.5 sm:flex",
								children: SPEEDS.map((s) => {
									const active = speed === s;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setSpeed(s),
										className: cn("relative mono-num rounded-[3px] px-2 py-1 text-[11px] transition-colors z-10", active ? "text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"),
										children: [
											s,
											"x",
											active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
												layoutId: "activeSpeedTab",
												className: "absolute inset-0 bg-primary rounded-[3px] -z-10",
												transition: {
													type: "spring",
													stiffness: 380,
													damping: 30
												}
											})
										]
									}, s);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setRunning(!running),
								className: "inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-surface-raised",
								children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5" }), running ? "Pause" : "Resume"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-sm border border-primary/40 bg-primary/10 px-3 py-1.5 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mono-num block text-sm leading-none text-accent",
									children: mounted ? fmtClock(now) : "--:--:--"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[9px] tracking-widest text-muted-foreground uppercase",
									children: "Ops time"
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex gap-1 overflow-x-auto border-b border-border bg-surface px-4 py-2 md:hidden",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: cn("shrink-0 rounded-sm px-3 py-1.5 text-xs", path === item.to || item.to === "/dashboard" && path === "/dashboard/" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"),
						children: item.label
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "grid-backdrop min-w-0 flex-1 p-4 sm:p-6",
					children
				})
			]
		})]
	});
}
function DashboardLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) });
}
//#endregion
export { DashboardLayout as component };
