import { request, ApiError } from './http'

/**
 * @typedef {Object} LedgerRecord
 * @property {string} id
 * @property {string} cid
 * @property {string} blockchainHash
 * @property {string} computedHash
 * @property {boolean} verified
 * @property {number} timestamp            Unix seconds (block time)
 * @property {'SAFE'|'WARNING'} status
 * @property {{containerID:string,temperature:number,humidity:number,gpsLocation:string,recordedAt:string}} telemetry
 */

/** Maps the backend payload onto the shape the UI uses, so API changes stay in this file. */
function normalizeRecord(raw, index) {
  const data = raw.data ?? {}
  return {
    id: `${raw.cid ?? 'no-cid'}:${raw.timestamp ?? index}`,
    cid: raw.cid ?? '',
    blockchainHash: raw.blockchainHash ?? '',
    computedHash: raw.computedHash ?? '',
    verified: Boolean(raw.verified),
    timestamp: Number(raw.timestamp),
    status: raw.status ?? 'WARNING',
    payload: data,
    telemetry: {
      containerID: data.containerID ?? '',
      temperature: data.temperature,
      humidity: data.humidity,
      gpsLocation: data.gpsLocation ?? '',
      recordedAt: data.timestamp ?? '',
    },
  }
}

/** @returns {Promise<LedgerRecord[]>} */
export async function getContainerRecords(containerID, { signal } = {}) {
  const raw = await request('/product-data', { params: { containerID }, signal })
  if (!Array.isArray(raw)) throw new ApiError('The backend returned an unexpected response.')
  return raw.map(normalizeRecord)
}
