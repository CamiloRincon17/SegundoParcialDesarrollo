
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProductoView from '@/views/ProductoView.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/productos', component: ProductoView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;