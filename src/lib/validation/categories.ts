// Zod
import { z } from "zod";

// Schemas
import { playerCategorySchema } from "@/lib/validation/player-category";

export const categorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().max(100),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createCategorySchema = categorySchema.pick({
  name: true,
});

export type Category = z.infer<typeof categorySchema>;
