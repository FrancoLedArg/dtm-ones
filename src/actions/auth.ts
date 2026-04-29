"use server";

// Next
import { revalidatePath } from "next/cache";

// Safe Action
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";

// Supabase
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Validation Schema
import { signInSchema } from "@/lib/validation/auth";

export const signIn = actionClient
  .metadata({ actionName: "signIn" })
  .inputSchema(signInSchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: parsedInput.email,
      password: parsedInput.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/", "layout");
    return { message: "Inicio de sesión exitoso." };
  });
