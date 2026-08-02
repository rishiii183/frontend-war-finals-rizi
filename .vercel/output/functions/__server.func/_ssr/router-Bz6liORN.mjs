import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { _ as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bz6liORN.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Cexz5zjX.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$6 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "AOCC — Airport Operations Control Center" },
			{
				name: "description",
				content: "Real-time airport operations control center unifying flights, gates, baggage, security, maintenance, staff and retail into one live picture."
			},
			{
				property: "og:title",
				content: "AOCC — Airport Operations Control Center"
			},
			{
				property: "og:description",
				content: "Live flight, gate and resource monitoring for airport operations teams."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@AOCC"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Hind:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$6.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$5 = () => import("./routes-BxdSR1_J.mjs");
var Route$5 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "AOCC — Airport Operations Control Center" }, {
		name: "description",
		content: "Real-time airport operations control center. Monitor flights, gates, and resources in one unified dashboard."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./dashboard-CgEGu8kE.mjs");
var Route$4 = createFileRoute("/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./dashboard-CEMuFQQD.mjs");
var Route$3 = createFileRoute("/dashboard/")({
	head: () => ({ meta: [
		{ title: "Ops Overview — AOCC Airport Operations Control Center" },
		{
			name: "description",
			content: "Airport-wide situational awareness: on-time performance, gate conflicts, screening queues, baggage flow and a live exception feed."
		},
		{
			property: "og:title",
			content: "Ops Overview — AOCC"
		},
		{
			property: "og:description",
			content: "Live airport-wide status, KPIs and exception feed for operations controllers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./flights-WMf_9jAC.mjs");
var Route$2 = createFileRoute("/dashboard/flights")({
	head: () => ({ meta: [
		{ title: "Flight Monitoring — AOCC Airport Operations" },
		{
			name: "description",
			content: "Search, filter and drill into every arrival and departure with live status, gate assignment, passenger and baggage linkage."
		},
		{
			property: "og:title",
			content: "Flight Monitoring — AOCC"
		},
		{
			property: "og:description",
			content: "Full flight board with search, filters, sorting and per-flight drill-down."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./gates-LAtUFP7m.mjs");
var Route$1 = createFileRoute("/dashboard/gates")({
	head: () => ({ meta: [
		{ title: "Gate & Stand Plan — AOCC Airport Operations" },
		{
			name: "description",
			content: "Rolling gate occupancy timeline with overlap conflict detection, live gate events and terminal-level resource pressure."
		},
		{
			property: "og:title",
			content: "Gate & Stand Plan — AOCC"
		},
		{
			property: "og:description",
			content: "Terminal gate timeline, conflicts and live gate event log."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./resources-B6G1xsci.mjs");
var Route = createFileRoute("/dashboard/resources")({
	head: () => ({ meta: [
		{ title: "Resources — Staff, Maintenance & Retail | AOCC" },
		{
			name: "description",
			content: "Shift coverage by role and terminal, open maintenance work orders by severity, and terminal retail performance in one operational view."
		},
		{
			property: "og:title",
			content: "Resources — Staff, Maintenance & Retail | AOCC"
		},
		{
			property: "og:description",
			content: "Crew coverage, maintenance work orders and retail revenue for airport operations."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$6
});
var DashboardRoute = Route$4.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$6
});
var DashboardIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRoute
});
var DashboardRouteChildren = {
	DashboardFlightsRoute: Route$2.update({
		id: "/flights",
		path: "/flights",
		getParentRoute: () => DashboardRoute
	}),
	DashboardGatesRoute: Route$1.update({
		id: "/gates",
		path: "/gates",
		getParentRoute: () => DashboardRoute
	}),
	DashboardResourcesRoute: Route.update({
		id: "/resources",
		path: "/resources",
		getParentRoute: () => DashboardRoute
	}),
	DashboardIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	DashboardRoute: DashboardRoute._addFileChildren(DashboardRouteChildren)
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
