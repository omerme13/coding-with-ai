import { MapPin } from "lucide-react";
import type { Pin } from "../lib/plan";

type Props = {
  pins: Pin[];
  activePinId: string | null;
  onPinClick: (pin: Pin) => void;
};

export default function PinSidebar({ pins, activePinId, onPinClick }: Props) {
  return (
    <aside className="flex w-72 shrink-0 flex-col rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-2 text-sm font-semibold">Pins ({pins.length})</h2>

      {pins.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-slate-500">
          <MapPin size={24} className="text-slate-300" />
          <p>No pins yet.</p>
          <p>Click anywhere on the plan to add one.</p>
        </div>
      ) : (
        <ul className="-mx-2 min-h-0 flex-1 overflow-y-auto">
          {pins.map((pin) => (
            <li key={pin.id}>
              <button
                type="button"
                onClick={() => onPinClick(pin)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-slate-50 ${
                  pin.id === activePinId ? "bg-blue-50 text-blue-700" : ""
                }`}
              >
                <MapPin size={14} className="shrink-0" />
                <span className="truncate">{pin.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
