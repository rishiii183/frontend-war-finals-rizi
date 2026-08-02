import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as cn } from "./utils-BruFI2qy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StatusChip-De3g_y1o.js
var import_jsx_runtime = require_jsx_runtime();
function Panel({ title, subtitle, action, children, className, bodyClassName }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("panel flex min-w-0 flex-col overflow-hidden", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "truncate text-[13px] tracking-wide uppercase",
					children: title
				}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-[11px] text-muted-foreground",
					children: subtitle
				})]
			}), action]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("min-w-0 flex-1", bodyClassName ?? "p-4"),
			children
		})]
	});
}
function Kpi({ label, value, unit, delta, tone = "neutral" }) {
	const toneClass = {
		neutral: "text-foreground",
		ok: "text-ok",
		warn: "text-warn",
		crit: "text-crit"
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel relative overflow-hidden p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute inset-x-0 top-0 h-px", tone === "crit" ? "bg-crit" : tone === "warn" ? "bg-warn" : tone === "ok" ? "bg-ok" : "bg-primary") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] leading-tight tracking-widest text-muted-foreground uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cn("mono-num mt-2 text-2xl leading-none font-semibold", toneClass),
				children: [value, unit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-1 text-xs text-muted-foreground",
					children: unit
				})]
			}),
			delta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 truncate text-[11px] text-muted-foreground",
				children: delta
			})
		]
	});
}
var MAP = {
	Scheduled: "text-muted-foreground border-border bg-muted/40",
	Boarding: "text-accent border-accent/40 bg-accent/10",
	"En Route": "text-info border-info/40 bg-info/10",
	Departed: "text-ok border-ok/40 bg-ok/10",
	Landed: "text-ok border-ok/40 bg-ok/10",
	Delayed: "text-warn border-warn/40 bg-warn/10",
	Diverted: "text-warn border-warn/40 bg-warn/10",
	Cancelled: "text-crit border-crit/40 bg-crit/10",
	Open: "text-warn border-warn/40 bg-warn/10",
	"In Progress": "text-info border-info/40 bg-info/10",
	Resolved: "text-ok border-ok/40 bg-ok/10",
	Critical: "text-crit border-crit/40 bg-crit/10",
	High: "text-warn border-warn/40 bg-warn/10",
	Medium: "text-info border-info/40 bg-info/10",
	Low: "text-muted-foreground border-border bg-muted/40",
	"On Duty": "text-ok border-ok/40 bg-ok/10",
	Break: "text-warn border-warn/40 bg-warn/10",
	"Off Duty": "text-muted-foreground border-border bg-muted/40",
	Overtime: "text-crit border-crit/40 bg-crit/10"
};
function StatusChip({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase", MAP[status] ?? MAP["Scheduled"], className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }), status]
	});
}
//#endregion
export { Panel as n, StatusChip as r, Kpi as t };
