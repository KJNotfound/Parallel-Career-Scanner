import { formatPersonalMark, sunSignFromIsoDate } from '@/data/birth-mark'
import { CURRENT_JOB_CHOICES } from '@/data/current-jobs'
import {
  driveLabel,
  regionLabel,
  skillLabel,
  squadLabel,
  stressLabel,
  type IdentityKeys,
} from '@/data/identity-options'
import { buildNarrativePack } from '@/data/rimworld-narrative'
import { situationLabel } from '@/data/situation-options'
import { SCAN_LOG_POOL } from '@/data/scan-logs'
import { SLOT_NOUNS, SLOT_TIMEUNITS, SLOT_VERBS } from '@/data/slots'
import { bytesToHex, modPositive, sha256Bytes } from '@/lib/seed-hash'

export type MultiverseInput = IdentityKeys & {
  birthday: string
  situationKey: string
  currentJobKey: string
  defiance: number
}

export type MultiverseResult = {
  /** 「个体时痕」展示串（由公历生日衍生）。 */
  nickname: string
  birthdayIso: string
  subjectId: string
  cosmicSeedHex: string
  branchId: string
  jobTitle: string
  jobTitleEn: string
  /** 两条短简录（来路+据点记事）。 */
  storyBeats: [string, string]
  colonyName: string
  stats: string[]
  verdict: string
  footnote: string
}

const VERDICT_RIM: string[] = [
  '「{{colony}}」登记「{{adultTitle}}」；{{pct}}% 宇宙仍缓存「{{childTitle}}」。',
  '「{{childTitle}}」→「{{adultTitle}}」：偏差归天气。{{incident}}',
  '「{{job}}」可见度 {{pct}}%；公摊归「{{colony}}」后勤。',
  '{{incident}} 补丁拒收约 {{pct}}%。',
  '「{{colony}}」把你当耗材；你比 {{pct}}% 的耗材多撑一轮。',
]

const VERDICT_TEMPLATES: string[] = [
  '在 {{pct}}% 的宇宙里，你仍在{{verb}}。',
  '其余宇宙并非更好，只是你不在场；其中 {{pct}}% 仍在{{verb}}。',
  '本分支宇宙的「{{job}}」编制已满；你属于外包现实。',
  '与理想自我的重叠率：{{pct}}%（已按自我欺骗折扣调整）。',
  '「意义感」在可观测宇宙中的半衰期：约{{timeunit}}。',
  '你当前职业在平行宇宙中的出现频率：高于超新星爆发，低于准时下班。',
  '在 {{pct}}% 的宇宙里，{{noun}}比你先获得编制。',
  '系统建议：把期待调成飞行模式；仍有 {{pct}}% 的宇宙拒绝执行该建议。',
  '好消息：你并非孤独。坏消息：其中 {{pct}}% 的孤独形态是{{verb}}。',
  '宇宙常数更新：{{noun}} → 常数；你 → 噪声（置信度 {{pct}}%）。',
  '若把「算了」当作策略，你在 {{pct}}% 的宇宙里已是战略家。',
  '平行人事处备注：{{job}}为默认兜底岗位，覆盖约 {{pct}}% 的样本。',
  '在 {{pct}}% 的宇宙里，你仍在{{verb}}；其余宇宙只是你还没学会那种痛。',
  '误差范围：±{{pct}}% 的「没事」；真实范围：不可解析。',
  '本结果已通过自我怀疑校验；残余希望：{{pct}}%（四舍五入为 0）。',
  '「再等等看」在 {{pct}}% 的宇宙里收敛为「就这样吧」。',
  '你并非被困住，只是在 {{pct}}% 的宇宙里选择了熟悉的坏。',
  '统计显著性：不显著；情绪显著性：显著；显著性阈值：{{noun}}。',
  '若存在更好的你，他在 {{pct}}% 的宇宙里同样没睡好。',
  '本宇宙 HR 意见：{{verb}}可写进 KPI，但不算产出。',
  '平行宇宙医保不报销：{{timeunit}}的慢性失望。',
  '温馨提示：{{pct}}% 的「会好的」属于占位符语法糖。',
  '宇宙尽头不是热寂，是{{noun}}的第 N 次修订。',
]

const RIM_STAT_TEMPLATES: string[] = [
  '「{{colony}}」口粮叙事可信度 {{pct}}%。',
  '「{{job}}」与地形耦合 {{pct}}%；余量算天气。',
  '「{{adultTitle}}」与{{noun}}弱相关，耐心当 R²。',
  '「{{childTitle}}」决策噪声权重 {{pct}}%。',
  '「{{colony}}」日志：{{incident}} 后外出阈值下调。',
  '「{{colony}}」队列里「{{adultTitle}}」排位前 {{pct}}%（从队尾数）。',
]

