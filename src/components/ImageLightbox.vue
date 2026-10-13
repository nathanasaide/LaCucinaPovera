<script setup lang="ts">
import { shallowRef } from 'vue'
import LightboxDialog from './LightboxDialog.vue'

defineProps<{ src: string; alt: string }>()

const open = shallowRef(false)
</script>

<template>
  <!-- Thumbnail — clickable -->
  <button type="button" class="img-lightbox-trigger" :aria-label="`View ${alt} full screen`" @click="open = true">
    <img :src="src" :alt="alt" loading="lazy" />
    <span class="img-lightbox-hint" aria-hidden="true">tap to enlarge</span>
  </button>

  <!-- Lightbox -->
  <LightboxDialog :open="open" :label="alt" @close="open = false">
    <img v-if="open" class="lightbox__img" :src="src" :alt="alt" />
  </LightboxDialog>
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
