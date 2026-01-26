"use server";

// UploadThing
import { utapi } from "@/server/uploadthing";

// Safe Action
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

const deleteFileSchema = z.object({
  imageUrl: z.url(),
});

export const deleteUploadThingFile = actionClient
  .metadata({ actionName: "deleteUploadThingFile" })
  .inputSchema(deleteFileSchema)
  .action(async ({ parsedInput: { imageUrl } }) => {
    await utapi.deleteFiles(imageUrl);

    return { success: true };
  });
