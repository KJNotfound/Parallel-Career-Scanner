import type { Answers, ScoreBreakdown } from '../types/schema'

const clampScore = (value: number): number => Math.max(0, Math.min(100, Math.round(value)))

export const applySatireRules = (scores: ScoreBreakdown, answers: Answers): ScoreBreakdown => {
  const next = { ...scores, flags: [...scores.flags] }

  const highMeetings = (answers.meetingDensity ?? 0) >= 10
  const highOvertime = (answers.overtimeNights ?? 0) >= 4
  const shortSleep = (answers.sleepHours ?? 0) <= 5.5
  const highComparison = (answers.displayPressure ?? 0) >= 16
  const lowSavings = (answers.savingsMonths ?? 0) <= 1
  const highSocialDisplay = (answers.displayPressure ?? 0) >= 18

  if (highMeetings && highOvertime) {
    next.environment = clampScore(next.environment + 5)
    next.flags.push('performativeSurvival')
  }

  if (shortSleep && highComparison) {
    next.mental = clampScore(next.mental - 8)
    next.flags.push('mentalBatteryWarning')
  }

  if (lowSavings && highSocialDisplay) {
    next.finance = clampScore(next.finance - 6)
    next.flags.push('cashflowMirage')
  }

  next.total = clampScore(
    next.finance * 0.3 + next.environment * 0.3 + next.mental * 0.25 + next.expectation * 0.15,
  )

  return next
}
