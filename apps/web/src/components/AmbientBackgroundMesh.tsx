'use client';

import React, { useEffect, useRef } from 'react';

type ShapeType = 'star' | 'bell' | 'like' | 'youtube';

interface FloatingIcon {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  floatSpeed: number;
  floatOffset: number;
  driftX: number;
  driftY: number;
  rotation: number;
  rotSpeed: number;
  stage: number; // 0: star, 1: bell, 2: like, 3: youtube
}

export function AmbientBackgroundMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollYRef = useRef(0);
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    // Create 32 dynamic floating particles distributed nicely
    const iconCount = Math.max(22, Math.min(38, Math.floor(window.innerWidth / 50)));
    const icons: FloatingIcon[] = Array.from({ length: iconCount }, (_, i) => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 12 + 18, // 18px to 30px - clearly visible!
        floatSpeed: Math.random() * 0.0015 + 0.0008,
        floatOffset: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.35,
        driftY: (Math.random() - 0.5) * 0.35,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        stage: 0,
      };
    });

    // Drawing Primitives for each Morph State:
    // 1. STAR ⭐ (Electric Cyan & Sapphire Glow)
    const renderStar = (ctx: CanvasRenderingContext2D, size: number, progress: number) => {
      const r = size;
      const points = 4;
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? r : r * 0.38;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Cyan to Sapphire Gradient
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
      grad.addColorStop(0, '#e0f2fe');
      grad.addColorStop(0.5, '#38bdf8');
      grad.addColorStop(1, '#0284c7');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 16;
      ctx.fill();

      // Inner Diamond Core
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.fill();
    };

    // 2. BELL 🔔 (Notification Gold / Amber Glow)
    const renderBell = (ctx: CanvasRenderingContext2D, size: number) => {
      const s = size * 0.85;
      ctx.save();
      ctx.beginPath();
      // Bell dome
      ctx.moveTo(-s * 0.55, s * 0.4);
      ctx.quadraticCurveTo(-s * 0.5, -s * 0.4, 0, -s * 0.65);
      ctx.quadraticCurveTo(s * 0.5, -s * 0.4, s * 0.55, s * 0.4);
      // Bell bottom flare
      ctx.lineTo(s * 0.7, s * 0.55);
      ctx.lineTo(-s * 0.7, s * 0.55);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, -s * 0.65, 0, s * 0.55);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(1, '#d97706');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 18;
      ctx.fill();

      // Clapper
      ctx.beginPath();
      ctx.arc(0, s * 0.7, s * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#fde68a';
      ctx.fill();

      // Top tiny loop
      ctx.beginPath();
      ctx.arc(0, -s * 0.75, s * 0.12, 0, Math.PI * 2);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    };

    // 3. LIKE 👍 (Electric Blue Thumbs Up)
    const renderLike = (ctx: CanvasRenderingContext2D, size: number) => {
      const s = size * 0.8;
      ctx.save();
      ctx.translate(-s * 0.1, s * 0.1);

      // Main Hand / Thumb contour
      ctx.beginPath();
      // Wrist
      ctx.rect(-s * 0.6, -s * 0.1, s * 0.3, s * 0.7);
      const grad = ctx.createLinearGradient(0, -s * 0.6, 0, s * 0.6);
      grad.addColorStop(0, '#60a5fa');
      grad.addColorStop(1, '#2563eb');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 16;
      ctx.fill();

      // Hand body + Thumb
      ctx.beginPath();
      ctx.moveTo(-s * 0.2, s * 0.6);
      ctx.lineTo(s * 0.4, s * 0.6);
      ctx.quadraticCurveTo(s * 0.65, s * 0.6, s * 0.65, s * 0.35); // pinky
      ctx.lineTo(s * 0.65, -s * 0.05); // fingers
      ctx.quadraticCurveTo(s * 0.65, -s * 0.25, s * 0.4, -s * 0.25);
      // Thumb sticking up
      ctx.lineTo(s * 0.1, -s * 0.25);
      ctx.lineTo(0, -s * 0.7);
      ctx.quadraticCurveTo(-s * 0.05, -s * 0.85, -s * 0.25, -s * 0.75);
      ctx.lineTo(-s * 0.25, -s * 0.1);
      ctx.closePath();

      ctx.fillStyle = grad;
      ctx.shadowColor = '#60a5fa';
      ctx.shadowBlur = 14;
      ctx.fill();

      ctx.restore();
    };

    // 4. YOUTUBE / SUBSCRIBE ▶️ (Crisp YouTube Red Play Button)
    const renderYouTube = (ctx: CanvasRenderingContext2D, size: number) => {
      const w = size * 1.8;
      const h = size * 1.25;
      const r = 6;

      ctx.save();
      // Rounded Red YouTube Pill
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, r);
      const grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      grad.addColorStop(0, '#ff0000');
      grad.addColorStop(1, '#cc0000');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 20;
      ctx.fill();

      // White Centered Play Triangle
      const pw = w * 0.28;
      const ph = h * 0.36;
      ctx.beginPath();
      ctx.moveTo(-pw * 0.4, -ph);
      ctx.lineTo(pw * 0.7, 0);
      ctx.lineTo(-pw * 0.4, ph);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 4;
      ctx.fill();

      ctx.restore();
    };

    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Deep High-Tech Background Ambient Mesh Gradient
      const scrollProgress = scrollYRef.current;
      // Scroll state: every 300px changes the stage!
      // stage 0: Star ⭐
      // stage 1: Bell 🔔
      // stage 2: Like 👍
      // stage 3: YouTube ▶️
      const totalStageFloat = (scrollProgress / 280) % 4;
      const activeStage = Math.floor(totalStageFloat);
      const stageTransition = totalStageFloat - activeStage; // 0 -> 1 smooth blend

      // Draw subtle connective cyber mesh lines between nearby particles
      ctx.lineWidth = 0.6;
      for (let i = 0; i < icons.length; i++) {
        for (let j = i + 1; j < icons.length; j++) {
          const dx = icons[i].x - icons[j].x;
          const dy = icons[i].y - icons[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.18;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(icons[i].x, icons[i].y);
            ctx.lineTo(icons[j].x, icons[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and Draw Each Icon
      icons.forEach((icon, idx) => {
        // Floating sinusoidal movement
        icon.x += icon.driftX + Math.sin(time * icon.floatSpeed + icon.floatOffset) * 0.4;
        icon.y += icon.driftY + Math.cos(time * icon.floatSpeed + icon.floatOffset) * 0.4;
        icon.rotation += icon.rotSpeed;

        // Wrap around canvas screen borders
        if (icon.x < -40) icon.x = width + 40;
        if (icon.x > width + 40) icon.x = -40;
        if (icon.y < -40) icon.y = height + 40;
        if (icon.y > height + 40) icon.y = -40;

        // React to mouse proximity (gentle repelling magnet effect)
        const mx = mousePos.current.x;
        const my = mousePos.current.y;
        if (mx > 0 && my > 0) {
          const mdx = icon.x - mx;
          const mdy = icon.y - my;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140) {
            const force = (1 - mdist / 140) * 2.5;
            icon.x += (mdx / mdist) * force;
            icon.y += (mdy / mdist) * force;
          }
        }

        // Calculate icon-specific stage morph
        // Stagger slightly by particle index for natural organic cascading wave!
        const staggeredScroll = (scrollProgress + idx * 45) / 280;
        const currStage = Math.floor(staggeredScroll) % 4;
        const nextStage = (currStage + 1) % 4;
        const morphT = staggeredScroll % 1; // 0 to 1

        ctx.save();
        ctx.translate(icon.x, icon.y);
        ctx.rotate(icon.rotation);

        // Alpha / Scale pulse during morph
        const scale = 1 + Math.sin(time * 0.03 + idx) * 0.08;
        ctx.scale(scale, scale);

        // Render with smooth morphing crossfade:
        // Current Stage
        ctx.save();
        ctx.globalAlpha = Math.max(0.15, 1 - morphT * 0.85);
        if (currStage === 0) renderStar(ctx, icon.size, morphT);
        else if (currStage === 1) renderBell(ctx, icon.size);
        else if (currStage === 2) renderLike(ctx, icon.size);
        else renderYouTube(ctx, icon.size);
        ctx.restore();

        // Incoming Next Stage (blends in smoothly as you scroll)
        if (morphT > 0.08) {
          ctx.save();
          ctx.globalAlpha = Math.min(0.95, morphT * 1.1);
          if (nextStage === 0) renderStar(ctx, icon.size * (0.6 + morphT * 0.4), morphT);
          else if (nextStage === 1) renderBell(ctx, icon.size * (0.6 + morphT * 0.4));
          else if (nextStage === 2) renderLike(ctx, icon.size * (0.6 + morphT * 0.4));
          else renderYouTube(ctx, icon.size * (0.6 + morphT * 0.4));
          ctx.restore();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Background Dark Slate / Sapphire Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Cybernetic High-Tech Vignette Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
