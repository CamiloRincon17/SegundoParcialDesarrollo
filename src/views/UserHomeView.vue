<template>
  <div class="container-fluid p-4">
    <h2 class="mb-4">Catálogo de Películas</h2>

    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
    
    <div v-else class="row">
      <div v-for="movie in movies" :key="movie.id" class="col-md-4 col-lg-3 mb-4">
        <ProductCardComponent :movie="movie" :is-admin="false" @view="onViewMovie" />
      </div>
    </div>

    <MovieModal
      v-if="showModal"
      :movie="selectedMovie"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCardComponent from '../components/ProductCardComponent.vue'
import MovieModal from '../components/MovieModal.vue'
import { getMovies } from '../service/api'

const movies = ref([])
const loading = ref(false)
const showModal = ref(false)
const selectedMovie = ref(null)

const loadMovies = async () => {
  loading.value = true
  try {
    const res = await getMovies()
    movies.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const onViewMovie = (movie) => {
  selectedMovie.value = movie
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedMovie.value = null
}

onMounted(loadMovies)
</script>
