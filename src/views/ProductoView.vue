<script setup>
import { ref, onMounted, computed } from 'vue'
import { getMovies, deleteMovie, createMovie, updateMovie } from '@/service/api'
import ProductCardComponent from '@/components/ProductCardComponent.vue'
import MovieModal from '@/components/MovieModal.vue'

// Estados principales
const movies = ref([])
const loading = ref(false)
const error = ref(null)

// Estados del modal
const showModal = ref(false)
const selectedMovie = ref(null)

// Estados de búsqueda
const searchQuery = ref('')
const selectedGenre = ref('')

// Obtener rol del usuario
const userRole = localStorage.getItem('userRole')

// Géneros disponibles para el modal
const genres = ['Acción', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción', 'Romance', 'Thriller']

// ⭐ Computed: Filtrar películas
const filteredMovies = computed(() => {
  let result = movies.value
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m => 
      m.title?.toLowerCase().includes(query) ||
      m.genre?.toLowerCase().includes(query) ||
      m.description?.toLowerCase().includes(query)
    )
  }
  
  // Filtrar por género
  if (selectedGenre.value) {
    result = result.filter(m => m.genre === selectedGenre.value)
  }
  
  return result
})

// ⭐ Computed: Géneros únicos disponibles
const availableGenres = computed(() => {
  const genresSet = movies.value
    .map(m => m.genre)
    .filter(Boolean)
  return [...new Set(genresSet)].sort()
})

// ⭐ Función: Cargar películas
const fetchMovies = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await getMovies()
    movies.value = response.data || []
    console.log('✅ Películas cargadas:', movies.value.length)
  } catch (err) {
    error.value = 'No se pudieron cargar las películas. Verifica que JSON Server esté corriendo con "npm run api".'
    console.error('❌ Error al cargar películas:', err)
  } finally {
    loading.value = false
  }
}

// ⭐ Función: Abrir modal para editar
const onEdit = (movie) => {
  selectedMovie.value = { ...movie }
  showModal.value = true
}

// ⭐ Función: Cerrar modal
const closeModal = () => {
  showModal.value = false
  selectedMovie.value = null
}

// ⭐ Función: Guardar película (crear o actualizar)
const handleSave = async (movieData) => {
  try {
    if (selectedMovie.value?.id) {
      // Actualizar película existente
      await updateMovie(selectedMovie.value.id, movieData)
      
      // Actualizar en la lista local
      const index = movies.value.findIndex(m => m.id === selectedMovie.value.id)
      if (index !== -1) {
        movies.value[index] = { ...movieData, id: selectedMovie.value.id }
      }
      
      alert('✅ Película actualizada correctamente')
    } else {
      // Crear nueva película
      const response = await createMovie(movieData)
      movies.value.push(response.data)
      alert('✅ Película creada correctamente')
    }
    
    closeModal()
  } catch (err) {
    alert('❌ Error al guardar la película')
    console.error('Error:', err)
  }
}

// ⭐ Función: Eliminar película
const handleDelete = async (id) => {
  const movie = movies.value.find(m => m.id === id)
  
  if (!movie) {
    alert('❌ Película no encontrada')
    return
  }
  
  const confirmDelete = confirm(
    `¿Estás seguro de eliminar "${movie.title}"?\n\nEsta acción no se puede deshacer.`
  )
  
  if (!confirmDelete) return
  
  try {
    await deleteMovie(id)
    movies.value = movies.value.filter(m => m.id !== id)
    alert('✅ Película eliminada correctamente')
  } catch (err) {
    alert('❌ Error al eliminar la película')
    console.error('Error:', err)
  }
}

// ⭐ Función: Limpiar filtros
const clearFilters = () => {
  searchQuery.value = ''
  selectedGenre.value = ''
}

// Cargar películas al montar el componente
onMounted(() => {
  fetchMovies()
})
</script>

