import { useRef, useState } from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import FloorPlanViewer from "./components/FloorPlanViewer";
import type { FloorPlanViewerHandle } from "./components/FloorPlanViewer";
import PinSidebar from "./components/PinSidebar";
import PinDetails from "./components/PinDetails";
import { initialPins } from "./lib/plan";
import type { Pin } from "./lib/plan";
import type { Point } from "./lib/viewport";

// Provided layout. You may change it if your design needs it.
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pins, setPins] = useState<Pin[]>(initialPins);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const viewerRef = useRef<FloorPlanViewerHandle>(null);

  function addPin(point: Point) {
    setPins((prev) => [...prev, { id: crypto.randomUUID(), x: point.x, y: point.y, label: `Pin ${prev.length + 1}` }]);
    setActivePinId(null);
  }

  function removePin(id: string) {
    setPins((prev) => prev.filter((pin) => pin.id !== id));
    setActivePinId((active) => (active === id ? null : active));
  }

  const activePin = pins.find((pin) => pin.id === activePinId);

  function focusPin(pin: Pin) {
    viewerRef.current?.focusPin(pin);
    setActivePinId(pin.id);
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100 text-slate-900">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <h1 className="text-base font-semibold">Floor Plan Viewer</h1>
        <button
          onClick={() => setSidebarOpen((open) => !open)}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          {sidebarOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          Toggle sidebar
        </button>
      </header>

      <div className="flex min-h-0 flex-1 gap-4 p-4">
        <main className="relative min-h-0 min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-200">
          <FloorPlanViewer
            ref={viewerRef}
            pins={pins}
            activePinId={activePinId}
            onAddPin={addPin}
            onSelectPin={setActivePinId}
            popover={
              activePin && (
                <PinDetails
                  pin={activePin}
                  onDelete={() => removePin(activePin.id)}
                  onClose={() => setActivePinId(null)}
                />
              )
            }
          />
        </main>

        {sidebarOpen && <PinSidebar pins={pins} activePinId={activePinId} onPinClick={focusPin} />}
      </div>
    </div>
  );
}
