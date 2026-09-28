import { FloorPlanImage, PLAN_HEIGHT, PLAN_WIDTH, initialPins } from "../lib/plan";

// Starter: renders the plan at full size with the initial pins.
// Nothing is clipped, zoomable, pannable or interactive yet.
export default function FloorPlanViewer() {
  return (
    <div>
      <div className="relative" style={{ width: PLAN_WIDTH, height: PLAN_HEIGHT }}>
        <FloorPlanImage />
        {initialPins.map((pin) => (
          <div
            key={pin.id}
            className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 ring-2 ring-white"
            style={{ left: pin.x, top: pin.y }}
            title={pin.label}
          />
        ))}
      </div>
    </div>
  );
}
