import { useState } from 'react'
import type { Session, SessionStatus } from './types'

type Filter = 'all' | SessionStatus

const FILTERS: Filter[] = ['all', 'draft', 'signed']

interface Props {
  sessions: Session[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function SessionList({ sessions, selectedId, onSelect }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = filter === 'all' ? sessions : sessions.filter((s) => s.status === filter)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded px-3 py-1 text-sm capitalize ${
              filter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-slate-500">No {filter} sessions.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {visible.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                aria-current={s.id === selectedId}
                className={`flex w-full items-center justify-between rounded border px-3 py-2 text-left ${
                  s.id === selectedId ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>
                  <span className="font-medium">{s.clientInitials}</span>
                  <span className="ml-2 text-sm text-slate-500">
                    {s.date} · {s.durationMin} min
                  </span>
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    s.status === 'signed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {s.status}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
