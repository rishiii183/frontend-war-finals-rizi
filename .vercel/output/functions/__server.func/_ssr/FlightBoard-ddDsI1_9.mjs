import { o as __toESM } from "../_runtime.mjs";
import { d as require_react, u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { a as fmtTime, n as cn, o as liveStatus, s as useOps } from "./utils-BruFI2qy.mjs";
import { r as StatusChip } from "./StatusChip-De3g_y1o.mjs";
import { _ as Check, a as ShieldCheck, b as ArrowDownLeft, g as ChevronDown, n as Wrench, p as Luggage, r as Users, s as Search, t as X, v as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { i as AnimatePresence, r as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FlightBoard-ddDsI1_9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Cross-table drill-down: flight → gate events → baggage → screening → crew. */
function FlightDetail({ flight, onClose }) {
	const { data } = useOps();
	if (!flight) return null;
	const events = data.gateEvents.filter((e) => e.flight_id === flight.flight_id).slice(0, 6);
	const bags = data.baggage.filter((b) => b.flight_id === flight.flight_id);
	const mishandled = bags.filter((b) => b.stage === "Mishandled").length;
	const lanes = data.security.filter((l) => l.terminal === flight.terminal);
	const avgWait = lanes.length ? Math.round(lanes.reduce((s, l) => s + l.wait_min, 0) / lanes.length) : 0;
	const crew = data.staff.filter((s) => s.terminal === flight.terminal && s.status === "On Duty");
	const mx = data.maintenance.filter((m) => m.location.includes(flight.gate) && m.status !== "Resolved");
	const Stat = ({ label, value }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border/60 bg-background/50 p-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[9px] tracking-widest text-muted-foreground uppercase font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mono-num mt-0.5 text-xs font-semibold text-foreground",
			children: value
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			"aria-label": "Close detail",
			onClick: onClose,
			className: "absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "relative flex flex-col w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-accent/20 bg-surface-raised/95 backdrop-blur-xl shadow-2xl z-10 transition-all duration-300",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex items-start justify-between border-b border-border bg-surface-raised px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mono-num text-lg font-bold leading-tight text-foreground",
							children: flight.flight_no
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: flight.status })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-xs text-muted-foreground mt-1.5",
						children: [
							flight.airline,
							" · ",
							flight.aircraft,
							" · ",
							flight.origin,
							" → ",
							flight.destination
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					"aria-label": "Close",
					className: "rounded-md border border-border p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 grid gap-5 md:grid-cols-2 overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-[10px] tracking-widest text-muted-foreground uppercase font-semibold",
						children: "Core metrics"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Scheduled",
								value: fmtTime(flight.scheduled)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Estimated",
								value: fmtTime(flight.estimated)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Delay",
								value: `${flight.delay_min}m`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Gate / Stand",
								value: `${flight.gate} · ${flight.stand}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Terminal",
								value: flight.terminal
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Belt",
								value: flight.belt
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						icon: Luggage,
						title: "Baggage linkage",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: [
								flight.bags,
								" bags manifested · ",
								bags.length,
								" tracked on belt ",
								flight.belt,
								" ·",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: mishandled ? "text-crit" : "text-ok",
									children: [mishandled, " mishandled"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2.5 flex gap-1",
							children: [
								"Check-in",
								"Screening",
								"Sorting",
								"Loading",
								"Delivered"
							].map((s) => {
								const n = bags.filter((b) => b.stage === s).length;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1 rounded-sm bg-background/40 p-1.5 text-center border border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mono-num text-xs font-semibold text-foreground",
										children: n
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-[8px] text-muted-foreground mt-0.5",
										children: s
									})]
								}, s);
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							icon: ShieldCheck,
							title: "Screening pressure",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground leading-relaxed",
								children: [
									flight.terminal,
									" average wait",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: avgWait > 20 ? "text-warn font-semibold" : "text-ok font-semibold",
										children: [avgWait, " min"]
									}),
									" across",
									" ",
									lanes.filter((l) => l.open).length,
									" open lanes · ",
									flight.pax_checked_in,
									" pax checked in of ",
									flight.pax_booked,
									"."
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							icon: Users,
							title: "Crew on shift",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									crew.length,
									" personnel on duty in ",
									flight.terminal,
									"."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1.5",
								children: crew.slice(0, 4).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between gap-2 text-xs border-b border-border/30 pb-1 last:border-0 last:pb-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-foreground/90",
										children: c.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-muted-foreground font-mono text-[10px]",
										children: c.role
									})]
								}, c.shift_id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							icon: Wrench,
							title: "Gate events & maintenance",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-1.5",
								children: [
									events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mono-num shrink-0 text-muted-foreground",
											children: fmtTime(e.ts)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-foreground/80",
											children: e.event_type
										})]
									}, e.event_id)),
									mx.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2 text-xs text-warn",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mono-num shrink-0",
											children: m.log_id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "truncate",
											children: [
												m.system,
												" · ",
												m.severity
											]
										})]
									}, m.log_id)),
									!events.length && !mx.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "text-xs text-muted-foreground",
										children: "No events logged for this rotation."
									})
								]
							})
						})
					]
				})]
			})]
		})]
	});
}
function Section({ icon: Icon, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-border/60 bg-surface/30 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "mb-2.5 flex items-center gap-2 text-[10px] tracking-widest uppercase font-semibold text-primary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), title]
		}), children]
	});
}
function CustomSelect({ value, options, onChange, className }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	const selectedOption = options.find((o) => o.value === value) || options[0];
	(0, import_react.useEffect)(() => {
		function handleClickOutside(e) {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("relative inline-block text-xs", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((prev) => !prev),
			className: cn("flex w-full items-center justify-between gap-2 rounded-md border border-accent/20 bg-surface/80 px-3 py-1.5 text-foreground backdrop-blur-md transition-all duration-200 hover:border-accent/40 hover:bg-surface-raised focus:border-accent focus:outline-none shadow-[0_2px_8px_rgba(0,0,0,0.4)]", open && "border-accent/60 bg-surface-raised ring-1 ring-accent/30"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium truncate mr-1",
				children: selectedOption?.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				animate: { rotate: open ? 180 : 0 },
				transition: { duration: .2 },
				className: "flex shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 text-accent/80" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: {
				opacity: 0,
				scale: .95,
				y: -6
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 4
			},
			exit: {
				opacity: 0,
				scale: .95,
				y: -6
			},
			transition: {
				duration: .15,
				ease: "easeOut"
			},
			className: "absolute left-0 right-0 z-50 overflow-hidden rounded-lg border border-accent/30 bg-surface-raised/95 p-1 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.6)]",
			children: options.map((option) => {
				const isSelected = option.value === value;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						onChange(option.value);
						setOpen(false);
					},
					className: cn("flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors", isSelected ? "bg-accent/20 font-semibold text-accent" : "text-muted-foreground hover:bg-surface/80 hover:text-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: option.label }), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-accent" })]
				}, option.value);
			})
		}) })]
	});
}
function FlightBoard({ compact = false }) {
	const { data, now } = useOps();
	const [q, setQ] = (0, import_react.useState)("");
	const [dir, setDir] = (0, import_react.useState)("All");
	const [status, setStatus] = (0, import_react.useState)("All");
	const [sort, setSort] = (0, import_react.useState)("scheduled");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const rows = (0, import_react.useMemo)(() => {
		const list = data.flights.map((f) => ({
			...f,
			status: liveStatus(f, now)
		})).filter((f) => dir === "All" ? true : f.direction === dir).filter((f) => status === "All" ? true : f.status === status).filter((f) => {
			if (!q.trim()) return true;
			const s = q.toLowerCase();
			return f.flight_no.toLowerCase().includes(s) || f.airline.toLowerCase().includes(s) || f.origin.toLowerCase().includes(s) || f.destination.toLowerCase().includes(s) || f.gate.toLowerCase().includes(s);
		});
		list.sort((a, b) => sort === "flight_no" ? a.flight_no.localeCompare(b.flight_no) : sort === "delay_min" ? b.delay_min - a.delay_min : a.scheduled - b.scheduled);
		if (!compact) return list;
		const idx = list.findIndex((f) => f.estimated >= now - 9e5);
		return list.slice(Math.max(0, idx), Math.max(0, idx) + 8);
	}, [
		data.flights,
		now,
		q,
		dir,
		status,
		sort,
		compact
	]);
	const STATUSES = [
		"All",
		"Boarding",
		"En Route",
		"Delayed",
		"Landed",
		"Departed",
		"Cancelled"
	];
	const [page, setPage] = (0, import_react.useState)(0);
	const pageSize = 12;
	const currentFiltersKey = `${dir}-${status}-${q}-${sort}`;
	const [lastFiltersKey, setLastFiltersKey] = (0, import_react.useState)(currentFiltersKey);
	if (currentFiltersKey !== lastFiltersKey) {
		setPage(0);
		setLastFiltersKey(currentFiltersKey);
	}
	const pageCount = Math.ceil(rows.length / pageSize);
	const displayRows = (0, import_react.useMemo)(() => {
		if (compact) return rows;
		return rows.slice(page * pageSize, (page + 1) * pageSize);
	}, [
		rows,
		page,
		pageSize,
		compact
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col",
		children: [
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-[180px] flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search flight, airline, city or gate",
							className: "w-full rounded-sm border border-input bg-background py-1.5 pr-3 pl-8 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex items-center gap-1 rounded-sm border border-border bg-surface p-0.5",
						children: [
							"All",
							"Arrival",
							"Departure"
						].map((d) => {
							const active = dir === d;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setDir(d),
								className: cn("relative rounded-[3px] px-2.5 py-1 text-xs transition-colors z-10", active ? "text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"),
								children: [d, active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									layoutId: "activeDirectionTab",
									className: "absolute inset-0 bg-primary rounded-[3px] -z-10",
									transition: {
										type: "spring",
										stiffness: 380,
										damping: 30
									}
								})]
							}, d);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomSelect, {
						value: status,
						onChange: (val) => setStatus(val),
						options: STATUSES.map((s) => ({
							value: s,
							label: s === "All" ? "All statuses" : s
						})),
						className: "w-36"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomSelect, {
						value: sort,
						onChange: (val) => setSort(val),
						options: [
							{
								value: "scheduled",
								label: "Sort: schedule"
							},
							{
								value: "delay_min",
								label: "Sort: delay"
							},
							{
								value: "flight_no",
								label: "Sort: flight no."
							}
						],
						className: "w-36"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] border-collapse text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border text-[10px] tracking-widest text-muted-foreground uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-left font-semibold",
								children: "Flight"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left font-semibold",
								children: "Route"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left font-semibold",
								children: "Sched"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left font-semibold",
								children: "Est"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left font-semibold",
								children: "Gate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left font-semibold",
								children: "Pax"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-left font-semibold",
								children: "Status"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [displayRows.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						onClick: () => setSelected(f),
						className: "cursor-pointer border-b border-border/60 transition-colors hover:bg-surface-raised",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [f.direction === "Arrival" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "h-3.5 w-3.5 shrink-0 text-info" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5 shrink-0 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mono-num text-[13px] font-semibold",
											children: f.flight_no
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[11px] text-muted-foreground",
											children: f.airline
										})]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "mono-num px-3 py-2.5 text-xs",
								children: [
									f.origin,
									" → ",
									f.destination
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "mono-num px-3 py-2.5 text-xs text-muted-foreground",
								children: fmtTime(f.scheduled)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: cn("mono-num px-3 py-2.5 text-xs", f.delay_min >= 15 ? "text-warn" : "text-foreground"),
								children: [fmtTime(f.estimated), f.delay_min >= 15 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1",
									children: [
										"+",
										f.delay_min,
										"m"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "mono-num px-3 py-2.5 text-xs",
								children: [f.gate, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 text-muted-foreground",
									children: f.terminal
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "mono-num px-3 py-2.5 text-xs text-muted-foreground",
								children: [
									f.pax_checked_in,
									"/",
									f.pax_booked
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: f.status })
							})
						]
					}, f.flight_id)), !displayRows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "px-4 py-10 text-center text-sm text-muted-foreground",
						children: "No flights match the current filters."
					}) })] })]
				})
			}),
			!compact && pageCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-t border-border px-4 py-3 bg-surface/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Showing ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground font-medium",
							children: page * pageSize + 1
						}),
						" to",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground font-medium",
							children: Math.min((page + 1) * pageSize, rows.length)
						}),
						" ",
						"of ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground font-medium",
							children: rows.length
						}),
						" flights"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage((p) => Math.max(0, p - 1)),
							disabled: page === 0,
							className: "px-2.5 py-1.5 rounded-md border border-border bg-surface text-xs text-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-raised transition-colors",
							children: "Previous"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground px-2",
							children: [
								"Page ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground font-medium",
									children: page + 1
								}),
								" of",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground font-medium",
									children: pageCount
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage((p) => Math.min(pageCount - 1, p + 1)),
							disabled: page === pageCount - 1,
							className: "px-2.5 py-1.5 rounded-md border border-border bg-surface text-xs text-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-raised transition-colors",
							children: "Next"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlightDetail, {
				flight: selected,
				onClose: () => setSelected(null)
			})
		]
	});
}
//#endregion
export { FlightBoard as t };
