// Zod
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().max(100),
  bannerUrl: z.url().optional(),
});
