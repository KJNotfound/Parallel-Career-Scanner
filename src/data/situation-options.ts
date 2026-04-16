/** 近况入参（选填），参与宇宙种子哈希。 */
export const SITUATION_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '（不选）' },
  { value: 'overwork', label: '长期加班态' },
  { value: 'quiet_quit', label: '精神离职中' },
  { value: 'poor_stable', label: '贫穷但稳定' },
  { value: 'seasonal_emotion', label: '换季 emo' },
  { value: 'love_brain', label: '恋爱脑间歇发作' },
  { value: 'boss_ptsd', label: '上司 PUA 余震' },
  { value: 'job_hunt_hide', label: '正在求职潜水' },
  { value: 'exam_grind', label: '考公考研执念' },
  { value: 'body_warn', label: '身体发出警告' },
  { value: 'caffeine', label: '咖啡因过量' },
  { value: 'travel_only', label: '只想旅行不上班' },
  { value: 'family_group', label: '家庭群压力测试' },
  { value: 'cyber_hysteria', label: '赛博歇斯底里' },
  { value: 'always_on', label: '二十四小时待机' },
  { value: 'try_tired', label: '什么都想试又立刻倦' },
  { value: 'bed_bond', label: '与床建立了深度羁绊' },
  { value: 'social_battery', label: '社交电量个位数' },
  { value: 'existential', label: '存在主义发作' },
]

export function situationLabel(key: string): string {
  const row = SITUATION_OPTIONS.find((c) => c.value === key)
  return row?.label ?? '（未登记）'
}
