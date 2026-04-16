/** 由公历生日推算太阳黄道星座（娱乐用边界）。 */
export function sunSignFromIsoDate(iso: string): { key: string; label: string } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return { key: 'unknown', label: '未知' }
  const m = Number(iso.slice(5, 7))
  const d = Number(iso.slice(8, 10))
  if (Number.isNaN(m) || Number.isNaN(d)) return { key: 'unknown', label: '未知' }

  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return { key: 'aries', label: '白羊座' }
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return { key: 'taurus', label: '金牛座' }
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return { key: 'gemini', label: '双子座' }
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return { key: 'cancer', label: '巨蟹座' }
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return { key: 'leo', label: '狮子座' }
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return { key: 'virgo', label: '处女座' }
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return { key: 'libra', label: '天秤座' }
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return { key: 'scorpio', label: '天蝎座' }
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return { key: 'sagittarius', label: '射手座' }
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return { key: 'capricorn', label: '摩羯座' }
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return { key: 'aquarius', label: '水瓶座' }
  if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) return { key: 'pisces', label: '双鱼座' }
  return { key: 'unknown', label: '未知' }
}

const WEEKDAY_ZH = ['日', '一', '二', '三', '四', '五', '六'] as const

/**
 * 由生日衍生的「个体时痕」：日期、星期、年内序日、简易熵位（仅展示，与种子中的生日一致）。
 */
export function formatPersonalMark(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '（未登记生辰）'
  const d = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(d.getTime())) return '（未登记生辰）'
  const y = d.getFullYear()
  const start = new Date(`${y}-01-01T12:00:00`)
  const doy = Math.floor((d.getTime() - start.getTime()) / 86400000) + 1
  const w = WEEKDAY_ZH[d.getDay()]!
  const digitSum = iso.replace(/\D/g, '').split('').reduce((acc, ch) => acc + Number(ch), 0)
  const entropy = digitSum % 97
  return `${iso} · 星期${w} · 年内第${doy}日 · 熵位${String(entropy).padStart(2, '0')}`
}
