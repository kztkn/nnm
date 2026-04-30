"use client";

import { useState } from "react";
import { type HistoryState } from "@/lib/missions";

type Props = {
  history: HistoryState;
};

const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export default function HistoryCalendar({ history }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const canGoNext = !isSameMonth(currentMonth, today);

  function prevMonth() {
    setCurrentMonth((m) => {
      const d = new Date(m);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
    setSelectedDate(null);
  }

  function nextMonth() {
    if (!canGoNext) return;
    setCurrentMonth((m) => {
      const d = new Date(m);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
    setSelectedDate(null);
  }

  // 月の全日セルを生成（先頭の空白含む）
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=日
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // セル配列：先頭 firstDay 個は null（空白）
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // 7の倍数になるよう末尾パディング
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = `${year}年${month + 1}月`;

  function handleDayClick(day: number) {
    const d = new Date(year, month, day);
    const dateStr = toDateStr(d);
    const entry = history[dateStr];
    if (!entry) return; // 未達成は無視
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  }

  const selectedEntry = selectedDate ? history[selectedDate] : null;

  const selectedLabel = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("ja-JP", {
        month: "long",
        day: "numeric",
        weekday: "short",
      })
    : null;

  return (
    <div className="w-full max-w-md mt-12">
      <p className="text-[10px] tracking-[0.25em] text-white/25 uppercase mb-4">history</p>

      {/* 月ナビゲーション */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
        >
          ‹
        </button>
        <span className="text-[13px] text-white/50 tracking-wide">{monthLabel}</span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className={`w-7 h-7 flex items-center justify-center transition-colors ${canGoNext ? "text-white/40 hover:text-white/70" : "text-white/10 cursor-default"}`}
        >
          ›
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((label, i) => (
          <div key={i} className="flex items-center justify-center">
            <span className={`text-[10px] ${i === 0 ? "text-white/20" : i === 6 ? "text-white/20" : "text-white/25"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;

          const d = new Date(year, month, day);
          const dateStr = toDateStr(d);
          const achieved = !!history[dateStr];
          const isToday = d.getTime() === today.getTime();
          const isFuture = d.getTime() > today.getTime();
          const isSelected = selectedDate === dateStr;

          return (
            <div key={i} className="flex items-center justify-center py-0.5">
              <button
                onClick={() => !isFuture && handleDayClick(day)}
                disabled={isFuture || !achieved}
                className={[
                  "w-9 h-9 rounded-lg text-[12px] flex items-center justify-center transition-all duration-150",
                  achieved
                    ? isSelected
                      ? "bg-[#5570ff] text-white"
                      : "bg-[#3b4fd4] text-white/90 hover:bg-[#4a5ee0] active:scale-95 cursor-pointer"
                    : isFuture
                    ? "text-white/10 cursor-default"
                    : "bg-white/[0.04] text-white/25 cursor-default",
                  isToday && !achieved ? "ring-1 ring-[#6b8eff]/40" : "",
                  isToday && achieved ? "ring-1 ring-[#8aa0ff]/60" : "",
                ].join(" ")}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>

      {/* 詳細パネル */}
      {selectedEntry && selectedLabel && (
        <div className="mt-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <p className="text-[11px] text-white/40 tracking-wide mb-2">{selectedLabel}</p>
          {selectedEntry === true ? (
            <p className="text-[11px] text-white/25 italic">記録なし（アップデート前のデータ）</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {selectedEntry.map((text, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#6b8eff]/50 text-[11px] mt-0.5">•</span>
                  <span className="text-[12px] text-white/60 leading-snug">{text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
