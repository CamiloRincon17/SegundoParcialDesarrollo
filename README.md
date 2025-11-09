# Segundo Parcial - Vue.js Project

This is a Vue.js project created for the second partial evaluation. It includes a login system, a dashboard, and a product management section. The project is built with Vue 3, Vue Router for navigation, and Bootstrap 5 for styling.

## Features

- **User Authentication:** A simple login system that grants access to protected routes.
- **Dashboard:** A central hub for the application after logging in.
- **Product Management:** A section to view and manage products.
- **Responsive Design:** The use of Bootstrap ensures the application is usable on different screen sizes.

## Project Setup

To get the project up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd SegundopParcialDesarrollo
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

## Available Scripts

In the project directory, you can run the following commands:

### `npm run serve`

Runs the app in development mode. Open [http://localhost:8080](http://localhost:8080) to view it in the browser. The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `dist` directory. It correctly bundles Vue in production mode and optimizes the build for the best performance.

### `npm run lint`

Lints and fixes files.

## Project Structure

The project follows a standard Vue CLI structure:

```
.
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── FooterComponent.vue
│   │   ├── NavbarComponent.vue
│   │   ├── ProductCardComponent.vue
│   │   └── SidebarComponent.vue
│   ├── router/
│   │   └── index.js
│   ├── views/
│   │   ├── DashboardView.vue
│   │   ├── LoginView.vue
│   │   └── ProductoView.vue
│   ├── App.vue
│   └── main.js
├── .gitignore
├── babel.config.js
├── package.json
└── README.md
```

- **`src/components`**: Contains reusable Vue components.
- **`src/views`**: Contains the main pages of the application.
- **`src/router`**: Defines the application's routes.
- **`src/main.js`**: The entry point of the application.

## Dependencies

The main dependencies of the project are:

- **`vue`**: The core Vue.js library.
- **`vue-router`**: The official router for Vue.js.
- **`bootstrap`**: The popular CSS framework for building responsive, mobile-first projects on the web.

## Authentication

The project uses a simple authentication mechanism based on `localStorage`. The `isAuthenticated` flag is stored in `localStorage` after a successful login. The router's `beforeEach` guard checks for this flag to protect routes that require authentication.

## Configuration

See [Configuration Reference](https://cli.vuejs.org/config/).