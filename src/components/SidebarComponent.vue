<template>
  <div class="sidebar p-3">
    <div class="d-flex flex-column h-100">
      <h3 class="mb-4">Cinema Admin</h3>
      <nav class="nav flex-column">
        <router-link 
          class="nav-link text-white" 
          :class="{ active: $route.path === '/dashboard' }"
          to="/dashboard"
        >
          Dashboard
        </router-link>
        <router-link 
          class="nav-link text-white" 
          :class="{ active: $route.path.includes('/productos') }"
          to="/dashboard/productos"
        >
          Películas
        </router-link>
      </nav>
      <div class="mt-auto">
        <button class="btn btn-outline-light w-100" @click="logout">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const logout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userRole')
  localStorage.removeItem('username')
  // Recargar la página para limpiar todo el estado
  window.location.href = '/login'
}
</script>

<style scoped>
.nav-link.active {
  background-color: rgba(255,255,255,0.1);
}

.nav-link:hover {
  background-color: rgba(255,255,255,0.05);
}
</style>