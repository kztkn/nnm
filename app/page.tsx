"use client";

import { useEffect, useState } from "react";
import { loadDayState, saveCompleted, loadStreak, updateStreak, type DayState, type StreakState } from "@/lib/missions";
import { shareAllDone } from "@/lib/share";
import MissionCard from "@/components/MissionCard";

export default function Home() {
  const [state, setState] = useState<DayState | null>(null);
  const [streak, setStreak] = useState<StreakState>({ current: 0, lastCompletedDate: "", max: 0 });

  useEffect(() => {
    setState(loadDayState());
    setStreak(loadStreak());
  }, []);

  function toggleMission(id: number) {
    if (!state) return;
    const next = saveCompleted(id, state.completed);
    const nextState = { ...state, completed: next };
    setState(nextState);

    const willBeAllDone = nextState.missions.every((m) => next.includes(m.id));
    if (willBeAllDone) {
      setStreak(updateStreak());
    }
  }

  const allDone = state ? state.missions.every((m) => state.completed.includes(m.id)) : false;

  const dateLabel = new Date().toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center px-4 py-16">

      {/* ヘッダー */}
      <div className="w-full max-w-md mb-12 flex items-start justify-between">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-white/25 uppercase mb-2">
            {dateLabel}
          </p>
          <h1 className="text-2xl font-light tracking-wider text-white/90">
            non normale
          </h1>
          <p className="text-[12px] text-white/30 mt-1 tracking-wide">
            今日の3ミッション
          </p>
        </div>

        {/* ストリーク */}
        {streak.current > 0 && (
          <div className="text-right">
            <p className="text-[10px] text-white/25 uppercase tracking-widest mb-0.5">streak</p>
            <p className="text-3xl font-light text-[#6b8eff] leading-none">
              {streak.current}
            </p>
            <p className="text-[9px] text-white/20 mt-1">max {streak.max}</p>
          </div>
        )}
      </div>

      {/* ミッションカード */}
      <div className="w-full max-w-md flex flex-col gap-3">
        {state ? (
          state.missions.map((mission, i) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              index={i}
              completed={state.completed.includes(mission.id)}
              streak={streak.current}
              onToggle={toggleMission}
            />
          ))
        ) : (
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#111318] border border-white/[0.06] h-[70px] animate-pulse"
            />
          ))
        )}
      </div>

      {/* 全達成 */}
      {allDone && (
        <div className="mt-12 text-center">
          <p className="text-[13px] tracking-[0.15em] text-[#6b8eff]/80 uppercase">
            mission complete
          </p>
          <p className="text-white/30 text-xs mt-2">
            今日もnon normaleだった
          </p>
          <button
            onClick={() => shareAllDone(streak.current)}
            className="mt-6 px-5 py-2 rounded-full border border-[#6b8eff]/30 text-[#6b8eff]/70 text-[12px] tracking-widest uppercase hover:border-[#6b8eff]/60 hover:text-[#6b8eff] transition-all duration-200"
          >
            share
          </button>
        </div>
      )}

      <div className="mt-auto pt-16 text-[10px] text-white/15 tracking-widest uppercase">
        nnm
      </div>
    </main>
  );
}
