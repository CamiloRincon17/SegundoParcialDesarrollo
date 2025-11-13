import { createRouter, createWebHistory } from 'vue-router'
import DashboardProductoView from '@/views/DashboardProductoView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/productos',
    name: 'ProductosPublico',
    component: () => import('@/views/ProductoView.vue')
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard/productos'
      },
      {
        path: 'productos', // -> /dashboard/productos
        name: 'DashboardProductos',
        component: DashboardProductoView,
        meta: {
          requiresAdmin: true
        }
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const userRole = localStorage.getItem('userRole')
  
  // Si la ruta requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    alert('⚠️ Debes iniciar sesión para acceder')
    next('/login')
    return
  }

  // Si la ruta requiere ser admin y no lo es
  if (to.meta.requiresAdmin && userRole !== 'admin' && isAuthenticated) {
    alert('🚫 No tienes permisos para acceder a esta página')
    next('/productos') // Redirigir a la vista pública si no es admin
    return
  }

  // Si está autenticado e intenta ir a login, redirigir
  if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
})

export default router
