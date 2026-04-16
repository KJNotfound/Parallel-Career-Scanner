import { forwardRef } from 'react'
import type { MultiverseResult } from '@/lib/predict-multiverse'
import { cn } from '@/lib/utils'

type ResultCardProps = {
  result: MultiverseResult
  className?: string
}

/** 仪器读数风格分享卡，供 html-to-image 导出。 */
export const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(function ResultCard(
  { result, className },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative w-full max-w-[400px] overflow-hidden border border-[#2a3140] bg-[#12151c] text-[#d7dce8]',
        className,
      )}
      style={{ fontFamily: '"Noto Sans SC", system-ui, sans-serif' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(125,211,192,0.08) 2px, rgba(125,211,192,0.08) 3px)',
        }}
      />

      <div className="relative px-6 pb-7 pt-6">
        <header className="border-b border-[#252a35] pb-4">
          <p className="text-[0.7rem] font-medium tracking-wide text-[#7dd3c0]/90">平行宇宙职业扫描仪</p>
          <p className="mt-1 font-mono-strict text-[0.6rem] tracking-wide text-[#6b7287]">版本 v0.10.2 · 读数面板</p>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 font-mono-strict text-[0.62rem] text-[#9aa3b5]">
            <span className="text-[#5c6375]">样本编号</span>
            <span className="text-right text-[#c5cad6]">{result.subjectId}</span>
            <span className="text-[#5c6375]">分支编号</span>
            <span className="text-right text-[#c5cad6]">{result.branchId}</span>
            <span className="text-[#5c6375]">宇宙种子</span>
            <span className="text-right break-all text-[#c5cad6]">{result.cosmicSeedHex}</span>
            <span className="text-[#5c6375]">据点</span>
            <span className="text-right text-[#aeb6c8]">{result.colonyName}</span>
          </div>
        </header>

        <p className="mt-5 font-mono-strict text-[0.62rem] tracking-wide text-[#6b7287]">个体时痕</p>
        <p className="mt-1 text-sm font-semibold leading-snug tracking-tight text-[#eef1f7] sm:text-base">
          {result.nickname}
        </p>

        <div className="mt-6 border border-[#9a4d4d]/45 bg-[#0e1016]/80 px-4 py-4">
          <p className="font-mono-strict text-[0.62rem] font-medium tracking-wide text-[#d48a8a]">职务条</p>
          <h2 className="mt-2 text-[1.05rem] font-bold leading-snug text-[#f2f4f8]">{result.jobTitle}</h2>
          <p className="mt-1.5 font-mono-strict text-[0.65rem] leading-snug text-[#8b93a8]" lang="en">
            {result.jobTitleEn}
          </p>
        </div>

        <div className="mt-5 border border-[#7dd3c0]/25 bg-[#0e1016]/70 px-3.5 py-3">
          <p className="font-mono-strict text-[0.62rem] tracking-wide text-[#7dd3c0]">简录</p>
          <div className="mt-2 space-y-2 text-[0.74rem] leading-snug text-[#aeb6c8]">
            {result.storyBeats.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-2.5 border border-[#252a35] bg-[#0e1016]/60 px-3.5 py-3.5">
          <p className="font-mono-strict text-[0.62rem] tracking-wide text-[#6b7287]">观测统计</p>
          <ul className="list-none space-y-1.5 text-[0.74rem] leading-snug text-[#aeb6c8]">
            {result.stats.map((line, i) => (
              <li key={i} className="border-l-2 border-[#7dd3c0]/35 pl-2.5">
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 border-l-4 border-[#9a4d4d] bg-[#181c24]/90 px-3.5 py-3">
          <p className="font-mono-strict text-[0.62rem] tracking-wide text-[#9a4d4d]">判词</p>
          <p className="mt-2 text-[0.88rem] font-medium leading-snug text-[#e6e9f0]">{result.verdict}</p>
        </div>

        <p className="mt-4 font-mono-strict text-[0.62rem] leading-relaxed text-[#6b7287]">{result.footnote}</p>

        <p className="mt-6 border-t border-[#252a35] pt-3 text-center font-mono-strict text-[0.58rem] leading-relaxed text-[#5c6375]">
          仅供娱乐 · 宇宙学层面不提供保修
        </p>
      </div>
    </div>
  )
})
