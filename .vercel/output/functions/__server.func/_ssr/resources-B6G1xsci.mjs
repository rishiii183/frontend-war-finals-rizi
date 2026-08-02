import { o as __toESM } from "../_runtime.mjs";
import { d as require_react, u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { a as fmtTime, i as fmtMoney, n as cn, s as useOps } from "./utils-BruFI2qy.mjs";
import { n as Panel, r as StatusChip, t as Kpi } from "./StatusChip-De3g_y1o.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as PieChart, r as BarChart, s as CartesianGrid, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resources-B6G1xsci.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)",
	"var(--color-chart-5)"
];
function Resources() {
	const { data, now } = useOps();
	const [sev, setSev] = (0, import_react.useState)("All");
	const coverage = (0, import_react.useMemo)(() => {
		return Array.from(new Set(data.staff.map((s) => s.role))).map((role) => ({
			role,
			onDuty: data.staff.filter((s) => s.role === role && s.status === "On Duty").length,
			offDuty: data.staff.filter((s) => s.role === role && s.status !== "On Duty").length
		}));
	}, [data.staff]);
	const retail = (0, import_react.useMemo)(() => {
		return Array.from(new Set(data.retail.map((r) => r.category))).map((c) => ({
			name: c,
			value: Math.round(data.retail.filter((r) => r.category === c).reduce((s, r) => s + r.amount, 0))
		}));
	}, [data.retail]);
	const revenue = data.retail.reduce((s, r) => s + r.amount, 0);
	const logs = data.maintenance.filter((m) => sev === "All" ? true : m.severity === sev);
	const openMx = data.maintenance.filter((m) => m.status !== "Resolved").length;
	const onDuty = data.staff.filter((s) => s.status === "On Duty").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Personnel on duty",
						value: onDuty,
						delta: `${data.staff.length} rostered`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Open work orders",
						value: openMx,
						tone: openMx > 12 ? "warn" : "ok",
						delta: `${data.maintenance.filter((m) => m.severity === "Critical").length} critical`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Retail revenue",
						value: fmtMoney(revenue),
						delta: "Ops day to date"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Avg basket",
						value: fmtMoney(revenue / data.retail.length),
						delta: `${data.retail.length} transactions`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Shift coverage by role",
					subtitle: "On duty vs. off roster right now",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[240px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: coverage,
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
										dataKey: "role",
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
										dataKey: "onDuty",
										stackId: "a",
										fill: "var(--color-chart-2)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "offDuty",
										stackId: "a",
										fill: "var(--color-muted)"
									})
								]
							})
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Retail mix",
					subtitle: "Revenue share by category",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[240px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: retail,
								dataKey: "value",
								nameKey: "name",
								innerRadius: 52,
								outerRadius: 82,
								paddingAngle: 2,
								stroke: "var(--color-background)",
								children: retail.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--color-surface-raised)",
								border: "1px solid var(--color-border)",
								borderRadius: 6,
								fontSize: 12
							} })] })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-1 grid grid-cols-2 gap-1",
						children: retail.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-1.5 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-2 w-2 shrink-0 rounded-full",
									style: { background: COLORS[i % COLORS.length] }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-muted-foreground",
									children: r.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mono-num ml-auto shrink-0",
									children: fmtMoney(r.value)
								})
							]
						}, r.name))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Maintenance work orders",
				subtitle: "Asset faults affecting operational capability",
				bodyClassName: "p-0",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 rounded-sm border border-border bg-surface p-0.5",
					children: [
						"All",
						"Critical",
						"High",
						"Medium",
						"Low"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSev(s),
						className: cn("rounded-[3px] px-2 py-1 text-[11px] transition-colors", sev === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"),
						children: s
					}, s))
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[720px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border text-[10px] tracking-widest text-muted-foreground uppercase",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2 text-left font-semibold",
									children: "Order"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left font-semibold",
									children: "System / Asset"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left font-semibold",
									children: "Location"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left font-semibold",
									children: "Opened"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left font-semibold",
									children: "ETA"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left font-semibold",
									children: "Technician"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left font-semibold",
									children: "Severity"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2 text-left font-semibold",
									children: "Status"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: logs.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/60 hover:bg-surface-raised",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "mono-num px-4 py-2.5 text-xs",
									children: m.log_id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2.5 text-xs",
									children: [m.system, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mono-num ml-1.5 text-muted-foreground",
										children: m.asset
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 text-xs text-muted-foreground",
									children: m.location
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "mono-num px-3 py-2.5 text-xs text-muted-foreground",
									children: fmtTime(m.opened)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "mono-num px-3 py-2.5 text-xs",
									children: [m.eta_min, "m"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 text-xs",
									children: m.technician
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: m.severity })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: m.status })
								})
							]
						}, m.log_id)) })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Roster",
				subtitle: `Shift board as of ${fmtTime(now)}`,
				bodyClassName: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3",
					children: data.staff.slice(0, 24).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 bg-surface px-4 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mono-num truncate text-[11px] text-muted-foreground",
								children: [
									s.role,
									" · ",
									s.terminal,
									" · ",
									fmtTime(s.start),
									"–",
									fmtTime(s.end)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: s.status })]
					}, s.shift_id))
				})
			})
		]
	});
}
//#endregion
export { Resources as component };
