<script setup>
import { ref, onMounted, computed } from 'vue'
import { getMovies } from '@/service/api'
import MovieCard from './MovieCard.vue' // Renombrado para consistencia
import MovieDetailModal from './MovieDetailModal.vue' // Importar el modal correcto
import MovieCarousel2025 from '@/components/MovieCarousel2025.vue'

// Estados principales
const movies = ref([])
const loading = ref(false)
const error = ref(null)

// Estados de búsqueda
const searchQuery = ref('')
const selectedGenre = ref('')

// ⭐ Computed: Filtrar películas
const filteredMovies = computed(() => {
  let result = movies.value

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (m) =>
        m.title?.toLowerCase().includes(query) ||
        m.genre?.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query)
    )
  }

  // Filtrar por género
  if (selectedGenre.value) {
    result = result.filter((m) => m.genre === selectedGenre.value)
  }

  return result
})

// ⭐ Computed: Géneros únicos disponibles
const availableGenres = computed(() => {
  const genresSet = movies.value.map((m) => m.genre).filter(Boolean)
  return [...new Set(genresSet)].sort()
})

// Estados para el modal de detalles
const showDetailModal = ref(false)
const selectedMovieForDetail = ref(null)
const openDetailModal = (movie) => {
  selectedMovieForDetail.value = movie
  showDetailModal.value = true
}


// ⭐ Función: Cargar películas
const fetchMovies = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getMovies()
    movies.value = response.data || []
  } catch (err) {
    error.value = 'No se pudieron cargar las películas. Verifica que JSON Server esté corriendo con "npm run api".'
  } finally {
    loading.value = false
  }
}

// Cargar películas al montar el componente
onMounted(fetchMovies)
</script>

<template>
  <div class="container mt-4">
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
    
    <div v-else>
      <!-- Nuevo Carrusel de Próximos Estrenos -->
      <MovieCarousel2025 @view-movie="openDetailModal" />

      <h2 class="mb-4">Nuestro Catálogo</h2>

      <!-- BARRA DE BÚSQUEDA Y FILTROS -->
      <div class="row mb-4 g-3">
        <div class="col-md-8">
          <input v-model="searchQuery" type="text" class="form-control" placeholder="🔍 Buscar por título o género...">
        </div>
        <div class="col-md-4">
          <select v-model="selectedGenre" class="form-select">
            <option value="">📁 Todos los géneros</option>
            <option v-for="genre in availableGenres" :key="genre" :value="genre">{{ genre }}</option>
          </select>
        </div>
      </div>

      <!-- ESTADO: SIN RESULTADOS -->
      <div v-if="filteredMovies.length === 0" class="alert alert-info text-center">
        <i class="bi bi-search me-2"></i>
        {{ searchQuery || selectedGenre ? 'No se encontraron películas con esos filtros.' : 'No hay películas registradas.' }}
      </div>

      <!-- GRID DE PELÍCULAS -->
      <div v-else class="row g-4">
        <div v-for="movie in filteredMovies" :key="movie.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <MovieCard :movie="movie" @view-movie="openDetailModal" />
        </div>
      </div>
    </div>
    
    <!-- ============================================ -->
    <!-- MODAL DE DETALLES -->
    <!-- ============================================ -->
    <MovieDetailModal
      :show="showDetailModal"
      :movie="selectedMovieForDetail"
      @close="showDetailModal = false"
    />
  </div>
</template>

<style scoped>
</style>