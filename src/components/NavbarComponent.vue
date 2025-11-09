<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Navbar</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/productos">Productos</router-link>
          </li>
        </ul>

        <div class="d-flex">
          <ul class="navbar-nav">
            <!-- Si el usuario está autenticado -->
            <li class="nav-item" v-if="isAuthenticated">
              <span class="nav-link">Bienvenido, {{ username }}</span>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <button class="btn btn-outline-danger" @click="logout">Cerrar Sesión</button>
            </li>

            <!-- Si NO está autenticado -->
            <li class="nav-item" v-else>
              <router-link class="btn btn-outline-success" to="/login">
                Iniciar Sesión
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
const username = ref(localStorage.getItem('username') || 'Usuario')

const logout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('username')
  isAuthenticated.value = false
  window.location.href = '/' // redirige al inicio
}
</script>
