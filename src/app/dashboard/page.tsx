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
      playerPositions: true,
      playerRoles: true,
      playerContractStatuses: true,
      playerAvailabilityStatuses: true,
      playerDevelopmentStages: true,
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
      accessorKey: "playerPositions.name",
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

        <Empty className="w-full h-full bg-muted rounded-lg">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-primary">
              <FolderOpenIcon size={48} />
            </EmptyMedia>

            <EmptyTitle>No hay jugadores aún</EmptyTitle>
            <EmptyDescription>
              No agregaste ningun jugador aún.
              <br />
              Comienza agregando uno.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
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
