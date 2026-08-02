import { o as __toESM } from "../_runtime.mjs";
import { a as useThree, c as Object3D, d as require_react, i as useFrame, l as Vector3, n as useGLTF, r as Canvas, s as MathUtils, t as Sparkles, u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PlaneScene-wBa-hR8Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlaneModel({ scale = 1 }) {
	const { scene } = useGLTF("/airplane.glb");
	(0, import_react.useEffect)(() => {
		if (scene) scene.traverse((child) => {
			if (child.isMesh) {
				const mesh = child;
				mesh.castShadow = true;
				mesh.receiveShadow = true;
			}
		});
	}, [scene]);
	const modelScale = scale * .08;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		scale: modelScale,
		dispose: null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", { object: scene })
	});
}
useGLTF.preload("/airplane.glb");
if (typeof window !== "undefined" && !Object3D.prototype.data) {
	const dataMap = /* @__PURE__ */ new WeakMap();
	Object.defineProperty(Object3D.prototype, "data", {
		get() {
			let d = dataMap.get(this);
			if (!d) {
				d = {};
				dataMap.set(this, d);
			}
			return d;
		},
		set(val) {
			dataMap.set(this, val);
		},
		enumerable: false,
		configurable: true
	});
}
/**
* Subscribes to the framer-motion MotionValue and calls invalidate()
* so frameloop="demand" actually redraws on each scroll update.
*/
function ScrollDriver({ progress }) {
	const invalidate = useThree((s) => s.invalidate);
	(0, import_react.useEffect)(() => {
		return progress.on("change", () => invalidate());
	}, [progress, invalidate]);
	return null;
}
/** Animates the airplane position / rotation based on scroll progress 0→1. */
function AnimatedPlane({ progress }) {
	const ref = (0, import_react.useRef)(null);
	useFrame(() => {
		const p = progress.get();
		const g = ref.current;
		const yEased = p * p * (3 - 2 * p);
		g.position.x = MathUtils.lerp(5.2, -3.5, p);
		g.position.y = MathUtils.lerp(4.6, .25, yEased);
		g.position.z = MathUtils.lerp(-1.8, .8, p);
		g.rotation.z = MathUtils.lerp(-.35, 0, p);
		g.rotation.x = p < .8 ? MathUtils.lerp(-.08, -.02, p / .8) : MathUtils.lerp(-.02, .08, (p - .8) / .2);
		g.rotation.y = MathUtils.lerp(.18, -.08, p);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaneModel, { scale: 1.1 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			position: [
				-.8,
				-.2,
				0
			],
			color: "#38bdf8",
			intensity: 2.5,
			distance: 4
		})]
	});
}
/** Camera gently tracks the plane's descent. */
function AnimatedCamera({ progress }) {
	const lookTarget = (0, import_react.useRef)(new Vector3());
	useFrame(({ camera }) => {
		const p = progress.get();
		camera.position.x = MathUtils.lerp(0, -1.2, p);
		camera.position.y = MathUtils.lerp(3.5, 1.4, p);
		camera.position.z = MathUtils.lerp(10, 7.5, p);
		lookTarget.current.set(MathUtils.lerp(2.8, -1.8, p), MathUtils.lerp(2.8, .4, p), 0);
		camera.lookAt(lookTarget.current);
	});
	return null;
}
/** 3D Runway lights on ground plane that fade in as the jet lands */
function RunwayGround3D({ progress }) {
	const groupRef = (0, import_react.useRef)(null);
	useFrame(() => {
		const p = progress.get();
		if (groupRef.current) {
			const opacity = MathUtils.clamp((p - .5) / .3, 0, 1);
			groupRef.current.position.y = MathUtils.lerp(-1, -.1, opacity);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: groupRef,
		position: [
			-4,
			-.1,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					0,
					-.05,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [16, 2.5] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#0b1329",
					roughness: .9
				})]
			}),
			Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: [
					(i - 6) * 1.3,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						0,
						1.3
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.04,
						8,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#38bdf8" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						0,
						-1.3
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.04,
						8,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#38bdf8" })]
				})]
			}, i)),
			Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					(i - 2.5) * 2.4,
					.01,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.2, .08] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#94a3b8" })]
			}, i))
		]
	});
}
function PlaneScene({ progress }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		frameloop: "demand",
		dpr: [1, 1.5],
		gl: {
			alpha: true,
			antialias: true,
			powerPreference: "high-performance"
		},
		camera: {
			fov: 48,
			near: .1,
			far: 100,
			position: [
				0,
				3.5,
				10
			]
		},
		style: { background: "transparent" },
		onCreated: ({ gl }) => gl.setClearColor(0, 0),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollDriver, { progress }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", {
				intensity: .45,
				color: "#0f172a"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					6,
					10,
					5
				],
				intensity: 1.5,
				color: "#e0f2fe"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					-6,
					-4,
					-5
				],
				intensity: .8,
				color: "#0284c7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				position: [
					0,
					5,
					-2
				],
				intensity: 1.2,
				color: "#38bdf8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
				count: 70,
				scale: [
					18,
					12,
					18
				],
				size: 2.5,
				speed: .4,
				color: "#38bdf8",
				opacity: .65
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
				fallback: null,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedPlane, { progress }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedCamera, { progress }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunwayGround3D, { progress })
				]
			})
		]
	});
}
//#endregion
export { PlaneScene };
