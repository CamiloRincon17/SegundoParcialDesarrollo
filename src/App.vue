<template>
  <div id="app">
    <NavbarComponent v-if="!isLoginRoute" />
    <div class="layout">
      <router-view />
    </div>
    <ProductCardComponent v-if="!isLoginRoute" />
    <FooterComponent v-if="!isLoginRoute" />
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
  },
  computed: {
    isLoginRoute() {
      return this.$route.name === 'login'
    }
  }
}
</script>
