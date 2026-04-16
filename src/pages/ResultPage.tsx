import { ProgressMeter } from '../components/ProgressMeter'
import type { NarrativeResult, ScoreBreakdown } from '../types/schema'

interface ResultPageProps {
  score: ScoreBreakdown
  narrative: NarrativeResult
  onReset: () => void
}

export function ResultPage({ score, narrative, onReset }: ResultPageProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${narrative.shareLine}\n${narrative.summary}`)
  }

  return (
    <main className="layout">
      <header className="hero card">
        <p className="badge">Annual Result Sheet</p>
        <h1>{narrative.title}</h1>
        <p>{narrative.summary}</p>
      </header>

      <section className="card result-main">
        <ProgressMeter label="总进度" score={score.total} />
        <ProgressMeter label="体面维持指数" score={score.environment} />
        <ProgressMeter label="现金流错觉指数" score={score.finance} />
        <ProgressMeter label="情绪续航指数" score={score.mental} />
        <ProgressMeter label="社会期待缓冲指数" score={score.expectation} />
      </section>

      <section className="card narrative">
        <h2>系统诊断</h2>
        <p>{narrative.diagnosis}</p>
        <h3>回弹建议</h3>
        <p>{narrative.bounceBack}</p>
      </section>

      <section className="card action-row">
        <button type="button" onClick={handleCopy}>
          复制分享文案
        </button>
        <button type="button" className="ghost" onClick={onReset}>
          重新测算
        </button>
      </section>
    </main>
  )
}
