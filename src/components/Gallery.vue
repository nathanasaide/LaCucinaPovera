<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Photo {
  src: string
  alt: string
  caption?: string
}

const props = defineProps<{ photos: Photo[] }>()

const lightboxIndex = ref<number | null>(null)

const currentPhoto = computed(() =>
  lightboxIndex.value !== null ? props.photos[lightboxIndex.value] : null
)

function open(i: number) {
  lightboxIndex.value = i
  document.body.style.overflow = 'hidden'
}

function close() {
  lightboxIndex.value = null
  document.body.style.overflow = ''
}

function prev() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value - 1 + props.photos.length) % props.photos.length
}

function next() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % props.photos.length
}

function handleKey(e: KeyboardEvent) {
  if (lightboxIndex.value === null) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <!-- Gallery thumbnails -->
  <div class="gallery-grid">
    <button
      v-for="(photo, i) in photos"
      :key="i"
      class="gallery-thumb"
      :aria-label="`View photo: ${photo.alt}`"
      @click="open(i)"
    >
      <img
        :src="photo.src"
        :alt="photo.alt"
        loading="lazy"
        decoding="async"
      />
    </button>
  </div>

  <!-- Lightbox -->
  <Teleport to="body">
    <div
      v-if="currentPhoto"
      class="lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="`Photo ${(lightboxIndex ?? 0) + 1} of ${photos.length}`"
      @click.self="close"
    >
      <button class="lightbox__close" @click="close" aria-label="Close">&times;</button>

      <button
        v-if="photos.length > 1"
        class="lightbox__nav lightbox__nav--prev"
        @click="prev"
        aria-label="Previous photo"
      >&#8249;</button>

      <img
        class="lightbox__img"
        :src="currentPhoto.src"
        :alt="currentPhoto.alt"
      />

      <button
        v-if="photos.length > 1"
        class="lightbox__nav lightbox__nav--next"
        @click="next"
        aria-label="Next photo"
      >&#8250;</button>

      <p v-if="currentPhoto.caption" class="lightbox__caption">
        {{ currentPhoto.caption }}
      </p>
    </div>
  </Teleport>
</template>
