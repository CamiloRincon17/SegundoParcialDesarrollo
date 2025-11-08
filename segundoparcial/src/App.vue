<template>
    <div id="app">
          <router-view/>
          <FooterComponent />
          <NavbarComponent  />
          <SidebarComponent />  
          <ProductCardComponent />
    </div>
</template>

<script>
import FooterComponent from './components/FooterComponent.vue'
import NavbarComponent from './components/NavbarComponent.vue'; 
import ProductCardComponent from './components/ProductCardComponent.vue';
import SidebarComponent from './components/SidebarComponent.vue';


export default {
  name: 'App',
  components: {
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
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
