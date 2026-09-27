# Notification Feed

A live notification center. New notifications arrive in real time; the
connection occasionally drops and must recover on its own.

## Stack

- React 19, TypeScript, Tailwind CSS
- `lucide-react` for icons

## Assignment

You'll work in `components/NotificationFeed.tsx`. It currently renders a
static, hardcoded list. `lib/mock-api.ts` exposes `fetchNotifications()`,
`connectLive()`, `markAsRead()`, and `markAllAsRead()` — none are wired up.

`connectLive(onEvent, onDisconnect)` opens a simulated live connection: it
pushes a new notification every few seconds, and roughly once every 15–20
seconds it drops the connection (calls `onDisconnect`) without warning. It is
up to your code to notice the drop and reconnect — the mock API will not do
this for you.

Build the feed so it satisfies all of the following:

### Live Connection
- [ ] On mount, fetch existing notifications and connect to the live stream
- [ ] A status indicator shows **Live** / **Reconnecting…** / **Offline**
- [ ] On disconnect, the app reconnects automatically
- [ ] After several consecutive failed reconnect attempts, stop retrying and
      show **Offline** with a manual "Try again" button

### Grouping & Display
- [ ] Notifications are grouped under day headers: **Today**, **Yesterday**,
      then the date
- [ ] Unread notifications are visually distinct (not just a tiny dot — make
      it actually scannable)
- [ ] An unread count badge is shown somewhere prominent (e.g. page title
      area)

### Read State
- [ ] Clicking a notification marks it as read
- [ ] A "Mark all as read" action clears all unread state at once

### Filtering
- [ ] Tabs or a dropdown: All / Unread / by type (info, warning,
      action-required)
- [ ] Filtered-out notifications are hidden, not removed from state

### Responsive & Empty States
- [ ] Feed scrolls independently within its own container — the page itself
      doesn't grow
- [ ] Mobile-friendly
- [ ] Empty state when there are no notifications, and a distinct one when a
      filter matches nothing

### Bonus (verbal discussion)
- Live pushes and a reconnect can both hand you notifications you already
  have, or hand them to you out of order. How would you handle that?