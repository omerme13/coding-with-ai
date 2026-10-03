import { useEffect, useState } from 'react'
import { fetchSessions } from './api'
import SessionDetail from './SessionDetail'
import SessionList from './SessionList'
import { MOCK_MODES, type MockMode, type Session } from './types'

type SessionsState =
  | { status: 'loading' }
  | { status: 'ok'; sessions: Session[] }
  | { status: 'error' }

export default function App() {
  const [sessionsState, setSessionsState] = useState<SessionsState>({ status: 'loading' })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mockMode, setMockMode] = useState<MockMode>('random')

  useEffect(() => {
    const controller = new AbortController()
    fetchSessions(controller.signal)
      .then((sessions) => setSessionsState({ status: 'ok', sessions }))
      .catch(() => {
        if (!controller.signal.aborted) setSessionsState({ status: 'error' })
      })
    return () => controller.abort()
  }, [])

  const sessions = sessionsState.status === 'ok' ? sessionsState.sessions : []
  const selected = sessions.find((s) => s.id === selectedId)

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
        <h1 className="text-lg font-semibold">Session Notes</h1>
        <label className="flex items-center gap-2 text-sm text-slate-500">
          Mock mode
          <select
            value={mockMode}
            onChange={(e) => setMockMode(e.target.value as MockMode)}
            className="rounded border border-slate-300 px-2 py-1"
          >
            {MOCK_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </header>

      <main className="grid grid-cols-[20rem_1fr] gap-6 p-6">
        <aside>
          {sessionsState.status === 'loading' && <p className="text-sm text-slate-500">Loading sessions…</p>}
          {sessionsState.status === 'error' && (
            <p role="alert" className="text-sm text-red-700">
              Couldn't load sessions. Is the server running?
            </p>
          )}
          {sessionsState.status === 'ok' && (
            <SessionList sessions={sessions} selectedId={selectedId} onSelect={setSelectedId} />
          )}
        </aside>

        {selected ? (
          <SessionDetail key={`${selected.id}:${mockMode}`} session={selected} mockMode={mockMode} />
        ) : (
          <p className="text-slate-500">Select a session to see its summary.</p>
        )}
      </main>
    </div>
  )
}
