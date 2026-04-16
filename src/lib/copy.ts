import type { NarrativeResult, ScoreBreakdown } from '../types/schema'

const gradeTitle = (score: number): string => {
  if (score >= 75) return '看起来一切正常（仅限报表）'
  if (score >= 60) return '高度可雇佣（情绪另算）'
  if (score >= 40) return '勉强在线（系统建议继续忍耐）'
  return '试运行中（建议保持低姿态呼吸）'
}

const diagnosisByFlags = (flags: string[], score: ScoreBreakdown): string => {
  if (flags.includes('performativeSurvival')) {
    return '系统检测到你具备高强度参会与加班能力。恭喜，这在统计学上被归类为“组织协同”。'
  }
  if (flags.includes('mentalBatteryWarning')) {
    return '你正在用睡眠透支去覆盖外部比较压力。系统认可你的责任感，同时记录了电量红色告警。'
  }
  if (flags.includes('cashflowMirage')) {
    return '你的现金流呈现“视觉体面、财务克制”结构。外部世界看见的是稳重，你账户看见的是文学性。'
  }

  if (score.environment < 40) {
    return '你处在一个高频沟通、低频结论的环境。该环境擅长制造忙碌感，对意义产出较为保守。'
  }

  if (score.expectation < 45) {
    return '社会期待正在以礼貌的方式持续催促你。系统确认：你并非落后，只是被放在了公开比较模式。'
  }

  return '你的当前状态符合“青年稳定周旋模型”。即使每周都在应付，也仍然在维持基本秩序。'
}

const bounceBackByScore = (score: number): string => {
  if (score >= 65) {
    return '你没有击败系统，但你已经学会在制度缝隙里保留一点生活。对这个版本的现实来说，这足够专业。'
  }

  if (score >= 40) {
    return '今天的你也许没前进很多，但你仍在推进明天。能持续上线，本身就是一种有效进度。'
  }

  return '现实并不体面，但你还在场。系统备注：只要你继续出现，进度条就不会归零。'
}

export const buildNarrative = (score: ScoreBreakdown): NarrativeResult => {
  const title = gradeTitle(score.total)
  const summary = `人生进度 ${score.total}%｜体面 ${score.environment}%｜现金流 ${score.finance}%｜续航 ${score.mental}%`
  const diagnosis = diagnosisByFlags(score.flags, score)
  const bounceBack = bounceBackByScore(score.total)
  const shareLine = `《青年生存进度评估系统》判定我为「${title}」，当前进度 ${score.total}%。`

  return {
    title,
    summary,
    diagnosis,
    bounceBack,
    shareLine,
  }
}
