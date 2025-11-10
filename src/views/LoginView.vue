<template>
  <div class="login-container">
    <div class="row h-100">
      <!-- Lado izquierdo: texto -->
      <div class="col-md-6 d-flex justify-content-center align-items-center">
        <div class="text-white px-5">
          <h1>Las mejores pelis 🍿</h1>
          <p>Disfruta del mejor catálogo de películas con nosotros.</p>
        </div>
      </div>

      <!-- Lado derecho: login -->
      <div class="col-md-6 d-flex justify-content-center align-items-center">
        <div class="card shadow p-4" style="width:380px;">
          <h2 class="text-center mb-3">Iniciar Sesión</h2>

          <div v-if="alert.message" :class="`alert alert-${alert.type}`" role="alert">
            {{ alert.message }}
          </div>

          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="username" class="form-label">Usuario</label>
              <input id="username" v-model="username" type="text" class="form-control" />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input id="password" v-model="password" type="password" class="form-control" />
            </div>

            <button class="btn btn-success w-100" type="submit">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import usuarios from '../data/usuarios.json' // archivo local con usuarios

const username = ref('')
const password = ref('')
const router = useRouter()

const alert = ref({ message: '', type: 'danger' })

const login = () => {
  if (!username.value || !password.value) {
    alert.value = { message: 'Por favor ingresa usuario y contraseña', type: 'warning' }
    return
  }

  const user = usuarios.find(u => u.username === username.value && u.password === password.value)

  if (user) {
    // Guardar sesión básica
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userRole', user.role || 'user')
    localStorage.setItem('username', user.username)

    // Redirigir según rol
    if (user.role === 'admin') {
      router.push('/dashboard')
    } else {
      router.push('/productos')
    }
  } else {
    alert.value = { message: 'Credenciales inválidas', type: 'danger' }
    // limpiar alerta luego de 3s
    setTimeout(() => { alert.value = { message: '', type: 'danger' } }, 3000)
  }
}
</script>

<style scoped>
.login-container {
  background-image: url('https://i.pinimg.com/736x/91/1f/ae/911faeb1679a0530cb80855caa837704.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  position: fixed; /* Añadido para fijar el fondo */
  top: 0;
  left: 0;
}

.row {
  margin: 0;
  width: 100%;
  min-height: 100vh;
}

.col-md-6 {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-white {
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}
</style>
