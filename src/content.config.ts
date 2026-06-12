import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.date(),
  updatedDate: z.date().optional(),
  category: z.enum(["avant-de-partir", "sante", "equipement"]),
  tags: z.array(z.string()).default([]),
  isAffiliate: z.boolean().default(false),
  featured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  theme: z.string().optional(),
});

export const collections = {
  "avant-de-partir": defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/avant-de-partir" }),
    schema: articleSchema,
  }),
  "sante": defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/sante" }),
    schema: articleSchema,
  }),
  "equipement": defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/equipement" }),
    schema: articleSchema,
  }),
};
