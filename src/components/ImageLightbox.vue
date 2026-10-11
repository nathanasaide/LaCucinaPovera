<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{ src: string; alt: string }>()

const open = ref(false)

function openLightbox() {
  open.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  open.value = false
  document.body.style.overflow = ''
}

function handleKey(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <!-- Thumbnail — clickable -->
  <button class="img-lightbox-trigger" :aria-label="`View ${alt} full screen`" @click="openLightbox">
    <img :src="src" :alt="alt" loading="lazy" />
    <span class="img-lightbox-hint" aria-hidden="true">tap to enlarge</span>
  </button>

  <!-- Lightbox -->
  <Teleport to="body">
    <div
      v-if="open"
      class="lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="alt"
      @click.self="closeLightbox"
    >
      <button class="lightbox__close" @click="closeLightbox" aria-label="Close">&times;</button>
      <img class="lightbox__img" :src="src" :alt="alt" />
    </div>
  </Teleport>
</template>

<style scoped>
.img-lightbox-trigger {
  display: block;
  width: 100%;
  cursor: zoom-in;
  background: none;
  border: none;
  padding: 0;
  position: relative;
}

.img-lightbox-trigger img {
  width: 100%;
  height: auto;
  border-radius: 1px;
  display: block;
}

.img-lightbox-hint {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: rgba(0,0,0,0.45);
  color: #fff;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.2em 0.5em;
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.img-lightbox-trigger:hover .img-lightbox-hint,
.img-lightbox-trigger:focus .img-lightbox-hint {
  opacity: 1;
}
</style>
