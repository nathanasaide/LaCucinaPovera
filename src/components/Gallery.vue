<script setup lang="ts">
import { shallowRef, computed } from 'vue'
import LightboxDialog from './LightboxDialog.vue'

interface Photo {
  src: string
  alt: string
  caption?: string
}

const props = defineProps<{ photos: Photo[] }>()

const lightboxIndex = shallowRef<number | null>(null)

const currentPhoto = computed(() =>
  lightboxIndex.value !== null ? props.photos[lightboxIndex.value] : null
)

function open(i: number) {
  lightboxIndex.value = i
}

function close() {
  lightboxIndex.value = null
}

function prev() {
  if (lightboxIndex.value === null || !props.photos.length) return
  lightboxIndex.value = (lightboxIndex.value - 1 + props.photos.length) % props.photos.length
}

function next() {
  if (lightboxIndex.value === null || !props.photos.length) return
  lightboxIndex.value = (lightboxIndex.value + 1) % props.photos.length
}
</script>

<template>
  <!-- Gallery thumbnails -->
  <div class="gallery-grid">
    <button
      v-for="(photo, i) in photos"
      :key="i"
      type="button"
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
  <LightboxDialog
    :open="!!currentPhoto"
    :label="`Photo ${(lightboxIndex ?? 0) + 1} of ${photos.length}`"
    @close="close"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="next"
  >
    <template v-if="currentPhoto">
      <button
        v-if="photos.length > 1"
        type="button"
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
        type="button"
        class="lightbox__nav lightbox__nav--next"
        @click="next"
        aria-label="Next photo"
      >&#8250;</button>

      <p v-if="currentPhoto.caption" class="lightbox__caption">
        {{ currentPhoto.caption }}
      </p>
    </template>
  </LightboxDialog>
</template>
