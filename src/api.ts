import type { MockMode, Session, Summary } from './types'

export class MalformedResponseError extends Error {}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

export function isSummary(value: unknown): value is Summary {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return typeof v.summary === 'string' && isStringArray(v.riskFlags) && isStringArray(v.nextSteps)
}

export async function fetchSessions(signal?: AbortSignal): Promise<Session[]> {
  const res = await fetch('/api/sessions', { signal })
  if (!res.ok) throw new Error(`Failed to load sessions (${res.status})`)
  return res.json()
}

export async function fetchSummary(id: string, mode: MockMode, signal: AbortSignal): Promise<Summary> {
  const query = mode === 'random' ? '' : `?mode=${mode}`
  const res = await fetch(`/api/sessions/${encodeURIComponent(id)}/summary${query}`, {
    method: 'POST',
    signal,
  })
  if (!res.ok) throw new Error(`Summary request failed (${res.status})`)
  const data: unknown = await res.json()
  if (!isSummary(data)) throw new MalformedResponseError('Unexpected summary shape')
  return data
}
