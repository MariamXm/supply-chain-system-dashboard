import { formatTimestamp } from './format'

export function downloadFile(filename, content, mime) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }))
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  a.click()
  URL.revokeObjectURL(url)
}

const csvCell = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`

export function recordsToCsv(records) {
  const header = ['packet', 'time', 'temperature_c', 'humidity_pct', 'gps', 'status', 'verified', 'cid', 'computed_hash', 'onchain_hash']
  const rows = records.map((r) => [
    r.sequence, formatTimestamp(r.timestamp), r.telemetry.temperature, r.telemetry.humidity,
    r.telemetry.gpsLocation, r.status, r.isVerified, r.cid, r.computedHash, r.blockchainHash,
  ])
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')
}
