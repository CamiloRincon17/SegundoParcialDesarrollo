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
            ¿No tienes cuenta? <a href="#" @click.prevent="showRegisterModal = true" class="text-success">Crear cuenta</a>
          </p>
        </form>
      </div>
    </div>

    <!-- Modal de Registro -->
    <div v-if="showRegisterModal" class="modal-overlay" @click.self="showRegisterModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-white">Crear Nueva Cuenta</h3>
          <button @click="showRegisterModal = false" class="btn-close" aria-label="Close">×</button>
        </div>

        <div v-if="registerAlert.message" :class="`alert alert-${registerAlert.type}`" role="alert">
          {{ registerAlert.message }}
        </div>

        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="registerName" class="form-label text-white">Nombre completo</label>
            <input
              v-model="registerForm.name"
              type="text"
              class="form-control bg-dark text-white border-0"
              id="registerName"
              placeholder="Tu nombre"
              required
            />
          </div>

          <div class="mb-3">
            <label for="registerEmail" class="form-label text-white">Correo electrónico</label>
            <input
              v-model="registerForm.email"
              type="email"
              class="form-control bg-dark text-white border-0"
              id="registerEmail"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div class="mb-3">
            <label for="registerPassword" class="form-label text-white">Contraseña</label>
            <input
              v-model="registerForm.password"
              type="password"
              class="form-control bg-dark text-white border-0"
              id="registerPassword"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div class="mb-3">
            <label for="registerPasswordConfirm" class="form-label text-white">Confirmar contraseña</label>
            <input
              v-model="registerForm.passwordConfirm"
              type="password"
              class="form-control bg-dark text-white border-0"
              id="registerPasswordConfirm"
              placeholder="Repite tu contraseña"
              required
            />
          </div>

          <div class="mb-3">
            <label for="accessCode" class="form-label text-white">
              Código de acceso <span class="text-muted">(opcional)</span>
            </label>
            <input
              v-model="registerForm.accessCode"
              type="text"
              class="form-control bg-dark text-white border-0"
              id="accessCode"
              placeholder="ADMIN2025 o SUPER2025"
            />
            <small class="text-muted">Dejar vacío para cuenta regular</small>
          </div>

          <button type="submit" class="btn btn-custom w-100 mb-2">CREAR CUENTA</button>
          <button type="button" @click="showRegisterModal = false" class="btn btn-secondary w-100">CANCELAR</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// Importa las funciones de autenticación desde el servicio API
import { loginUser, registerUser } from '../service/api'

export default {
  name: "LoginView",
  // `data` contiene el estado local del componente.
  data() {
    return {
      email: "", // Almacena el correo electrónico ingresado por el usuario.
      password: "", // Almacena la contraseña ingresada por el usuario.
      showPassword: false, // Controla si la contraseña se muestra o no.
      alert: { message: '', type: 'danger' }, // Objeto para gestionar los mensajes de alerta.
      showRegisterModal: false, // Controla la visibilidad del modal de registro
      registerForm: { // Datos del formulario de registro
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        accessCode: '' // Código para asignar rol admin o superadmin
      },
      registerAlert: { message: '', type: 'danger' } // Alertas del modal de registro
    };
  },
  // `methods` contiene las funciones que se pueden llamar desde el template.
  methods: {
    // Cambia el estado de `showPassword` para mostrar u ocultar la contraseña.
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    // Gestiona el proceso de inicio de sesión usando MockAPI.
    async handleLogin() {
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

      try {
        // Llama a la API para validar las credenciales del usuario.
        const user = await loginUser(this.email, this.password)

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
      } catch (error) {
        // Si hay un error de conexión o del servidor, se muestra un mensaje.
        console.error('Error en login:', error)
        this.alert = { message: 'Error al conectar con el servidor. Verifica tu conexión.', type: 'danger' }
        setTimeout(() => { this.alert = { message: '', type: 'danger' } }, 3000)
      }
    },
    // Gestiona el proceso de registro de nuevos usuarios.
    async handleRegister() {
      // Validación básica
      if (!this.registerForm.name || !this.registerForm.email || !this.registerForm.password) {
        this.registerAlert = { message: 'Por favor completa todos los campos', type: 'warning' }
        setTimeout(() => { this.registerAlert = { message: '', type: 'danger' } }, 3000)
        return
      }

      // Validación del formato del correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.registerForm.email)) {
        this.registerAlert = { message: 'Por favor ingresa un correo electrónico válido', type: 'warning' }
        setTimeout(() => { this.registerAlert = { message: '', type: 'danger' } }, 3000)
        return
      }

      // Validación de longitud de contraseña
      if (this.registerForm.password.length < 6) {
        this.registerAlert = { message: 'La contraseña debe tener al menos 6 caracteres', type: 'warning' }
        setTimeout(() => { this.registerAlert = { message: '', type: 'danger' } }, 3000)
        return
      }

      // Validación de coincidencia de contraseñas
      if (this.registerForm.password !== this.registerForm.passwordConfirm) {
        this.registerAlert = { message: 'Las contraseñas no coinciden', type: 'warning' }
        setTimeout(() => { this.registerAlert = { message: '', type: 'danger' } }, 3000)
        return
      }

      try {
        // Determinar el rol según el código de acceso
        const ADMIN_CODE = "ADMIN2025"
        const SUPERADMIN_CODE = "SUPER2025"
        
        let userRole = 'user' // Por defecto
        if (this.registerForm.accessCode === SUPERADMIN_CODE) {
          userRole = 'superadmin'
        } else if (this.registerForm.accessCode === ADMIN_CODE) {
          userRole = 'admin'
        }

        // Crear el nuevo usuario en la API
        const newUser = {
          username: this.registerForm.email,
          password: this.registerForm.password,
          name: this.registerForm.name,
          role: userRole
        }

        await registerUser(newUser)

        // Mostrar mensaje de éxito
        this.registerAlert = { message: '¡Cuenta creada exitosamente! Redirigiendo...', type: 'success' }
        
        // Guardar sesión automáticamente
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userRole', userRole)
        localStorage.setItem('username', newUser.username)

        // Redirigir según el rol
        setTimeout(() => {
          if (userRole === 'admin' || userRole === 'superadmin') {
            this.$router.push('/dashboard')
          } else {
            this.$router.push('/productos')
          }
        }, 2000)
      } catch (error) {
        console.error('Error en registro:', error)
        this.registerAlert = { message: 'Error al crear la cuenta. Intenta de nuevo.', type: 'danger' }
        setTimeout(() => { this.registerAlert = { message: '', type: 'danger' } }, 3000)
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

/* Estilos del modal de registro */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 255, 144, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.btn-close {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.3s;
}

.btn-close:hover {
  color: #00ff90;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
  border: none;
  transition: 0.3s;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

</style>
