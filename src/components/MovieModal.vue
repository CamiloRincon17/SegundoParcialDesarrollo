<!-- aqui se muesta lo de editar la pelicula -->
<script setup>
import { ref, watch, computed } from 'vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  show: Boolean,
  movie: Object,
  genres: Array,
})

// eslint-disable-next-line no-undef
const emit = defineEmits(['close', 'saved'])

const initialFormState = {
  title: '',
  genre: '',
  year: new Date().getFullYear(),
  price: null,
  image: '',
  description: '',
}

const formData = ref({ ...initialFormState })
const errors = ref({})

// --- VALIDACIÓN ---

const validateForm = () => {
  errors.value = {}

  if (!formData.value.title || formData.value.title.trim().length < 3) {
    errors.value.title = 'El título debe tener al menos 3 caracteres'
  }
  if (!formData.value.genre) {
    errors.value.genre = 'Debes seleccionar un género.'
  }
  const currentYear = new Date().getFullYear()
  if (!formData.value.year || formData.value.year < 1900 || formData.value.year > currentYear + 1) {
    errors.value.year = `El año debe ser válido (entre 1900 y ${currentYear + 1}).`
  }
  if (formData.value.price === null || formData.value.price < 0) {
    errors.value.price = 'El precio debe ser 0 o mayor.'
  }
  if (formData.value.image && !isValidURL(formData.value.image)) {
    errors.value.image = 'Debe ser una URL válida (http:// o https://).'
  }

  return Object.keys(errors.value).length === 0
}

const isValidURL = (string) => {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

// --- MANEJO DEL FORMULARIO ---

const handleSubmit = () => {
  if (!validateForm()) {
    // No se necesita alert, los errores se muestran en el form
    return
  }
  emit('saved', { ...formData.value })
}

const resetForm = () => {
  formData.value = { ...initialFormState }
  errors.value = {}
}

// Watcher para cargar datos al editar o resetear al cerrar
watch(() => props.show, (newVal) => {
  if (newVal && props.movie) {
    // Modo edición: Cargar datos de la película
    formData.value = { ...props.movie }
  } else if (!newVal) {
    // Al cerrar: Resetear formulario y errores
    resetForm()
  }
})

const descriptionCharCount = computed(() => formData.value.description?.length || 0)
</script>
  <!-- funcionalidad de editar peliculas y agregar -->
<template>
  <div v-if="show" class="modal-backdrop fade show"></div>
  <div v-if="show" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ movie ? '✏️ Editar Película' : '➕ Nueva Película' }}</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- Título -->
            <div class="mb-3">
              <label class="form-label fw-bold">Título <span class="text-danger">*</span></label>
              <input v-model="formData.title" type="text" class="form-control" :class="{ 'is-invalid': errors.title }"
                placeholder="Ej: El Padrino" maxlength="100">
              <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
            </div>

            <div class="row">
              <!-- Género -->
              <div class="col-md-7 mb-3">
                <label class="form-label fw-bold">Género <span class="text-danger">*</span></label>
                <select v-model="formData.genre" class="form-select" :class="{ 'is-invalid': errors.genre }">
                  <option disabled value="">-- Selecciona un género --</option>
                  <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
                </select>
                <div v-if="errors.genre" class="invalid-feedback">{{ errors.genre }}</div>
              </div>
              <!-- Año -->
              <div class="col-md-5 mb-3">
                <label class="form-label fw-bold">Año <span class="text-danger">*</span></label>
                <input v-model.number="formData.year" type="number" class="form-control"
                  :class="{ 'is-invalid': errors.year }" placeholder="2024" min="1900"
                  :max="new Date().getFullYear() + 1">
                <div v-if="errors.year" class="invalid-feedback">{{ errors.year }}</div>
              </div>
            </div>

            <!-- Precio -->
            <div class="mb-3">
              <label class="form-label fw-bold">Precio (COP) <span class="text-danger">*</span></label>
              <div class="input-group" :class="{ 'is-invalid': errors.price }">
                <span class="input-group-text">$</span>
                <input v-model.number="formData.price" type="number" class="form-control"
                  :class="{ 'is-invalid': errors.price }" placeholder="15000" step="100" min="0">
              </div>
              <div v-if="errors.price" class="invalid-feedback">{{ errors.price }}</div>
            </div>

            <!-- URL poster -->
            <div class="mb-3">
              <label class="form-label fw-bold">URL de carrusel </label>
              <input v-model="formData.poster" type="text" class="form-control" :class="{ 'is-invalid': errors.poster }"
                placeholder="https://ejemplo.com/imagen.jpg">
              <div v-if="errors.poster" class="invalid-feedback">{{ errors.poster }}</div>
              <small class="form-text text-muted">Opcional. Se usará una imagen por defecto si se deja vacío.</small>
            </div>
            <!-- URL image -->
            <div class="mb-3">
              <label class="form-label fw-bold">URL de Imagen</label>
              <input v-model="formData.image" type="text" class="form-control" :class="{ 'is-invalid': errors.image }"
                placeholder="https://ejemplo.com/imagen.jpg">
              <div v-if="errors.image" class="invalid-feedback">{{ errors.image }}</div>
              <small class="form-text text-muted">Opcional. Se usará una imagen por defecto si se deja vacío.</small>
            </div>
            <!-- Descripción -->
            <div class="mb-3">
              <label class="form-label fw-bold">Descripción</label>
              <textarea v-model="formData.description" class="form-control" rows="3"
                placeholder="Descripción breve de la película..." maxlength="500"></textarea>
              <small class="form-text text-muted text-end d-block">{{ descriptionCharCount }} / 500</small>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="emit('close')">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="handleSubmit">{{ movie ? '💾 Actualizar' : '➕ Crear'
            }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Corrige el problema de Bootstrap donde el input-group no muestra el borde de error */
.input-group.is-invalid .form-control {
  border-color: #dc3545;
}
</style>