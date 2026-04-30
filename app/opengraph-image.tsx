import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0a0a0f",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "80px 96px",
          position: "relative",
        }}
      >
        {/* アクセントライン */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "3px",
            background: "linear-gradient(90deg, #6b8eff 0%, #3b4fd4 60%, transparent 100%)",
          }}
        />

        {/* ラベル */}
        <div
          style={{
            fontSize: "14px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            marginBottom: "24px",
            fontFamily: "sans-serif",
          }}
        >
          daily mission
        </div>

        {/* タイトル */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: 300,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            marginBottom: "28px",
            fontFamily: "sans-serif",
          }}
        >
          non normale
        </div>

        {/* サブタイトル */}
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.05em",
            fontFamily: "sans-serif",
          }}
        >
          普通じゃない、小さなハッピーミッション
        </div>

        {/* 右下ドット装飾 */}
        <div
          style={{
            position: "absolute",
            bottom: "72px",
            right: "96px",
            display: "flex",
            gap: "10px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: i === 3 ? "#6b8eff" : "rgba(107,142,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
