<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Catálogo de Películas</h2>
      <button v-if="userRole === 'admin'" class="btn btn-danger" @click="openModal()">+ Añadir película</button>
    </div>

    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
    
    <div v-else>
      <!-- Vista de administrador -->
      <table v-if="userRole === 'admin'" class="table table-hover">
        <thead>
          <tr>
            <th>Poster</th>
            <th>Título</th>
            <th>Género</th>
            <th>Año</th>
            <th>Venta</th>
            <th>Alquiler</th>
            <th>Existencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in movies" :key="m.id">
            <td><img :src="m.poster || 'https://via.placeholder.com/60x80'" alt="" style="width:60px;height:80px;object-fit:cover"/></td>
            <td>{{ m.title }}</td>
            <td>{{ m.genre }}</td>
            <td>{{ m.year }}</td>
            <td>${{ m.salePrice?.toFixed(2) || '0.00' }}</td>
            <td>${{ m.rentPrice?.toFixed(2) || '0.00' }}</td>
            <td>{{ m.stock ?? '-' }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" @click="onEdit(m)">Editar</button>
              <button class="btn btn-sm btn-success me-1" @click="onView(m)">Ver</button>
              <button class="btn btn-sm btn-danger" @click="onDelete(m.id)">Borrar</button>
            </td>
          </tr>
          <tr v-if="movies.length === 0">
            <td colspan="8" class="text-center text-muted py-4">
              No hay películas en el catálogo. Haga clic en "Añadir película" para comenzar.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Vista de usuario -->
      <div v-else class="row row-cols-1 row-cols-md-4 g-4">
        <div v-for="movie in movies" :key="movie.id" class="col">
          <ProductCardComponent
            :movie="movie"
            :is-admin="userRole === 'admin'"
            @view="onEdit"
            @delete="onDelete"
          />
        </div>
      </div>
    </div>

    <MovieModal
      :show="showModal"
      :movie="selected"
      :genres="genres"
      @close="closeModal"
      @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MovieModal from '../components/MovieModal.vue'
import ProductCardComponent from '../components/ProductCardComponent.vue'
import { getMovies, deleteMovie } from '../service/api'

const movies = ref([])
const loading = ref(false)
const showModal = ref(false)
const selected = ref(null)
const userRole = ref(localStorage.getItem('userRole'))
const genres = ref(['Acción', 'Comedia', 'Drama', 'Ciencia Ficción', 'Terror', 'Suspenso', 'Animación'])

const loadMovies = async () => {
  loading.value = true
  try {
    const res = await getMovies()
    movies.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.error('Error al cargar películas:', e)
    alert(`Error al cargar películas: ${e.message || 'Verifique que el servidor JSON esté corriendo en el puerto 3000'}`)
    movies.value = []
  } finally {
    loading.value = false
  }
}

const openModal = () => {
  selected.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selected.value = null
}

const onEdit = (movie) => {
  selected.value = { ...movie }
  showModal.value = true
}

const onView = (movie) => {
  // comportamiento ver (puedes implementar un detalle modal separado)
  selected.value = { ...movie }
  showModal.value = true
}

const onDelete = async (id) => {
  if (!confirm('¿Está seguro que desea eliminar esta película?')) return
  try {
    await deleteMovie(id)
    // Recargar las películas desde el servidor
    await loadMovies()
  } catch (e) {
    console.error('Error al eliminar:', e)
    alert(`Error al eliminar: ${e.response?.data?.message || e.message || 'Error desconocido'}`)
  }
}

const onSaved = async () => {
  closeModal()
  // Recargar las películas para asegurar que tenemos los datos actualizados del servidor
  await loadMovies()
}

onMounted(loadMovies)
</script>