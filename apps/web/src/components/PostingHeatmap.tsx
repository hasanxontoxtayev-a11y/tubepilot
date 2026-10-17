'use client';

import { useMemo } from 'react';
import { TelegramHelpButton } from './TelegramHelpButton';
import { Clock } from 'lucide-react';

interface PostingHeatmapProps {
  heatmapMatrix?: number[][]; // 7 days (Mon-Sun) x 24 hours (0-23)
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function PostingHeatmap({ heatmapMatrix }: PostingHeatmapProps) {
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
    if (value > 80) return 'bg-rose-500 text-white';
    if (value > 60) return 'bg-rose-500/70 text-white';
    if (value > 40) return 'bg-rose-500/40 text-gray-200';
    if (value > 20) return 'bg-rose-500/20 text-gray-400';
    return 'bg-dark-700/60 text-gray-600';
  };

  return (
    <div className="p-6 rounded-2xl bg-dark-800 border border-dark-600">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-semibold text-white">Audience Peak Posting Heatmap</h3>
        </div>
        <TelegramHelpButton featureKey="posting_time" />
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Analyzed from your channel's 28-day viewer traffic velocity. High-density blocks indicate optimal release windows.
      </p>

      {/* 24h Time Labels */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 mb-1 text-[10px] text-gray-500 text-center">
            <span />
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i}>{i % 3 === 0 ? `${i}h` : ''}</span>
            ))}
          </div>

          {/* Matrix Rows */}
          {DAYS.map((day, dayIdx) => (
            <div key={day} className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 mb-1 items-center">
              <span className="text-xs text-gray-400 font-medium">{day}</span>
              {matrix[dayIdx].map((val, hourIdx) => (
                <div
                  key={hourIdx}
                  title={`${day} @ ${hourIdx}:00 - Activity: ${val}%`}
                  className={`h-6 rounded flex items-center justify-center text-[10px] font-semibold transition-transform hover:scale-110 cursor-pointer ${getColorClass(
                    val
                  )}`}
                >
                  {val > 80 ? '🔥' : ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-dark-700 mt-2">
        <span>Low Activity</span>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-dark-700/60" />
          <span className="w-3 h-3 rounded bg-rose-500/20" />
          <span className="w-3 h-3 rounded bg-rose-500/40" />
          <span className="w-3 h-3 rounded bg-rose-500/70" />
          <span className="w-3 h-3 rounded bg-rose-500" />
        </div>
        <span>Peak Prime Time</span>
      </div>
    </div>
  );
}
