import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const settingsCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.object({
    siteName: z.string(),
    tagline: z.string(),
    scheduleOverride: z.enum(['auto', 'open', 'closed']).default('auto'),
    openStatusText: z.string(),
    closedStatusText: z.string(),
    openingHours: z.array(z.object({
      day: z.string(),
      hours: z.string(),
    })),
    hoursNote: z.string().optional(),
    hoursNoteExpires: z.iso.date().or(z.literal('')).optional(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    instagramUrl: z.url({ protocol: /^https?$/ }),
    facebookUrl: z.url({ protocol: /^https?$/ }).or(z.literal('')).optional(),
    googleMapsUrl: z.url({ protocol: /^https?$/ }),
    storyText: z.string(),
    storyName: z.string(),
  }),
});

const menuCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/menu' }),
  schema: z.object({
    category: z.string(),
    description: z.string().optional(),
    items: z.array(z.object({
      name: z.string(),
      description: z.string(),
      price: z.string(),
      dietary: z.string().optional(),
    })),
  }),
});

const photosCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/photos' }),
  schema: z.object({
    photos: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })),
  }),
});

const woodbankCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/woodbank' }),
  schema: z.object({
    googleMapsUrl: z.url({ protocol: /^https?$/ }).or(z.literal('')).optional(),
    locationText: z.string(),
    soupText: z.string(),
    focacciaText: z.string(),
    pizzas: z.array(z.object({
      name: z.string(),
      description: z.string(),
      price: z.string().optional(),
    })),
    dippers: z.array(z.object({
      name: z.string(),
      price: z.string(),
    })).optional(),
  }),
});

export const collections = {
  settings: settingsCollection,
  menu: menuCollection,
  photos: photosCollection,
  woodbank: woodbankCollection,
};
