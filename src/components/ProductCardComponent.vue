<!-- src/components/ProductCardComponent.vue -->
<template>
  <div class="card h-100 shadow-sm movie-card">
    <img :src="movie.image || 'https://via.placeholder.com/400x600?text=Sin+Póster'" class="card-img-top" :alt="movie.title">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title flex-grow-1">{{ movie.title }}</h5>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge bg-primary">{{ movie.genre }}</span>
        <span class="badge bg-secondary">{{ movie.year }}</span>
      </div>
      <p class="card-text fw-bold fs-5 text-success mb-3">
        ${{ movie.price?.toLocaleString('es-CO') || 'N/A' }}
      </p>
    </div>
    <div v-if="isAdmin" class="card-footer">
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-primary w-100" @click="$emit('edit', movie)">
          <i class="bi bi-pencil-fill me-1"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger w-100" @click="$emit('delete', movie.id)">
          <i class="bi bi-trash-fill me-1"></i> Eliminar
        </button>
      </div>
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
  isAdmin: {
    type: Boolean,
    default: false
  }
})

// eslint-disable-next-line no-undef
defineEmits(['edit', 'delete'])
</script>

<style scoped>
.movie-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
}

.card-img-top {
  height: 300px;
  object-fit: cover;
}
</style>