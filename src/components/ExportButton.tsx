import { useState, type RefObject } from 'react'
import { Download, ImageIcon } from 'lucide-react'
import { toPng } from 'html-to-image'
import { cn } from '@/lib/utils'

type ExportButtonProps = {
  targetRef: RefObject<HTMLElement | null>
  fileBaseName?: string
  className?: string
}

export function ExportButton({ targetRef, fileBaseName = '平行宇宙职业', className }: ExportButtonProps) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function runExport(mode: 'download' | 'clipboard') {
    const node = targetRef.current
    if (!node) {
      setMessage('暂无可导出的卡片')
      return
    }
    setBusy(true)
    setMessage(null)
    try {
      await document.fonts.ready

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#12151c',
      })

      if (mode === 'download') {
        const link = document.createElement('a')
        const safeName = fileBaseName.replace(/[/\\?%*:|"<>]/g, '-').slice(0, 40)
        link.download = `${safeName}-${Date.now()}.png`
        link.href = dataUrl
        link.click()
        setMessage('已保存 PNG')
      } else {
        const blob = await (await fetch(dataUrl)).blob()
        if (!navigator.clipboard || !window.ClipboardItem) {
          setMessage('当前环境不支持复制图片，请改用下载')
          return
        }
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setMessage('已复制图片到剪贴板')
      }
    } catch (e) {
      console.error(e)
      setMessage('导出失败，请重试或换浏览器')
    } finally {
      setBusy(false)
      window.setTimeout(() => setMessage(null), 4000)
    }
  }

  return (
    <div className={cn('flex flex-col items-stretch gap-2', className)}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void runExport('download')}
          className={cn(
            'inline-flex items-center justify-center gap-2 border border-[#7dd3c0]/45',
            'bg-[#7dd3c0]/10 px-4 py-2.5 font-mono-strict text-sm font-medium text-[#d7f5ee]',
            'hover:bg-[#7dd3c0]/18 disabled:opacity-50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3c0]/60',
          )}
        >
          <Download className="h-4 w-4" aria-hidden />
          {busy ? '导出中…' : '下载 PNG'}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void runExport('clipboard')}
          className={cn(
            'inline-flex items-center justify-center gap-2 border border-[#3a4254]',
            'bg-[#161a22] px-4 py-2.5 font-mono-strict text-sm font-medium text-[#c5cad6]',
            'hover:bg-[#1c212c] disabled:opacity-50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b7287]/50',
          )}
        >
          <ImageIcon className="h-4 w-4" aria-hidden />
          复制图片
        </button>
      </div>
      {message ? (
        <p className="text-center font-mono-strict text-xs text-[#7dd3c0]" role="status">
          {message}
        </p>
      ) : null}
    </div>
  )
}
