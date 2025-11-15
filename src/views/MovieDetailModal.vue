<template>
  <div v-if="show" class="modal-backdrop fade show"></div>
  <div v-if="show" class="modal fade show d-block" tabindex="-1" @click.self="close">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content bg-dark text-white shadow-lg">
        <div class="modal-header border-secondary">
          <h5 class="modal-title">{{ movie?.title }}</h5>
          <button type="button" class="btn-close btn-close-white" @click="close"></button>
        </div>
        <div class="modal-body" v-if="movie">
          <div class="row g-4">
            <div class="col-md-4">
              <img :src="movie.poster || movie.image || 'https://via.placeholder.com/400x600?text=No+Image'" class="img-fluid rounded shadow" :alt="movie.title">
            </div>
            <div class="col-md-8 d-flex flex-column">
              <div>
                <p class="mb-3">{{ movie.description || 'No hay descripción disponible.' }}</p>
                <hr>
                <p>
                  <strong>Género:</strong>
                  <span class="badge bg-primary ms-2 fs-6">{{ movie.genre }}</span>
                </p>
                <p>
                  <strong>Año de Estreno:</strong>
                  <span class="badge bg-secondary ms-2 fs-6">{{ movie.year }}</span>
                </p>
                <p v-if="movie.releaseDate">
                  <strong>Lanzamiento:</strong>
                  <span class="badge bg-info ms-2 fs-6">{{ movie.releaseDate }}</span>
                </p>
              </div>
              <div class="mt-auto text-end">
                <h3 class="text-success fw-bold">
                  ${{ movie.price?.toLocaleString('es-CO') || '0' }}
                </h3>
                <button class="btn btn-success btn-lg mt-2">
                  <i class="bi bi-cart-plus me-2"></i> Comprar Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer border-secondary">
          <button type="button" class="btn btn-outline-light" @click="close">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-undef
defineProps({
  show: Boolean,
  movie: Object,
})

// eslint-disable-next-line no-undef
const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<style scoped>
.modal-content {
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.modal-title {
  color: #66d9ef; /* Un color cian para el título */
}
.img-fluid {
  max-height: 500px;
  object-fit: cover;
}
.text-success {
  color: #a6e22e !important; /* Verde lima para el precio */
}
</style>