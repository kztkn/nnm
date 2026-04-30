import missionsData from "@/data/missions.json";

export type Mission = {
  id: number;
  text: string;
  isRare?: boolean;
};

export type DayState = {
  date: string;
  missions: Mission[];
  completed: number[];
  reloadCredits: number;
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function dateToSeed(dateStr: string): number {
  return dateStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 31;
}

export function getTodayMissions(): Mission[] {
  const today = new Date().toISOString().slice(0, 10);
  const rand = seededRandom(dateToSeed(today));

  const normal = [...missionsData.normal];
  const rare = [...missionsData.rare];

  // shuffle normal
  for (let i = normal.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [normal[i], normal[j]] = [normal[j], normal[i]];
  }

  // 7日に1回レアが混入（日付の数値で判定）
  const dayNum = parseInt(today.replace(/-/g, ""), 10);
  const includeRare = dayNum % 7 === 0;

  if (includeRare) {
    const rareIndex = Math.floor(rand() * rare.length);
    return [
      { ...normal[0] },
      { ...normal[1] },
      { ...rare[rareIndex], isRare: true },
    ];
  }

  return [{ ...normal[0] }, { ...normal[1] }, { ...normal[2] }];
}

export function loadDayState(): DayState {
  const today = new Date().toISOString().slice(0, 10);

  if (typeof window === "undefined") {
    return { date: today, missions: getTodayMissions(), completed: [], reloadCredits: 3 };
  }

  const stored = localStorage.getItem("nnm_day");
  if (stored) {
    const parsed: DayState = JSON.parse(stored);
    if (parsed.date === today) {
      // 既存データに reloadCredits がなければ補完
      if (parsed.reloadCredits === undefined) parsed.reloadCredits = 3;
      return parsed;
    }
  }

  const fresh: DayState = {
    date: today,
    missions: getTodayMissions(),
    completed: [],
    reloadCredits: 3,
  };
  localStorage.setItem("nnm_day", JSON.stringify(fresh));
  return fresh;
}

export type StreakState = {
  current: number;
  lastCompletedDate: string;
  max: number;
};

export function loadStreak(): StreakState {
  if (typeof window === "undefined") return { current: 0, lastCompletedDate: "", max: 0 };
  const stored = localStorage.getItem("nnm_streak");
  if (stored) return JSON.parse(stored);
  return { current: 0, lastCompletedDate: "", max: 0 };
}

export function updateStreak(): StreakState {
  const today = new Date().toISOString().slice(0, 10);
  const streak = loadStreak();

  if (streak.lastCompletedDate === today) return streak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const next: StreakState = {
    current: streak.lastCompletedDate === yesterdayStr ? streak.current + 1 : 1,
    lastCompletedDate: today,
    max: 0,
  };
  next.max = Math.max(next.current, streak.max);

  localStorage.setItem("nnm_streak", JSON.stringify(next));
  return next;
}

export function reloadMission(index: number, currentState: DayState): DayState | null {
  if (currentState.reloadCredits <= 0) return null;

  const currentIds = new Set(currentState.missions.map((m) => m.id));
  const allMissions: Mission[] = [
    ...missionsData.normal,
    ...missionsData.rare.map((m) => ({ ...m, isRare: true as const })),
  ];
  const candidates = allMissions.filter((m) => !currentIds.has(m.id));
  if (candidates.length === 0) return null;

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  const oldId = currentState.missions[index].id;

  const nextMissions = currentState.missions.map((m, i) => (i === index ? picked : m));
  const nextCompleted = currentState.completed.filter((id) => id !== oldId);

  const next: DayState = {
    ...currentState,
    missions: nextMissions,
    completed: nextCompleted,
    reloadCredits: currentState.reloadCredits - 1,
  };
  localStorage.setItem("nnm_day", JSON.stringify(next));
  return next;
}

export function saveCompleted(id: number, completed: number[]): number[] {
  const today = new Date().toISOString().slice(0, 10);
  const stored = localStorage.getItem("nnm_day");
  if (!stored) return completed;

  const parsed: DayState = JSON.parse(stored);
  const next = completed.includes(id)
    ? completed.filter((c) => c !== id)
    : [...completed, id];

  localStorage.setItem(
    "nnm_day",
    JSON.stringify({ ...parsed, date: today, completed: next })
  );
  return next;
}
