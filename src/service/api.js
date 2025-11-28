//  libreria usada
import axios from 'axios'

// 1. Configuración base de Axios
const api = axios.create({
  baseURL: 'https://6929a1e39d311cddf34aa637.mockapi.io/api/v1',
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

// Exportar funciones CRUD para interactuar con la API de películas (recurso: productos)
export const getMovies = () => api.get('/productos')
export const getMovie = (id) => api.get(`/productos/${id}`)
export const createMovie = (data) => api.post('/productos', data)
export const updateMovie = (id, data) => api.put(`/productos/${id}`, data)
export const deleteMovie = (id) => api.delete(`/productos/${id}`)

// Funciones de autenticación (recurso: users)
export const getUsers = () => api.get('/users')
export const getUserByEmail = (email) => api.get(`/users?username=${email}`)
export const loginUser = async (email, password) => {
  try {
    const response = await api.get(`/users?username=${email}`)
    const users = response.data
    const user = users.find(u => u.username === email && u.password === password)
    return user || null
  } catch (error) {
    console.error('Error en loginUser:', error)
    throw error
  }
}
export const registerUser = (data) => api.post('/users', data)
export const updateUser = (id, data) => api.put(`/users/${id}`, data)
export const deleteUser = (id) => api.delete(`/users/${id}`)