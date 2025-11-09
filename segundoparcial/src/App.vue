<template>
  <div id="app">
    <NavbarComponent  />
    <div class="layout" >

      <router-view />

    </div>
    <ProductCardComponent />
    <FooterComponent />

  </div>
</template>

<script>
import FooterComponent from './components/FooterComponent.vue'
import NavbarComponent from './components/NavbarComponent.vue';
import ProductCardComponent from './components/ProductCardComponent.vue';


export default {
  name: 'App',
  components: {
    FooterComponent,
    NavbarComponent,
    ProductCardComponent
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
