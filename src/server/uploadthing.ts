// Uploadthing
import { UTApi } from "uploadthing/server";

// Env
import { env } from "@/config/env";

export const utapi = new UTApi({
  token: env.UPLOADTHING_TOKEN,
});
