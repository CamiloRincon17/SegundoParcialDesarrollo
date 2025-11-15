<template>
  <div id="app">
    <NavbarComponent v-if="!isLoginRoute" />
    <router-view />
    <FooterComponent v-if="!isLoginRoute" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import FooterComponent from './components/FooterComponent.vue'
import NavbarComponent from './components/NavbarComponent.vue'

export default {
  name: 'App',
  components: {
    FooterComponent,
    NavbarComponent
  },
  setup() {
    const route = useRoute()
    const isLoginRoute = computed(() => {
      return route?.name === 'Login'
    })
    
    return {
      isLoginRoute
    }
  }
}
</script>
