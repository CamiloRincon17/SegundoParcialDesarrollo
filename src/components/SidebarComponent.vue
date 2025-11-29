<template>
  <div class="sidebar p-3 ">
    <div class="d-flex flex-column h-100">
      <h3 class="mb-4">
        <i class="bi bi-speedometer2 me-2"></i>
        Admin Panel
      </h3>
      <nav class="nav flex-column ">
        <router-link class="sidebar-link" to="/dashboard">
          <i class="bi bi-house-door-fill me-2"></i>
          Dashboard
        </router-link>

        <router-link class="sidebar-link" to="/productos">
          <i class="bi bi-globe me-2"></i>
          Página Principal
        </router-link>

      </nav>
      <div class="mt-auto">
        <button class="btn btn-outline-light w-100" @click="logout">
          <i class="bi bi-box-arrow-right me-2"></i>
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
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
.sidebar-link {
  display: block;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.sidebar-link:hover {
  background-color: rgba(0, 255, 123, 0.1);
  color: #fff;
}
.router-link-exact-active {
  background-color: #0d6efd;
  color: #fff;
  font-weight: 500;
}
</style>