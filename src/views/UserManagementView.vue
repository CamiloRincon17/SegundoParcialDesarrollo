<template>
  <div class="user-management-container">
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="header-section mb-4">
        <h1 class="text-white mb-2">👥 Gestión de Usuarios</h1>
        <p class="text-muted">Administra roles y permisos de los usuarios del sistema</p>
      </div>

      <!-- Estadísticas -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="stat-card stat-total">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>{{ totalUsers }}</h3>
              <p>Total Usuarios</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="stat-card stat-admin">
            <div class="stat-icon">🔧</div>
            <div class="stat-info">
              <h3>{{ adminCount }}</h3>
              <p>Administradores</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="stat-card stat-superadmin">
            <div class="stat-icon">👑</div>
            <div class="stat-info">
              <h3>{{ superAdminCount }}</h3>
              <p>Super Admins</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerta -->
      <div v-if="alert.message" :class="`alert alert-${alert.type}`" role="alert">
        {{ alert.message }}
      </div>

      <!-- Tabla de Usuarios -->
      <div class="table-container">
        <table class="table table-dark table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.username }}</td>
              <td>
                <span :class="`badge role-${user.role}`">
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td>
                <div class="btn-group">
                  <select 
                    v-model="user.role" 
                    @change="updateUserRole(user)" 
                    class="form-select form-select-sm bg-dark text-white"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                  <button 
                    @click="confirmDelete(user)" 
                    class="btn btn-sm btn-danger ms-2"
                    :disabled="user.username === currentUser"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botón Volver -->
      <div class="mt-4">
        <router-link to="/dashboard" class="btn btn-secondary">
          ← Volver al Dashboard
        </router-link>
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content-small">
        <h4 class="text-white mb-3">⚠️ Confirmar Eliminación</h4>
        <p class="text-white">¿Estás seguro de que deseas eliminar al usuario <strong>{{ userToDelete?.name }}</strong>?</p>
        <p class="text-danger">Esta acción no se puede deshacer.</p>
        <div class="d-flex gap-2 mt-4">
          <button @click="deleteUser" class="btn btn-danger flex-fill">Eliminar</button>
          <button @click="showDeleteModal = false" class="btn btn-secondary flex-fill">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsers, updateUser, deleteUser } from '../service/api'

export default {
  name: 'UserManagementView',
  data() {
    return {
      users: [],
      alert: { message: '', type: 'success' },
      currentUser: localStorage.getItem('username'),
      showDeleteModal: false,
      userToDelete: null
    }
  },
  computed: {
    totalUsers() {
      return this.users.length
    },
    adminCount() {
      return this.users.filter(u => u.role === 'admin').length
    },
    superAdminCount() {
      return this.users.filter(u => u.role === 'superadmin').length
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    async loadUsers() {
      try {
        const response = await getUsers()
        this.users = response.data
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
        this.showAlert('Error al cargar usuarios', 'danger')
      }
    },
    getRoleLabel(role) {
      const labels = {
        'user': '👤 Usuario',
        'admin': '🔧 Admin',
        'superadmin': '👑 Super Admin'
      }
      return labels[role] || role
    },
    async updateUserRole(user) {
      try {
        await updateUser(user.id, { role: user.role })
        this.showAlert(`Rol actualizado a ${this.getRoleLabel(user.role)}`, 'success')
      } catch (error) {
        console.error('Error al actualizar rol:', error)
        this.showAlert('Error al actualizar el rol', 'danger')
      }
    },
    confirmDelete(user) {
      if (user.username === this.currentUser) {
        this.showAlert('No puedes eliminarte a ti mismo', 'warning')
        return
      }
      this.userToDelete = user
      this.showDeleteModal = true
    },
    async deleteUser() {
      try {
        await deleteUser(this.userToDelete.id)
        this.users = this.users.filter(u => u.id !== this.userToDelete.id)
        this.showAlert('Usuario eliminado exitosamente', 'success')
        this.showDeleteModal = false
        this.userToDelete = null
      } catch (error) {
        console.error('Error al eliminar usuario:', error)
        this.showAlert('Error al eliminar el usuario', 'danger')
      }
    },
    showAlert(message, type) {
      this.alert = { message, type }
      setTimeout(() => {
        this.alert = { message: '', type: 'success' }
      }, 3000)
    }
  }
}
</script>

<style scoped>
.user-management-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
  padding: 2rem 0;
}

.header-section h1 {
  font-size: 2.5rem;
  font-weight: bold;
}

/* Estadísticas */
.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 255, 144, 0.2);
}

.stat-icon {
  font-size: 3rem;
}

.stat-info h3 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  color: #00ff90;
}

.stat-info p {
  margin: 0;
  color: #aaa;
}

/* Tabla */
.table-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.table-dark {
  background-color: transparent;
}

.table-dark thead th {
  border-bottom: 2px solid #00ff90;
  color: #00ff90;
  font-weight: bold;
}

.table-dark tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-dark tbody tr:hover {
  background-color: rgba(0, 255, 144, 0.1);
}

/* Badges de roles */
.badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
}

.role-user {
  background-color: #3b82f6;
  color: white;
}

.role-admin {
  background-color: #10b981;
  color: white;
}

.role-superadmin {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #000;
}

/* Formularios */
.form-select-sm {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-select-sm:focus {
  border-color: #00ff90;
  box-shadow: 0 0 0 0.2rem rgba(0, 255, 144, 0.25);
}

/* Modal */
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
}

.modal-content-small {
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(255, 0, 0, 0.3);
}

/* Botones */
.btn {
  transition: all 0.3s;
}

.btn-secondary {
  background-color: #6c757d;
  border: none;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
