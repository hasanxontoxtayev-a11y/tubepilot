'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  pulse: number;
  type: 'star' | 'youtube' | 'like' | 'bell';
  hue: number;
  baseAlpha: number;
  rotation: number;
  rotSpeed: number;
}

export function AmbientBackgroundMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const scrollHue = useRef(210); // Base electric blue
  const prevScrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.targetX = e.clientX;
      mousePos.current.targetY = e.clientY;
    };

    // When user scrolls up or down: dynamically change hue spectrum across stars and icons!
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const diff = currentScroll - prevScrollY.current;
      prevScrollY.current = currentScroll;
      // Cycle through electric hues: Blue -> Cyan -> Purple -> Gold -> Red
      scrollHue.current = (scrollHue.current + Math.abs(diff) * 0.45) % 360;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Helper functions to draw YouTube Brand Emoticons & Stars
    const drawStar = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos(((18 + i * 90) * Math.PI) / 180) * r, -Math.sin(((18 + i * 90) * Math.PI) / 180) * r);
        ctx.lineTo(Math.cos(((63 + i * 90) * Math.PI) / 180) * (r * 0.38), -Math.sin(((63 + i * 90) * Math.PI) / 180) * (r * 0.38));
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    };

    const drawYouTubeBadge = (x: number, y: number, r: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      // YouTube rounded red play rectangle
      const w = r * 2.2;
      const h = r * 1.5;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 4);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
      ctx.fill();

      // White inner play triangle
      ctx.beginPath();
      ctx.moveTo(-w * 0.18, -h * 0.28);
      ctx.lineTo(w * 0.24, 0);
      ctx.lineTo(-w * 0.18, h * 0.28);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    };

    const drawLikeHand = (x: number, y: number, r: number, color: string, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.font = `${Math.round(r * 2.2)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fillText('👍', 0, 0);
      ctx.restore();
    };

    const drawBellIcon = (x: number, y: number, r: number, color: string, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.font = `${Math.round(r * 2.2)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.fillText('🔔', 0, 0);
      ctx.restore();
    };

    // Initialize 60 floating elements (YouTube logos, stars, thumbs-up, bells)
    const particleCount = 60;
    const types: ('star' | 'youtube' | 'like' | 'bell')[] = [
      'star', 'star', 'star', 'star', 'star',
      'youtube', 'youtube',
      'like', 'bell'
    ];

    const particles: Particle[] = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 5 + 3,
      speedY: Math.random() * 0.35 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      pulse: Math.random() * Math.PI,
      type: types[Math.floor(Math.random() * types.length)],
      hue: Math.floor(Math.random() * 360),
      baseAlpha: Math.random() * 0.4 + 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Cursor magnetic spotlight with scrolling dynamic color
      if (mx > 0 && my > 0) {
        const radGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 320);
        radGlow.addColorStop(0, `hsla(${scrollHue.current}, 85%, 65%, 0.16)`);
        radGlow.addColorStop(0.5, `hsla(${(scrollHue.current + 40) % 360}, 80%, 55%, 0.06)`);
        radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw all interactive particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulse += 0.03;
        p.rotation += p.rotSpeed;

        // Mouse repelling physics
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160 && dist > 0) {
          const force = (160 - dist) / 160;
          p.x += (dx / dist) * force * 4.5;
          p.y += (dy / dist) * force * 4.5;
        }

        if (p.y < -30) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        // Dynamic color combined with scroll hue
        const dynamicHue = (p.hue + scrollHue.current) % 360;
        const currentAlpha = Math.max(0.15, p.baseAlpha + Math.sin(p.pulse) * 0.25);
        const glowColor = `hsla(${dynamicHue}, 90%, 65%, ${currentAlpha})`;

        if (p.type === 'youtube') {
          drawYouTubeBadge(p.x, p.y, p.size * 1.8, p.rotation);
        } else if (p.type === 'like') {
          drawLikeHand(p.x, p.y, p.size * 1.4, glowColor, p.rotation);
        } else if (p.type === 'bell') {
          drawBellIcon(p.x, p.y, p.size * 1.4, glowColor, p.rotation);
        } else {
          drawStar(p.x, p.y, p.size * 1.6, glowColor, currentAlpha);
        }
      }

      // Constellation neon lines between close stars
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(${scrollHue.current}, 75%, 65%, ${0.12 * (1 - d / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* 1. Deep Cyber Multi-Layered Neon Aura Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] bg-blue-600/20 rounded-full blur-[140px] animate-float-slow" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-cyan-600/18 rounded-full blur-[160px] animate-float-delayed" />
      <div className="absolute top-[35%] right-[15%] w-[45vw] h-[45vw] bg-indigo-600/18 rounded-full blur-[130px] animate-pulse-slow" />
      <div className="absolute top-[70%] left-[8%] w-[40vw] h-[40vw] bg-rose-600/15 rounded-full blur-[140px] animate-float-slow" />

      {/* 2. Cyber Mesh Grid Line Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 3. HTML5 Canvas Star, YouTube Logo, Bell & Thumb Particle Engine */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
