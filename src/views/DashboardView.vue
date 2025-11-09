<template>
  <div class="dashboard-container">
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="my-4">Películas</h1>
          
          <!-- Barra de herramientas -->
          <div class="toolbar d-flex gap-3 mb-4">
            <button class="btn btn-danger" @click="showAddModal = true">
              + Añadir película
            </button>
            <div class="d-flex gap-2 flex-grow-1">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Ingrese un título..."
                v-model="searchQuery"
              />
              <select class="form-select w-auto" v-model="yearFilter">
                <option value="">Año</option>
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
              <select class="form-select w-auto" v-model="genreFilter">
                <option value="">Género</option>
                <option value="Accion">Acción</option>
                <option value="Terror">Terror</option>
                <option value="Comedia">Comedia</option>
              </select>
              <button class="btn btn-primary" @click="buscar">Buscar</button>
            </div>
          </div>

          <!-- Tabla de películas -->
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Título</th>
                  <th>Género</th>
                  <th>Año</th>
                  <th>Precio de venta</th>
                  <th>Precio de alquiler</th>
                  <th>Existencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="movie in movies" :key="movie.id">
                  <td>
                    <img :src="movie.poster" class="movie-poster" :alt="movie.title">
                  </td>
                  <td>{{ movie.title }}</td>
                  <td>{{ movie.genre }}</td>
                  <td>{{ movie.year }}</td>
                  <td>${{ movie.salePrice }}</td>
                  <td>${{ movie.rentPrice }}</td>
                  <td>{{ movie.stock }}</td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-sm btn-primary" @click="editMovie(movie)">
                        Editar
                      </button>
                      <button class="btn btn-sm btn-success" @click="verMovie(movie)">
                        Ver
                      </button>
                      <button class="btn btn-sm btn-danger" @click="deleteMovie(movie)">
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Añadir el modal -->
  <MovieModal 
    :show="showAddModal" 
    :movie="selectedMovie"
    :isEdit="!!selectedMovie"
    @close="closeModal"
    @save="saveMovie"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MovieModal from '../components/MovieModal.vue'

const searchQuery = ref('')
const yearFilter = ref('')
const genreFilter = ref('')
const showAddModal = ref(false)
const selectedMovie = ref(null)

const movies = ref([
  {
    id: 1,
    title: 'Venom',
    genre: 'Accion',
    year: 2018,
    salePrice: 10.73,
    rentPrice: 3.99,
    stock: 35,
    poster: 'https://example.com/venom-poster.jpg'
  },
  // Añade más películas aquí
])

const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018]

const closeModal = () => {
  showAddModal.value = false
  selectedMovie.value = null
}

const editMovie = (movie) => {
  selectedMovie.value = { ...movie }
  showAddModal.value = true
}

const saveMovie = (movieData) => {
  if (selectedMovie.value) {
    // Actualizar película existente
    const index = movies.value.findIndex(m => m.id === movieData.id)
    if (index !== -1) {
      movies.value[index] = movieData
    }
  } else {
    // Añadir nueva película
    const newMovie = {
      ...movieData,
      id: Math.max(0, ...movies.value.map(m => m.id)) + 1
    }
    movies.value.push(newMovie)
  }
  closeModal()
}

const deleteMovie = (movie) => {
  if (confirm('¿Está seguro de eliminar esta película?')) {
    const index = movies.value.findIndex(m => m.id === movie.id)
    if (index !== -1) {
      movies.value.splice(index, 1)
    }
  }
}

const verMovie = (movie) => {
  // Aquí puedes implementar la vista detallada de la película
  console.log('Ver película:', movie)
}

const buscar = () => {
  // Implementar filtrado
  let filteredMovies = [...movies.value]
  
  if (searchQuery.value) {
    filteredMovies = filteredMovies.filter(movie => 
      movie.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (yearFilter.value) {
    filteredMovies = filteredMovies.filter(movie => 
      movie.year === yearFilter.value
    )
  }
  
  if (genreFilter.value) {
    filteredMovies = filteredMovies.filter(movie => 
      movie.genre === genreFilter.value
    )
  }
  
  movies.value = filteredMovies
}

onMounted(() => {
  // Cargar datos iniciales
})
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

.table {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-group {
  gap: 5px;
}
</style>