const STAT_TEMPLATES: string[] = [
  '「准时下班」事件检出率：<{{pct}}%（仪器下限）。',
  '与「理想生活」的余弦相似度：{{pct}}%（已归一化到更糟）。',
  '「收到」复读频率：在本分支排名前 {{pct}}%。',
  '「稍后再说」堆栈深度：与{{noun}}强相关，拖到越晚越像真的没时间。',
  '「没事」语句的伪阳性率：{{pct}}%。',
  '「在吗」触发焦虑的半衰期：约{{timeunit}}。',
  '群聊存在感积分：低于{{noun}}，高于已退群的前同事。',
  '周报诚实度先验：0；后验：仍接近 0（置信区间含{{pct}}% 谎言）。',
  '咖啡依赖对生产力的解释方差：{{pct}}%；其余归因于命。',
  '「下周一定」违约概率：点估计 {{pct}}%；区间估计：你心里有数。',
  '睡眠债名义本金：高；实际可偿还现金流：见{{noun}}。',
  '「再等等看」策略的夏普比率：负；最大回撤：{{timeunit}}。',
  '「我很好」与生理信号的一致性：{{pct}}%（测量误差：你的表情）。',
  '把{{noun}}标为 P0 的次数：在 {{pct}}% 的宇宙里仍不会改变结局。',
  '「会好的」在训练集上的准确率：{{pct}}%；测试集：现实生活。',
  '与「自由」的欧氏距离：稳定；与{{noun}}的纠缠：上升。',
  '「摸鱼」被检测概率：低；「摸鱼愧疚」被自检概率：{{pct}}%。',
  '「辞职念头」出现频次：高；「辞职行动」似然：在误差棒内趋近于零。',
  '「人生是旷野」引用次数：{{pct}}%；旷野收费：见{{noun}}。',
  '「做自己」与「做{{noun}}」的互信息：意外的高。',
  '「一切都会过去」真值：真；「一切」定义域：含{{timeunit}}。',
  '「你只是累了」解释力度：{{pct}}%；剩余残差：结构性荒谬。',
  '「再撑一下」迭代次数：无界；收敛判据：无。',
  '「我不配」与「我确实不配」的 A/B 测试结果：平局（p={{pct}}%）。',
]

const ALL_VERDICTS: string[] = [...VERDICT_RIM, ...VERDICT_TEMPLATES]
const ALL_STATS: string[] = [...RIM_STAT_TEMPLATES, ...STAT_TEMPLATES]

const FOOTNOTES: string[] = [
  '本输出不含医疗建议；若不适，优先怀疑资本主义与睡眠不足。',
  '仪器已通过「别太当真」计量认证。',
  '若结果过准，说明你对生活过于诚实；建议适度自欺以续命。',
  '平行人事处保留最终解释权，且通常懒得解释。',
  '本分支宇宙不提供「被理解」保修。',
  '免责声明：随机娱乐生成；不构成职业、心理或宇宙学建议。',
  '若需希望，请另购 DLC；本机默认不预装。',
  '复制本判词不会改变命运，但可能获得点赞。',
  '「会更好」属于未观测变量；当前数据集不支持该假设。',
  '系统提示：把屏幕关掉，世界不会因此停止荒谬。',
  '若你笑了一下，本扫描器的 KPI 已达成。',
  '宇宙不关心你，但关心你回不回「收到」。',
  '本页仅供娱乐；真实人生请咨询睡眠与存款余额。',
  '再扫描一次也不会更幸运，只会更熟练地面对真相。',
  '建议保存截图，以便在聚会时证明你也曾科学地丧过。',
]

function jobLabel(key: string): string {
  const row = CURRENT_JOB_CHOICES.find((c) => c.value === key)
  return row?.label ?? '（未登记）'
}

function buildSeedRaw(input: MultiverseInput): string {
  const sun = sunSignFromIsoDate(input.birthday)
  return [
    'MV2',
    input.birthday,
    sun.key,
    sun.label,
    input.regionKey,
    regionLabel(input.regionKey),
    input.skillKey,
    skillLabel(input.skillKey),
    input.driveKey,
    driveLabel(input.driveKey),
    input.stressKey,
    stressLabel(input.stressKey),
    input.squadKey,
    squadLabel(input.squadKey),
    input.situationKey,
    situationLabel(input.situationKey),
    input.currentJobKey,
    String(input.defiance),
    jobLabel(input.currentJobKey),
  ].join('|')
}

