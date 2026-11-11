import { ref, watch } from 'vue'

export function useLocalStorage(key, initial) {
  function read() {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  }
  const state = ref(read())
  watch(
    state,
    (value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        /* storage unavailable: degrade silently */
      }
    },
    { deep: true },
  )
  return state
}
