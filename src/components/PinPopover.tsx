import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { Point, Size } from "../lib/viewport";

const GAP = 14; // distance from the pin center
const MARGIN = 8; // minimum distance from the panel edge

type Props = {
  anchor: Point; // pin position in panel px
  panel: Size;
  children: ReactNode;
};

// Positioning shell: above the pin by default, flipped below when there's
// no room, then clamped so it always stays inside the panel.
export default function PinPopover({ anchor, panel, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Runs after every render: the content can change size (e.g. while editing).
  // Position is written directly to the DOM after measuring, before paint.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    let top = anchor.y - GAP - h;
    if (top < MARGIN) top = anchor.y + GAP;
    const left = Math.max(MARGIN, Math.min(anchor.x - w / 2, panel.w - w - MARGIN));
    top = Math.max(MARGIN, Math.min(top, panel.h - h - MARGIN));
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  });

  return (
    <div
      ref={ref}
      role="dialog"
      className="absolute max-w-64 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg"
      // Keep presses inside the popover from panning or adding pins.
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