function resultFromBytes(bytes: Uint8Array, displayName: string, input: MultiverseInput): MultiverseResult {
  const fullHex = bytesToHex(bytes, 32)
  const cosmicSeedHex = fullHex.slice(0, 10).toUpperCase()
  const branchId = `BR-${fullHex.slice(0, 4).toUpperCase()}`
  const subjectNum = 10000 + modPositive(bytes, 4, 90000)
  const subjectId = `SUBJECT-${subjectNum}`

  const pack = buildNarrativePack(bytes, input)
  const jobTitle = pack.jobTitleZh
  const verb = SLOT_VERBS[modPositive(bytes, 52, SLOT_VERBS.length)]!
  const noun = SLOT_NOUNS[modPositive(bytes, 56, SLOT_NOUNS.length)]!
  const timeunit = SLOT_TIMEUNITS[modPositive(bytes, 60, SLOT_TIMEUNITS.length)]!
  const pct = formatPct(bytes, 24)

  const ctx = {
    pct,
    verb,
    noun,
    timeunit,
    job: jobTitle,
    colony: pack.colonyName,
    childTitle: pack.childTitleZh,
    adultTitle: pack.adultTitleZh,
    incident: pack.incidentLine,
  }

  const statTemplates = pickDistinctTemplates(bytes, 28, ALL_STATS, 2)
  const stats = statTemplates.map((t) => replaceSlots(t, ctx))

  const verdictBias = input.defiance >= 68 ? 5 : 0
  const verdictIdx = modPositive(bytes, 40 + verdictBias * 4, ALL_VERDICTS.length)
  const verdict = replaceSlots(ALL_VERDICTS[verdictIdx]!, ctx)

  const footnote = FOOTNOTES[modPositive(bytes, 44, FOOTNOTES.length)]!

  return {
    nickname: displayName,
    birthdayIso: input.birthday,
    subjectId,
    cosmicSeedHex,
    branchId,
    jobTitle,
    jobTitleEn: pack.jobTitleEn,
    storyBeats: pack.storyBeats,
    colonyName: pack.colonyName,
    stats,
    verdict,
    footnote,
  }
}

function formatPct(bytes: Uint8Array, offset: number): string {
  const v = 700 + modPositive(bytes, offset, 300)
  return (v / 10).toFixed(1)
}

type SlotCtx = {
  pct: string
  verb: string
  noun: string
  timeunit: string
  job: string
  colony: string
  childTitle: string
  adultTitle: string
  incident: string
}

function replaceSlots(template: string, ctx: SlotCtx): string {
  return template
    .replaceAll('{{pct}}', ctx.pct)
    .replaceAll('{{verb}}', ctx.verb)
    .replaceAll('{{noun}}', ctx.noun)
    .replaceAll('{{timeunit}}', ctx.timeunit)
    .replaceAll('{{job}}', ctx.job)
    .replaceAll('{{colony}}', ctx.colony)
    .replaceAll('{{childTitle}}', ctx.childTitle)
    .replaceAll('{{adultTitle}}', ctx.adultTitle)
    .replaceAll('{{incident}}', ctx.incident)
}

function pickDistinctTemplates(
  bytes: Uint8Array,
  startOffset: number,
  pool: string[],
  need: number,
): string[] {
  const out: string[] = []
  let off = startOffset
  let guard = 0
  while (out.length < need && guard < 200) {
    guard++
    const idx = modPositive(bytes, off % 24, pool.length)
    off += 4
    const t = pool[idx]!
    if (!out.includes(t)) out.push(t)
  }
  let i = 0
  while (out.length < need) {
    out.push(pool[i % pool.length]!)
    i++
  }
  return out
}

export function buildScanLogSequence(bytes: Uint8Array, lineCount = 7): string[] {
  const lines: string[] = ['启动：平行宇宙职业扫描仪 // v0.10.2']
  const picked = pickDistinctTemplates(bytes, 100, SCAN_LOG_POOL, lineCount)
  return lines.concat(picked)
}

export async function predictMultiverse(input: MultiverseInput): Promise<MultiverseResult> {
  const displayName = formatPersonalMark(input.birthday)
  const bytes = await sha256Bytes(buildSeedRaw(input))
  return resultFromBytes(bytes, displayName, input)
}

/** 单次哈希：扫描日志与最终结果同源。 */
export async function runMultiverseScan(input: MultiverseInput): Promise<{
  result: MultiverseResult
  scanLogs: string[]
}> {
  const displayName = formatPersonalMark(input.birthday)
  const bytes = await sha256Bytes(buildSeedRaw(input))
  return {
    result: resultFromBytes(bytes, displayName, input),
    scanLogs: buildScanLogSequence(bytes, 5),
  }
}

export function estimateScanDurationMs(logCount: number): number {
  return 520 + logCount * 420
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => window.setTimeout(r, ms))
}
