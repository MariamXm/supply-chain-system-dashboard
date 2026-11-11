import { createRouter, createWebHistory } from 'vue-router'
import { DEFAULT_CONTAINER } from '@/config/env'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: { name: 'audit', params: { containerID: DEFAULT_CONTAINER || undefined } },
    },
    {
      path: '/audit/:containerID?',
      name: 'audit',
      component: () => import('@/views/AuditView.vue'), // lazy-loaded
      props: true,
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
