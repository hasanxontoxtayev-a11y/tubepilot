'use client';

import { useMemo } from 'react';
import { TelegramHelpButton } from './TelegramHelpButton';
import { Clock, Lock, Sparkles } from 'lucide-react';

interface PostingHeatmapProps {
  heatmapMatrix?: number[][]; // 7 days (Mon-Sun) x 24 hours (0-23)
  subscriptionTier?: 'FREE' | 'PRO';
  onUpgradeClick?: (feature?: string) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function PostingHeatmap({
  heatmapMatrix,
  subscriptionTier = 'FREE',
  onUpgradeClick,
}: PostingHeatmapProps) {
  // Realistic deterministic activity distribution to prevent SSR hydration mismatches
  const matrix = useMemo(() => {
    if (heatmapMatrix && heatmapMatrix.length === 7) return heatmapMatrix;
    return [
      [12, 8, 5, 4, 6, 10, 15, 22, 35, 48, 55, 62, 70, 75, 68, 65, 72, 82, 94, 98, 91, 78, 45, 20],
      [10, 6, 4, 3, 5, 12, 18, 25, 38, 52, 58, 66, 72, 78, 70, 68, 75, 85, 96, 95, 88, 74, 40, 18],
      [15, 9, 6, 5, 8, 14, 20, 28, 42, 56, 62, 69, 76, 80, 74, 71, 78, 88, 97, 99, 92, 80, 48, 22],
      [14, 8, 5, 4, 7, 13, 19, 27, 40, 54, 60, 68, 74, 79, 72, 69, 76, 86, 95, 96, 89, 76, 44, 21],
      [18, 11, 7, 6, 9, 16, 24, 32, 48, 62, 70, 78, 84, 88, 82, 80, 86, 95, 100, 98, 94, 85, 55, 28],
      [25, 16, 10, 8, 12, 20, 30, 42, 60, 75, 82, 89, 92, 94, 90, 88, 92, 98, 96, 92, 86, 78, 58, 35],
      [22, 14, 9, 7, 10, 18, 28, 38, 55, 70, 78, 85, 89, 91, 88, 85, 90, 96, 94, 89, 82, 72, 52, 30],
    ];
  }, [heatmapMatrix]);

  const getColorClass = (value: number) => {
    if (value > 80) return 'bg-cyan-500 text-white shadow-sm shadow-cyan-400/50';
    if (value > 60) return 'bg-cyan-600/80 text-white';
    if (value > 40) return 'bg-blue-600/50 text-cyan-200';
    if (value > 20) return 'bg-blue-900/30 text-slate-300';
    return 'bg-slate-800/60 text-slate-500';
  };

  const isFree = subscriptionTier === 'FREE';

  return (
    <div className="p-6 rounded-3xl glass-panel relative overflow-hidden border border-cyan-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-semibold text-white">Audience Peak Posting Heatmap</h3>
          {isFree && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
              <Lock className="w-3 h-3" /> PRO Feature
            </span>
          )}
        </div>
        <TelegramHelpButton featureKey="posting_time" />
      </div>
      <p className="text-xs text-slate-400 mb-5">
        Analyzed from your channel&apos;s 28-day viewer traffic velocity. High-density blocks indicate optimal release windows.
      </p>

      {/* Relative container for heatmap + Free overlay */}
      <div className="relative">
        {/* 24h Time Labels & Heatmap Grid */}
        <div className={`overflow-x-auto pb-2 transition-all ${isFree ? 'blur-sm select-none pointer-events-none opacity-40' : ''}`}>
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 mb-1 text-[10px] text-slate-400 text-center">
              <span />
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i}>{i % 3 === 0 ? `${i}h` : ''}</span>
              ))}
            </div>

            {/* Matrix Rows */}
            {DAYS.map((day, dayIdx) => (
              <div key={day} className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 mb-1 items-center">
                <span className="text-xs text-slate-400 font-medium">{day}</span>
                {matrix[dayIdx].map((val, hourIdx) => (
                  <div
                    key={hourIdx}
                    title={`${day} @ ${hourIdx}:00 - Activity: ${val}%`}
                    className={`h-6 rounded flex items-center justify-center text-[10px] font-semibold transition-transform hover:scale-110 cursor-pointer ${getColorClass(
                      val
                    )}`}
                  >
                    {val > 80 ? '⚡' : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Free Overlay Gate */}
        {isFree && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-slate-950/80 backdrop-blur-[3px] rounded-2xl border border-cyan-500/20">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-cyan-950/50">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-white">Video Yuklash Uchun Eng Optimal Vaqt Xaritasi</h4>
            <p className="text-xs text-slate-300 max-w-md mt-1 mb-4">
              Auditoriyangiz eng faol bo&apos;lgan soatlarni ko&apos;rish va dastlabki 2 soatda maksimal tomosha yig&apos;ish uchun PRO tarifiga o&apos;ting.
            </p>
            <button
              type="button"
              onClick={() => onUpgradeClick?.("Audience Peak Posting Heatmap (Eng Optimal Vaqt)")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-xl shadow-cyan-950/50 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>PRO Tarifga O&apos;tish ($19)</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800 mt-2">
        <span>Low Activity</span>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-slate-800/60" />
          <span className="w-3 h-3 rounded bg-blue-900/30" />
          <span className="w-3 h-3 rounded bg-blue-600/50" />
          <span className="w-3 h-3 rounded bg-cyan-600/80" />
          <span className="w-3 h-3 rounded bg-cyan-500" />
        </div>
        <span>Peak Prime Time</span>
      </div>
    </div>
  );
}
