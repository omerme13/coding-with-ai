# Task Board

A Kanban-style task board for a small team workflow. Users organize cards across
"To Do / In Progress / Done" columns, reorder them, and the app persists changes
to a backend.

## Stack

- React 19, TypeScript, Tailwind CSS
- `@dnd-kit/core` + `@dnd-kit/sortable` (installed, not yet wired up)
- `lucide-react` for icons
- `shadcn/ui` available for UI primitives
- `sonner` available for toasts

## Assignment

The file you'll be working in is `components/task-board.tsx`. It currently
renders a hardcoded board with no state, no interactivity, and no connection to
`lib/mock-api.ts`. That file exposes `fetchBoard()` and `saveBoard()`, both of
which simulate network delay, and `saveBoard()` randomly fails ~20% of the time.

Build an interactive task board that satisfies all of the following:

### Drag & Drop
- [ ] Cards can be dragged between columns
- [ ] Cards can be reordered within a column
- [ ] Visual feedback during drag (dragged card is visually distinct)
- [ ] Dropping outside a valid column reverts to original position

### Card Management
- [ ] Add a new card via an input at the bottom of each column
- [ ] Edit a card's title inline (click to edit, Enter/blur to save)
- [ ] Delete a card (with a confirm step)
- [ ] Each column header shows its card count

### Filtering & Search
- [ ] Search input filters cards by title (case-insensitive) across all columns
- [ ] Priority filter (All / High / Medium / Low)
- [ ] Filtered-out cards are hidden, not removed from state

### Persistence & Async
- [ ] On mount, call `fetchBoard()` — show a loading skeleton while it resolves
- [ ] On mount fetch failure, show an error state with a retry button
- [ ] Every change (move, add, edit, delete) is optimistic: update the UI
      immediately, then call `saveBoard()`
- [ ] While a save is in flight, show a subtle "saving…" indicator
- [ ] If `saveBoard()` rejects, roll back the change and show an error toast

### Responsive Layout
- [ ] Desktop: columns side by side, each with independent vertical scroll
- [ ] Mobile: columns stack full-width
- [ ] Long card lists scroll within their column without growing the page

### Empty States
- [ ] An empty column shows a short friendly message instead of blank space

### Bonus (verbal discussion)
- How would you handle two users editing the same board at the same time —
  concurrent moves, conflicting edits, stale state?