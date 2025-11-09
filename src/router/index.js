import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductoView from '../views/ProductoView.vue'

const routes = [
  { path: '/', redirect: '/productos' },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/productos', name: 'productos', component: ProductoView } // Quitamos meta: { requiresAuth: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const userRole = localStorage.getItem('userRole')
  
  // Si va al login y ya está autenticado
  if (to.path === '/login' && isAuthenticated) {
    next('/productos')
    return
  }
  
  // Proteger ruta de dashboard solo para admin
  if (to.path === '/dashboard') {
    if (!isAuthenticated || userRole !== 'admin') {
      next('/productos')
      return
    }
  }
  
  // Si requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }
  
  next()
})

export default router
