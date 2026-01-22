"use server";

// Safe Action
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";

// Database
import { db } from "@/lib/db";

// Schema
import { players, categories, positions } from "@/lib/db/schema";

// Drizzle
import { desc } from "drizzle-orm";

// Validation Schema
import { createPlayerSchema } from "@/lib/validation/players";

export const createPlayer = actionClient
  .metadata({ actionName: "createPlayer" })
  .inputSchema(createPlayerSchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput: data }) => {
    const newPlayer = await db.insert(players).values(data).returning();

    return newPlayer;
  });
