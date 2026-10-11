import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const settingsCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.object({
    siteName: z.string(),
    tagline: z.string(),
    isOpen: z.boolean(),
    openStatusText: z.string(),
    closedStatusText: z.string(),
    openingHours: z.array(z.object({
      day: z.string(),
      hours: z.string(),
    })),
    hoursNote: z.string().optional(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    instagramUrl: z.string().url(),
    facebookUrl: z.string().url().or(z.literal('')).optional(),
    googleMapsUrl: z.string().url(),
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

export const collections = {
  settings: settingsCollection,
  menu: menuCollection,
  photos: photosCollection,
};
