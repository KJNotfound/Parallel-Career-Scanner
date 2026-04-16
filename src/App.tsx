import { useCallback, useRef, useState, type FormEvent } from 'react'
import { Activity } from 'lucide-react'
import { ExportButton } from '@/components/ExportButton'
import { ResultCard } from '@/components/ResultCard'
import { CURRENT_JOB_CHOICES } from '@/data/current-jobs'
import {
  DRIVE_OPTIONS,
  REGION_OPTIONS,
  SKILL_OPTIONS,
  SQUAD_OPTIONS,
  STRESS_OPTIONS,
} from '@/data/identity-options'
import { SITUATION_OPTIONS } from '@/data/situation-options'
import {
  estimateScanDurationMs,
  runMultiverseScan,
  sleep,
  type MultiverseInput,
  type MultiverseResult,
} from '@/lib/predict-multiverse'
import { cn } from '@/lib/utils'

const BIRTHDAY_MIN = '1900-01-01'

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function todayIsoDate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const fieldClass = cn(
  'mt-2 w-full border border-[#2a3140] bg-[#0e1016] px-3 py-2.5 font-mono-strict text-sm text-[#d7dce8]',
  'focus-visible:border-[#7dd3c0]/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7dd3c0]/50',
)

export default function App() {
  const [birthday, setBirthday] = useState('')
  const [regionKey, setRegionKey] = useState('')
  const [skillKey, setSkillKey] = useState('')
  const [driveKey, setDriveKey] = useState('')
  const [stressKey, setStressKey] = useState('')
  const [squadKey, setSquadKey] = useState('')
  const [situationKey, setSituationKey] = useState('')
  const [currentJobKey, setCurrentJobKey] = useState('')
  const [defiance, setDefiance] = useState(42)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [result, setResult] = useState<MultiverseResult | null>(null)

  const cardRef = useRef<HTMLDivElement>(null)

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!birthday || !ISO_DATE_RE.test(birthday)) {
        setError('请填写公历生日（年-月-日）')
        setResult(null)
        setTerminalLines([])
        return
      }

      const input: MultiverseInput = {
        birthday,
        regionKey,
        skillKey,
        driveKey,
        stressKey,
        squadKey,
        situationKey,
        currentJobKey,
        defiance,
      }

      setError(null)
      setResult(null)
      setTerminalLines([])
      setScanning(true)

      try {
        const { result: next, scanLogs } = await runMultiverseScan(input)
        const perLineMs = 380
        const minTotal = estimateScanDurationMs(scanLogs.length)
        const streamMs = scanLogs.length * perLineMs
        const padMs = Math.max(0, minTotal - streamMs)
        if (padMs > 0) await sleep(Math.floor(padMs / 2))

        for (const line of scanLogs) {
          setTerminalLines((prev) => [...prev, line])
          await sleep(perLineMs)
        }
        if (padMs > 0) await sleep(Math.ceil(padMs / 2))

        setResult(next)
      } finally {
        setScanning(false)
      }
    },
    [birthday, regionKey, skillKey, driveKey, stressKey, squadKey, situationKey, currentJobKey, defiance],
  )

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-xl flex-col">
        <header className="mb-10 border-b border-[#252a35] pb-8">
          <div className="mb-3 inline-flex items-center gap-2 border border-[#7dd3c0]/35 bg-[#7dd3c0]/8 px-2.5 py-1 text-[0.65rem] tracking-wide text-[#9ee9d9]">
            <Activity className="h-3.5 w-3.5 shrink-0 text-[#7dd3c0]" aria-hidden />
            娱乐向 · 不作任何承诺
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#eef1f7] sm:text-3xl">
            平行宇宙职业扫描仪
          </h1>
          <p className="mt-1 font-mono-strict text-xs text-[#6b7287]">版本 v0.10.2</p>
          <p className="mt-4 max-w-prose text-pretty text-sm leading-relaxed text-[#9aa3b5]">
            职务条=语境+真实工种（短）；简录补叙事。多选项写入种子。仅供娱乐。
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="border border-[#252a35] bg-[#11141a]/90 p-6 shadow-[0_0_0_1px_rgba(125,211,192,0.04)]"
        >
          <p className="font-mono-strict text-[0.65rem] font-medium tracking-wide text-[#6b7287]">参数登记</p>

          <label className="mt-4 block text-sm font-medium text-[#aeb6c8]" htmlFor="birthday">
            公历生日 <span className="text-[#9a4d4d]">*</span>
          </label>
          <input
            id="birthday"
            type="date"
            min={BIRTHDAY_MIN}
            max={todayIsoDate()}
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className={fieldClass}
          />
          <p className="mt-1 font-mono-strict text-[0.65rem] leading-relaxed text-[#5c6375]">
            生日写入种子与「个体时痕」；黄道参与哈希，界面不展示星座名。
          </p>

          <fieldset className="mt-6 border-t border-[#252a35] pt-5">
            <legend className="text-sm font-medium text-[#aeb6c8]">语境与拿手（选填）</legend>
            <p className="mt-1 font-mono-strict text-[0.65rem] text-[#5c6375]">
              影响职务条前缀与工种池；不选则仪器随机兜底。
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#aeb6c8]" htmlFor="region">
                  地缘语境
                </label>
                <select
                  id="region"
                  value={regionKey}
                  onChange={(e) => setRegionKey(e.target.value)}
                  className={fieldClass}
                >
                  {REGION_OPTIONS.map((c) => (
                    <option key={c.value || '_reg'} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#aeb6c8]" htmlFor="skill">
                  拿手倾向
                </label>
                <select
                  id="skill"
                  value={skillKey}
                  onChange={(e) => setSkillKey(e.target.value)}
                  className={fieldClass}
                >
                  {SKILL_OPTIONS.map((c) => (
                    <option key={c.value || '_sk'} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset className="mt-6 border-t border-[#252a35] pt-5">
            <legend className="text-sm font-medium text-[#aeb6c8]">动机与站位（选填）</legend>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#aeb6c8]" htmlFor="drive">
                  驱动力
                </label>
                <select
                  id="drive"
                  value={driveKey}
                  onChange={(e) => setDriveKey(e.target.value)}
                  className={fieldClass}
                >
                  {DRIVE_OPTIONS.map((c) => (
                    <option key={c.value || '_dr'} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#aeb6c8]" htmlFor="stress">
                  承压
                </label>
                <select
                  id="stress"
                  value={stressKey}
                  onChange={(e) => setStressKey(e.target.value)}
                  className={fieldClass}
                >
                  {STRESS_OPTIONS.map((c) => (
                    <option key={c.value || '_st'} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#aeb6c8]" htmlFor="squad">
                  班组位置
                </label>
                <select
                  id="squad"
                  value={squadKey}
                  onChange={(e) => setSquadKey(e.target.value)}
                  className={fieldClass}
                >
                  {SQUAD_OPTIONS.map((c) => (
                    <option key={c.value || '_sq'} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <label className="mt-6 block text-sm font-medium text-[#aeb6c8]" htmlFor="situation">
            近况标签（选填）
          </label>
          <select
            id="situation"
            value={situationKey}
            onChange={(e) => setSituationKey(e.target.value)}
            className={fieldClass}
          >
            {SITUATION_OPTIONS.map((c) => (
              <option key={c.value || '_sit_empty'} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <label className="mt-5 block text-sm font-medium text-[#aeb6c8]" htmlFor="job">
            本宇宙自报职业（选填）
          </label>
          <select
            id="job"
            value={currentJobKey}
            onChange={(e) => setCurrentJobKey(e.target.value)}
            className={fieldClass}
          >
            {CURRENT_JOB_CHOICES.map((c) => (
              <option key={c.value || '_empty'} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <label className="text-sm font-medium text-[#aeb6c8]" htmlFor="defiance">
                对命运的反抗程度
              </label>
              <span className="font-mono-strict text-xs text-[#7dd3c0]">{defiance}</span>
            </div>
            <input
              id="defiance"
              type="range"
              min={0}
              max={100}
              value={defiance}
              onChange={(e) => setDefiance(Number(e.target.value))}
              className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded bg-[#252a35] accent-[#7dd3c0]"
            />
            <p className="mt-1 font-mono-strict text-[0.65rem] text-[#5c6375]">
              仅影响判词分支权重，不改变你对周一的态度。
            </p>
          </div>

          {error ? (
            <p className="mt-4 font-mono-strict text-sm text-[#d48a8a]" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={scanning}
            className={cn(
              'mt-6 w-full border border-[#7dd3c0]/55 py-3 text-sm font-semibold tracking-wide',
              'bg-[#7dd3c0]/12 text-[#d7f5ee] hover:bg-[#7dd3c0]/20 disabled:opacity-50',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3c0]/50',
            )}
          >
            {scanning ? '扫描中…' : '开始校准'}
          </button>
        </form>

        {(terminalLines.length > 0 || scanning) && (
          <section
            className="mt-8 border border-[#252a35] bg-[#0a0c10] p-4"
            aria-live="polite"
            aria-busy={scanning}
          >
            <p className="font-mono-strict text-[0.65rem] tracking-wide text-[#5c6375]">运行日志</p>
            <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap break-words font-mono-strict text-[0.72rem] leading-relaxed text-[#8b93a8]">
              {terminalLines.join('\n')}
              {scanning && terminalLines.length === 0 ? '…' : ''}
            </pre>
          </section>
        )}

        {result ? (
          <section className="mt-10 flex flex-col items-center gap-6">
            <div className="flex justify-center overflow-x-auto pb-2">
              <ResultCard ref={cardRef} result={result} />
            </div>
            <ExportButton
              targetRef={cardRef}
              fileBaseName={`平行宇宙职业-${result.birthdayIso.replace(/-/g, '')}`}
            />
            <p className="max-w-md text-center font-mono-strict text-[0.65rem] leading-relaxed text-[#5c6375]">
              免责声明：本应用为确定性娱乐生成，不构成职业、心理、财务或宇宙学建议。
            </p>
          </section>
        ) : (
          !scanning && (
            <p className="mt-10 text-center font-mono-strict text-[0.65rem] text-[#5c6375]">
              填写公历生日后执行校准；完成后可导出 PNG。
            </p>
          )
        )}

        <footer className="mt-16 border-t border-[#252a35] pt-6 text-center font-mono-strict text-[0.6rem] text-[#4a5163]">
          平行宇宙职业扫描仪 · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  )
}
