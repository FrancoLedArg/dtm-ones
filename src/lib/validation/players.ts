// Zod
import { z } from "zod";

export const createPlayerSchema = z.object({
  fullName: z.string().max(150).optional(),
  category: z.number().int().positive("Debe seleccionar una categoría"),
  position: z.number().int().positive("Debe seleccionar una posición"),
  height: z.string().max(20).optional(),
  dateOfBirth: z.string().max(50).optional(),
  nationality: z.string().max(100).optional(),
  lastClub: z.string().max(150).optional(),
});
