// Zod
import { z } from "zod";

export const categoryShapeSchema = z.object({
  id: z.number().int().positive("Debe seleccionar una categoría"),
  name: z.string().max(100).optional(),
});

export const createPlayerSchema = z.object({
  fullName: z.string().max(150).optional(),
  position: z.array(categoryShapeSchema),
  role: z.array(categoryShapeSchema),
  contractStatus: z.array(categoryShapeSchema),
  availabilityStatus: z.array(categoryShapeSchema),
  developmentStage: z.array(categoryShapeSchema),
  height: z.string().max(20).optional(),
  dateOfBirth: z.string().max(50).optional(),
  nationality: z.string().max(100).optional(),
  lastClub: z.string().max(150).optional(),
});
