import { modPositive } from '@/lib/seed-hash'

/** 偏真实蓝领 / 一线岗，带拿手标签供「拿手倾向」过滤。 */
export const REAL_JOBS: { zh: string; en: string; tags: string[] }[] = [
  { zh: '电工', en: 'Electrician', tags: ['hands', 'mix'] },
  { zh: '焊工', en: 'Welder', tags: ['hands'] },
  { zh: '钳工', en: 'Fitter', tags: ['hands'] },
  { zh: '机修', en: 'Mechanic', tags: ['hands', 'mix'] },
  { zh: '制冷工', en: 'Refrigeration tech', tags: ['hands'] },
  { zh: '起重信号工', en: 'Rigger-signaler', tags: ['hands', 'body'] },
  { zh: '土木帮工', en: 'Laborer', tags: ['body', 'hands'] },
  { zh: '消控值班', en: 'Fire panel watch', tags: ['head', 'mix'] },
  { zh: '仓管', en: 'Warehouse clerk', tags: ['head', 'mix'] },
  { zh: '物流理货', en: 'Picker', tags: ['body', 'hands'] },
  { zh: '质检', en: 'QC inspector', tags: ['head', 'hands'] },
  { zh: '化验员', en: 'Lab tech', tags: ['head'] },
  { zh: '护士', en: 'Nurse', tags: ['talk', 'head', 'mix'] },
  { zh: '护工', en: 'Care aide', tags: ['body', 'talk'] },
  { zh: '保洁', en: 'Janitor', tags: ['body', 'mix'] },
  { zh: '厨师', en: 'Cook', tags: ['hands', 'mix'] },
  { zh: '司机', en: 'Driver', tags: ['body', 'hands'] },
  { zh: '保安', en: 'Security guard', tags: ['body', 'talk'] },
  { zh: '话务', en: 'Call operator', tags: ['talk', 'head'] },
  { zh: '数据录入', en: 'Data entry', tags: ['head'] },
  { zh: '记账文员', en: 'Clerk', tags: ['head'] },
  { zh: '采购助理', en: 'Purchasing asst.', tags: ['talk', 'head'] },
  { zh: '测绘协助', en: 'Survey aide', tags: ['hands', 'head'] },
  { zh: '农技员', en: 'Agri tech', tags: ['head', 'hands'] },
  { zh: '水处理工', en: 'Water treatment op.', tags: ['hands'] },
  { zh: '夜班护士', en: 'Night nurse', tags: ['head', 'body'] },
  { zh: '住院护工', en: 'Ward aide', tags: ['body'] },
  { zh: '电工助理', en: 'Electrician helper', tags: ['hands', 'mix'] },
  { zh: '安检员', en: 'Security screener', tags: ['talk', 'body'] },
]

export function pickRealJob(bytes: Uint8Array, skillKey: string): { zh: string; en: string } {
  let pool = REAL_JOBS
  if (skillKey) {
    const filtered = REAL_JOBS.filter((j) => j.tags.includes(skillKey))
    if (filtered.length > 0) pool = filtered
  }
  const idx = modPositive(bytes, 64, pool.length)
  const j = pool[idx]!
  return { zh: j.zh, en: j.en }
}
