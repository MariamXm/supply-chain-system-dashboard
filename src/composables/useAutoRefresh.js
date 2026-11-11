import { onMounted, onUnmounted, watch } from 'vue'

/** Runs `task` every `intervalMs` while `enabled` is true and the tab is visible. */
export function useAutoRefresh(task, { intervalMs, enabled }) {
  let timer = null
  const stop = () => {
    clearInterval(timer)
    timer = null
  }
  const start = () => {
    stop()
    if (enabled.value) timer = setInterval(() => !document.hidden && task(), intervalMs)
  }
  watch(enabled, start)
  onMounted(start)
  onUnmounted(stop)
}
