<!-- navbar y sus funcinalidades -->
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <!-- se linkea el nombre como si fuera un boton para mandarte a la parte de productos -->
      <router-link class="navbar-brand" to="/productos">Film Galaxy</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li v-if="isAuthenticated" class="nav-item">
            <span class="nav-link">{{ username }}</span>
          </li>
          <li v-if="isAuthenticated && userRole === 'admin'" class="nav-item">
            <router-link class="nav-link" to="/productos">Página Principal</router-link>
          </li>
          <li v-if="isAuthenticated && userRole === 'admin'" class="nav-item">
            <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <button class="btn btn-outline-light" @click="logout">
              Cerrar Sesión
            </button>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="btn btn-outline-light" to="/login">
              Iniciar Sesión
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'NavbarComponent',
  setup() {
    const route = useRoute()
    const username = ref('')
    const isAuthenticated = ref(false)
    const userRole = ref('')

    const updateAuthState = () => {
      isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true'
      userRole.value = localStorage.getItem('userRole') || ''
      username.value = localStorage.getItem('username') || 'Usuario'
    }

    // Escuchar cambios en el almacenamiento local (para cambios en otras pestañas)
    const handleStorageChange = (e) => {
      if (e.key === 'isAuthenticated' || e.key === 'userRole' || e.key === 'username') {
        updateAuthState()
      }
    }

    // Observar cambios en la ruta para actualizar el estado
    watch(() => route.path, () => {
      updateAuthState()
    })

    onMounted(() => {
      updateAuthState()
      window.addEventListener('storage', handleStorageChange)
    })

    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange)
    })

    const logout = () => {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userRole')
      localStorage.removeItem('username')
      // Recargar la página para limpiar todo el estado
      window.location.href = '/productos'
    }

    return {
      username,
      isAuthenticated,
      userRole,
      logout
    }
  }
}
</script>