<template>
  <div class="container mt-4">
    
    <!-- ============================================ -->
    <!-- SECCIÓN: ENCABEZADO CON BÚSQUEDA Y FILTROS -->
    <!-- ============================================ -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h2 class="card-title mb-4">
          <i class="bi bi-film me-2"></i>
          Gestión de Películas
        </h2>
        
        <!-- Barra de búsqueda y filtros -->
        <div class="row g-3 align-items-end">
          
          <!-- Búsqueda por texto -->
          <div class="col-md-4">
            <label class="form-label small text-muted">Buscar</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input 
                v-model="searchQuery"
                type="text" 
                class="form-control" 
                placeholder="Título, género, descripción..."
              >
            </div>
          </div>
          
          <!-- Filtro por género -->
          <div class="col-md-3">
            <label class="form-label small text-muted">Género</label>
            <select v-model="selectedGenre" class="form-select">
              <option value="">Todos los géneros</option>
              <option v-for="genre in availableGenres" :key="genre" :value="genre">
                {{ genre }}
              </option>
            </select>
          </div>
          
          <!-- Botón limpiar filtros -->
          <div class="col-md-2">
            <button 
              v-if="searchQuery || selectedGenre" 
              @click="clearFilters"
              class="btn btn-outline-secondary w-100"
            >
              <i class="bi bi-x-circle me-1"></i>
              Limpiar
            </button>
          </div>
          
          <!-- Botón nueva película (solo admin) -->
          <div class="col-md-3" v-if="userRole === 'admin'">
            <button 
              class="btn btn-primary w-100" 
              @click="showModal = true; selectedMovie = null"
            >
              <i class="bi bi-plus-circle me-1"></i>
              Nueva Película
            </button>
          </div>
          
        </div>
        
        <!-- Indicador de resultados -->
        <div v-if="!loading && !error" class="mt-3">
          <small class="text-muted">
            <i class="bi bi-info-circle me-1"></i>
            Mostrando {{ filteredMovies.length }} de {{ movies.length }} películas
          </small>
        </div>
        
      </div>
    </div>
    
    <!-- ============================================ -->
    <!-- ESTADO: CARGANDO -->
    <!-- ============================================ -->
    <div v-if="loading" class="text-center my-5 py-5">
      <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="text-muted">Cargando catálogo de películas...</p>
    </div>
    
    <!-- ============================================ -->
    <!-- ESTADO: ERROR -->
    <!-- ============================================ -->
    <div v-else-if="error" class="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
      <div class="flex-grow-1">
        <h5 class="alert-heading mb-1">Error al cargar películas</h5>
        <p class="mb-0">{{ error }}</p>
      </div>
      <button @click="fetchMovies" class="btn btn-outline-danger">
        <i class="bi bi-arrow-clockwise me-1"></i>
        Reintentar
      </button>
    </div>
    
    <!-- ============================================ -->
    <!-- ESTADO: SIN RESULTADOS -->
    <!-- ============================================ -->
    <div v-else-if="filteredMovies.length === 0" class="alert alert-info text-center shadow-sm">
      <i class="bi bi-inbox fs-1 d-block mb-2"></i>
      <h5 class="alert-heading">
        {{ searchQuery || selectedGenre ? 'No se encontraron películas' : 'El catálogo está vacío' }}
      </h5>
      <p class="mb-3">
        {{ searchQuery || selectedGenre 
          ? 'Intenta cambiar los filtros de búsqueda' 
          : 'Agrega la primera película al catálogo' 
        }}
      </p>
      <button v-if="searchQuery || selectedGenre" @click="clearFilters" class="btn btn-outline-info">
        <i class="bi bi-funnel me-1"></i>
        Limpiar filtros
      </button>
    </div>
    
    <!-- ============================================ -->
    <!-- GRID DE PELÍCULAS -->
    <!-- ============================================ -->
    <div v-else class="row g-4">
      <div 
        v-for="movie in filteredMovies" 
        :key="movie.id" 
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <ProductCardComponent 
          :movie="movie" 
          :is-admin="userRole === 'admin'"
          @view="onEdit"
          @delete="handleDelete"
        />
      </div>
    </div>
    
    <!-- ============================================ -->
    <!-- MODAL DE CREAR/EDITAR -->
    <!-- ============================================ -->
    <MovieModal
      :show="showModal"
      :movie="selectedMovie"
      :genres="genres"
      @close="closeModal"
      @saved="handleSave"
    />
    
  </div>
</template>

<style scoped>
/* Animación para el spinner */
@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

/* Transición suave para las cards */
.col-12, .col-sm-6, .col-md-4, .col-lg-3 {
  transition: all 0.3s ease;
}

/* Hover en las cards */
.col-12:hover, .col-sm-6:hover, .col-md-4:hover, .col-lg-3:hover {
  transform: translateY(-5px);
}

/* Estilos para alertas */
.alert {
  border-radius: 0.5rem;
}

/* Estilos para la card de búsqueda */
.card {
  border-radius: 0.75rem;
  border: none;
}

.card-body {
  padding: 1.5rem;
}
</style>