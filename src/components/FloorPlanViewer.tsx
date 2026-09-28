import { useEffect, useImperativeHandle, useRef, useState } from "react";
import type { MouseEvent, PointerEvent, ReactNode, Ref } from "react";
import { FloorPlanImage, PLAN_HEIGHT, PLAN_WIDTH } from "../lib/plan";
import type { Pin } from "../lib/plan";
import { useElementSize } from "../hooks/useElementSize";
import {
  FIT_VIEW,
  MAX_ZOOM,
  MIN_ZOOM,
  centerOn,
  clampView,
  isInsidePlan,
  planToScreen,
  scaleOf,
  screenToPlan,
  zoomAt,
} from "../lib/viewport";
import type { Point, View } from "../lib/viewport";
import ZoomControls from "./ZoomControls";
import PinPopover from "./PinPopover";

const DRAG_THRESHOLD = 4; // px of movement before a press counts as a pan
const BUTTON_ZOOM_STEP = 1.5;
const WHEEL_SENSITIVITY = 0.0015;
const FOCUS_ZOOM = 2.5;

export type FloorPlanViewerHandle = {
  focusPin: (pin: Pin) => void;
};

type Props = {
  pins: Pin[];
  activePinId: string | null;
  onAddPin: (point: Point) => void;
  onSelectPin: (id: string | null) => void;
  popover?: ReactNode; // content for the active pin's popover; the viewer only positions it
  ref?: Ref<FloorPlanViewerHandle>;
};

type Drag = { startX: number; startY: number; viewX: number; viewY: number };

export default function FloorPlanViewer({ pins, activePinId, onAddPin, onSelectPin, popover, ref }: Props) {
  const [panelRef, panel] = useElementSize<HTMLDivElement>();
  const [rawView, setRawView] = useState<View>(FIT_VIEW);
  // Clamp on every render so a panel resize keeps fit and pan limits correct.
  const view = clampView(rawView, panel);
  const scale = scaleOf(view, panel);

  const drag = useRef<Drag | null>(null);
  const didDrag = useRef(false);

  useImperativeHandle(
    ref,
    () => ({
      focusPin: (pin) => setRawView((v) => centerOn(panel, pin, Math.max(v.zoom, FOCUS_ZOOM))),
    }),
    [panel],
  );

  // Native listener: React's onWheel is passive, so it can't stop page scroll.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cursor = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const deltaY = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? e.deltaY * 16 : e.deltaY;
      const factor = Math.exp(-deltaY * WHEEL_SENSITIVITY);
      setRawView((v) => zoomAt(v, panel, cursor, v.zoom * factor));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [panel, panelRef]);

  function zoomAroundCenter(factor: number) {
    const center = { x: panel.w / 2, y: panel.h / 2 };
    setRawView((v) => zoomAt(v, panel, center, v.zoom * factor));
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    drag.current = { startX: e.clientX, startY: e.clientY, viewX: view.x, viewY: view.y };
    didDrag.current = false;
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!didDrag.current) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      didDrag.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setRawView((v) => clampView({ ...v, x: d.viewX + dx, y: d.viewY + dy }, panel));
  }

  function endDrag() {
    drag.current = null;
  }

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    // A pan ends with a click event; it must not drop a pin.
    if (didDrag.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const point = screenToPlan(view, panel, { x: e.clientX - rect.left, y: e.clientY - rect.top });
    if (isInsidePlan(point)) onAddPin(point);
    else onSelectPin(null);
  }

  const activePin = pins.find((pin) => pin.id === activePinId);
  const activeAnchor = activePin ? planToScreen(view, panel, activePin) : null;
  // Hide the popover while its pin is panned out of view.
  const anchorVisible =
    activeAnchor !== null &&
    activeAnchor.x >= 0 &&
    activeAnchor.y >= 0 &&
    activeAnchor.x <= panel.w &&
    activeAnchor.y <= panel.h;

  return (
    <div
      ref={panelRef}
      className="absolute inset-0 cursor-crosshair touch-none overflow-hidden rounded-lg select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={handleClick}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: PLAN_WIDTH,
          height: PLAN_HEIGHT,
          transform: `translate(${view.x}px, ${view.y}px) scale(${scale})`,
        }}
      >
        <FloorPlanImage />
      </div>

      {/* Unscaled overlay: pins keep a constant on-screen size. */}
      {pins.map((pin) => {
        const p = planToScreen(view, panel, pin);
        const active = pin.id === activePinId;
        return (
          <button
            key={pin.id}
            type="button"
            aria-label={pin.label}
            title={pin.label}
            className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full ring-2 ring-white ${
              active ? "bg-blue-600" : "bg-red-500"
            }`}
            style={{ left: p.x, top: p.y }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPin(active ? null : pin.id);
            }}
          />
        );
      })}

      {popover && activeAnchor && anchorVisible && (
        <PinPopover anchor={activeAnchor} panel={panel}>
          {popover}
        </PinPopover>
      )}

      <ZoomControls
        canZoomIn={view.zoom < MAX_ZOOM}
        canZoomOut={view.zoom > MIN_ZOOM}
        onZoomIn={() => zoomAroundCenter(BUTTON_ZOOM_STEP)}
        onZoomOut={() => zoomAroundCenter(1 / BUTTON_ZOOM_STEP)}
        onFit={() => setRawView(FIT_VIEW)}
      />
    </div>
  );
}
