<template>
  <!-- Modal Backdrop -->
  <div v-if="show" class="modal-backdrop fade show"></div>
  
  <!-- Modal -->
  <div v-if="show" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i :class="`bi ${icon} me-2`"></i>
            {{ title }}
          </h5>
          <button type="button" class="btn-close" @click="cancel" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
          <p v-if="warningMessage" class="text-danger fw-bold mb-0">
            <i class="bi bi-exclamation-triangle-fill me-1"></i>
            {{ warningMessage }}
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="cancel">
            <i class="bi bi-x-circle me-1"></i>
            {{ cancelText }}
          </button>
          <button type="button" :class="`btn btn-${confirmType}`" @click="confirm">
            <i :class="`bi ${confirmIcon} me-1`"></i>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: 'Confirmar Acción'
  },
  message: {
    type: String,
    required: true
  },
  warningMessage: {
    type: String,
    default: 'Esta acción no se puede deshacer.'
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  confirmType: {
    type: String,
    default: 'danger',
    validator: (value) => ['primary', 'danger', 'warning', 'success'].includes(value)
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const icon = computed(() => {
  const icons = {
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    primary: 'bi-question-circle-fill',
    success: 'bi-check-circle-fill'
  }
  return icons[props.confirmType] || icons.danger
})

const confirmIcon = computed(() => {
  const icons = {
    danger: 'bi-trash-fill',
    warning: 'bi-exclamation-triangle-fill',
    primary: 'bi-check-lg',
    success: 'bi-check-circle-fill'
  }
  return icons[props.confirmType] || icons.primary
})

const confirm = () => {
  emit('confirm')
  emit('close')
}

const cancel = () => {
  emit('cancel')
  emit('close')
}
</script>

<style scoped>
.modal-content {
  border-radius: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  border-bottom: 2px solid #dee2e6;
}

.modal-title {
  font-weight: 600;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
}
</style>
