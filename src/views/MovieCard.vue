
<template>
  <div class="card h-100 shadow-sm movie-card bg-dark">
    <img :src="movie.image || 'https://via.placeholder.com/400x600?text=Sin+Póster'" class="card-img-top" :alt="movie.title">
    <div class="card-body d-flex flex-column">
      <h5 class=" card-title flex-grow-1">{{ movie.title }}</h5>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge  btn-custom">{{ movie.genre }}</span>
        <span class="badge bg-secondary">{{ movie.year }}</span>
      </div>
      <p class="card-text fw-bold fs-5 text-gradient mb-3">
        ${{ movie.price?.toLocaleString('es-CO') || 'N/A' }}
      </p>
      <button class="btn btn-outline-light mt-auto" @click="$emit('view-movie', movie)">
        <i class="bi bi-eye me-1"></i> Ver Detalles
      </button>
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-undef
defineProps({
  movie: {
    type: Object,
    required: true
  },
})

// eslint-disable-next-line no-undef
defineEmits(['view-movie'])
</script>

<style scoped>
.movie-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  background-color: #373f3d; /* Fondo oscuro */
  color: white;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
}

.card-img-top {
  height: 300px;
  object-fit: cover;
}

.text-success {
  color: #a6e22e !important; /* Verde lima para el precio */
}
</style>