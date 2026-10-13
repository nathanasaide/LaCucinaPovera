<script setup lang="ts">
import { onBeforeUnmount, useTemplateRef, watchEffect } from 'vue'

const props = defineProps<{ open: boolean; label: string }>()
const emit = defineEmits<{ close: [] }>()
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')
let restore: (() => void) | undefined

function restorePage() {
  restore?.()
  restore = undefined
}

watchEffect(() => {
  const element = dialog.value
  if (!element) return
  if (props.open && !element.open) {
    const trigger = document.activeElement
    const overflow = document.body.style.overflow
    restore = () => {
      document.body.style.overflow = overflow
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
    element.showModal()
    document.body.style.overflow = 'hidden'
    closeButton.value?.focus()
  } else if (!props.open && element.open) {
    element.close()
    restorePage()
  }
}, { flush: 'post' })

onBeforeUnmount(() => {
  dialog.value?.close()
  restorePage()
})
</script>

<template>
  <dialog
    ref="dialog"
    class="lightbox"
    :aria-label="label"
    @cancel.prevent="emit('close')"
    @close="emit('close')"
    @click.self="emit('close')"
  >
    <button ref="closeButton" type="button" class="lightbox__close" @click="emit('close')" aria-label="Close">&times;</button>
    <slot />
  </dialog>
</template>
