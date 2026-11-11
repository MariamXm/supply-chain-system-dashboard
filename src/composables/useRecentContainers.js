import { useLocalStorage } from './useLocalStorage'

// Module-level so every component shares one list.
const recent = useLocalStorage('recent-containers', [])

export function useRecentContainers(limit = 5) {
  function remember(id) {
    recent.value = [id, ...recent.value.filter((x) => x !== id)].slice(0, limit)
  }
  return { recent, remember }
}
