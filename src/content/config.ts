import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    tags: z.array(z.string()).optional().default([]),
    category: z.string().optional().default(''),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { posts };
