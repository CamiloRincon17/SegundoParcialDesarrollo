<template>
  <div class="sidebar p-3 ">
    <div class="d-flex flex-column h-100">
      <h3 class="mb-4">
        <i class="bi bi-shield-lock-fill me-2"></i>
        Admin Panel
      </h3>
      <nav class="nav flex-column ">
        <router-link class="sidebar-link" to="/dashboard">
          <i class="bi bi-grid-fill me-2"></i>
          Dashboard
        </router-link>

        <router-link class="sidebar-link" to="/productos">
          <i class="bi bi-house-door-fill me-2"></i>
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

/* Hacer los iconos más notables */
h3 {
  white-space: nowrap;
}

h3 i {
  font-size: 1.5em;
  color: #00ff7b;
  text-shadow: 0 0 10px rgba(0, 255, 123, 0.5);
  vertical-align: middle;
}

.sidebar-link {
  display: block;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.sidebar-link i {
  font-size: 1.3em;
  color: #00ff7b;
  text-shadow: 0 0 8px rgba(0, 255, 123, 0.3);
  transition: all 0.3s ease;
  vertical-align: middle;
}

.sidebar-link:hover {
  background-color: rgba(0, 255, 123, 0.15);
  color: #fff;
  transform: translateX(5px);
}

.sidebar-link:hover i {
  color: #00ff7b;
  text-shadow: 0 0 15px rgba(0, 255, 123, 0.8);
  transform: scale(1.2);
}

.router-link-exact-active {
  background-color: rgba(0, 255, 123, 0.2);
  color: #fff;
  font-weight: 500;
  border-left: 3px solid #00ff7b;
}

.router-link-exact-active i {
  color: #00ff7b;
  text-shadow: 0 0 12px rgba(0, 255, 123, 0.6);
  transform: scale(1.15);
}

.btn-outline-light i {
  font-size: 1.2em;
  vertical-align: middle;
}
</style>