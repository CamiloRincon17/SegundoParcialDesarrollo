//  libreria usada
import axios from 'axios'

// 1. Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000, // 10 segundos de timeout
})

//  Interceptor de respuestas para manejo global de errores
api.interceptors.response.use(
  // Si la respuesta es exitosa (status 2xx), la devuelve sin cambios.
  (response) => response,
  // Si hay un error en la respuesta, se ejecuta esta función.
  error => {
    // Solo loguear errores detallados en desarrollo para no exponer info en producción.
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error en la llamada API:', error)

      if (!error.response) {
        console.warn('🔌 Error de red: No se pudo conectar con el servidor. ¿Está corriendo `npm run api`?')
      } else if (error.response.status === 404) {
        console.warn(`🚫 Recurso no encontrado (404) en: ${error.config.url}`)
      } else if (error.response.status >= 500) {
        console.error('🔥 Error interno del servidor (5xx). Revisa la terminal de `json-server`.')
      }
    }

    // Es crucial propagar el error para que el `.catch()` en el componente que hizo la llamada pueda manejarlo.
    return Promise.reject(error)
  }
)

// Exportar funciones CRUD para interactuar con la API de películas
export const getMovies = () => api.get('/movies')
export const getMovie = (id) => api.get(`/movies/${id}`)
export const createMovie = (data) => api.post('/movies', data)
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data)
export const deleteMovie = (id) => api.delete(`/movies/${id}`)