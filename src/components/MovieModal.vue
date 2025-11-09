<template>
  <div class="modal" tabindex="-1" :class="{ 'd-block': show }">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEdit ? 'Editar Película' : 'Añadir Película' }}</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveMovie">
            <div class="mb-3">
              <label class="form-label">Título</label>
              <input type="text" class="form-control" v-model="movieData.title" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Género</label>
              <select class="form-select" v-model="movieData.genre" required>
                <option value="Accion">Acción</option>
                <option value="Terror">Terror</option>
                <option value="Comedia">Comedia</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Año</label>
              <input type="number" class="form-control" v-model="movieData.year" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Precio de venta</label>
              <input type="number" step="0.01" class="form-control" v-model="movieData.salePrice" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Precio de alquiler</label>
              <input type="number" step="0.01" class="form-control" v-model="movieData.rentPrice" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Existencia</label>
              <input type="number" class="form-control" v-model="movieData.stock" required>
            </div>
            <div class="mb-3">
              <label class="form-label">URL del Poster</label>
              <input type="url" class="form-control" v-model="movieData.poster" required>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="saveMovie">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  movie: Object,
  isEdit: Boolean
})

const emit = defineEmits(['close', 'save'])

const movieData = ref({
  title: '',
  genre: '',
  year: new Date().getFullYear(),
  salePrice: 0,
  rentPrice: 0,
  stock: 0,
  poster: ''
})

watch(() => props.movie, (newMovie) => {
  if (newMovie) {
    movieData.value = { ...newMovie }
  }
}, { immediate: true })

const close = () => {
  emit('close')
}

const saveMovie = () => {
  emit('save', movieData.value)
  close()
}
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>