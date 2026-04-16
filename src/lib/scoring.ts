import { DIMENSION_WEIGHTS, QUESTIONS, type Answers, type Dimension, type ScoreBreakdown } from '../types/schema'

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

const toPercent = (value: number): number => Math.round(value * 100)

export const normalize = (value: number, min: number, max: number, reverse = false): number => {
  if (max <= min) {
    return 0.5
  }

  const bounded = clamp(value, min, max)
  const raw = (bounded - min) / (max - min)
  return reverse ? 1 - raw : raw
}

export const buildDefaultAnswers = (): Answers =>
  QUESTIONS.reduce<Answers>((acc, question) => {
    acc[question.id] = question.defaultValue
    return acc
  }, {})

export const calculateScores = (answers: Answers): ScoreBreakdown => {
  const totalsByDimension: Record<Dimension, number> = {
    finance: 0,
    environment: 0,
    mental: 0,
    expectation: 0,
  }
  const weightsByDimension: Record<Dimension, number> = {
    finance: 0,
    environment: 0,
    mental: 0,
    expectation: 0,
  }

  for (const question of QUESTIONS) {
    const answer = answers[question.id] ?? question.defaultValue
    const normalized = normalize(answer, question.min, question.max, question.reverse)
    totalsByDimension[question.dimension] += normalized * question.weight
    weightsByDimension[question.dimension] += question.weight
  }

  const financeRaw = totalsByDimension.finance / Math.max(weightsByDimension.finance, 1e-6)
  const environmentRaw = totalsByDimension.environment / Math.max(weightsByDimension.environment, 1e-6)
  const mentalRaw = totalsByDimension.mental / Math.max(weightsByDimension.mental, 1e-6)
  const expectationRaw = totalsByDimension.expectation / Math.max(weightsByDimension.expectation, 1e-6)

  const weightedTotal =
    financeRaw * DIMENSION_WEIGHTS.finance +
    environmentRaw * DIMENSION_WEIGHTS.environment +
    mentalRaw * DIMENSION_WEIGHTS.mental +
    expectationRaw * DIMENSION_WEIGHTS.expectation

  return {
    total: toPercent(weightedTotal),
    finance: toPercent(financeRaw),
    environment: toPercent(environmentRaw),
    mental: toPercent(mentalRaw),
    expectation: toPercent(expectationRaw),
    flags: [],
  }
}
