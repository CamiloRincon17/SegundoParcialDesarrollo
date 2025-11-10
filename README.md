# Cinema Plus — Gestión de películas (Vue 3 + Bootstrap 5.3)

Aplicación web modular y responsiva para administrar un catálogo de películas (venta/alquiler). Construida con Vue 3, Bootstrap 5.3 y una API simulada con JSON Server.

## Objetivo del negocio
Administrar el catálogo (crear, listar, editar, eliminar) y permitir acceso según rol (admin/usuario) con una interfaz moderna y responsiva.

## Estructura del proyecto
```
src/
  ├── assets/         # Estilos, variables y recursos (incluye custom.scss)
  ├── components/     # Componentes reutilizables (Navbar, Sidebar, Footer, Cards, Modales)
  ├── layouts/        # Layouts (Dashboard con Sidebar + router-view)
  ├── router/         # Definición de rutas (vue-router)
  ├── service/        # Servicios de API (axios)
  ├── views/          # Vistas (LoginView, ProductoView, etc.)
  └── data/           # Datos locales (usuarios.json para login educativo)
```

## Instalación y ejecución
```bash
# 1) Instalar dependencias
npm install

# 2) Iniciar API simulada (JSON Server en http://localhost:3000)
npm run api

# 3) Ejecutar la app (Vue CLI)
npm run serve
```

## Configuración visual y paleta
- Bootstrap 5.3 incluido.
- Estilos y colores personalizados en `src/assets/custom.scss` (importado en `src/main.js`).

## Autenticación (educativa)
- Login contra `src/data/usuarios.json` (solo fines académicos).
- Guarda `isAuthenticated`, `userRole` y `username` en `localStorage`.
- Nota: No es un sistema de autenticación real ni apto para producción.

## Rutas principales
- `/login` — Inicio de sesión.
- `/dashboard` — Layout con Sidebar.
- `/dashboard/productos` — Gestión de productos (CRUD).
- `/productos` — Catálogo público (lectura).

## Consumo de API (CRUD de productos)
Servicio en `src/service/api.js` (axios, baseURL `http://localhost:3000`):
```js
export const getMovies = () => api.get('/movies')
export const getMovie = (id) => api.get(`/movies/${id}`)
export const createMovie = (data) => api.post('/movies', data)
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data)
export const deleteMovie = (id) => api.delete(`/movies/${id}`)
```
La app usa un modal (`MovieModal.vue`) para crear/editar y `ProductoView.vue` para listar, editar y eliminar.

## Componentización y comunicación
- `NavbarComponent`, `SidebarComponent`, `FooterComponent` — reusables.
- `ProductCardComponent` — recibe `movie` e `isAdmin` por props y emite eventos `view`/`delete`.
- `MovieModal` — recibe `movie`, `show`, `genres` y emite `saved`/`close`.

Ejemplo breve:
```vue
<!-- Parent (ProductoView.vue) -->
<ProductCardComponent :movie="movie" :is-admin="userRole === 'admin'" @view="onEdit" @delete="onDelete"/>
```

## Evidencia colaborativa
- Ramas de features, PRs y commits en GitHub (agregar enlaces):
  - Branch: <https://github.com/CamiloRincon17/SegundoParcialDesarrollo/branches>
  - Pull Request: <https://github.com/CamiloRincon17/SegundoParcialDesarrollo/pulls?q=is%3Apr+is%3Aclosed>
  - Historial de commits: <https://github.com/CamiloRincon17/SegundoParcialDesarrollo/commits/main/>



## Nota
El login es únicamente educativo y no representa un sistema real de autenticación.