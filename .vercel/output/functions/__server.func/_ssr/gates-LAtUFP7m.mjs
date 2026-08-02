import { o as __toESM } from "../_runtime.mjs";
import { d as require_react, u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { a as fmtTime, n as cn, o as liveStatus, s as useOps } from "./utils-BruFI2qy.mjs";
import { n as Panel, r as StatusChip, t as Kpi } from "./StatusChip-De3g_y1o.mjs";
import { r as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gates-LAtUFP7m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MIN = 6e4;
var WINDOW = 216e5;
function GateTimeline({ terminal }) {
	const { data, now } = useOps();
	const start = now - 36e5;
	const end = start + WINDOW;
	const gates = data.gates.filter((g) => g.terminal === terminal);
	const flights = (0, import_react.useMemo)(() => new Map(data.flights.map((f) => [f.flight_id, f])), [data.flights]);
	const ticks = Array.from({ length: 7 }, (_, i) => start + i * 36e5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 overflow-x-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-[760px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[64px_minmax(0,1fr)] border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-7",
					children: ticks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mono-num absolute top-1 -translate-x-1/2 text-[10px] text-muted-foreground",
						style: { left: `${(t - start) / WINDOW * 100}%` },
						children: fmtTime(t)
					}, t))
				})]
			}), gates.map((g) => {
				const rows = data.occupancy.filter((o) => o.gate === g.gate && o.to > start && o.from < end).sort((a, b) => a.from - b.from);
				const laneEnds = [];
				const placed = rows.map((o) => {
					let lane = laneEnds.findIndex((e) => e <= o.from);
					if (lane === -1) lane = Math.min(laneEnds.length, 1);
					laneEnds[lane] = o.to;
					return {
						o,
						lane
					};
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[64px_minmax(0,1fr)] border-b border-border/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mono-num flex items-center px-3 py-2 text-xs text-muted-foreground",
						children: g.gate
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex",
								children: ticks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex-1 border-l border-border/40" }, t))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-y-0 z-10 w-px bg-accent",
								style: { left: `${(now - start) / WINDOW * 100}%` }
							}),
							placed.map(({ o, lane }) => {
								const f = flights.get(o.flight_id);
								const left = Math.max(0, (o.from - start) / WINDOW * 100);
								const width = Math.min(100 - left, (o.to - o.from) / WINDOW * 100);
								const active = now >= o.from && now <= o.to;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									title: `${f?.flight_no} · ${fmtTime(o.from)}–${fmtTime(o.to)}${o.conflict ? " · CONFLICT" : ""}`,
									className: cn("absolute z-20 flex h-5 items-center overflow-hidden rounded-sm border px-1.5 text-[10px] whitespace-nowrap", o.conflict ? "border-crit bg-crit/30 text-crit" : active ? "border-accent bg-accent/20 text-accent" : "border-primary/50 bg-primary/15 text-foreground"),
									style: {
										left: `${left}%`,
										width: `${Math.max(width, 3)}%`,
										top: lane === 0 ? 4 : 26
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mono-num truncate",
										children: f ? `${f.flight_no} ${liveStatus(f, now)}` : o.flight_id
									})
								}, o.flight_id);
							})
						]
					})]
				}, g.gate);
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "px-3 pt-3 text-[11px] text-muted-foreground",
			children: [
				"Rolling ",
				WINDOW / 36e5,
				"h stand plan · red blocks indicate overlapping assignments requiring reallocation · vertical marker is current ops time (",
				Math.round(WINDOW / MIN),
				" min window)."
			]
		})]
	});
}
var TERMINALS = [
	"T1",
	"T2",
	"T3"
];
function Gates() {
	const { data, now } = useOps();
	const [terminal, setTerminal] = (0, import_react.useState)("T1");
	const conflicts = (0, import_react.useMemo)(() => data.occupancy.filter((o) => o.conflict && o.terminal === terminal), [data.occupancy, terminal]);
	const gatesInTerminal = data.gates.filter((g) => g.terminal === terminal).length;
	const occupiedNow = data.occupancy.filter((o) => o.terminal === terminal && now >= o.from && now <= o.to).length;
	const events = data.gateEvents.filter((e) => e.ts <= now).slice(0, 18);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Gates in terminal",
						value: gatesInTerminal,
						delta: `${terminal} stand inventory`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Occupied now",
						value: occupiedNow,
						delta: `${Math.round(occupiedNow / gatesInTerminal * 100)}% utilisation`,
						tone: occupiedNow / gatesInTerminal > .8 ? "warn" : "ok"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Conflicts",
						value: conflicts.length,
						tone: conflicts.length ? "crit" : "ok",
						delta: "Overlapping assignments"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Events logged",
						value: events.length,
						delta: "Last operational hour window"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Stand occupancy timeline",
				subtitle: "Conflict-aware gate plan",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex gap-1 rounded-sm border border-border bg-surface p-0.5",
					children: TERMINALS.map((t) => {
						const active = terminal === t;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setTerminal(t),
							className: cn("relative rounded-[3px] px-2.5 py-1 text-xs transition-colors z-10", active ? "text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"),
							children: [t, active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
								layoutId: "activeTerminalTab",
								className: "absolute inset-0 bg-primary rounded-[3px] -z-10",
								transition: {
									type: "spring",
									stiffness: 380,
									damping: 30
								}
							})]
						}, t);
					})
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateTimeline, { terminal })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Conflict register",
					subtitle: `${conflicts.length} overlapping windows in ${terminal}`,
					bodyClassName: "max-h-[320px] overflow-y-auto p-0",
					children: conflicts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: conflicts.map((c) => {
							const f = data.flights.find((x) => x.flight_id === c.flight_id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 px-4 py-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mono-num w-12 shrink-0 text-xs text-crit",
										children: c.gate
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mono-num truncate text-xs",
											children: f?.flight_no
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-[11px] text-muted-foreground",
											children: [
												fmtTime(c.from),
												"–",
												fmtTime(c.to),
												" · ",
												f?.aircraft
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: "Critical" })
								]
							}, c.flight_id);
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "p-4 text-sm text-muted-foreground",
						children: [
							"No conflicts in ",
							terminal,
							"."
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Gate event log",
					subtitle: "Turnaround milestones as they are recorded",
					bodyClassName: "max-h-[320px] overflow-y-auto p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-4 py-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mono-num w-12 shrink-0 text-xs text-muted-foreground",
									children: fmtTime(e.ts)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mono-num w-12 shrink-0 text-xs text-accent",
									children: e.gate
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs",
										children: e.event_type
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-[11px] text-muted-foreground",
										children: e.note
									})]
								})
							]
						}, e.event_id))
					})
				})]
			})
		]
	});
}
//#endregion
export { Gates as component };
