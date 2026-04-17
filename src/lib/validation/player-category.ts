// Zod
import { z } from "zod";

export const playerCategorySchema = z.object({
  playerId: z.number().int().positive(),
  categoryId: z.number().int().positive(),
});
