'use client';

import React, { useEffect, useState } from 'react';

// Stages in scroll morphing:
// 0: Star ⭐ (Electric Cyan Spark)
// 1: Bell 🔔 (YouTube Notification Bell)
// 2: Like 👍 (Thumbs Up)
// 3: YouTube ▶️ (Play & Subscribe Badge)

export function AmbientBackgroundMesh() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Every 320px scroll steps through: Star -> Bell -> Like -> YouTube
          const currentStage = Math.floor(scrollY / 300) % 4;
          setStage(currentStage);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* 
        Ultra-High-Performance Hardware-Accelerated Floating Icons in FRONT (Foreground overlay)
        Fixed on screen edges (left and right margins), completely pointer-events-none so all buttons remain clickable.
      */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {/* Floating Item 1: Top Left */}
        <div className="absolute top-28 left-6 sm:left-12 transition-all duration-700 ease-out transform animate-[float_6s_ease-in-out_infinite]">
          <DynamicIcon stage={stage} delay="0s" size="w-12 h-12" />
        </div>

        {/* Floating Item 2: Top Right */}
        <div className="absolute top-44 right-6 sm:right-14 transition-all duration-700 ease-out transform animate-[float_7s_ease-in-out_infinite_1s]">
          <DynamicIcon stage={(stage + 1) % 4} delay="0.5s" size="w-14 h-14" />
        </div>

        {/* Floating Item 3: Center Left */}
        <div className="absolute top-[48%] left-4 sm:left-10 transition-all duration-700 ease-out transform animate-[float_6.5s_ease-in-out_infinite_2s]">
          <DynamicIcon stage={(stage + 2) % 4} delay="1s" size="w-11 h-11" />
        </div>

        {/* Floating Item 4: Center Right */}
        <div className="absolute top-[58%] right-4 sm:right-12 transition-all duration-700 ease-out transform animate-[float_8s_ease-in-out_infinite_1.5s]">
          <DynamicIcon stage={(stage + 3) % 4} delay="1.5s" size="w-13 h-13" />
        </div>

        {/* Floating Item 5: Bottom Left */}
        <div className="absolute bottom-24 left-8 sm:left-16 transition-all duration-700 ease-out transform animate-[float_7.5s_ease-in-out_infinite_0.5s]">
          <DynamicIcon stage={stage} delay="2s" size="w-12 h-12" />
        </div>

        {/* Floating Item 6: Bottom Right */}
        <div className="absolute bottom-28 right-8 sm:right-20 transition-all duration-700 ease-out transform animate-[float_6s_ease-in-out_infinite_2.5s]">
          <DynamicIcon stage={(stage + 1) % 4} delay="2.5s" size="w-14 h-14" />
        </div>
      </div>

      {/* Lightweight Ambient Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>
    </>
  );
}

// Single Hardware-Accelerated SVG Morph Component
function DynamicIcon({ stage, size }: { stage: number; delay?: string; size: string }) {
  return (
    <div
      className={`relative ${size} flex items-center justify-center transition-transform duration-500 hover:scale-125`}
    >
      {/* STAGE 0: Glowing Star ⭐ */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
          stage === 0 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-45 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-cyan-400/20 blur-lg rounded-full" />
        <svg viewBox="0 0 24 24" className="w-full h-full fill-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      {/* STAGE 1: YouTube Notification Bell 🔔 */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
          stage === 1 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-amber-400/25 blur-lg rounded-full" />
        <svg viewBox="0 0 24 24" className="w-full h-full fill-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.9)]">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
      </div>

      {/* STAGE 2: YouTube Like Thumbs Up 👍 */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
          stage === 2 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-blue-500/25 blur-lg rounded-full" />
        <svg viewBox="0 0 24 24" className="w-full h-full fill-blue-400 drop-shadow-[0_0_14px_rgba(59,130,246,0.9)]">
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
        </svg>
      </div>

      {/* STAGE 3: YouTube Subscribe / Play Badge ▶️ */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
          stage === 3 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-red-600/30 blur-lg rounded-full" />
        <svg viewBox="0 0 24 24" className="w-full h-full fill-red-600 drop-shadow-[0_0_14px_rgba(239,68,68,0.9)]">
          <path d="M21.58 7.19a2.506 2.506 0 0 0-1.76-1.77C18.26 5 12 5 12 5s-6.26 0-7.82.42c-.87.24-1.54.91-1.78 1.77C2 8.75 2 12 2 12s0 3.25.4 4.81c.24.86.91 1.53 1.78 1.77C5.74 19 12 19 12 19s6.26 0 7.82-.42c.87-.24 1.52-.91 1.76-1.77.42-1.56.42-4.81.42-4.81s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z" />
        </svg>
      </div>
    </div>
  );
}
