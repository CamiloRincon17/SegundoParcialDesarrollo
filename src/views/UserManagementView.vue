<template>
  <div class="user-management-container">
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="header-section mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h1 class="text-white mb-2">
            <i class="bi bi-people-fill me-2"></i>
            Gestión de Usuarios
          </h1>
          <p class="text-muted">Administra roles y permisos de los usuarios del sistema</p>
        </div>
        <button @click="openModalForCreate" class="btn btn-success btn-lg">
          <i class="bi bi-plus-circle me-2"></i>
          Crear Usuario
        </button>
      </div>

      <!-- Estadísticas -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="stat-card stat-total">
            <div class="stat-icon">
              <i class="bi bi-people-fill"></i>
            </div>
            <div class="stat-info">
              <h3>{{ totalUsers }}</h3>
              <p>Total Usuarios</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="stat-card stat-admin">
            <div class="stat-icon">
              <i class="bi bi-gear-fill"></i>
            </div>
            <div class="stat-info">
              <h3>{{ adminCount }}</h3>
              <p>Administradores</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="stat-card stat-superadmin">
            <div class="stat-icon">
              <i class="bi bi-shield-fill-check"></i>
            </div>
            <div class="stat-info">
              <h3>{{ superAdminCount }}</h3>
              <p>Super Admins</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerta de Bootstrap -->
      <AlertComponent
        v-model="showAlert"
        :message="alert.message"
        :type="alert.type"
        :duration="3000"
      />

      <!-- Tabla de Usuarios -->
      <div class="table-container">
        <table class="table table-dark table-hover">
          <thead>
            <tr>
              <th><i class="bi bi-hash me-1"></i>ID</th>
              <th><i class="bi bi-person-fill me-1"></i>Nombre</th>
              <th><i class="bi bi-envelope-fill me-1"></i>Email</th>
              <th><i class="bi bi-shield-fill me-1"></i>Rol</th>
              <th><i class="bi bi-gear-fill me-1"></i>Acciones</th>
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
                  <button 
                    @click="openModalForEdit(user)" 
                    class="btn btn-sm btn-primary"
                    title="Editar usuario"
                  >
                    <i class="bi bi-pencil-fill me-1"></i>
                    Editar
                  </button>
                  <button 
                    @click="confirmDelete(user)" 
                    class="btn btn-sm btn-danger"
                    :disabled="user.username === currentUser"
                    title="Eliminar usuario"
                  >
                    <i class="bi bi-trash-fill me-1"></i>
                    Eliminar
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
          <i class="bi bi-arrow-left me-2"></i>
          Volver al Dashboard
        </router-link>
      </div>
    </div>

    <!-- Modal de Usuario (Crear/Editar) -->
    <UserModal
      :show="showUserModal"
      :user="selectedUser"
      @close="closeUserModal"
      @saved="handleSaveUser"
    />

    <!-- Modal de Confirmación de Eliminación -->
    <ConfirmModal
      :show="showDeleteModal"
      title="Confirmar Eliminación"
      :message="`¿Estás seguro de que deseas eliminar al usuario '${userToDelete?.name}'?`"
      warningMessage="Esta acción no se puede deshacer."
      confirmText="Eliminar"
      cancelText="Cancelar"
      confirmType="danger"
      @confirm="deleteUser"
      @cancel="showDeleteModal = false"
      @close="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUsers, createUser, updateUser, deleteUser as deleteUserAPI } from '../service/api'
import UserModal from '../components/UserModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import AlertComponent from '../components/AlertComponent.vue'

// Estados principales
const users = ref([])
const currentUser = localStorage.getItem('username')

// Estados de modales
const showUserModal = ref(false)
const selectedUser = ref(null)
const showDeleteModal = ref(false)
const userToDelete = ref(null)

// Estados de alertas
const showAlert = ref(false)
const alert = ref({ message: '', type: 'success' })

// Computed
const totalUsers = computed(() => users.value.length)
const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length)
const superAdminCount = computed(() => users.value.filter(u => u.role === 'superadmin').length)

// Funciones
const loadUsers = async () => {
  try {
    const response = await getUsers()
    users.value = response.data
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
    displayAlert('Error al cargar usuarios', 'danger')
  }
}

const getRoleLabel = (role) => {
  const labels = {
    'user': '👤 Usuario',
    'admin': '🔧 Admin',
    'superadmin': '👑 Super Admin'
  }
  return labels[role] || role
}

const openModalForCreate = () => {
  selectedUser.value = null
  showUserModal.value = true
}

const openModalForEdit = (user) => {
  selectedUser.value = { ...user }
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
  selectedUser.value = null
}

const handleSaveUser = async (userData) => {
  try {
    if (selectedUser.value?.id) {
      // Actualizar usuario existente
      await updateUser(selectedUser.value.id, userData)
      const index = users.value.findIndex(u => u.id === selectedUser.value.id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...userData }
      }
      displayAlert('✅ Usuario actualizado correctamente', 'success')
    } else {
      // Crear nuevo usuario
      const response = await createUser(userData)
      users.value.push(response.data)
      displayAlert('✅ Usuario creado correctamente', 'success')
    }
    closeUserModal()
  } catch (error) {
    console.error('Error al guardar usuario:', error)
    displayAlert('❌ Error al guardar el usuario', 'danger')
  }
}

const confirmDelete = (user) => {
  if (user.username === currentUser) {
    displayAlert('⚠️ No puedes eliminarte a ti mismo', 'warning')
    return
  }
  userToDelete.value = user
  showDeleteModal.value = true
}

const deleteUser = async () => {
  try {
    await deleteUserAPI(userToDelete.value.id)
    users.value = users.value.filter(u => u.id !== userToDelete.value.id)
    displayAlert('✅ Usuario eliminado exitosamente', 'success')
    showDeleteModal.value = false
    userToDelete.value = null
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    displayAlert('❌ Error al eliminar el usuario', 'danger')
  }
}

const displayAlert = (message, type) => {
  alert.value = { message, type }
  showAlert.value = true
}

onMounted(loadUsers)
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
