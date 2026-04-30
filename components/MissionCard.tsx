"use client";

import { Mission } from "@/lib/missions";

type Props = {
  mission: Mission;
  index: number;
  completed: boolean;
  onToggle: (id: number) => void;
};

export default function MissionCard({ mission, index, completed, onToggle }: Props) {
  return (
    <div
      className={`
        relative group cursor-pointer select-none
        rounded-2xl border px-6 py-5 transition-all duration-300
        ${completed
          ? "bg-[#1a1f2e] border-[#3b4fd4]/60"
          : "bg-[#111318] border-white/[0.06] hover:border-white/[0.12]"
        }
      `}
      onClick={() => onToggle(mission.id)}
    >
      {/* レア帯 */}
      {mission.isRare && (
        <span className="absolute -top-px left-6 text-[10px] tracking-[0.2em] text-[#6b8eff] uppercase font-medium">
          rare
        </span>
      )}

      <div className="flex items-center gap-4">
        {/* インデックス番号 */}
        <span className="text-[11px] text-white/20 font-mono w-4 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* ミッション本文 */}
        <p
          className={`flex-1 text-[15px] leading-relaxed transition-all duration-300 ${
            completed ? "text-white/30 line-through" : "text-white/80"
          }`}
        >
          {mission.text}
        </p>

        {/* チェックボタン */}
        <div
          className={`
            shrink-0 w-7 h-7 rounded-full border flex items-center justify-center
            transition-all duration-300
            ${completed
              ? "bg-[#3b4fd4] border-[#3b4fd4] scale-100"
              : "border-white/20 group-hover:border-white/40 scale-95"
            }
          `}
        >
          {completed && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
