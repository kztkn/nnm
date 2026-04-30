"use client";

import { useEffect, useState } from "react";
import { loadDayState, saveCompleted, type DayState } from "@/lib/missions";
import MissionCard from "@/components/MissionCard";

export default function Home() {
  const [state, setState] = useState<DayState | null>(null);

  useEffect(() => {
    setState(loadDayState());
  }, []);

  function toggleMission(id: number) {
    if (!state) return;
    const next = saveCompleted(id, state.completed);
    setState({ ...state, completed: next });
  }

  const allDone =
    state ? state.missions.every((m) => state.completed.includes(m.id)) : false;

  const today = new Date();
  const dateLabel = today.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-md mb-12">
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

      <div className="w-full max-w-md flex flex-col gap-3">
        {state ? (
          state.missions.map((mission, i) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              index={i}
              completed={state.completed.includes(mission.id)}
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

      {allDone && (
        <div className="mt-12 text-center">
          <p className="text-[13px] tracking-[0.15em] text-[#6b8eff]/80 uppercase">
            mission complete
          </p>
          <p className="text-white/30 text-xs mt-2">
            今日もnon normaleだった
          </p>
        </div>
      )}

      <div className="mt-auto pt-16 text-[10px] text-white/15 tracking-widest uppercase">
        nnm
      </div>
    </main>
  );
}
