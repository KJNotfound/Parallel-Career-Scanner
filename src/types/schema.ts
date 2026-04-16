export type Dimension = 'finance' | 'environment' | 'mental' | 'expectation'

export interface QuestionItem {
  id: string
  label: string
  min: number
  max: number
  defaultValue: number
  weight: number
  dimension: Dimension
  reverse?: boolean
  hint?: string
}

export type Answers = Record<string, number>

export interface ScoreBreakdown {
  total: number
  finance: number
  environment: number
  mental: number
  expectation: number
  flags: string[]
}

export interface NarrativeResult {
  title: string
  summary: string
  diagnosis: string
  bounceBack: string
  shareLine: string
}

export const QUESTIONS: QuestionItem[] = [
  {
    id: 'interviewMomentum',
    label: '最近30天，你拿到的有效面试推进（轮次）',
    min: 0,
    max: 8,
    defaultValue: 2,
    weight: 0.18,
    dimension: 'environment',
    hint: '0 表示海投无回音，8 表示快变成面试官朋友。',
  },
  {
    id: 'meetingDensity',
    label: '每周无效会议/群同步次数',
    min: 0,
    max: 20,
    defaultValue: 6,
    weight: 0.22,
    dimension: 'environment',
    reverse: true,
    hint: '越高表示时间更容易被格式化蒸发。',
  },
  {
    id: 'overtimeNights',
    label: '每周加班到20:30之后的天数',
    min: 0,
    max: 7,
    defaultValue: 2,
    weight: 0.2,
    dimension: 'environment',
    reverse: true,
  },
  {
    id: 'rentRatio',
    label: '房租/基本生活费占你月收入（或生活费）的比例（%）',
    min: 10,
    max: 90,
    defaultValue: 45,
    weight: 0.35,
    dimension: 'finance',
    reverse: true,
  },
  {
    id: 'savingsMonths',
    label: '你当前储蓄可覆盖几个月基本开销',
    min: 0,
    max: 12,
    defaultValue: 2,
    weight: 0.3,
    dimension: 'finance',
  },
  {
    id: 'displayPressure',
    label: '你每周看见“同龄人领先我”内容的频率',
    min: 0,
    max: 30,
    defaultValue: 10,
    weight: 0.15,
    dimension: 'expectation',
    reverse: true,
  },
  {
    id: 'familyPrompt',
    label: '你每周被亲友催“工作/考研/对象”的次数',
    min: 0,
    max: 15,
    defaultValue: 4,
    weight: 0.12,
    dimension: 'expectation',
    reverse: true,
  },
  {
    id: 'sleepHours',
    label: '工作日平均睡眠时长（小时）',
    min: 4,
    max: 9,
    defaultValue: 6.5,
    weight: 0.2,
    dimension: 'mental',
  },
  {
    id: 'weekendRecovery',
    label: '周末恢复感（0-10）',
    min: 0,
    max: 10,
    defaultValue: 5,
    weight: 0.25,
    dimension: 'mental',
  },
  {
    id: 'commuteHours',
    label: '单日往返通勤总时长（小时）',
    min: 0,
    max: 4,
    defaultValue: 1.5,
    weight: 0.15,
    dimension: 'mental',
    reverse: true,
  },
]

export const DIMENSION_WEIGHTS: Record<Dimension, number> = {
  finance: 0.3,
  environment: 0.3,
  mental: 0.25,
  expectation: 0.15,
}
