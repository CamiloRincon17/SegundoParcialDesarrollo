<template>
  <div class="login-container">
    <form @submit.prevent="login" class="login-form">
      <h2>Iniciar Sesión</h2>
      <div class="form-group">
        <label for="username">Usuario:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="login-button">Entrar</button>
    </form>
  </div>
</template>

<script>
import usuarios from '@/data/usuarios.json';

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    login() {
      const user = usuarios.find(u => u.username === this.username);

      if (user && user.password === this.password) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', user.username);
        this.$router.push('/dashboard');
      } else {
        alert('Credenciales incorrectas');
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-form {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: bold;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0056b3;
}
</style>
