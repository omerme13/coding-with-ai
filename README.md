**Task: Session Notes**

A clinician sees a list of therapy sessions. Selecting one shows an AI-generated summary of it.

**Backend (Node, TypeScript, small)**
- `GET /api/sessions` returns about 8 hardcoded sessions: `id`, `clientInitials`, `date`, `durationMin`, `status` (`draft` or `signed`).
- `POST /api/sessions/:id/summary` mocks the AI and returns `{ summary: string, riskFlags: string[], nextSteps: string[] }`.
- The mock has a `?mode=` query param: `ok`, `slow` (6 s), `empty` (empty strings and arrays), `malformed` (a missing field, or `riskFlags` as a string), `html` (the summary contains `<b>` and a `<script>` tag), `error` (500).
- Without the param it picks randomly, with a random delay of 0.5 to 6 s.

**Frontend (React, TypeScript)**
- List on the left with a filter by status. The selected session's detail is on the right.
- Selecting a session fetches its summary. A Regenerate button refetches it.
- The detail view shows the summary, risk flags and next steps.
- Switching sessions quickly must never show the previous session's summary.


