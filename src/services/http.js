import { API_BASE_URL } from '@/config/env'

export class ApiError extends Error {
  constructor(message, { status = null, cause = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.cause = cause
  }
}

/**
 * Thin fetch wrapper: query params, timeout, caller-supplied abort signal,
 * and normalised errors. Every future service module builds on this.
 */
export async function request(path, { params = {}, signal, timeoutMs = 15000 } = {}) {
  const url = new URL(path, API_BASE_URL)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const signals = [AbortSignal.timeout(timeoutMs)]
  if (signal) signals.push(signal)

  let res
  try {
    res = await fetch(url, { signal: AbortSignal.any(signals) })
  } catch (err) {
    if (err.name === 'TimeoutError') {
      throw new ApiError('The backend took too long to respond.', { cause: err })
    }
    if (err.name === 'AbortError') throw err // superseded request: let the caller ignore it
    throw new ApiError(`Cannot reach the backend at ${API_BASE_URL}. Is the server running?`, { cause: err })
  }

  let body = null
  try {
    body = await res.json()
  } catch {
    /* non-JSON body */
  }

  if (!res.ok) {
    throw new ApiError(body?.error ?? `Request failed with status ${res.status}.`, { status: res.status })
  }
  return body
}
