<template>
  <div v-if="show" class="modal-backdrop" @click.self="close">
    <div class="modal-dialog" role="document" style="max-width:600px;margin:40px auto">
      <div class="modal-content p-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">{{ form.id ? 'Editar película' : 'Nueva película' }}</h5>
          <button type="button" class="btn-close" @click="close" aria-label="Cerrar"></button>
        </div>

        <div class="mb-2">
          <label class="form-label">Título *</label>
          <input v-model="form.title" class="form-control" placeholder="Título" required/>
        </div>
        <div class="mb-2">
          <label class="form-label">Género *</label>
          <select v-model="form.genre" class="form-control" required>
            <option disabled value="">Seleccione un género</option>
            <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
        <div class="row g-2 mb-2">
          <div class="col">
            <label class="form-label">Año *</label>
            <input v-model.number="form.year" type="number" class="form-control" placeholder="Año" min="1900" :max="new Date().getFullYear() + 1" required/>
          </div>
          <div class="col">
            <label class="form-label">Precio venta *</label>
            <input v-model.number="form.salePrice" type="number" step="0.01" class="form-control" placeholder="Precio venta" min="0" required/>
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col">
            <label class="form-label">Precio alquiler *</label>
            <input v-model.number="form.rentPrice" type="number" step="0.01" class="form-control" placeholder="Precio alquiler" min="0" required/>
          </div>
          <div class="col">
            <label class="form-label">Existencia *</label>
            <input v-model.number="form.stock" type="number" class="form-control" placeholder="Existencia" min="0" required/>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">URL del poster</label>
          <input v-model="form.poster" class="form-control" placeholder="URL poster"/>
          <small class="form-text text-muted">Opcional: URL de la imagen del poster</small>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-secondary" @click="close">Cancelar</button>
          <button class="btn btn-primary" @click="save">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, watch } from 'vue'
import { createMovie, updateMovie } from '../service/api'

export default {
  name: 'MovieModal',
  props: {
    movie: { type: Object, default: null },
    genres: { type: Array, default: () => ['Acción', 'Comedia', 'Drama', 'Ciencia Ficción', 'Terror', 'Suspenso', 'Animación'] },
    show: { type: Boolean, default: false }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const form = reactive({
      id: props.movie?.id ?? null,
      title: props.movie?.title ?? '',
      genre: props.movie?.genre ?? '',
      year: props.movie?.year ?? new Date().getFullYear(),
      salePrice: props.movie?.salePrice ?? 0,
      rentPrice: props.movie?.rentPrice ?? 0,
      stock: props.movie?.stock ?? 0,
      poster: props.movie?.poster ?? ''
    })

    // Actualizar el form cuando cambia la prop movie
    watch(() => props.movie, (newMovie) => {
      if (newMovie) {
        form.id = newMovie.id ?? null
        form.title = newMovie.title ?? ''
        form.genre = newMovie.genre ?? ''
        form.year = newMovie.year ?? new Date().getFullYear()
        form.salePrice = newMovie.salePrice ?? 0
        form.rentPrice = newMovie.rentPrice ?? 0
        form.stock = newMovie.stock ?? 0
        form.poster = newMovie.poster ?? ''
      } else {
        // Resetear el form si no hay movie
        form.id = null
        form.title = ''
        form.genre = ''
        form.year = new Date().getFullYear()
        form.salePrice = 0
        form.rentPrice = 0
        form.stock = 0
        form.poster = ''
      }
    }, { immediate: true })

    const save = async () => {
      // Validación básica
      if (!form.title || !form.title.trim()) {
        alert('Por favor ingrese un título')
        return
      }
      if (!form.genre) {
        alert('Por favor seleccione un género')
        return
      }
      if (!form.year || form.year < 1900 || form.year > new Date().getFullYear() + 1) {
        alert('Por favor ingrese un año válido')
        return
      }
      if (form.salePrice < 0 || form.rentPrice < 0) {
        alert('Los precios no pueden ser negativos')
        return
      }
      if (form.stock < 0) {
        alert('La existencia no puede ser negativa')
        return
      }

      try {
        let res
        // Preparar datos sin el id para crear
        const movieData = {
          title: form.title.trim(),
          genre: form.genre,
          year: parseInt(form.year),
          salePrice: parseFloat(form.salePrice) || 0,
          rentPrice: parseFloat(form.rentPrice) || 0,
          stock: parseInt(form.stock) || 0,
          poster: form.poster.trim() || ''
        }

        if (form.id) {
          res = await updateMovie(form.id, movieData)
        } else {
          res = await createMovie(movieData)
        }
        
        // Emitir el evento con los datos guardados
        emit('saved', res.data)
      } catch (e) {
        console.error('Error al guardar:', e)
        const errorMessage = e.response?.data?.message || e.response?.data || e.message || 'Error desconocido'
        alert(`Error al guardar: ${errorMessage}`)
      }
    }

    const close = () => {
      emit('close')
    }

    return { 
      form,
      save, 
      close
    }
  }
}
</script>

<style scoped>
.modal-backdrop { 
  position: fixed; 
  inset: 0; 
  background: rgba(0,0,0,0.5); 
  z-index: 2000; 
  display: flex; 
  align-items: flex-start; 
  justify-content: center;
  padding-top: 40px;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  max-height: 90vh;
  overflow-y: auto;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}
</style>