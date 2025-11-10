<template>
  <div class="card h-100">
    <img :src="movie.poster" class="card-img-top" :alt="movie.title">
    <div class="card-body">
      <h5 class="card-title">{{ movie.title }}</h5>
      <p class="card-text">
        <small class="text-muted">{{ movie.genre }} | {{ movie.year }}</small>
      </p>
      <div>
        <p class="mb-0">Venta: ${{ movie.salePrice }}</p>
        <p class="mb-0">Alquiler: ${{ movie.rentPrice }}</p>
      </div>
    </div>
    <div class="card-footer">
      <div class="d-flex gap-2">
        <button class="btn btn-primary flex-grow-1" @click="$emit('view', movie)">
          {{ isAdmin ? 'Editar' : 'Ver detalles' }}
        </button>
        <button v-if="isAdmin" 
          class="btn btn-danger"
          @click="$emit('delete', movie.id)">
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCardComponent',
  props: {
    movie: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.movie-card {
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: scale(1.02);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}
</style>