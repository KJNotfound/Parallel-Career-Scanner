import { useMemo, useState, type FormEvent } from 'react'
import { QuestionGroup } from '../components/QuestionGroup'
import { buildNarrative } from '../lib/copy'
import { applySatireRules } from '../lib/rules'
import { buildDefaultAnswers, calculateScores } from '../lib/scoring'
import { QUESTIONS, type Answers, type NarrativeResult, type ScoreBreakdown } from '../types/schema'

interface FormPageProps {
  onCalculated: (payload: { answers: Answers; score: ScoreBreakdown; narrative: NarrativeResult }) => void
}

export function FormPage({ onCalculated }: FormPageProps) {
  const [answers, setAnswers] = useState<Answers>(() => buildDefaultAnswers())

  const groupedQuestions = useMemo(
    () => ({
      environment: QUESTIONS.filter((item) => item.dimension === 'environment'),
      finance: QUESTIONS.filter((item) => item.dimension === 'finance'),
      expectation: QUESTIONS.filter((item) => item.dimension === 'expectation'),
      mental: QUESTIONS.filter((item) => item.dimension === 'mental'),
    }),
    [],
  )

  const handleChange = (id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const base = calculateScores(answers)
    const enhanced = applySatireRules(base, answers)
    const narrative = buildNarrative(enhanced)
    onCalculated({ answers, score: enhanced, narrative })
  }

  return (
    <main className="layout">
      <header className="hero card">
        <p className="badge">National Youth Survival Audit Engine · Beta</p>
        <h1>你的人生进度条</h1>
        <p>
          本系统不承诺改变人生，只负责量化荒谬。评估对象为学生与初入职场群体，所有结论仅供社交转发与轻度自救参考。
        </p>
      </header>

      <form className="form-grid" onSubmit={handleSubmit}>
        <QuestionGroup
          title="学业 / 工作环境"
          description="系统会根据你的会议密度、推进效率和加班结构计算“组织适配度”。"
          questions={groupedQuestions.environment}
          answers={answers}
          onChange={handleChange}
        />
        <QuestionGroup
          title="生存财务"
          description="我们只做冷静评估，不对月初有钱月末哲学进行道德审判。"
          questions={groupedQuestions.finance}
          answers={answers}
          onChange={handleChange}
        />
        <QuestionGroup
          title="社会期待"
          description="外界催促会被折算成背景噪声，并计入进度损耗。"
          questions={groupedQuestions.expectation}
          answers={answers}
          onChange={handleChange}
        />
        <QuestionGroup
          title="心理续航"
          description="系统默认你是成年人，并允许你偶尔状态不在线。"
          questions={groupedQuestions.mental}
          answers={answers}
          onChange={handleChange}
        />

        <div className="card cta-block">
          <button type="submit">开始审计我的人生</button>
        </div>
      </form>
    </main>
  )
}
