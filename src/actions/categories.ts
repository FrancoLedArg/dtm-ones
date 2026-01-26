"use server";

// Safe Action
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";

// Database
import { db } from "@/lib/db";

// Schema
import { categories } from "@/lib/db/schema";

// Validation Schema
import { createCategorySchema } from "@/lib/validation/categories";

export const createCategory = actionClient
  .metadata({ actionName: "createCategory" })
  .inputSchema(createCategorySchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput: data }) => {
    const newCategory = await db.insert(categories).values(data).returning();

    return newCategory;
  });
