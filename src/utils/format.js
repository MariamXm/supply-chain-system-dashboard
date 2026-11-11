export const formatTemp = (v) => (Number.isFinite(v) ? `${String(v).replace('-', '−')} °C` : '—')
export const formatHumidity = (v) => (Number.isFinite(v) ? `${v}%` : '—')

export function formatTimestamp(ts, options = { dateStyle: 'medium', timeStyle: 'short' }) {
  return Number.isFinite(ts) ? new Date(ts * 1000).toLocaleString(undefined, options) : 'N/A'
}

export function shortHash(hash, head = 8, tail = 6) {
  if (!hash) return '—'
  return hash.length <= head + tail + 1 ? hash : `${hash.slice(0, head)}…${hash.slice(-tail)}`
}

export function timeAgo(ts) {
  if (!Number.isFinite(ts)) return ''
  const diff = ts - Date.now() / 1000
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  for (const [unit, secs] of [['day', 86400], ['hour', 3600], ['minute', 60]]) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit)
  }
  return rtf.format(Math.round(diff), 'second')
}
