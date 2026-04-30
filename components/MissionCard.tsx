"use client";

import { Mission } from "@/lib/missions";
import { shareMission } from "@/lib/share";

type Props = {
  mission: Mission;
  index: number;
  completed: boolean;
  streak: number;
  reloadCredits: number;
  onToggle: (id: number) => void;
  onReload: (index: number) => void;
};

export default function MissionCard({ mission, index, completed, streak, reloadCredits, onToggle, onReload }: Props) {
  const canReload = !completed && reloadCredits > 0;

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

      <div className="flex items-center gap-3">
        {/* リロードボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (canReload) onReload(index);
          }}
          className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200
            ${canReload
              ? "text-white/30 hover:text-white/60 hover:bg-white/5"
              : "text-white/10 cursor-default"
            }`}
          title={reloadCredits === 0 ? "広告で回復（近日）" : "別のミッションに変える"}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* ミッション本文 */}
        <p
          className={`flex-1 text-[15px] leading-relaxed transition-all duration-300 ${
            completed ? "text-white/30 line-through" : "text-white/80"
          }`}
        >
          {mission.text}
        </p>

        {/* シェアボタン（常時表示） */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            shareMission(mission.text, streak);
          }}
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200
            ${completed
              ? "border border-[#6b8eff]/30 bg-[#6b8eff]/10 hover:bg-[#6b8eff]/20 text-[#6b8eff]"
              : "border border-white/10 text-white/25 hover:border-white/25 hover:text-white/50"
            }`}
          title="シェアする"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </button>

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
