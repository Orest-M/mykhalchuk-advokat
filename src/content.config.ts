/**
 * Content collections. Both use a glob loader over
 * `src/content/<collection>/<locale>/*.md`, so a second locale is just a new
 * folder. Real content arrives in tasks 6 (services) and 7 (faq); this file
 * defines only the schemas plus one example file per collection.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    /** Card title, e.g. "Військові справи". */
    title: z.string(),
    /** URL slug for future per-service pages; defaults to the file id. */
    slug: z.string().optional(),
    /** Sort order in the grid (ascending). */
    order: z.number().default(99),
    /** Inline icon name resolved by `Icon.astro` (task 4). */
    icon: z.string().default('scales'),
    /** One or two sentences shown on the card. */
    summary: z.string(),
    /** Highlighted (wider) card — true for military when militaryFocus is on. */
    featured: z.boolean().default(false),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    /** The question. The answer is the Markdown body. */
    title: z.string(),
    /** Sort order in the accordion (ascending). */
    order: z.number().default(99),
    /** Pin to the top / highlight if ever needed. */
    featured: z.boolean().default(false),
  }),
});

export const collections = { services, faq };
