'use client';

import React, { useEffect, useRef } from 'react';

export function AmbientBackgroundMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

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

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic glowing cyber neon particles (Indigo, Purple, Cyan, Gold)
    const colors = [
      'rgba(99, 102, 241,', // Indigo
      'rgba(168, 85, 247,', // Purple
      'rgba(6, 182, 212,',  // Cyan
      'rgba(236, 72, 153,', // Pink
      'rgba(245, 158, 11,', // Amber
    ];

    const particleCount = 65;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      originX: Math.random() * width,
      originY: Math.random() * height,
      size: Math.random() * 2.8 + 1.2,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.35,
      baseOpacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Draw cursor interactive glow spotlight
      if (mx > 0 && my > 0) {
        const radGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
        radGlow.addColorStop(0, 'rgba(129, 140, 248, 0.18)');
        radGlow.addColorStop(0.5, 'rgba(192, 132, 252, 0.08)');
        radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // Render & interact particles with cursor
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulse += 0.025;

        // Mouse repelling/attraction physics
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 0) {
          const force = (180 - dist) / 180;
          p.x += (dx / dist) * force * 3.5;
          p.y += (dy / dist) * force * 3.5;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const currentOpacity = p.baseOpacity + Math.sin(p.pulse) * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${Math.max(0.1, currentOpacity)})`;
        ctx.shadowColor = p.color.replace('rgba(', 'rgb(').slice(0, -1);
        ctx.shadowBlur = 12;
        ctx.fill();
      }

      // Draw subtle connecting constellation lines near cursor
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 95) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - d / 95)})`;
            ctx.lineWidth = 0.6;
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
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* 1. FinTech Multi-Layered Aurora Glow Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] bg-indigo-600/22 rounded-full blur-[140px] animate-float-slow" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/20 rounded-full blur-[160px] animate-float-delayed" />
      <div className="absolute top-[30%] right-[15%] w-[45vw] h-[45vw] bg-cyan-500/18 rounded-full blur-[130px] animate-pulse-slow" />
      <div className="absolute top-[65%] left-[8%] w-[40vw] h-[40vw] bg-pink-500/15 rounded-full blur-[140px] animate-float-slow" />

      {/* 2. Cyber Mesh Grid Line Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 3. HTML5 Canvas Interactive Constellation & Mouse Magnet Particle Engine */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
