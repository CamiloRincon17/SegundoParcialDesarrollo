<template>
  <!--
    Este es el contenedor principal de la pantalla de inicio de sesión.
    Está dividido en dos paneles: uno para la imagen (izquierda) y otro para el formulario (derecha).
  -->
  <div class="split-screen-container">
    <!-- 
      Panel izquierdo (Imagen):
      Este panel ocupa la mitad de la pantalla en dispositivos de tamaño mediano y grandes (d-md-block).
      En pantallas pequeñas (d-none), se oculta para dar más espacio al formulario.
    -->
    <div class="left-pane d-none d-md-block"></div>

    <!-- 
      Panel derecho (Formulario):
      Este panel contiene el formulario de inicio de sesión.
      Utiliza Flexbox (d-flex, align-items-center, justify-content-center) para centrar el contenido vertical y horizontalmente.
    -->
    <div class="right-pane d-flex align-items-center justify-content-center">
      <div class="form-wrapper">
        <!-- Títulos del formulario -->
        <h2 class="fw-bold mb-3 text-white">¡Qué alegría verte de nuevo!</h2>
        <h4 class="mb-4 text-white">Entrar</h4>

        <!-- 
          Alerta de retroalimentación:
          Se muestra un mensaje de alerta si `alert.message` tiene contenido.
          La clase de la alerta (`alert-danger`, `alert-warning`, etc.) se asigna dinámicamente.
        -->
        <div v-if="alert.message" :class="`alert alert-${alert.type}`" role="alert">
          {{ alert.message }}
        </div>

        <!-- 
          Formulario de inicio de sesión:
          El evento `submit` se previene (`.prevent`) y en su lugar se llama al método `handleLogin`.
        -->
        <form @submit.prevent="handleLogin">
          <!-- Campo de correo electrónico -->
          <div class="mb-3">
            <label for="email" class="form-label text-white">Tu correo</label>
            <input
              v-model="email"
              type="email"
              class="form-control bg-dark text-white border-0"
              id="email"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <!-- Campo de contraseña -->
          <div class="mb-3">
            <label for="password" class="form-label text-white">Tu contraseña</label>
            <div class="input-group">
              <!-- 
                El tipo de input (`text` o `password`) cambia según el valor de `showPassword`.
                Esto permite mostrar u ocultar la contraseña.
              -->
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control bg-dark text-white border-0"
                id="password"
                placeholder="••••••••"
                required
              />
              <!-- Botón para mostrar/ocultar la contraseña -->
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="togglePassword"
              >
                👁
              </button>
            </div>
          </div>

          <!-- Enlace para recuperar contraseña -->
          <div class="mb-3 text-end">
            <a href="#" class="text-success text-decoration-none">¿Olvidaste la contraseña?</a>
          </div>

          <!-- Botón de envío del formulario -->
          <button type="submit" class="btn btn-custom w-100 mb-3">ENTRAR</button>

          <!-- Enlace para crear una nueva cuenta -->
          <p class="text-center text-white">
            ¿No tienes cuenta? <a href="#" class="text-success">Crear cuenta</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// Importa los datos de usuarios desde un archivo JSON local.
import usuarios from '../data/usuarios.json'

export default {
  name: "LoginView",
  // `data` contiene el estado local del componente.
  data() {
    return {
      email: "", // Almacena el correo electrónico ingresado por el usuario.
      password: "", // Almacena la contraseña ingresada por el usuario.
      showPassword: false, // Controla si la contraseña se muestra o no.
      alert: { message: '', type: 'danger' } // Objeto para gestionar los mensajes de alerta.
    };
  },
  // `methods` contiene las funciones que se pueden llamar desde el template.
  methods: {
    // Cambia el estado de `showPassword` para mostrar u ocultar la contraseña.
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    // Gestiona el proceso de inicio de sesión.
    handleLogin() {
      // Validación básica para asegurar que los campos no estén vacíos.
      if (!this.email || !this.password) {
        this.alert = { message: 'Por favor ingresa correo y contraseña', type: 'warning' }
        // Oculta la alerta después de 3 segundos.
        setTimeout(() => { this.alert = { message: '', type: 'danger' } }, 3000)
        return
      }

      // Validación del formato del correo electrónico usando una expresión regular.
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.alert = { message: 'Por favor ingresa un correo electrónico válido', type: 'warning' }
        setTimeout(() => { this.alert = { message: '', type: 'danger' } }, 3000)
        return
      }

      // Busca al usuario en el archivo JSON. Compara el correo y la contraseña.
      const user = usuarios.find(u => u.username.toLowerCase() === this.email.toLowerCase() && u.password === this.password)

      if (user) {
        // Si el usuario es válido, se guarda la información de sesión en `localStorage`.
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userRole', user.role || 'user')
        localStorage.setItem('username', user.username)

        // Redirige al usuario según su rol.
        if (user.role === 'admin') {
          this.$router.push('/dashboard')
        } else {
          this.$router.push('/productos')
        }
      } else {
        // Si las credenciales son inválidas, se muestra un mensaje de error.
        this.alert = { message: 'Credenciales inválidas', type: 'danger' }
        setTimeout(() => { this.alert = { message: '', type: 'danger' } }, 3000)
      }
    },
  },
};
</script>

<style scoped>
/* 
  `scoped` asegura que estos estilos solo se apliquen a este componente.
*/

/* Contenedor principal que divide la pantalla. */
.split-screen-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #121218; /* Color de fondo de respaldo */
}

/* Panel izquierdo con la imagen de fondo. */
.left-pane {
  flex: 1;
  background-image: url("https://cloudfront-us-east-1.images.arcpublishing.com/grupoclarin/QNUQ5DOKIVG7JLNGJJFJNAQLSM.jpg");
  background-size: cover;
  background-position: center;
}

/* Panel derecho que contiene el formulario. */
.right-pane {
  flex: 1;
  padding: 3rem;
  background-color: #121218;
}

/* Contenedor del formulario para limitar su ancho. */
.form-wrapper {
  max-width: 450px;
  width: 100%;
}

/* Estilos para el botón de "ENTRAR". */
.btn-custom {
  background-color: #00ff90;
  color: #000;
  font-weight: bold;
  transition: 0.3s;
}

.btn-custom:hover {
  background-color: #00cc72;
  color: #000;
}

/* Estilos para el botón de mostrar/ocultar contraseña. */
.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
  background-color: transparent;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}

/* Estilos para los campos de texto. */
.form-control.bg-dark {
  background-color: #1a1a1a !important;
  color: #fff !important;
}

.form-control.bg-dark:focus {
  background-color: #1a1a1a;
  color: #fff;
  border-color: #00ff90;
  box-shadow: 0 0 0 0.2rem rgba(0, 255, 144, 0.25);
}

/* Estilos para la alerta de mensajes. */
.alert {
  margin-bottom: 1rem;
}

/* 
  Media Query para pantallas pequeñas (menos de 768px).
  Hace que el panel del formulario ocupe todo el ancho.
*/
@media (max-width: 767.98px) {
  .right-pane {
    width: 100%;
    padding: 2rem 1.5rem;
  }
  
  .form-wrapper {
    max-width: 100%;
  }
}
</style>
