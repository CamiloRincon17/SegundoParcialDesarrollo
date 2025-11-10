<template>
  <div class="d-flex">
    <SidebarComponent />
    <div class="flex-grow-1">
      <main class="p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '../components/SidebarComponent.vue'

export default {
  components: { SidebarComponent }
}
</script>