import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { disciplines, projectStatuses } from "@lib/content/types";

const disciplineSchema = z.enum(disciplines);
const statusSchema = z.enum(projectStatuses);

const linkSchema = z
  .object({
    label: z.string(),
    url: z.string().url()
  })
  .optional();

const sharedVisualSchema = z
  .object({
    alt: z.string(),
    label: z.string().optional()
  })
  .optional();

const projectImageSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string(),
  caption: z.string().optional()
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    context: z.string(),
    impact: z.string(),
    disciplines: z.array(disciplineSchema).min(1),
    status: statusSchema,
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    repository: linkSchema,
    demo: linkSchema,
    cover: sharedVisualSchema,
    mainImage: projectImageSchema.optional(),
    supportingImages: z.array(projectImageSchema).default([]),
    complexity: z.string(),
    role: z.string(),
    displayOrder: z.number().int().nonnegative().default(100)
  })
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    topic: z.string(),
    disciplines: z.array(disciplineSchema).min(1),
    status: statusSchema.default("planned"),
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    readingTime: z.string(),
    repository: linkSchema,
    demo: linkSchema,
    cover: sharedVisualSchema
  })
});

const labs = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/labs" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    question: z.string(),
    disciplines: z.array(disciplineSchema).min(1),
    status: statusSchema,
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    repository: linkSchema,
    demo: linkSchema,
    cover: sharedVisualSchema
  })
});

const travel = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/travel" }),
  schema: ({ image }) =>
    z.object({
      photos: z.array(
        z.object({
          image: image(),
          alt: z.string().min(1),
          location: z.string().min(1),
          capturedAt: z.coerce.date().optional(),
          caption: z.string().optional(),
          displayOrder: z.number().int().nonnegative().default(100)
        })
      )
    })
});

export const collections = { projects, notes, labs, travel };
