// Next
import Link from "next/link";

// Db + Drizzle
import { db } from "@/lib/db";

// Shadcn
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

// Form
import CreatePlayerForm from "@/components/create-player-form";

// Phosphor
import { FolderOpenIcon } from "@phosphor-icons/react/ssr";

export default async function Page() {
  const playerCategories = await db.query.playerCategories.findMany();

  if (playerCategories.length === 0) {
    return (
      <main>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpenIcon size={32} />
            </EmptyMedia>
            <EmptyTitle>No se encontraron categorías o posiciones</EmptyTitle>
            <EmptyDescription>
              Agrega como mínimo una categoría y una posición antes de poder
              crear un jugador.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex flex-row">
            <Button asChild>
              <Link href="/dashboard/positions">Agregar posición</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/categories/create">Agregar categoría</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  return (
    <main>
      <CreatePlayerForm playerCategories={playerCategories} />
    </main>
  );
}
