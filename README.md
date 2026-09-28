# Floor Plan Viewer

An interactive floor plan. Users zoom and pan around a large plan and drop
pins on rooms to leave notes.

## Stack

- React 19, TypeScript, Tailwind CSS
- `lucide-react` for icons

## Run

```
npm install
npm run dev
```

## Assignment

You'll work in `src/components/FloorPlanViewer.tsx`. It currently renders the
plan at its full size inside the panel, so it overflows and nothing is
interactive. `src/App.tsx` provides the layout (toolbar, panel, sidebar) and a
"Toggle sidebar" button that changes the panel's width. `src/lib/plan.tsx`
exposes `PLAN_WIDTH`, `PLAN_HEIGHT`, `<FloorPlanImage />`, the `Pin` type and
`initialPins`.

How you split state and components is up to you. Don't edit `src/lib/plan.tsx`.

Build the viewer so it satisfies all of the following:

### Containment
- [ ] The plan is clipped to the panel; the page never gets scrollbars
- [ ] The toolbar and sidebar never scale, move, or overlap the plan
- [ ] Scrolling the wheel over the panel does not scroll the page

### Zoom & Pan
- [ ] Zoom with mouse wheel and +/− buttons, min 1× (fit) and max 5×
- [ ] Wheel zoom is centered on the cursor, not the panel center
- [ ] Drag to pan; the plan can't be dragged out of view
- [ ] When the plan is smaller than the panel at the current zoom, it is centered
- [ ] A Fit/Reset button returns to the initial view
- [ ] Toggling the sidebar (panel resize) keeps fit and pan limits correct

### Pins
- [ ] Click the plan to add a pin at that exact spot
- [ ] Pins stay anchored to the same spot on the plan at any zoom or pan
- [ ] Pins keep a constant on-screen size at any zoom
- [ ] Clicking a pin opens a label popover that always stays inside the panel

### Sidebar
- [ ] Lists all pins
- [ ] Clicking a pin in the list zooms and pans so it is visible in the panel

### Empty & Edge States
- [ ] Empty state in the sidebar when there are no pins
- [ ] Dragging to pan must not accidentally add a pin

### Bonus (verbal discussion)
- The plan can be replaced with a much larger image (e.g. 20000×15000).
  What would you change, and what would start to hurt first?
