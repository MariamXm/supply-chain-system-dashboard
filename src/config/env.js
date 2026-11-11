export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'
export const IPFS_GATEWAY =
  import.meta.env.VITE_IPFS_GATEWAY ?? 'https://white-rational-whale-258.mypinata.cloud/ipfs'

/** Cold-chain rule enforced by the Lambda validator: warning when temp > -18 °C */
export const SAFE_MAX_TEMP_C = -18

export const ipfsUrl = (cid) => `${IPFS_GATEWAY}/${cid}`

/** Container opened automatically at "/" so the dashboard never starts empty. */
export const DEFAULT_CONTAINER = (import.meta.env.VITE_DEFAULT_CONTAINER ?? '').trim()

/** Live-update interval */
export const REFRESH_MS = (Number(import.meta.env.VITE_REFRESH_SECONDS) || 15) * 1000

/** Containers shown in the fleet overview. The backend has no "list containers" endpoint, so this is configured. */
export const CONTAINERS = [
  ...new Set((import.meta.env.VITE_CONTAINERS ?? '').split(',').map((s) => s.trim()).filter(Boolean)),
]

/** Fleet cards refresh slower than the active container, since each one is a separate backend call. */
export const FLEET_REFRESH_MS = 60_000
