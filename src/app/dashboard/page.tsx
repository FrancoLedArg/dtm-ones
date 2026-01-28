// Next
import Link from "next/link";

// Db + Drizzle
import { db } from "@/lib/db";
import { players } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

// Tanstack
import { ColumnDef } from "@tanstack/react-table";

// Shadcn
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DataTable } from "@/components/players-table";
import { Button } from "@/components/ui/button";

// Phosphor
import { FolderOpenIcon, PlusIcon, UserIcon } from "@phosphor-icons/react/ssr";

export default async function Page() {
  const allPlayers = await db.query.players.findMany({
    with: {
      playerCategories: true,
    },
    orderBy: [desc(players.createdAt)],
  });

  const columns: ColumnDef<(typeof allPlayers)[number]>[] = [
    {
      header: "Nombre",
      accessorKey: "fullName",
    },
    {
      header: "Categoría",
      accessorKey: "playerCategories.name",
    },
    {
      header: "Altura",
      accessorKey: "height",
    },
    {
      header: "Fecha de nacimiento",
      accessorKey: "dateOfBirth",
    },
    {
      header: "Nacionalidad",
      accessorKey: "nationality",
    },
    {
      header: "Última club",
      accessorKey: "lastClub",
    },
    {
      header: "Creado el",
      accessorKey: "createdAt",
    },
  ];

  if (allPlayers.length === 0) {
    return (
      <main className="h-full p-10 flex flex-col gap-6">
        <div className="flex justify-between items-center gap-2">
          <h1 className="text-2xl font-bold">Jugadores</h1>
          <Button asChild>
            <Link href="/dashboard/create">
              <PlusIcon size={24} />
              Agregar jugador
            </Link>
          </Button>
        </div>

        <div></div>

        <div className="w-full h-full flex justify-center items-center bg-muted rounded-lg p-10">
          <Empty className="bg-white rounded-lg">
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
        </div>
      </main>
    );
  }

  return (
    <main className="p-10 flex flex-col gap-4">
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-3xl font-bold">Jugadores</h1>
        <Button asChild>
          <Link href="/dashboard/create">
            <PlusIcon size={24} />
            Agregar jugador
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={allPlayers} />
    </main>
  );
}
