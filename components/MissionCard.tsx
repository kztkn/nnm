"use client";

import { Mission } from "@/lib/missions";
import { shareMission } from "@/lib/share";

type Props = {
  mission: Mission;
  index: number;
  completed: boolean;
  streak: number;
  onToggle: (id: number) => void;
};

export default function MissionCard({ mission, index, completed, streak, onToggle }: Props) {
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
      {mission.isRare && (
        <span className="absolute -top-px left-6 text-[10px] tracking-[0.2em] text-[#6b8eff] uppercase font-medium">
          rare
        </span>
      )}

      <div className="flex items-center gap-4">
        <span className="text-[11px] text-white/20 font-mono w-4 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>

        <p
          className={`flex-1 text-[15px] leading-relaxed transition-all duration-300 ${
            completed ? "text-white/30 line-through" : "text-white/80"
          }`}
        >
          {mission.text}
        </p>

        {/* シェアボタン（完了時のみ） */}
        {completed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              shareMission(mission.text, streak);
            }}
            className="shrink-0 w-7 h-7 rounded-full border border-[#6b8eff]/30 bg-[#6b8eff]/10 flex items-center justify-center hover:bg-[#6b8eff]/20 transition-all duration-200"
            title="シェアする"
          >
            <svg className="w-3 h-3 text-[#6b8eff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.246 14.488 7 15.5 7 15.5m0 0s-1 1-2 0m2 0l2-2m6.316-9.842C16.754 2.512 18 3.5 18 3.5m0 0s1-1 2 0m-2 0l-2 2M5 12H3m18 0h-2M12 5V3m0 18v-2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6" />
            </svg>
          </button>
        )}

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
