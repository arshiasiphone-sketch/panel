import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  radius: number; opacity: number; color: string;
  pulsePhase: number; pulseSpeed: number;
}

interface Props {
  primaryColor?: string;
  secondaryColor?: string;
  particleCount?: number;
}

export default function OrbBackground({
  primaryColor = "#9f1239",
  secondaryColor = "#d4af37",
  particleCount = 55,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function hexRgb(hex: string) {
      return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
      };
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pc = hexRgb(primaryColor);
    const sc = hexRgb(secondaryColor);

    particlesRef.current = Array.from({ length: particleCount }, () => {
      const isPrimary = Math.random() > 0.42;
      const c = isPrimary ? pc : sc;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.08,
        radius: 1.2 + Math.random() * 2.8,
        opacity: 0.08 + Math.random() * 0.25,
        color: `${c.r},${c.g},${c.b}`,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.015,
      };
    });

    const onMove = (cx: number, cy: number) => { mouseRef.current = { x: cx, y: cy }; };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => { const t = e.touches[0]; if (t) onMove(t.clientX, t.clientY); };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onLeave);
    window.addEventListener("mouseleave", onLeave);

    let t = 0;
    const draw = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const orbOffset1 = Math.sin(t * 0.003) * 30;
      const orbOffset2 = Math.cos(t * 0.0025) * 25;

      const g1 = ctx.createRadialGradient(
        canvas.width * 0.82 + orbOffset1, canvas.height * 0.08 + orbOffset1 * 0.5, 0,
        canvas.width * 0.82 + orbOffset1, canvas.height * 0.08 + orbOffset1 * 0.5, canvas.width * 0.45,
      );
      const mi1 = Math.max(0, 1 - Math.hypot(mx - canvas.width * 0.82, my - canvas.height * 0.08) / (canvas.width * 0.6));
      g1.addColorStop(0, `rgba(${pc.r},${pc.g},${pc.b},${0.18 + mi1 * 0.12})`);
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const g2 = ctx.createRadialGradient(
        canvas.width * 0.1 + orbOffset2, canvas.height * 0.88 + orbOffset2 * 0.5, 0,
        canvas.width * 0.1 + orbOffset2, canvas.height * 0.88 + orbOffset2 * 0.5, canvas.width * 0.38,
      );
      const mi2 = Math.max(0, 1 - Math.hypot(mx - canvas.width * 0.1, my - canvas.height * 0.88) / (canvas.width * 0.6));
      g2.addColorStop(0, `rgba(${sc.r},${sc.g},${sc.b},${0.10 + mi2 * 0.08})`);
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
          p.vx += (dx / dist) * force * 0.4;
          p.vy += (dy / dist) * force * 0.4;
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += p.pulseSpeed;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
        const pulseOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulsePhase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${pulseOpacity})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onLeave);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [primaryColor, secondaryColor, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
