export type SessionStatus = 'draft' | 'signed'

export interface Session {
  id: string
  clientInitials: string
  date: string
  durationMin: number
  status: SessionStatus
}

export interface Summary {
  summary: string
  riskFlags: string[]
  nextSteps: string[]
}

export const MOCK_MODES = ['random', 'ok', 'slow', 'empty', 'malformed', 'html', 'error'] as const
export type MockMode = (typeof MOCK_MODES)[number]
