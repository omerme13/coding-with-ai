import express from 'express'

type Status = 'draft' | 'signed'

interface Session {
  id: string
  clientInitials: string
  date: string
  durationMin: number
  status: Status
}

const MODES = ['ok', 'slow', 'empty', 'malformed', 'html', 'error'] as const
type Mode = (typeof MODES)[number]

const PORT = 3001

const sessions: Session[] = [
  { id: 's1', clientInitials: 'A.K.', date: '2026-09-28', durationMin: 50, status: 'signed' },
  { id: 's2', clientInitials: 'B.L.', date: '2026-09-29', durationMin: 45, status: 'draft' },
  { id: 's3', clientInitials: 'C.M.', date: '2026-09-29', durationMin: 60, status: 'signed' },
  { id: 's4', clientInitials: 'D.N.', date: '2026-09-30', durationMin: 50, status: 'draft' },
  { id: 's5', clientInitials: 'E.O.', date: '2026-10-01', durationMin: 30, status: 'signed' },
  { id: 's6', clientInitials: 'F.P.', date: '2026-10-01', durationMin: 50, status: 'draft' },
  { id: 's7', clientInitials: 'G.R.', date: '2026-10-02', durationMin: 45, status: 'draft' },
  { id: 's8', clientInitials: 'H.S.', date: '2026-10-02', durationMin: 60, status: 'signed' },
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)]

const isMode = (value: unknown): value is Mode => MODES.includes(value as Mode)

function okSummary(session: Session) {
  return {
    summary: `Session with ${session.clientInitials} (${session.durationMin} min). Client discussed work stress and sleep difficulties. Mood appeared stable, engaged throughout.`,
    riskFlags: ['Sleep disturbance'],
    nextSteps: ['Introduce sleep hygiene worksheet', 'Review mood log next session'],
  }
}

const app = express()

app.get('/api/sessions', (_req, res) => {
  res.json(sessions)
})

app.post('/api/sessions/:id/summary', async (req, res) => {
  const session = sessions.find((s) => s.id === req.params.id)
  if (!session) {
    res.status(404).json({ error: 'Session not found' })
    return
  }

  const requested = req.query.mode
  const mode: Mode = isMode(requested) ? requested : pick(MODES)
  const delayMs = isMode(requested)
    ? mode === 'slow' ? 6000 : 300
    : 500 + Math.random() * 5500

  await sleep(delayMs)

  switch (mode) {
    case 'ok':
    case 'slow':
      res.json(okSummary(session))
      return
    case 'empty':
      res.json({ summary: '', riskFlags: [], nextSteps: [] })
      return
    case 'malformed':
      res.json(
        Math.random() < 0.5
          ? { summary: okSummary(session).summary, nextSteps: [] }
          : { ...okSummary(session), riskFlags: 'Sleep disturbance' },
      )
      return
    case 'html':
      res.json({
        ...okSummary(session),
        summary: `<b>Important:</b> client reported progress.<script>alert('xss')</script>`,
      })
      return
    case 'error':
      res.status(500).json({ error: 'AI generation failed' })
      return
  }
})

app.listen(PORT, () => {
  console.log(`Session Notes API on http://localhost:${PORT}`)
})
