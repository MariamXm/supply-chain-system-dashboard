import { CONTAINERS } from '@/config/env'
import { getContainerRecords } from './ledgerService'

function summarize(id, records) {
  const latest = [...records].sort((a, b) => a.timestamp - b.timestamp).at(-1)
  return {
    id,
    state: 'ready',
    total: records.length,
    verified: records.filter((r) => r.verified).length,
    compliant: records.filter((r) => r.status === 'SAFE').length,
    latestTemp: latest?.telemetry.temperature ?? null,
    latestAt: latest?.timestamp ?? null,
  }
}

/**
 * One summary per container, shaped as { id, state, total, verified, compliant, latestTemp, latestAt }.
 *
 * TODAY: built from the existing per-container endpoint, one request per configured container.
 * LATER:  replace this body with a single `request('/containers')` call that returns the same shape.
 *         Nothing else in the app needs to change.
 */
export async function getFleetSummaries() {
  const results = await Promise.allSettled(CONTAINERS.map((id) => getContainerRecords(id)))
  return results.map((r, i) =>
    r.status === 'fulfilled' ? summarize(CONTAINERS[i], r.value) : { id: CONTAINERS[i], state: 'error' },
  )
}
