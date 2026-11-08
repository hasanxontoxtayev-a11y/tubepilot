'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function TubePilotLogo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeMap = {
    sm: { box: 'w-8 h-8', icon: 32, text: 'text-base', badge: 'text-[9px] px-1.5 py-0.2' },
    md: { box: 'w-11 h-11', icon: 44, text: 'text-xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { box: 'w-16 h-16', icon: 64, text: 'text-3xl', badge: 'text-xs px-2.5 py-1' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* 3D Futuristic Holographic Logo Symbol */}
      <div className={`relative ${currentSize.box} flex items-center justify-center flex-shrink-0`}>
        {/* Ambient Outer Electric Cyan & Blue Aura */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/50 via-blue-600/40 to-indigo-500/50 blur-md group-hover:blur-lg transition-all duration-500 opacity-90 group-hover:opacity-100 animate-pulse" />

        {/* Orbiting Cyber Ring */}
        <div className="absolute -inset-1 rounded-2xl border border-cyan-400/40 border-dashed animate-[spin_10s_linear_infinite] pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity" />

        {/* Core Container */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#0c1427] via-[#070b14] to-[#04060a] p-[1.5px] shadow-2xl shadow-cyan-950/90 border border-cyan-500/40 group-hover:border-cyan-300 transition-all duration-300 overflow-hidden">
          {/* Inner Shimmer Reflection Sweep */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

          {/* SVG: Quantum Play Triangle + Pilot Jet Wings in Vibrant Cyan / Electric Indigo */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-1.5 drop-shadow-[0_2px_10px_rgba(6,182,212,0.8)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Electric Jet Gradient */}
              <linearGradient id="jetGrad" x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="#a5f3fc" />
                <stop offset="40%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>

              {/* Quantum Play Core Gradient */}
              <linearGradient id="coreGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              {/* Cyber Wing Gradient */}
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Jet Wing Left */}
            <path
              d="M 50 16 L 22 58 C 20 62 25 66 30 64 L 46 58 Z"
              fill="url(#wingGrad)"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="group-hover:opacity-90 transition-opacity"
            />

            {/* Jet Wing Right */}
            <path
              d="M 50 16 L 78 58 C 80 62 75 66 70 64 L 54 58 Z"
              fill="url(#wingGrad)"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="group-hover:opacity-90 transition-opacity"
            />

            {/* Central Supersonic Jet Fuselage & YouTube Play Core */}
            <path
              d="M 50 12 L 68 50 L 50 86 L 32 50 Z"
              fill="url(#jetGrad)"
              className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]"
            />

            {/* YouTube Play Icon Embedded in Cockpit / Quantum Core */}
            <polygon
              points="45,40 45,60 62,50"
              fill="url(#coreGrad)"
              className="drop-shadow-[0_0_6px_rgba(255,255,255,1)] group-hover:scale-110 origin-center transition-transform"
            />

            {/* Trailing Quantum Thruster Particles */}
            <circle cx="50" cy="88" r="2.5" fill="#67e8f9" className="animate-ping" style={{ animationDuration: '2s' }} />
            <circle cx="50" cy="94" r="1.5" fill="#06b6d4" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight ${currentSize.text} leading-none`}>
              <span className="text-white drop-shadow-md font-extrabold tracking-tight">Tube</span>
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent font-black tracking-tight ml-0.5 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                Pilot
              </span>
            </span>
            <span
              className={`rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 text-cyan-300 font-black border border-cyan-400/40 uppercase tracking-widest shadow-sm ${currentSize.badge} flex items-center gap-1.5`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI PRO
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5 hidden sm:block">
            YouTube Growth Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
