// Provided file. Do not edit.

export const PLAN_WIDTH = 2400;
export const PLAN_HEIGHT = 1600;

export type Pin = {
  id: string;
  x: number; // plan coordinates (0..PLAN_WIDTH)
  y: number; // plan coordinates (0..PLAN_HEIGHT)
  label: string;
};

export const initialPins: Pin[] = [
  { id: "p1", x: 420, y: 380, label: "Reception desk" },
  { id: "p2", x: 1500, y: 620, label: "Conference room" },
  { id: "p3", x: 2050, y: 1250, label: "Server closet" },
];

const rooms = [
  { x: 100, y: 100, w: 700, h: 560, name: "Lobby", fill: "#eef2f7" },
  { x: 800, y: 100, w: 900, h: 560, name: "Open space", fill: "#f4f1ea" },
  { x: 1700, y: 100, w: 600, h: 560, name: "Meeting A", fill: "#e9f1ec" },
  { x: 100, y: 660, w: 500, h: 840, name: "Kitchen", fill: "#f6ece6" },
  { x: 600, y: 660, w: 1100, h: 840, name: "Conference room", fill: "#eceaf4" },
  { x: 1700, y: 660, w: 600, h: 400, name: "Meeting B", fill: "#e9f1ec" },
  { x: 1700, y: 1060, w: 600, h: 440, name: "Server closet", fill: "#f1eaea" },
];

// A generated floor plan. No external assets.
export function FloorPlanImage() {
  return (
    <svg
      width={PLAN_WIDTH}
      height={PLAN_HEIGHT}
      viewBox={`0 0 ${PLAN_WIDTH} ${PLAN_HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", userSelect: "none" }}
    >
      <rect width={PLAN_WIDTH} height={PLAN_HEIGHT} fill="#ffffff" />
      {Array.from({ length: PLAN_WIDTH / 100 + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={PLAN_HEIGHT} stroke="#f0f0f0" strokeWidth={2} />
      ))}
      {Array.from({ length: PLAN_HEIGHT / 100 + 1 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 100} x2={PLAN_WIDTH} y2={i * 100} stroke="#f0f0f0" strokeWidth={2} />
      ))}
      {rooms.map((r) => (
        <g key={r.name}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} stroke="#334155" strokeWidth={10} />
          <text
            x={r.x + r.w / 2}
            y={r.y + r.h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={56}
            fontFamily="system-ui, sans-serif"
            fill="#475569"
          >
            {r.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
