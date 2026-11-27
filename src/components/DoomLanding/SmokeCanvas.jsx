import React, { useEffect, useRef } from "react";

// Démonstration Canvas 2D autonome : pas le moteur WebGL de CSSScript.
// Des particules semi-transparentes s'étirent en volutes sous le curseur.
export default function SmokeCanvas({ stageRef, intensity, enabled }) {
  const canvasRef = useRef(null);
  const settingsRef = useRef({ intensity, enabled });

  useEffect(() => {
    settingsRef.current = { intensity, enabled };
  }, [intensity, enabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 1;
    let height = 1;
    let frame = 0;
    let last = 0;
    let raf = 0;
    const smoke = [];
    const pointer = { x: 0, y: 0, px: 0, py: 0, active: false, moved: false };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pointer.x = width * 0.42;
      pointer.y = height * 0.48;
    };

    const addPuff = (x, y, dx = 0, dy = 0, strength = 1) => {
      if (smoke.length >= 230) smoke.shift();
      const size = 20 + Math.random() * 45;
      smoke.push({
        x: x + (Math.random() - 0.5) * 28,
        y: y + (Math.random() - 0.5) * 28,
        vx: dx * 0.12 + (Math.random() - 0.5) * 1.45,
        vy: dy * 0.12 - 0.25 - Math.random() * 1.05,
        life: 0,
        maxLife: 60 + Math.random() * 65,
        size,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.012,
        seed: Math.random() * 1000,
        strength,
      });
    };

    const onMove = (event) => {
      const rect = stage.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
      pointer.moved = true;
      if (settingsRef.current.enabled) {
        const count = Math.min(
          7,
          Math.max(2, Math.floor(Math.hypot(dx, dy) / 11)),
        );
        for (let i = 0; i < count; i++) {
          const t = count <= 1 ? 1 : i / (count - 1);
          addPuff(pointer.px + dx * t, pointer.py + dy * t, dx, dy, 1);
        }
      }
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (event) => {
      onMove(event);
      if (settingsRef.current.enabled) {
        for (let i = 0; i < 13; i++) addPuff(pointer.x, pointer.y, 0, 0, 1.25);
      }
    };

    const draw = (time) => {
      raf = window.requestAnimationFrame(draw);
      if (time - last < 1000 / 45) return;
      last = time;
      frame++;
      ctx.clearRect(0, 0, width, height);
      if (!settingsRef.current.enabled) {
        smoke.length = 0;
        return;
      }

      // Une légère brume autonome, même sans souris, autour de Doom.
      if (frame % 3 === 0) {
        addPuff(
          width * (0.3 + Math.random() * 0.28),
          height * (0.64 + Math.random() * 0.18),
          0,
          0,
          0.28,
        );
      }
      const alpha = settingsRef.current.intensity / 100;
      ctx.globalCompositeOperation = "screen";
      for (let i = smoke.length - 1; i >= 0; i--) {
        const p = smoke[i];
        p.life++;
        if (p.life > p.maxLife) {
          smoke.splice(i, 1);
          continue;
        }
        const age = p.life / p.maxLife;
        p.vx *= 0.986;
        p.vy -= 0.003;
        p.x += p.vx + Math.sin(p.life * 0.058 + p.seed) * 0.68;
        p.y += p.vy;
        p.rotation += p.spin;
        const r = p.size * (1 + age * 2.4);
        const opacity =
          Math.pow(1 - age, 1.45) *
          Math.min(1, age * 8) *
          0.22 *
          alpha *
          p.strength;
        const green = 140 + Math.round(45 * (1 - age));
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        glow.addColorStop(0, `rgba(59,${green},86,${opacity})`);
        glow.addColorStop(0.28, `rgba(45,133,67,${opacity * 0.67})`);
        glow.addColorStop(0.64, `rgba(20,88,42,${opacity * 0.3})`);
        glow.addColorStop(1, "rgba(12,65,33,0)");
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1.35, 0.76);
        ctx.translate(-p.x, -p.y);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointerdown", onDown);
    raf = window.requestAnimationFrame(draw);
    return () => {
      observer.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointerdown", onDown);
      window.cancelAnimationFrame(raf);
    };
  }, [stageRef]);

  return <canvas className="smoke-canvas" ref={canvasRef} aria-hidden="true" />;
}
