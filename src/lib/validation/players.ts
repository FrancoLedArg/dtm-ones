// Zod
import { z } from "zod";

// Schemas
import { playerCategorySchema } from "@/lib/validation/player-category";

export const playerSchema = z.object({
  id: z.number().int().positive(),
  fullName: z.string().max(150).optional(),
  height: z.string().max(20).optional(),
  dateOfBirth: z.string().max(50).optional(),
  nationality: z.string().max(100).optional(),
  lastClub: z.string().max(150).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  playerCategories: z.array(playerCategorySchema),
});

export const getPlayerSchema = playerSchema.pick({
  id: true,
});

/** Input for creating a row in `players` plus optional `player_categories` links. */
export const createPlayerSchema = z.object({
  fullName: z.string().min(1).max(150),
  height: z.string().min(1).max(20),
  dateOfBirth: z.string().min(1).max(50),
  nationality: z.string().min(1).max(100),
  lastClub: z.string().min(1).max(150),
  playerCategories: z.array(
    z.object({
      categoryId: z.number().int().positive(),
    }),
  ),
});
