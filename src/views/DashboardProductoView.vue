<!-- se ve en admin -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { getMovies, createMovie, updateMovie, deleteMovie } from '@/service/api'
import MovieModal from '@/components/MovieModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import AlertComponent from '@/components/AlertComponent.vue'

// Estados principales
const movies = ref([])
const loading = ref(false)
const error = ref(null)

// Estados del modal
const showModal = ref(false)
const selectedMovie = ref(null)

// Estados de confirmación de eliminación
const showDeleteModal = ref(false)
const movieToDelete = ref(null)

// Estados de alerta
const showAlert = ref(false)
const alert = ref({ message: '', type: 'success' })

// Estados de búsqueda y filtro
const searchQuery = ref('')
const selectedGenre = ref('')

// Rol del usuario actual
const userRole = ref(localStorage.getItem('userRole'))

// Géneros para el modal
const genresForModal = ['Acción', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción', 'Romance', 'Thriller']

// Computed: Películas filtradas
const filteredMovies = computed(() => {
  let result = movies.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m => m.title?.toLowerCase().includes(query) || m.description?.toLowerCase().includes(query))
  }
  if (selectedGenre.value) {
    result = result.filter(m => m.genre === selectedGenre.value)
  }
  return result
})

// Computed: Géneros únicos para el filtro
const availableGenres = computed(() => {
  const genresSet = movies.value.map(m => m.genre).filter(Boolean)
  return [...new Set(genresSet)].sort()
})

// --- FUNCIONES CRUD ---

const fetchMovies = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await getMovies()
    movies.value = response.data || []
  } catch (err) {
    error.value = 'No se pudieron cargar los productos. Verifica que el servidor API esté corriendo.'
  } finally {
    loading.value = false
  }
}

const handleSave = async (movieData) => {
  try {
    if (selectedMovie.value?.id) {
      // Actualizar
      await updateMovie(selectedMovie.value.id, movieData)
      const index = movies.value.findIndex(m => m.id === selectedMovie.value.id)
      if (index !== -1) movies.value[index] = { ...movieData, id: selectedMovie.value.id }
      displayAlert('✅ Producto actualizado correctamente', 'success')
    } else {
      // Crear
      const response = await createMovie(movieData)
      movies.value.push(response.data)
      displayAlert('✅ Producto creado correctamente', 'success')
    }
    closeModal()
  } catch (err) {
    displayAlert('❌ Error al guardar el producto', 'danger')
    console.error(err)
  }
}

const confirmDeleteMovie = (movie) => {
  movieToDelete.value = movie
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    await deleteMovie(movieToDelete.value.id)
    movies.value = movies.value.filter(m => m.id !== movieToDelete.value.id)
    displayAlert('✅ Producto eliminado correctamente', 'success')
    showDeleteModal.value = false
    movieToDelete.value = null
  } catch (err) {
    displayAlert('❌ Error al eliminar el producto', 'danger')
    console.error(err)
  }
}

// --- FUNCIONES DEL MODAL ---

const openModalForCreate = () => {
  selectedMovie.value = null
  showModal.value = true
}

const openModalForEdit = (movie) => {
  selectedMovie.value = { ...movie }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedMovie.value = null
}

const displayAlert = (message, type) => {
  alert.value = { message, type }
  showAlert.value = true
}

onMounted(fetchMovies)
</script>

<template>
  <div class="container-fluid">
    <h1 class="mb-4">
      <i class="bi bi-box-seam me-2"></i>
      Gestión de Productos
    </h1>

    <!-- Barra de acciones y filtros -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label">
              <i class="bi bi-search me-1"></i>
              Buscar
            </label>
            <input v-model="searchQuery" type="text" class="form-control" placeholder="Título, descripción...">
          </div>
          <div class="col-md-3">
            <label class="form-label">
              <i class="bi bi-funnel me-1"></i>
              Género
            </label>
            <select v-model="selectedGenre" class="form-select">
              <option value="">Todos</option>
              <option v-for="genre in availableGenres" :key="genre" :value="genre">{{ genre }}</option>
            </select>
          </div>
          <div class="col-md-5 text-end">
            <router-link 
              v-if="userRole === 'superadmin'" 
              to="/users" 
              class="btn btn-warning me-2"
            >
              <i class="bi bi-people-fill me-1"></i>
              Gestión de Usuarios
            </router-link>
            <button @click="openModalForCreate" class="btn btn-success">
              <i class="bi bi-plus-circle me-1"></i>
              Nuevo Producto
            </button>
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

    <!-- ESTADO: CARGANDO -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-2 text-muted">Cargando datos...</p>
    </div>

    <!-- ESTADO: ERROR -->
    <div v-else-if="error" class="alert alert-danger d-flex align-items-center">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <div class="flex-grow-1">{{ error }}</div>
      <button @click="fetchMovies" class="btn btn-sm btn-outline-danger">
        <i class="bi bi-arrow-clockwise me-1"></i>
        Reintentar
      </button>
    </div>

    <!-- ESTADO: SIN RESULTADOS -->
    <div v-else-if="filteredMovies.length === 0" class="alert alert-info text-center">
      <i class="bi bi-info-circle me-2"></i>
      {{ searchQuery || selectedGenre ? 'No se encontraron productos con esos filtros.' : 'No hay productos registrados.' }}
    </div>

    <!-- TABLA DE PRODUCTOS -->
    <div v-else class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th><i class="bi bi-image me-1"></i>Póster</th>
            <th><i class="bi bi-card-heading me-1"></i>Título</th>
            <th><i class="bi bi-tag me-1"></i>Género</th>
            <th><i class="bi bi-calendar-event me-1"></i>Año</th>
            <th><i class="bi bi-cash me-1"></i>Precio (COP)</th>
            <th><i class="bi bi-gear-fill me-1"></i>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in filteredMovies" :key="movie.id">
            <td>
              <img :src="movie.image || 'https://via.placeholder.com/60x90?text=N/A'" :alt="movie.title" class="table-poster">
            </td>
            <td>{{ movie.title }}</td>
            <td><span class="badge bg-secondary">{{ movie.genre }}</span></td>
            <td>{{ movie.year }}</td>
            <td>${{ movie.price?.toLocaleString('es-CO') || '0' }}</td>
            <td>
              <div class="btn-group">
                <button @click="openModalForEdit(movie)" class="btn btn-sm btn-primary" title="Editar producto">
                  <i class="bi bi-pencil-fill me-1"></i>
                  Editar
                </button>
                <button @click="confirmDeleteMovie(movie)" class="btn btn-sm btn-danger" title="Eliminar producto">
                  <i class="bi bi-trash-fill me-1"></i>
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL PRODUCTO -->
    <MovieModal
      :show="showModal"
      :movie="selectedMovie"
      :genres="genresForModal"
      @close="closeModal"
      @saved="handleSave"
    />

    <!-- MODAL CONFIRMACIÓN ELIMINACIÓN -->
    <ConfirmModal
      :show="showDeleteModal"
      title="Confirmar Eliminación de Producto"
      :message="`¿Estás seguro de que deseas eliminar el producto '${movieToDelete?.title}'?`"
      warningMessage="Esta acción no se puede deshacer."
      confirmText="Eliminar Producto"
      cancelText="Cancelar"
      confirmType="danger"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
      @close="showDeleteModal = false"
    />
  </div>
</template>

<style scoped>
.table-poster {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
}
.table-responsive {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>