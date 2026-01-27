// Next
import Link from "next/link";

// Db + Drizzle
import { db } from "@/lib/db";
import { players } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Button } from "@/components/ui/button";

// Phosphor
import { FolderOpenIcon, UserIcon } from "@phosphor-icons/react/ssr";
import { Item, ItemGroup, ItemMedia } from "@/components/ui/item";

export default async function Page() {
  const allPlayers = await db.query.players.findMany({
    with: {
      playerCategories: true,
    },
    orderBy: [desc(players.createdAt)],
  });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 className="text-2xl font-bold">Jugadores</h1>
        <p className="text-sm text-muted-foreground">
          Lista de todos los jugadores registrados
        </p>
      </div>

      {allPlayers.length > 0 ? (
        <ItemGroup>
          {allPlayers.map((player) => (
            <Item key={player.id}>
              <ItemMedia variant="image">
                <UserIcon size={32} />
              </ItemMedia>
            </Item>
          ))}
        </ItemGroup>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpenIcon size={32} />
            </EmptyMedia>
            <EmptyTitle>No hay jugadores aún</EmptyTitle>
            <EmptyDescription>
              No agregaste ningun jugador aún. Comienza agregando uno.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/dashboard/create">Agregar jugador</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </main>
  );
}
