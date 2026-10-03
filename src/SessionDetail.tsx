import { useEffect, useState } from 'react'
import { fetchSummary, MalformedResponseError } from './api'
import type { MockMode, Session, Summary } from './types'

type SummaryState =
  | { status: 'loading' }
  | { status: 'ok'; summary: Summary }
  | { status: 'error'; message: string }

interface Props {
  session: Session
  mockMode: MockMode
}

// Rendered with key={session.id + mode}: switching sessions remounts this component,
// and the effect cleanup aborts the previous request, so a stale summary can't land here.
export default function SessionDetail({ session, mockMode }: Props) {
  const [state, setState] = useState<SummaryState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchSummary(session.id, mockMode, controller.signal)
      .then((summary) => {
        if (!controller.signal.aborted) setState({ status: 'ok', summary })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          message:
            err instanceof MalformedResponseError
              ? "Couldn't read the AI response."
              : 'Summary failed to generate.',
        })
      })
    return () => controller.abort()
  }, [session.id, mockMode, attempt])

  const regenerate = () => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{session.clientInitials}</h2>
          <p className="text-sm text-slate-500">
            {session.date} · {session.durationMin} min · {session.status}
          </p>
        </div>
        <button
          type="button"
          onClick={regenerate}
          disabled={state.status === 'loading'}
          className="rounded bg-slate-800 px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Regenerate
        </button>
      </header>

      {state.status === 'loading' && (
        <div role="status" className="flex flex-col gap-2">
          <p className="text-sm text-slate-500">Generating summary…</p>
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        </div>
      )}

      {state.status === 'error' && (
        <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {state.message} Try Regenerate.
        </div>
      )}

      {state.status === 'ok' && <SummaryView summary={state.summary} />}
    </section>
  )
}

function SummaryView({ summary }: { summary: Summary }) {
  const isEmpty = !summary.summary.trim() && summary.riskFlags.length === 0 && summary.nextSteps.length === 0
  if (isEmpty) {
    return (
      <p className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
        No summary was generated for this session. Try Regenerate.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-1 text-sm font-semibold uppercase text-slate-500">Summary</h3>
        {/* Rendered as text on purpose: model output may contain HTML/script. */}
        <p className="whitespace-pre-wrap">{summary.summary.trim() || 'No summary text.'}</p>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold uppercase text-slate-500">Risk flags</h3>
        {summary.riskFlags.length === 0 ? (
          <p className="text-sm text-slate-500">No risk flags.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {summary.riskFlags.map((flag, i) => (
              <li key={i} className="rounded bg-red-100 px-2 py-0.5 text-sm text-red-800">
                {flag}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold uppercase text-slate-500">Next steps</h3>
        {summary.nextSteps.length === 0 ? (
          <p className="text-sm text-slate-500">No next steps.</p>
        ) : (
          <ul className="list-disc pl-5">
            {summary.nextSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
