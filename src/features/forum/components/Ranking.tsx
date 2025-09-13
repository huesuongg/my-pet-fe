import React from "react";

type Person = {
  id: number; // rank number
  name: string;
  likes: number; // in thousands -> 1.8 => 1.8k
  avatar: string;
  badge?: number; // small counter on avatar
};

const topDefault: Person[] = [
  {
    id: 1,
    name: "Jennie",
    likes: 2.5,
    avatar: "https://i.pravatar.cc/80?img=1",
    badge: 2,
  },
  {
    id: 2,
    name: "Mino",
    likes: 3.8,
    avatar: "https://i.pravatar.cc/80?img=2",
    badge: 1,
  },
  {
    id: 3,
    name: "Vinxen",
    likes: 2.2,
    avatar: "https://i.pravatar.cc/80?img=3",
    badge: 3,
  },
];

const listDefault: Person[] = [
  { id: 4, name: "Zico", likes: 1.8, avatar: "https://i.pravatar.cc/64?img=4" },
  {
    id: 5,
    name: "Loopy",
    likes: 1.6,
    avatar: "https://i.pravatar.cc/64?img=5",
  },
  { id: 6, name: "Dean", likes: 1.5, avatar: "https://i.pravatar.cc/64?img=6" },
  {
    id: 7,
    name: "Flowsik",
    likes: 0.8,
    avatar: "https://i.pravatar.cc/64?img=7",
  },
];

const Thumb = () => (
  // SVG like icon (màu xám nhạt)
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M14 9V5a3 3 0 0 0-3-3l-1 6H5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h8.28a3 3 0 0 0 2.95-2.39l1.3-6A3 3 0 0 0 14 9Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
);

const Ranking: React.FC<{
  top?: Person[];
  list?: Person[];
  highlightRank?: number; // rank to highlight in the list (e.g., 6)
}> = ({ top = topDefault, list = listDefault, highlightRank = 6 }) => {
  return (
    <div
      className="ranking-container bg-white p-4 rounded-lg shadow-md"
      style={{ width: "100%" }}
    >
      {/* TOP 3 */}
      <h3
        className="text-xl font-bold mb-4 text-center relative"
        style={{
          background: "linear-gradient(90deg, #38bdf8, #2563eb)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        React Ranking
        <span
          style={{
            position: "absolute",
            left: "50%",
            bottom: -6,
            transform: "translateX(-50%)",
            width: 60,
            height: 3,
            borderRadius: 2,
            background: "linear-gradient(90deg, #38bdf8, #2563eb)",
            opacity: 0.8,
          }}
        />
      </h3>

      <div
        className="ranking-top"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0,1fr))",
          gap: 16,
          alignItems: "end",
          width: "100%",
        }}
      >
        {top.map((p) => (
          <div
            key={p.id}
            className="ranking-top-card"
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                position: "relative",
                width: 70,
                height: 70,
                margin: "0 auto",
              }}
            >
              {/* avatar */}
              <img
                src={p.avatar}
                alt={p.name}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "9999px",
                  objectFit: "cover",
                  border: "4px solid white",
                  boxShadow: "0 0 0 3px rgba(59,130,246,.6)", // blue ring
                }}
              />
              {/* badge */}
              {typeof p.badge === "number" && (
                <div
                  className="ranking-badge"
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    minWidth: 22,
                    height: 22,
                    padding: "0 6px",
                    borderRadius: 999,
                    background: p.badge === 1 ? "#FB923C" : "#3B82F6", // orange for #1, blue for #2/#3
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,.25)",
                  }}
                >
                  {p.badge}
                </div>
              )}
            </div>

            {/* name */}
            <div style={{ marginTop: 8, fontWeight: 600 }}>{p.name}</div>

            {/* likes under name */}
            <div
              className="ranking-like"
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                justifyContent: "center",
                color: "#6B7280",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              <Thumb />
              <span>{p.likes}k</span>
            </div>
          </div>
        ))}
      </div>

      {/* LIST 4.. */}
      <div className="ranking-list" style={{ marginTop: 16 }}>
        {list.map((p) => {
          const isActive = p.id === highlightRank;
          return (
            <div
              key={p.id}
              className={`ranking-row ${isActive ? "is-active" : ""}`}
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "28px 36px 1fr auto",
                gap: 10,
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 8,
                background: isActive ? "rgba(59,130,246,.08)" : "transparent",
              }}
            >
              {/* active left bar */}
              {isActive && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                    background: "#3B82F6",
                  }}
                />
              )}

              {/* rank number */}
              <div
                style={{
                  textAlign: "right",
                  color: "#111827",
                  fontWeight: 600,
                }}
              >
                {p.id}
              </div>

              {/* small avatar */}
              <img
                src={p.avatar}
                alt={p.name}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9999,
                  objectFit: "cover",
                }}
              />

              {/* name */}
              <div style={{ color: "#111827" }}>{p.name}</div>

              {/* like at right */}
              <div
                className="ranking-like"
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  color: "#9CA3AF",
                }}
              >
                <Thumb />
                <span>{p.likes}k</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ranking;
