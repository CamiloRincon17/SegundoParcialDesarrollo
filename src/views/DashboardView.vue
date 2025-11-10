<template>
  <div class="dashboard-container">
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12 d-flex justify-content-between align-items-center">
          <h1 class="my-4">Películas</h1>
          <div v-if="userRole === 'admin'">
            <button class="btn btn-danger me-2" @click="onAdd">+ Añadir película</button>
          </div>
        </div>
      </div>

      <!-- filtros -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="d-flex gap-2">
            <input v-model="searchQuery" class="form-control" placeholder="Ingrese un título..." />
            <select v-model="yearFilter" class="form-select w-auto">
              <option value="">Año</option>
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
            <select v-model="genreFilter" class="form-select w-auto">
              <option value="">Género</option>
              <option value="Accion">Acción</option>
              <option value="Terror">Terror</option>
              <option value="Comedia">Comedia</option>
            </select>
            <button class="btn btn-primary" @click="buscar">Buscar</button>
          </div>
        </div>
      </div>

      <!-- tabla -->
      <div class="row">
        <div class="col-12">
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>Poster</th>
                  <th>Título</th>
                  <th>Género</th>
                  <th>Año</th>
                  <th>Precio venta</th>
                  <th>Precio alquiler</th>
                  <th>Existencia</th>
                  <th v-if="userRole === 'admin'">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in displayedMovies" :key="m.id">
                  <td><img :src="m.poster" class="movie-poster" alt="" /></td>
                  <td>{{ m.title }}</td>
                  <td>{{ m.genre }}</td>
                  <td>{{ m.year }}</td>
                  <td>{{ m.salePrice.toFixed(2) }}</td>
                  <td>{{ (m.rentPrice ?? 0).toFixed(2) }}</td>
                  <td>{{ m.stock ?? '-' }}</td>
                  <td v-if="userRole === 'admin'">
                    <button class="btn btn-sm btn-primary me-1" @click="editMovie(m)">Editar</button>
                    <button class="btn btn-sm btn-success me-1" @click="verMovie(m)">Ver</button>
                    <button class="btn btn-sm btn-danger" @click="deleteMovie(m)">Borrar</button>
                  </td>
                </tr>
                <tr v-if="displayedMovies.length === 0">
                  <td colspan="8" class="text-center">No hay películas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- modal -->
    <MovieModal
      :show="showAddModal"
      :movie="selectedMovie"
      :isEdit="!!selectedMovie"
      @close="closeModal"
      @save="saveMovie"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MovieModal from '../components/MovieModal.vue'

const searchQuery = ref('')
const yearFilter = ref('')
const genreFilter = ref('')
const showAddModal = ref(false)
const selectedMovie = ref(null)
const userRole = ref(localStorage.getItem('userRole'))

const movies = ref([
  { id: 1, title: 'Venom', genre: 'Accion', year: 2018, salePrice: 10.73, rentPrice: 3.99, stock: 35, poster: 'https://i.imgur.com/placeholder.png' },
  { id: 2, title: 'Bad Boys', genre: 'Accion', year: 2020, salePrice: 11.99, rentPrice: 4.99, stock: 24, poster: 'https://i.imgur.com/placeholder2.png' }
])

const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018]

const displayedMovies = computed(() => {
  let list = [...movies.value]
  if (searchQuery.value) {
    list = list.filter(m => m.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }
  if (yearFilter.value) list = list.filter(m => String(m.year) === String(yearFilter.value))
  if (genreFilter.value) list = list.filter(m => m.genre === genreFilter.value)
  return list
})

const onAdd = () => {
  selectedMovie.value = null
  showAddModal.value = true
}

const editMovie = (movie) => {
  selectedMovie.value = { ...movie } // pasar copia
  showAddModal.value = true
}

const saveMovie = (movieData) => {
  // si viene con id actualiza, si no crea nuevo
  if (movieData.id) {
    const idx = movies.value.findIndex(m => m.id === movieData.id)
    if (idx !== -1) movies.value.splice(idx, 1, { ...movieData })
  } else {
    const newId = Math.max(0, ...movies.value.map(m => m.id)) + 1
    movies.value.push({ ...movieData, id: newId })
  }
}

const deleteMovie = (movie) => {
  if (!confirm('¿Seguro que desea eliminar esta película?')) return
  const idx = movies.value.findIndex(m => m.id === movie.id)
  if (idx !== -1) movies.value.splice(idx, 1)
}

const verMovie = (movie) => {
  // puedes abrir un modal detalle o redirigir a una vista
  alert(`Ver: ${movie.title}`)
}

const closeModal = () => {
  showAddModal.value = false
  selectedMovie.value = null
}

const buscar = () => {
  // displayedMovies es reactivo, solo resetea filtros si quieres
  // aquí solo dejamos que el computed haga su trabajo
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.movie-poster {
  width: 50px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
}
</style>