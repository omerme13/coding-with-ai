import type { PointerEvent, ReactNode } from "react";
import { Maximize, Minus, Plus } from "lucide-react";

type Props = {
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
};

export default function ZoomControls({ canZoomIn, canZoomOut, onZoomIn, onZoomOut, onFit }: Props) {
  return (
    <div
      className="absolute right-3 bottom-3 flex flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm"
      // Keep presses on the controls from starting a pan or adding a pin.
      onPointerDown={(e: PointerEvent) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <ControlButton label="Zoom in" onClick={onZoomIn} disabled={!canZoomIn}>
        <Plus size={16} />
      </ControlButton>
      <ControlButton label="Zoom out" onClick={onZoomOut} disabled={!canZoomOut}>
        <Minus size={16} />
      </ControlButton>
      <ControlButton label="Fit to panel" onClick={onFit}>
        <Maximize size={16} />
      </ControlButton>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center border-b border-slate-200 last:border-b-0 hover:bg-slate-50 disabled:text-slate-300 disabled:hover:bg-white"
    >
      {children}
    </button>
  );
}
