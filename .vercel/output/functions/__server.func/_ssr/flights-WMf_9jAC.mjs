import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as Panel } from "./StatusChip-De3g_y1o.mjs";
import { t as FlightBoard } from "./FlightBoard-ddDsI1_9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/flights-WMf_9jAC.js
var import_jsx_runtime = require_jsx_runtime();
function Flights() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Flight board",
		subtitle: "All movements · click any row for cross-table drill-down",
		bodyClassName: "",
		className: "min-h-[70vh]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlightBoard, {})
	});
}
//#endregion
export { Flights as component };
