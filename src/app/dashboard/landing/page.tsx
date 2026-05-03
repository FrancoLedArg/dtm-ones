// Db
import { db } from "@/lib/db";
import { landingMedia } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

// Components
import LandingMedia from "@/components/landing/landing-media";

export default async function Page() {
  const rows = await db
    .select()
    .from(landingMedia)
    .orderBy(asc(landingMedia.createdAt));

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Landing Page Content
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage hero video and gallery images for the public landing page.
        </p>
      </div>
      <LandingMedia landingMedia={rows} />
    </div>
  );
}
