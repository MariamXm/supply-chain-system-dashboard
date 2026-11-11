<template>
  <div class="animate-pulse space-y-4 rounded-lg border border-line bg-surface p-5" aria-hidden="true">
    <div class="h-4 w-1/3 rounded bg-frost"></div>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div v-for="n in 4" :key="n" class="h-20 rounded bg-frost"></div>
    </div>
    <div class="h-12 rounded bg-frost"></div>
  </div>
</template>
