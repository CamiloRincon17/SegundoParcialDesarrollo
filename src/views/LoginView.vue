<template>
  <div class="split-screen-container">
    <!-- Left Pane (Image) - Hidden on small screens -->
    <div class="left-pane d-none d-md-block"></div>

    <!-- Right Pane (Form) -->
    <div class="right-pane d-flex align-items-center justify-content-center">
      <div class="form-wrapper">
        <h2 class="fw-bold mb-3 text-white">¡Qué alegría verte de nuevo!</h2>
        <h4 class="mb-4 text-white">Entrar</h4>

        <form @submit.prevent="handleLogin">
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

          <div class="mb-3">
            <label for="password" class="form-label text-white">Tu contraseña</label>
            <div class="input-group">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control bg-dark text-white border-0"
                id="password"
                placeholder="••••••••"
                required
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="togglePassword"
              >
                👁
              </button>
            </div>
          </div>

          <div class="mb-3 text-end">
            <a href="#" class="text-success text-decoration-none">¿Olvidaste la contraseña?</a>
          </div>

          <button type="submit" class="btn btn-custom w-100 mb-3">ENTRAR</button>

          <p class="text-center text-white">
            ¿No tienes cuenta? <a href="#" class="text-success">Crear cuenta</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    handleLogin() {
      // Credenciales quemadas (solo para desarrollo)
      const hardcodedEmail = "user@example.com";
      const hardcodedPassword = "password123";

      if (this.email === hardcodedEmail && this.password === hardcodedPassword) {
        alert("Inicio de sesión exitoso!");
        this.$router.push('/home'); // Redirige a la vista de Home
      } else {
        alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      }
    },
  },
};
</script>

<style scoped>
.split-screen-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #121218; /* Fallback for the form side */
}

.left-pane {
  flex: 1;
  background-image: url("https://cloudfront-us-east-1.images.arcpublishing.com/grupoclarin/QNUQ5DOKIVG7JLNGJJFJNAQLSM.jpg");
  background-size: cover;
  background-position: center;
}

.right-pane {
  flex: 1;
  padding: 3rem;
}

.form-wrapper {
  max-width: 450px;
  width: 100%;
}

.btn-custom {
  background-color: #00ff90;
  color: #000;
  font-weight: bold;
  transition: 0.3s;
}

.btn-custom:hover {
  background-color: #00cc72;
}

/* On smaller screens, the right pane takes the full width */
@media (max-width: 767.98px) {
  .right-pane {
    width: 100%;
  }
}
</style>
