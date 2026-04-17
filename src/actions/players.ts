"use server";

// Safe Action
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";

// Database
import { db } from "@/lib/db";

// Schema
import { players, playerCategories } from "@/lib/db/schema";

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
    const { playerCategories: categoryRows, ...playerRow } = data;

    return db.transaction(async (tx) => {
      const [inserted] = await tx.insert(players).values(playerRow).returning();

      if (categoryRows.length > 0) {
        await tx.insert(playerCategories).values(
          categoryRows.map((row) => ({
            playerId: inserted.id,
            categoryId: row.categoryId,
          })),
        );
      }

      return inserted;
    });
  });
