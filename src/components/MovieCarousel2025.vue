<!-- funcionalidad carrusel -->
<template>
  <div class="movie-carousel-container mb-5">
    <h3 class="text-white mb-4 text-center">Próximos Estrenos 2025</h3>
    <div v-if="loading" class="text-center text-white my-5">
      <div class="spinner-border text-light mb-3" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Cargando próximos estrenos...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger text-center">
      Error al cargar estrenos: {{ error }}
    </div>
    <div v-else-if="movies.length === 0" class="alert alert-info text-center">
      No hay próximos estrenos para mostrar.
    </div>
    <div v-else id="upcomingCarousel" class="carousel slide" data-bs-ride="carousel">
      <!-- Indicadores -->
      <div class="carousel-indicators">
        <button
          v-for="(movie, index) in movies"
          :key="`indicator-${movie.id}`"
          type="button"
          data-bs-target="#upcomingCarousel"
          :data-bs-slide-to="index"
          :class="{ active: index === 0 }"
          :aria-current="index === 0 ? 'true' : 'false'"
          :aria-label="`Slide ${index + 1}`"
        ></button>
      </div>

      <!-- Contenido del Carrusel -->
      <div class="carousel-inner">
        <div v-for="(movie, index) in movies" :key="movie.id" class="carousel-item" :class="{ active: index === 0 }">
          <img :src="movie.image || 'https://via.placeholder.com/800x400?text=Próximo+Estreno'" class="d-block w-100 carousel-img" :alt="movie.title" />

          <div class="carousel-caption d-none d-md-block">
            <h5>{{ movie.title }}</h5>
            <p>
              <span class="badge bg-primary me-2">{{ movie.genre }}</span>
              <span class="badge bg-secondary">{{ movie.releaseDate || movie.year }}</span>
            </p>
            <button @click="handleViewMovie(movie)" class="btn btn-outline-light btn-sm mt-2">
              <i class="bi bi-eye me-1"></i> Ver más
            </button>
          </div>
        </div>
      </div>

      <!-- Controles -->
      <button class="carousel-control-prev" type="button" data-bs-target="#upcomingCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#upcomingCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMovies } from '@/service/api' // Asumiendo que getMovies puede traer movies2025

// eslint-disable-next-line no-undef
const emit = defineEmits(['view-movie'])

const movies = ref([])
const loading = ref(false)
const error = ref(null)

const fetchUpcomingMovies = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await getMovies() // O una API específica para próximos estrenos
    // Filtrar películas que sean de 2025 o tengan '2025' en releaseDate
    movies.value = response.data.filter(movie =>
      (movie.year && movie.year === 2025) || (movie.releaseDate && movie.releaseDate.includes('2025'))
    )
  } catch (err) {
    error.value = err.message || 'Error desconocido al cargar los próximos estrenos.'
    console.error('Error al cargar próximos estrenos:', err)
  } finally {
    loading.value = false
  }
}

const handleViewMovie = (movie) => {
  emit('view-movie', movie)
}

onMounted(() => {
  fetchUpcomingMovies()
})
</script>

<style scoped>
.carousel-item {
  height: 500px; /* Altura fija para el carrusel */
}

.carousel-img {
  height: 100%;
  width: 100%;
  object-fit: cover;  /* Asegura que la imagen cubra el espacio sin deformarse */
  filter: brightness(0.6); /* Oscurece la imagen para que el texto resalte */
}

@media (max-width: 768px) {
  .carousel-item {
    height: 300px; /* Altura más pequeña para móviles */
  }
  .carousel-caption h5 {
    font-size: 1.1rem;
  }
}
</style>