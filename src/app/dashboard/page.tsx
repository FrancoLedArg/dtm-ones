// Next
import Link from "next/link";

// Db + Drizzle
import { db } from "@/lib/db";
import { players } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

// Shadcn
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Phosphor
import { FolderOpenIcon } from "@phosphor-icons/react/ssr";

export default async function Page() {
  const allPlayers = await db.query.players.findMany({
    with: {
      category: true,
      position: true,
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
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Posición</TableHead>
                    <TableHead>Altura</TableHead>
                    <TableHead>Fecha de Nacimiento</TableHead>
                    <TableHead>Nacionalidad</TableHead>
                    <TableHead>Último Club</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPlayers.map((eachPlayer) => (
                    <TableRow key={eachPlayer.id}>
                      <TableCell className="font-medium">
                        {eachPlayer.fullName || "Sin nombre"}
                      </TableCell>
                      <TableCell>
                        {eachPlayer.category ? (
                          <Badge variant="secondary">
                            {eachPlayer.category.name}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {eachPlayer.position ? (
                          <Badge variant="outline">
                            {eachPlayer.position.name}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{eachPlayer.height || "-"}</TableCell>
                      <TableCell>{eachPlayer.dateOfBirth || "-"}</TableCell>
                      <TableCell>{eachPlayer.nationality || "-"}</TableCell>
                      <TableCell>{eachPlayer.lastClub || "-"}</TableCell>
                      <TableCell>
                        {eachPlayer.createdAt
                          ? new Date(eachPlayer.createdAt).toLocaleDateString(
                              "es-ES",
                            )
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
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
        </Card>
      )}
    </main>
  );
}
