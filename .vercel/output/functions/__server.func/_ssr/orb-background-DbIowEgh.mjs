import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { r as __exportAll$1 } from "./supabase-B2jjn2gh.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orb-background-DbIowEgh.js
var orb_background_DbIowEgh_exports = /* @__PURE__ */ __exportAll({
	n: () => orb_background_exports,
	t: () => OrbBackground
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var orb_background_exports = /* @__PURE__ */ __exportAll$1({ default: () => OrbBackground });
function hexRgb(hex) {
	return {
		r: parseInt(hex.slice(1, 3), 16),
		g: parseInt(hex.slice(3, 5), 16),
		b: parseInt(hex.slice(5, 7), 16)
	};
}
function OrbBackground({ primaryColor = "#9f1239", secondaryColor = "#d4af37", particleCount = 55 }) {
	const canvasRef = (0, import_react.useRef)(null);
	const mouseRef = (0, import_react.useRef)({
		x: -9999,
		y: -9999
	});
	const particlesRef = (0, import_react.useRef)([]);
	const rafRef = (0, import_react.useRef)(0);
	const lastDrawRef = (0, import_react.useRef)(0);
	const { pc, sc, initialParticles } = (0, import_react.useMemo)(() => {
		const pc = hexRgb(primaryColor);
		const sc = hexRgb(secondaryColor);
		return {
			pc,
			sc,
			initialParticles: Array.from({ length: particleCount }, () => {
				const c = Math.random() > .42 ? pc : sc;
				return {
					x: 0,
					y: 0,
					vx: (Math.random() - .5) * .35,
					vy: (Math.random() - .5) * .35 - .08,
					radius: 1.2 + Math.random() * 2.8,
					opacity: .08 + Math.random() * .25,
					color: `${c.r},${c.g},${c.b}`,
					pulsePhase: Math.random() * Math.PI * 2,
					pulseSpeed: .008 + Math.random() * .015
				};
			})
		};
	}, [
		primaryColor,
		secondaryColor,
		particleCount
	]);
	const prefersReducedMotion = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener("resize", resize);
		particlesRef.current = initialParticles.map((p) => ({
			...p,
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height
		}));
		const onMove = (cx, cy) => {
			mouseRef.current = {
				x: cx,
				y: cy
			};
		};
		const onMouseMove = (e) => onMove(e.clientX, e.clientY);
		const onTouchMove = (e) => {
			const t = e.touches[0];
			if (t) onMove(t.clientX, t.clientY);
		};
		const onLeave = () => {
			mouseRef.current = {
				x: -9999,
				y: -9999
			};
		};
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("touchmove", onTouchMove, { passive: true });
		window.addEventListener("touchend", onLeave);
		window.addEventListener("mouseleave", onLeave);
		let t = 0;
		const draw = (now) => {
			const interval = document.hidden ? 100 : prefersReducedMotion ? 100 : 33;
			if (now - lastDrawRef.current < interval) {
				rafRef.current = requestAnimationFrame(draw);
				return;
			}
			lastDrawRef.current = now;
			t++;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (prefersReducedMotion) {
				const g1 = ctx.createRadialGradient(canvas.width * .82, canvas.height * .08, 0, canvas.width * .82, canvas.height * .08, canvas.width * .45);
				g1.addColorStop(0, `rgba(${pc.r},${pc.g},${pc.b},0.18)`);
				g1.addColorStop(1, "transparent");
				ctx.fillStyle = g1;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				const g2 = ctx.createRadialGradient(canvas.width * .1, canvas.height * .88, 0, canvas.width * .1, canvas.height * .88, canvas.width * .38);
				g2.addColorStop(0, `rgba(${sc.r},${sc.g},${sc.b},0.1)`);
				g2.addColorStop(1, "transparent");
				ctx.fillStyle = g2;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			} else {
				const mx = mouseRef.current.x;
				const my = mouseRef.current.y;
				const orbOffset1 = Math.sin(t * .003) * 30;
				const orbOffset2 = Math.cos(t * .0025) * 25;
				const g1 = ctx.createRadialGradient(canvas.width * .82 + orbOffset1, canvas.height * .08 + orbOffset1 * .5, 0, canvas.width * .82 + orbOffset1, canvas.height * .08 + orbOffset1 * .5, canvas.width * .45);
				const mi1 = Math.max(0, 1 - Math.hypot(mx - canvas.width * .82, my - canvas.height * .08) / (canvas.width * .6));
				g1.addColorStop(0, `rgba(${pc.r},${pc.g},${pc.b},${.18 + mi1 * .12})`);
				g1.addColorStop(1, "transparent");
				ctx.fillStyle = g1;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				const g2 = ctx.createRadialGradient(canvas.width * .1 + orbOffset2, canvas.height * .88 + orbOffset2 * .5, 0, canvas.width * .1 + orbOffset2, canvas.height * .88 + orbOffset2 * .5, canvas.width * .38);
				const mi2 = Math.max(0, 1 - Math.hypot(mx - canvas.width * .1, my - canvas.height * .88) / (canvas.width * .6));
				g2.addColorStop(0, `rgba(${sc.r},${sc.g},${sc.b},${.1 + mi2 * .08})`);
				g2.addColorStop(1, "transparent");
				ctx.fillStyle = g2;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				if (mx > 0 && mx < canvas.width) {
					const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 160);
					mg.addColorStop(0, `rgba(${pc.r},${pc.g},${pc.b},0.06)`);
					mg.addColorStop(1, "transparent");
					ctx.fillStyle = mg;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}
				for (const p of particlesRef.current) {
					const dx = p.x - mx;
					const dy = p.y - my;
					const dist = Math.hypot(dx, dy);
					if (dist < 120) {
						const force = (120 - dist) / 120;
						p.vx += dx / dist * force * .4;
						p.vy += dy / dist * force * .4;
					}
					p.vx *= .985;
					p.vy *= .985;
					p.x += p.vx;
					p.y += p.vy;
					p.pulsePhase += p.pulseSpeed;
					if (p.x < -10) p.x = canvas.width + 10;
					if (p.x > canvas.width + 10) p.x = -10;
					if (p.y < -10) p.y = canvas.height + 10;
					if (p.y > canvas.height + 10) p.y = -10;
					const pulseOpacity = p.opacity * (.6 + .4 * Math.sin(p.pulsePhase));
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(${p.color},${pulseOpacity})`;
					ctx.fill();
				}
			}
			rafRef.current = requestAnimationFrame(draw);
		};
		rafRef.current = requestAnimationFrame(draw);
		return () => {
			cancelAnimationFrame(rafRef.current);
			window.removeEventListener("resize", resize);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("touchmove", onTouchMove);
			window.removeEventListener("touchend", onLeave);
			window.removeEventListener("mouseleave", onLeave);
		};
	}, [
		pc,
		sc,
		initialParticles,
		prefersReducedMotion
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		"aria-hidden": "true",
		className: "pointer-events-none fixed inset-0 -z-10",
		style: {
			width: "100%",
			height: "100%"
		}
	});
}
//#endregion
export { orb_background_DbIowEgh_exports as n, OrbBackground as t };
