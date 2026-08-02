import { o as __toESM } from "../_runtime.mjs";
import { d as require_react, u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { a as fmtTime, n as cn, o as liveStatus, s as useOps } from "./utils-BruFI2qy.mjs";
import { n as Panel, t as Kpi } from "./StatusChip-De3g_y1o.mjs";
import { h as Info, i as TriangleAlert, o as ShieldAlert, t as X } from "../_libs/lucide-react.mjs";
import { t as FlightBoard } from "./FlightBoard-ddDsI1_9.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, o as Area, r as BarChart, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CEMuFQQD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICON = {
	critical: ShieldAlert,
	warning: TriangleAlert,
	info: Info
};
var TONE = {
	critical: "border-l-crit text-crit",
	warning: "border-l-warn text-warn",
	info: "border-l-info text-info"
};
function AlertFeed({ limit = 12 }) {
	const { alerts, acknowledge } = useOps();
	const shown = alerts.slice(0, limit);
	if (!shown.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-4 text-sm text-muted-foreground",
		children: "No active exceptions. All monitored systems nominal."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border",
		children: shown.map((a) => {
			const Icon = ICON[a.severity];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("flip-in grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 border-l-2 px-4 py-3", TONE[a.severity]),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-0.5 h-4 w-4 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold text-foreground",
								children: a.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 line-clamp-2 text-xs text-muted-foreground",
								children: a.detail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mono-num mt-1 text-[10px] tracking-wider text-muted-foreground uppercase",
								children: [
									fmtTime(a.ts),
									" · ",
									a.domain
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => acknowledge(a.id),
						"aria-label": "Acknowledge alert",
						className: "shrink-0 rounded-sm border border-border p-1 text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
					})
				]
			}, a.id);
		})
	});
}
var MIN = 6e4;
function Overview() {
	const { data, now } = useOps();
	const stats = (0, import_react.useMemo)(() => {
		const live = data.flights.map((f) => ({
			...f,
			status: liveStatus(f, now)
		}));
		const active = live.filter((f) => f.status !== "Cancelled");
		const delayed = active.filter((f) => f.delay_min >= 15);
		const onTime = active.length ? Math.round((1 - delayed.length / active.length) * 100) : 100;
		const conflicts = new Set(data.occupancy.filter((o) => o.conflict).map((o) => o.gate)).size;
		const openLanes = data.security.filter((l) => l.open);
		const wait = openLanes.length ? Math.round(openLanes.reduce((s, l) => s + l.wait_min, 0) / openLanes.length) : 0;
		const mishandled = data.baggage.filter((b) => b.stage === "Mishandled").length;
		const pax = active.reduce((s, f) => s + f.pax_checked_in, 0);
		const critMx = data.maintenance.filter((m) => m.severity === "Critical" && m.status !== "Resolved").length;
		return {
			total: active.length,
			delayed: delayed.length,
			onTime,
			conflicts,
			wait,
			mishandled,
			pax,
			critMx,
			cancelled: live.length - active.length
		};
	}, [data, now]);
	const throughput = (0, import_react.useMemo)(() => {
		const bucketsMap = /* @__PURE__ */ new Map();
		for (let h = 0; h < 24; h += 2) bucketsMap.set(h, {
			arrivals: 0,
			departures: 0,
			totalDelay: 0,
			count: 0
		});
		data.flights.forEach((f) => {
			const h = new Date(f.estimated).getHours();
			const bucketHour = Math.floor(h / 2) * 2;
			const b = bucketsMap.get(bucketHour);
			if (b) {
				if (f.direction === "Arrival") b.arrivals++;
				else b.departures++;
				b.totalDelay += f.delay_min;
				b.count++;
			}
		});
		return Array.from(bucketsMap.entries()).map(([h, b]) => ({
			t: `${String(h).padStart(2, "0")}:00`,
			arrivals: b.arrivals,
			departures: b.departures,
			delay: b.count ? Math.round(b.totalDelay / b.count) : 0
		}));
	}, [data.flights]);
	const bagFlow = (0, import_react.useMemo)(() => {
		return [
			"Check-in",
			"Screening",
			"Sorting",
			"Loading",
			"Delivered",
			"Mishandled"
		].map((s) => ({
			stage: s,
			count: data.baggage.filter((b) => b.stage === s).length
		}));
	}, [data.baggage]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Active movements",
						value: stats.total,
						delta: `${stats.cancelled} cancelled`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "On-time perf.",
						value: stats.onTime,
						unit: "%",
						tone: stats.onTime > 80 ? "ok" : stats.onTime > 65 ? "warn" : "crit",
						delta: `${stats.delayed} flights ≥15m late`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Gate conflicts",
						value: stats.conflicts,
						tone: stats.conflicts ? "crit" : "ok",
						delta: "Overlapping stand windows"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Avg screening wait",
						value: stats.wait,
						unit: "min",
						tone: stats.wait > 20 ? "warn" : "ok",
						delta: `${data.security.filter((l) => l.open).length} lanes open`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Pax checked in",
						value: stats.pax.toLocaleString(),
						delta: "Across T1–T3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Mishandled bags",
						value: stats.mishandled,
						tone: stats.mishandled > 20 ? "warn" : "ok",
						delta: "Requires reconciliation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Critical maintenance",
						value: stats.critMx,
						tone: stats.critMx ? "crit" : "ok",
						delta: "Open work orders"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Crew on duty",
						value: data.staff.filter((s) => s.status === "On Duty").length,
						delta: `${data.staff.filter((s) => s.status === "Overtime").length} on overtime`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Movement throughput",
					subtitle: "±4h around ops time · arrivals, departures and average delay",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[240px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: throughput,
								margin: {
									top: 4,
									right: 8,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "ga",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "var(--color-chart-1)",
											stopOpacity: .55
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "var(--color-chart-1)",
											stopOpacity: .05
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "gd",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "var(--color-chart-2)",
											stopOpacity: .55
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "var(--color-chart-2)",
											stopOpacity: .05
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "var(--color-border)",
										strokeDasharray: "3 3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "t",
										stroke: "var(--color-muted-foreground)",
										fontSize: 11
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--color-muted-foreground)",
										fontSize: 11
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--color-surface-raised)",
										border: "1px solid var(--color-border)",
										borderRadius: 6,
										fontSize: 12,
										color: "var(--color-foreground)"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "arrivals",
										stroke: "var(--color-chart-1)",
										fill: "url(#ga)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "departures",
										stroke: "var(--color-chart-2)",
										fill: "url(#gd)"
									})
								]
							})
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Live exception feed",
					subtitle: "Auto-generated from cross-table conditions",
					bodyClassName: "max-h-[290px] overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertFeed, { limit: 14 })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Baggage flow",
					subtitle: "Bags by handling stage across the belt system",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[220px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: bagFlow,
								margin: {
									top: 4,
									right: 8,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "var(--color-border)",
										strokeDasharray: "3 3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "stage",
										stroke: "var(--color-muted-foreground)",
										fontSize: 10
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--color-muted-foreground)",
										fontSize: 11
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "var(--color-surface-raised)" },
										contentStyle: {
											background: "var(--color-surface-raised)",
											border: "1px solid var(--color-border)",
											borderRadius: 6,
											fontSize: 12
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										fill: "var(--color-chart-1)",
										radius: [
											3,
											3,
											0,
											0
										]
									})
								]
							})
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Security screening lanes",
					subtitle: "Queue depth and projected wait by lane",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-1.5 sm:grid-cols-2",
						children: data.security.slice(0, 12).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-sm border border-border bg-background px-2.5 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mono-num truncate text-xs",
									children: l.lane_id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 h-1 w-full overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("block h-full", l.wait_min > 25 ? "bg-crit" : l.wait_min > 15 ? "bg-warn" : "bg-ok"),
										style: { width: `${Math.min(100, l.queue / 120 * 100)}%` }
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("mono-num shrink-0 text-xs", !l.open ? "text-muted-foreground" : l.wait_min > 25 ? "text-crit" : "text-foreground"),
								children: l.open ? `${l.wait_min}m` : "closed"
							})]
						}, l.lane_id))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Next movements",
				subtitle: `Nearest rotations to ${fmtTime(now)} · select a row for full drill-down`,
				bodyClassName: "",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlightBoard, { compact: true })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "pb-2 text-[11px] text-muted-foreground",
				children: [
					"Simulated ops clock advances ",
					MIN / MIN,
					" minute per tick at 60x. Data source: mock multi-table airport dataset (flights, gate_events, baggage, passengers, security_screening, maintenance_logs, staff_shifts, retail_transactions)."
				]
			})
		]
	});
}
//#endregion
export { Overview as component };
