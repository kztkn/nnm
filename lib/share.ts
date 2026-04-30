export async function shareMission(missionText: string, streak: number) {
  const streakLine = streak > 0 ? `\n🔥 ${streak}日連続` : "";
  const text = `今日のミッションやった 🎯\n「${missionText}」${streakLine}\n#non_normale\nhttps://nnm-lovat.vercel.app`;

  if (typeof navigator === "undefined") return;

  if (navigator.share) {
    try {
      await navigator.share({ title: "non normale", text });
    } catch {
      // キャンセル時は何もしない
    }
  } else {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "width=550,height=420"
    );
  }
}

export async function shareAllDone(streak: number) {
  const streakLine = streak > 0 ? `🔥 ${streak}日連続達成！` : "今日のミッション全部やった！";
  const text = `${streakLine}\n\nnon normaleで非日常なミッションをこなしてます\n#non_normale\nhttps://nnm-lovat.vercel.app`;

  if (typeof navigator === "undefined") return;

  if (navigator.share) {
    try {
      await navigator.share({ title: "non normale", text });
    } catch {
      // キャンセル時は何もしない
    }
  } else {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "width=550,height=420"
    );
  }
}
