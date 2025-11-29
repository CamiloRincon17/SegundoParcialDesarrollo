<template>
  <transition name="fade">
    <div v-if="show" :class="`alert alert-${type} alert-dismissible fade show d-flex align-items-center`" role="alert">
      <i :class="`bi ${icon} me-2`" style="font-size: 1.5rem;"></i>
      <div class="flex-grow-1">{{ message }}</div>
      <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
    </div>
  </transition>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref, watch, computed } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'danger', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000 // Auto-dismiss después de 3 segundos
  },
  modelValue: Boolean // Para v-model
})

const emit = defineEmits(['update:modelValue', 'close'])

const show = ref(props.modelValue)
let timeoutId = null

const icon = computed(() => {
  const icons = {
    success: 'bi-check-circle-fill',
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill'
  }
  return icons[props.type] || icons.info
})

const close = () => {
  show.value = false
  emit('update:modelValue', false)
  emit('close')
  if (timeoutId) clearTimeout(timeoutId)
}

watch(() => props.modelValue, (newVal) => {
  show.value = newVal
  if (newVal && props.duration > 0) {
    // Auto-dismiss
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
})

watch(() => props.message, (newVal) => {
  if (newVal) {
    show.value = true
    emit('update:modelValue', true)
    if (props.duration > 0) {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        close()
      }, props.duration)
    }
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.alert {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid currentColor;
}
</style>
