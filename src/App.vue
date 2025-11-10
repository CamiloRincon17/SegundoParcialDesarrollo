<template>
  <div id="app">
    <NavbarComponent v-if="!isLoginRoute" />
    <router-view />
    <FooterComponent v-if="!isLoginRoute" />
  </div>
</template>

<script>
import FooterComponent from './components/FooterComponent.vue'
import NavbarComponent from './components/NavbarComponent.vue';

export default {
  name: 'App',
  components: {
    FooterComponent,
    NavbarComponent
  },
  computed: {
    isLoginRoute() {
      return this.$route.name === 'login'
    }
  }
}
</script>
