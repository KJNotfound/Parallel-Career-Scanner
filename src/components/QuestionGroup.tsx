import type { Answers, QuestionItem } from '../types/schema'

interface QuestionGroupProps {
  title: string
  description: string
  questions: QuestionItem[]
  answers: Answers
  onChange: (id: string, value: number) => void
}

export function QuestionGroup({ title, description, questions, answers, onChange }: QuestionGroupProps) {
  return (
    <section className="card question-group">
      <h2>{title}</h2>
      <p className="section-description">{description}</p>
      <div className="question-list">
        {questions.map((question) => (
          <label key={question.id} className="question-item">
            <span>{question.label}</span>
            <input
              type="range"
              min={question.min}
              max={question.max}
              step="0.5"
              value={answers[question.id] ?? question.defaultValue}
              onChange={(event) => onChange(question.id, Number(event.target.value))}
              aria-label={question.label}
            />
            <div className="question-meta">
              <strong>{answers[question.id] ?? question.defaultValue}</strong>
              <small>{question.hint}</small>
            </div>
          </label>
        ))}
      </div>
    </section>
  )
}
