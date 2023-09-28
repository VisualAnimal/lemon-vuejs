import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Category from '@/views/CategoryView.vue'
import Product from '@/views/Product.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/category',
      name: 'category',
      component: Category
    },
    {
      path: '/product',
      name: 'product',
      component: Product
    }
  ]
})

export default router
