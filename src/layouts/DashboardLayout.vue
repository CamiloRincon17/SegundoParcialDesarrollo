<template>
  <div class="d-flex">
    <SidebarComponent />
    <div class="flex-grow-1">
      <NavbarComponent />
      <main class="p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '../components/SidebarComponent.vue'
import NavbarComponent from '../components/NavbarComponent.vue'

export default {
  components: { SidebarComponent, NavbarComponent }
}
</script>