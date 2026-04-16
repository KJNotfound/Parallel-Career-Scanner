/** 额外「个性 / 语境」入参，写入种子并微调叙事。 */

export type IdentityKeys = {
  regionKey: string
  skillKey: string
  driveKey: string
  stressKey: string
  squadKey: string
}

export const REGION_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '（不测）' },
  { value: 'mine', label: '矿区 / 井下' },
  { value: 'orbit', label: '轨道 / 空间站' },
  { value: 'cold', label: '冷库 / 寒带' },
  { value: 'outpost', label: '前哨 / 边境' },
  { value: 'camp', label: '营地 / 帐篷线' },
  { value: 'port', label: '港口 / 物流' },
  { value: 'desert', label: '荒漠 / 旱线' },
]

export const SKILL_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '（不测）' },
  { value: 'hands', label: '动手 / 设备' },
  { value: 'head', label: '动脑 / 文书' },
  { value: 'talk', label: '嘴皮 / 协调' },
  { value: 'body', label: '体能 / 外勤' },
  { value: 'mix', label: '杂项 / 都能顶' },
]

export const DRIVE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '（不测）' },
  { value: 'money', label: '搞钱优先' },
  { value: 'safe', label: '保命第一' },
  { value: 'know', label: '搞清真相' },
  { value: 'belong', label: '混个编制' },
  { value: 'float', label: '先苟着' },
]

export const STRESS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '（不测）' },
  { value: 'low', label: '承压还行' },
  { value: 'mid', label: '经常紧绷' },
  { value: 'high', label: '快绷了' },
]

export const SQUAD_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '（不测）' },
  { value: 'solo', label: '独狼位' },
  { value: 'exec', label: '执行位' },
  { value: 'coord', label: '协调位' },
  { value: 'scape', label: '背锅位' },
]

const pick = <T extends { value: string }>(rows: T[], key: string): T | undefined =>
  rows.find((r) => r.value === key)

export function regionLabel(key: string): string {
  return pick(REGION_OPTIONS, key)?.label ?? ''
}

export function regionPrefix(key: string): string {
  const m: Record<string, string> = {
    mine: '矿区',
    orbit: '轨道',
    cold: '冷库',
    outpost: '前哨',
    camp: '营地',
    port: '港口',
    desert: '荒漠',
  }
  return m[key] ?? ''
}

export function skillLabel(key: string): string {
  return pick(SKILL_OPTIONS, key)?.label ?? ''
}

export function driveLabel(key: string): string {
  return pick(DRIVE_OPTIONS, key)?.label ?? ''
}

export function stressLabel(key: string): string {
  return pick(STRESS_OPTIONS, key)?.label ?? ''
}

export function squadLabel(key: string): string {
  return pick(SQUAD_OPTIONS, key)?.label ?? ''
}

/** 未选地域时，用字节兜底短前缀（仍像真实工种场景）。 */
export const REGION_FALLBACK_PREFIXES: string[] = ['驻点', '外包', '临时', '站点']
