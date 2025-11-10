# Cinema Management System

## Description
A modern web application for managing a movie rental and sales business, built with Vue.js and Bootstrap 5.3.

## Features
- User authentication (admin/customer roles)
- Movie catalog management
- Rental and sales tracking
- Responsive design
- API integration

## Project Structure
```
src/
  ├── components/    # Reusable UI components
  ├── views/        # Page components
  ├── layouts/      # Layout templates
  ├── router/       # Route definitions
  ├── service/      # API services
  ├── assets/       # Static resources
  └── data/         # Local data (users)
```

## Setup and Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## API Integration Example
```javascript
// Get movies
const movies = await api.getMovies()

// Create movie
const newMovie = await api.createMovie({
  title: 'New Movie',
  price: 9.99
})
```

## Component Communication
Examples of props and events usage:
```vue
<!-- Parent -->
<MovieCard 
  :movie="movieData"
  @update="handleUpdate"
/>

<!-- Child -->
<script>
export default {
  props: ['movie'],
  methods: {
    update() {
      this.$emit('update', this.movie)
    }
  }
}
</script>
```

## Collaboration Evidence
- [Feature Branch](link-to-branch)
- [Pull Request #1](link-to-pr)
- [Commit History](link-to-commits)

## Note
The authentication system implemented is for educational purposes only and should not be used in production environments.