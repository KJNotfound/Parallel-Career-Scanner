interface ProgressMeterProps {
  label: string
  score: number
}

export function ProgressMeter({ label, score }: ProgressMeterProps) {
  return (
    <div className="meter">
      <div className="meter-label">
        <span>{label}</span>
        <strong>{score}%</strong>
      </div>
      <div className="meter-track" aria-hidden="true">
        <div className="meter-fill" style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}
