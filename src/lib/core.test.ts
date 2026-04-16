import { describe, expect, it } from 'vitest'
import { buildNarrative } from './copy'
import { applySatireRules } from './rules'
import { buildDefaultAnswers, calculateScores, normalize } from './scoring'

describe('scoring basics', () => {
  it('normalizes reverse metrics correctly', () => {
    expect(normalize(10, 0, 10, true)).toBe(0)
    expect(normalize(0, 0, 10, true)).toBe(1)
  })

  it('builds scores inside 0-100', () => {
    const base = calculateScores(buildDefaultAnswers())
    expect(base.total).toBeGreaterThanOrEqual(0)
    expect(base.total).toBeLessThanOrEqual(100)
    expect(base.finance).toBeGreaterThanOrEqual(0)
    expect(base.finance).toBeLessThanOrEqual(100)
  })
})

describe('satire rules', () => {
  it('adds performative survival flag under heavy meetings and overtime', () => {
    const answers = buildDefaultAnswers()
    answers.meetingDensity = 12
    answers.overtimeNights = 5

    const next = applySatireRules(calculateScores(answers), answers)
    expect(next.flags).toContain('performativeSurvival')
  })
})

describe('copy fallback', () => {
  it('always returns full narrative strings', () => {
    const narrative = buildNarrative({
      total: 48,
      finance: 42,
      environment: 39,
      mental: 44,
      expectation: 55,
      flags: [],
    })

    expect(narrative.title.length).toBeGreaterThan(0)
    expect(narrative.diagnosis.length).toBeGreaterThan(0)
    expect(narrative.bounceBack.length).toBeGreaterThan(0)
    expect(narrative.shareLine.length).toBeGreaterThan(0)
  })
})
