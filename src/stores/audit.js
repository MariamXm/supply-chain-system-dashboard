import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getContainerRecords } from '@/services/ledgerService'
import { forgeTamperedHash } from '@/utils/hash'

const FILTERS = {
  all: () => true,
  compliant: (r) => r.isCompliant,
  warning: (r) => !r.isCompliant,
  mismatch: (r) => !r.isVerified,
}

// In-memory response cache: containerID -> { records, at }
const cache = new Map()
export const useAuditStore = defineStore('audit', () => {
  // ---- state
  const activeContainer = ref('')
  const rawRecords = ref([])
  const status = ref('idle') // idle | loading | success | error
  const error = ref('')
  const demoMode = ref(false)
  const tamperedHashes = ref({}) // recordId -> forged hash (kept apart from server data)
  const statusFilter = ref('all')
  const sortOrder = ref('newest')
  const selectedId = ref(null) // null = follow the latest packet
  const lastUpdated = ref(null)
  const refreshFailed = ref(false)
  let controller = null

  // ---- getters
  /** Chronological records with derived UI fields. Server data is never mutated. */
  const records = computed(() =>
    [...rawRecords.value]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((r, i) => {
        const forged = tamperedHashes.value[r.id]
        return {
          ...r,
          sequence: i + 1,
          computedHash: forged ?? r.computedHash,
          isTampered: Boolean(forged),
          isVerified: r.verified && !forged,
          isCompliant: r.status === 'SAFE',
        }
      }),
  )

  const summary = computed(() => {
    const total = records.value.length
    return {
      total,
      verified: records.value.filter((r) => r.isVerified).length,
      compliant: records.value.filter((r) => r.isCompliant).length,
      latest: records.value.at(-1) ?? null,
    }
  })

  const latestRecord = computed(() => records.value.at(-1) ?? null)
  const selectedRecord = computed(
    () => records.value.find((r) => r.id === selectedId.value) ?? latestRecord.value,
  )
  const following = computed(() => selectedId.value === null)

  const counts = computed(() =>
    Object.fromEntries(Object.entries(FILTERS).map(([key, fn]) => [key, records.value.filter(fn).length])),
  )

  const visibleRecords = computed(() => {
    const list = records.value.filter(FILTERS[statusFilter.value])
    return sortOrder.value === 'newest' ? [...list].reverse() : list
  })

  // ---- actions
  /**
   * Loads a container's records.
   * - Cached result: shown instantly without another network request.
   * - `force: true` skips the cache (used by "Audit again" and "Try again").
   */
  async function audit(containerID, { force = false } = {}) {
    const id = containerID.trim()
    if (!id) return
    controller?.abort() // a newer search supersedes any in-flight one
    controller = new AbortController()

    activeContainer.value = id
    tamperedHashes.value = {}
    statusFilter.value = 'all'
    selectedId.value = null
    refreshFailed.value = false
    error.value = ''

    const cached = cache.get(id)
    if (cached && !force) {
      rawRecords.value = cached.records
      status.value = 'success'
      lastUpdated.value = cached.at
      return
    } else {
      status.value = 'loading'
    }

    try {
      const fresh = await getContainerRecords(id, { signal: controller.signal })
      cache.set(id, { records: fresh, at: Date.now() })
      rawRecords.value = fresh
      lastUpdated.value = Date.now()
      status.value = 'success'
    } catch (err) {
      if (err.name === 'AbortError') return
      if (status.value === 'success') return // background refresh failed: keep showing cached data
      rawRecords.value = []
      error.value = err.message
      status.value = 'error'
    }
  }

  /** Silent background refresh used by live mode: no loading state, keeps current data on failure. */
  async function refresh() {
    const id = activeContainer.value
    if (!id || status.value === 'loading') return
    try {
      const fresh = await getContainerRecords(id)
      if (id !== activeContainer.value) return // user switched container meanwhile
      cache.set(id, { records: fresh, at: Date.now() })
      rawRecords.value = fresh
      lastUpdated.value = Date.now()
      refreshFailed.value = false
      status.value = 'success'
      error.value = ''
    } catch {
      if (id === activeContainer.value) refreshFailed.value = true
    }
  }

  function selectPacket(id) {
    selectedId.value = id === latestRecord.value?.id ? null : id
  }

  function followLatest() {
    selectedId.value = null
  }

  function reset() {
    controller?.abort()
    activeContainer.value = ''
    rawRecords.value = []
    status.value = 'idle'
    error.value = ''
  }

  async function toggleTamper(id) {
    if (tamperedHashes.value[id]) {
      const { [id]: _removed, ...rest } = tamperedHashes.value
      tamperedHashes.value = rest
      return
    }
    const record = rawRecords.value.find((r) => r.id === id)
    if (!record) return
    tamperedHashes.value = { ...tamperedHashes.value, [id]: await forgeTamperedHash(record.computedHash) }
  }

  function setDemoMode(on) {
    demoMode.value = on
    if (!on) tamperedHashes.value = {}
  }

  return {
    activeContainer, status, error, demoMode, statusFilter, sortOrder,
    records, summary, counts, visibleRecords,
    selectedRecord, following, lastUpdated, refreshFailed,
    audit, refresh, selectPacket, followLatest, reset, toggleTamper, setDemoMode,
  }
})
