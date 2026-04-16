import { useState } from 'react'
import { FormPage } from './pages/FormPage'
import { ResultPage } from './pages/ResultPage'
import type { Answers, NarrativeResult, ScoreBreakdown } from './types/schema'

interface ResultPayload {
  answers: Answers
  score: ScoreBreakdown
  narrative: NarrativeResult
}

function App() {
  const [result, setResult] = useState<ResultPayload | null>(null)

  if (!result) {
    return <FormPage onCalculated={setResult} />
  }

  return (
    <ResultPage
      score={result.score}
      narrative={result.narrative}
      onReset={() => setResult(null)}
    />
  )
}

export default App
