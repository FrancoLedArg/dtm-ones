"use server";

// Safe Action
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";

// Database
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Schema
import { players, playerMedia } from "@/lib/db/schema";

// Validation Schema
import { createPlayerMediaSchema } from "@/lib/validation/player-media";

export const createPlayerMedia = actionClient
  .metadata({ actionName: "createPlayerMedia" })
  .inputSchema(createPlayerMediaSchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput }) => {
    const { playerId, ...data } = parsedInput;

    const existingPlayer = await db.query.players.findFirst({
      where: eq(players.id, playerId),
    });

    if (!existingPlayer) {
      throw new Error("Jugador no encontrado.");
    }

    await db.insert(playerMedia).values({
      playerId,
      ...data,
    });

    revalidatePath(`/dashboard/players/${playerId}`);

    return {
      success: true,
      message: "Media agregada correctamente.",
    };
  });

/*
export const deletePlayerMedia = actionClient
  .metadata({ actionName: "deletePlayerMedia" })
  .inputSchema(deletePlayerMediaSchema)
  .action(async ({ parsedInput }) => {
    const mediaToDelete = await db.query.playerMedia.findFirst({
      where: eq(playerMedia.id, parsedInput.id),
    });

    if (!mediaToDelete) {
      throw new Error("Asset no encontrado.");
    }

    await db.delete(playerMedia).where(eq(playerMedia.id, parsedInput.id));

    const filePath = extractPathFromPublicUrl(
      mediaToDelete.url,
      PLAYER_MEDIA_BUCKET,
    );

    if (filePath) {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase.storage
        .from(PLAYER_MEDIA_BUCKET)
        .remove([filePath]);

      if (error) {
        throw new Error("No se pudo eliminar el asset en Supabase.");
      }
    }

    revalidatePath(`/dashboard/players/${mediaToDelete.playerId}`);

    return {
      success: true,
      message: "Asset eliminado correctamente.",
    };
  });
*/
