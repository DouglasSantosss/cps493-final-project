import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresAdmin?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/activities',
      name: 'activities',
      component: () => import('../views/ActivitiesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('../views/FriendsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login' }
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: 'home' }
  }

  if (to.name === 'login' && authStore.isLoggedIn) {
    return { name: 'home' }
  }
})

export default router
