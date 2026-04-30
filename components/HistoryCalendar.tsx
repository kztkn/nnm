"use client";

import { useMemo } from "react";
import { type HistoryState } from "@/lib/missions";

type Props = {
  history: HistoryState;
};

const COLS = 13; // weeks
const ROWS = 7;  // days per week

export default function HistoryCalendar({ history }: Props) {
  const { cells, monthLabels } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 今日を含む 91 日分。col=0が最も古い週
    const totalDays = COLS * ROWS;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (totalDays - 1));

    // 月ラベル：各列の最初のセルの月が変わるときだけ表示
    const months: { col: number; label: string }[] = [];
    const cells: { dateStr: string; achieved: boolean; isToday: boolean }[] = [];

    let prevMonth = -1;
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + col * ROWS + row);
        const dateStr = d.toISOString().slice(0, 10);
        cells.push({
          dateStr,
          achieved: !!history[dateStr],
          isToday: d.getTime() === today.getTime(),
        });
        if (row === 0 && d.getMonth() !== prevMonth) {
          months.push({ col, label: `${d.getMonth() + 1}月` });
          prevMonth = d.getMonth();
        }
      }
    }

    return { cells, monthLabels: months };
  }, [history]);

  const dayLabels = ["月", "", "水", "", "金", "", ""];

  return (
    <div className="w-full max-w-md mt-12">
      <p className="text-[10px] tracking-[0.25em] text-white/25 uppercase mb-4">history</p>

      <div className="flex gap-0.5">
        {/* 曜日ラベル列 */}
        <div className="flex flex-col gap-0.5 mr-1">
          {dayLabels.map((label, i) => (
            <div key={i} className="w-3 h-4 flex items-center justify-end">
              <span className="text-[8px] text-white/20 leading-none">{label}</span>
            </div>
          ))}
        </div>

        {/* グリッド本体 */}
        <div className="flex-1 overflow-hidden">
          {/* 月ラベル行 */}
          <div className="relative h-4 mb-0.5">
            {monthLabels.map(({ col, label }) => (
              <span
                key={col}
                className="absolute text-[8px] text-white/25 leading-none"
                style={{ left: `${(col / COLS) * 100}%` }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* セルグリッド（flex-row で週単位に並べる） */}
          <div className="flex gap-0.5">
            {Array.from({ length: COLS }).map((_, col) => (
              <div key={col} className="flex flex-col gap-0.5 flex-1">
                {Array.from({ length: ROWS }).map((_, row) => {
                  const cell = cells[col * ROWS + row];
                  if (!cell) return <div key={row} className="h-4" />;
                  return (
                    <div
                      key={row}
                      title={cell.dateStr}
                      className={[
                        "h-4 rounded-[2px] transition-colors",
                        cell.achieved
                          ? "bg-[#3b4fd4]"
                          : "bg-white/[0.04]",
                        cell.isToday
                          ? "ring-1 ring-[#6b8eff]/50"
                          : "",
                      ].join(" ")}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
