import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import ProductoView from '../views/ProductoView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  { path: '/', redirect: '/productos' },
  { path: '/login', name: 'login', component: LoginView },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: 'productos' },
      { path: 'productos', name: 'dashboard-productos', component: ProductoView }
    ]
  },
  { path: '/productos', name: 'public-productos', component: ProductoView, meta: { requiresAuth: true } } // si quieres accesible fuera del dashboard
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const userRole = localStorage.getItem('userRole')

  if (to.meta.requiresAuth) {
    if (isAuthenticated) {
      if (to.meta.role && to.meta.role !== userRole) {
        // Si el rol no es el correcto, redirigir
        next({ name: 'public-productos' }) // o a una página de "no autorizado"
      } else {
        // Si está autenticado y tiene el rol correcto (o no se requiere rol)
        next()
      }
    } else {
      // Si no está autenticado, redirigir al login
      next({ name: 'login' })
    }
  } else {
    // Si la ruta no requiere autenticación
    next()
  }
})

export default router
