<template>
  <!-- Modal Backdrop -->
  <div v-if="show" class="modal-backdrop fade show"></div>
  
  <!-- Modal -->
  <div v-if="show" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i :class="`bi ${user ? 'bi-pencil-fill' : 'bi-plus-circle-fill'} me-2`"></i>
            {{ user ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}
          </h5>
          <button type="button" class="btn-close" @click="emit('close')" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- Nombre -->
            <div class="mb-3">
              <label for="userName" class="form-label fw-bold">
                <i class="bi bi-person-fill me-1"></i>
                Nombre Completo <span class="text-danger">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                id="userName"
                placeholder="Ej: Juan Pérez"
                required
              />
              <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
            </div>

            <!-- Email -->
            <div class="mb-3">
              <label for="userEmail" class="form-label fw-bold">
                <i class="bi bi-envelope-fill me-1"></i>
                Correo Electrónico <span class="text-danger">*</span>
              </label>
              <input
                v-model="formData.username"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.username }"
                id="userEmail"
                placeholder="correo@ejemplo.com"
                required
              />
              <div v-if="errors.username" class="invalid-feedback">{{ errors.username }}</div>
            </div>

            <!-- Contraseña -->
            <div class="mb-3">
              <label for="userPassword" class="form-label fw-bold">
                <i class="bi bi-key-fill me-1"></i>
                Contraseña <span class="text-danger">*</span>
              </label>
              <div class="input-group">
                <input
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  id="userPassword"
                  :placeholder="user ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'"
                  :required="!user"
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="showPassword = !showPassword"
                >
                  <i :class="`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`"></i>
                </button>
              </div>
              <div v-if="errors.password" class="invalid-feedback d-block">{{ errors.password }}</div>
              <small v-if="user" class="form-text text-muted">
                Dejar vacío si no deseas cambiar la contraseña
              </small>
            </div>

            <!-- Rol -->
            <div class="mb-3">
              <label for="userRole" class="form-label fw-bold">
                <i class="bi bi-shield-fill-check me-1"></i>
                Rol <span class="text-danger">*</span>
              </label>
              <select
                v-model="formData.role"
                class="form-select"
                :class="{ 'is-invalid': errors.role }"
                id="userRole"
                required
              >
                <option value="">-- Seleccionar Rol --</option>
                <option value="user">👤 Usuario Regular</option>
                <option value="admin">🔧 Administrador</option>
                <option value="superadmin">👑 Super Administrador</option>
              </select>
              <div v-if="errors.role" class="invalid-feedback">{{ errors.role }}</div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="emit('close')">
            <i class="bi bi-x-circle me-1"></i>
            Cancelar
          </button>
          <button type="button" class="btn btn-primary" @click="handleSubmit">
            <i :class="`bi ${user ? 'bi-save-fill' : 'bi-plus-circle-fill'} me-1`"></i>
            {{ user ? 'Actualizar' : 'Crear Usuario' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  user: Object // Si existe, es modo edición
})

const emit = defineEmits(['close', 'saved'])

const initialFormState = {
  name: '',
  username: '',
  password: '',
  role: ''
}

const formData = ref({ ...initialFormState })
const errors = ref({})
const showPassword = ref(false)

// Validación del formulario
const validateForm = () => {
  errors.value = {}

  if (!formData.value.name || formData.value.name.trim().length < 3) {
    errors.value.name = 'El nombre debe tener al menos 3 caracteres'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.username || !emailRegex.test(formData.value.username)) {
    errors.value.username = 'Por favor ingresa un correo válido'
  }

  // Validar contraseña solo si es nuevo usuario o si se está cambiando
  if (!props.user) {
    // Crear nuevo usuario: contraseña obligatoria
    if (!formData.value.password || formData.value.password.length < 6) {
      errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    }
  } else if (formData.value.password && formData.value.password.length < 6) {
    // Editar: solo validar si se ingresó algo
    errors.value.password = 'Si cambias la contraseña, debe tener al menos 6 caracteres'
  }

  if (!formData.value.role) {
    errors.value.role = 'Debes seleccionar un rol'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  // Si es edición y no se cambió la contraseña, no enviarla
  const dataToSave = { ...formData.value }
  if (props.user && !dataToSave.password) {
    delete dataToSave.password
  }

  emit('saved', dataToSave)
}

const resetForm = () => {
  formData.value = { ...initialFormState }
  errors.value = {}
  showPassword.value = false
}

// Cargar datos del usuario al editar
watch(() => props.show, (newVal) => {
  if (newVal && props.user) {
    // Modo edición: cargar datos
    formData.value = {
      name: props.user.name || '',
      username: props.user.username || '',
      password: '', // No cargar la contraseña por seguridad
      role: props.user.role || ''
    }
  } else if (!newVal) {
    // Al cerrar: resetear
    resetForm()
  }
})
</script>

<style scoped>
.modal-content {
  border-radius: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  border-bottom: 2px solid #dee2e6;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header .btn-close {
  filter: brightness(0) invert(1);
}

.modal-title {
  font-weight: 600;
}

.form-label {
  color: #495057;
  margin-bottom: 0.5rem;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
}
</style>
