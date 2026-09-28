import { PLAN_HEIGHT, PLAN_WIDTH } from "./plan";

// Pure view math. A view is the plan's zoom (1 = fit) and its top-left
// offset in panel pixels. Everything clamps so the plan can't leave the panel.

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 5;

export type Size = { w: number; h: number };
export type Point = { x: number; y: number };
export type View = { zoom: number; x: number; y: number };

export const FIT_VIEW: View = { zoom: MIN_ZOOM, x: 0, y: 0 };

export function fitScale(panel: Size) {
  if (!panel.w || !panel.h) return 1;
  return Math.min(panel.w / PLAN_WIDTH, panel.h / PLAN_HEIGHT);
}

export function scaleOf(view: View, panel: Size) {
  return fitScale(panel) * view.zoom;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// Smaller than the panel: centered. Larger: edges can't go past the panel's.
function clampAxis(offset: number, planSize: number, panelSize: number) {
  if (planSize <= panelSize) return (panelSize - planSize) / 2;
  return clamp(offset, panelSize - planSize, 0);
}

export function clampView(view: View, panel: Size): View {
  const zoom = clamp(view.zoom, MIN_ZOOM, MAX_ZOOM);
  const scale = fitScale(panel) * zoom;
  return {
    zoom,
    x: clampAxis(view.x, PLAN_WIDTH * scale, panel.w),
    y: clampAxis(view.y, PLAN_HEIGHT * scale, panel.h),
  };
}

export function screenToPlan(view: View, panel: Size, p: Point): Point {
  const scale = scaleOf(view, panel);
  return { x: (p.x - view.x) / scale, y: (p.y - view.y) / scale };
}

export function planToScreen(view: View, panel: Size, p: Point): Point {
  const scale = scaleOf(view, panel);
  return { x: view.x + p.x * scale, y: view.y + p.y * scale };
}

export function isInsidePlan(p: Point) {
  return p.x >= 0 && p.y >= 0 && p.x <= PLAN_WIDTH && p.y <= PLAN_HEIGHT;
}

// Zoom so the plan point under `anchor` (panel px) stays under it.
export function zoomAt(view: View, panel: Size, anchor: Point, newZoom: number): View {
  const current = clampView(view, panel);
  const planPoint = screenToPlan(current, panel, anchor);
  const zoom = clamp(newZoom, MIN_ZOOM, MAX_ZOOM);
  const scale = fitScale(panel) * zoom;
  return clampView({ zoom, x: anchor.x - planPoint.x * scale, y: anchor.y - planPoint.y * scale }, panel);
}

// Center a plan point in the panel at the given zoom (as far as clamping allows).
export function centerOn(panel: Size, planPoint: Point, zoom: number): View {
  const scale = fitScale(panel) * clamp(zoom, MIN_ZOOM, MAX_ZOOM);
  return clampView({ zoom, x: panel.w / 2 - planPoint.x * scale, y: panel.h / 2 - planPoint.y * scale }, panel);
}
