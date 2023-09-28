import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EditPage from '@/views/EditPage.vue'
import TestPage from '@/views/TestPage.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/edit',
      name: 'edit',
      component: EditPage
    },
    {
      path: '/test',
      name: 'test',
      component: TestPage
    }
  ]
})

export default router
