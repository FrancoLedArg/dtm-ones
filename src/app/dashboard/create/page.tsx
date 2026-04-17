// Db + Drizzle
import { db } from "@/lib/db";

// Form
import CreatePlayerForm from "@/components/create-player-form";

export default async function Page() {
  const categories = await db.query.categories.findMany();

  return (
    <main>
      <CreatePlayerForm categories={categories} />
    </main>
  );
}
