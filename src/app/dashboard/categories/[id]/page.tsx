// Next
import Image from "next/image";
import { notFound } from "next/navigation";

// Db + Drizzle
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Shadcn
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  ItemDescription,
  ItemContent,
  ItemActions,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyMedia } from "@/components/ui/empty";

// Phosphor
import { ImageBrokenIcon, UserIcon, PenIcon } from "@phosphor-icons/react/ssr";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, Number(id)),
    with: {
      players: true,
    },
  });

  if (!category) {
    return notFound();
  }

  return (
    <main className="py-8 flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <div className="w-full h-48 relative flex justify-center items-center bg-gray-200 rounded-md overflow-hidden">
          {category.bannerUrl ? (
            <Image
              src={category.bannerUrl}
              alt={category.name}
              fill
              className="object-cover w-full h-full"
            />
          ) : (
            <ImageBrokenIcon size={24} className="text-gray-400" />
          )}
        </div>
      </div>

      <div className="w-full flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        <p className="text-sm text-muted-foreground">
          Lista de todos los jugadores de la categoría
        </p>
      </div>

      {category.players.length > 0 ? (
        <ItemGroup>
          {category.players.map((player) => (
            <Item key={player.id}>
              <ItemMedia variant="image">
                <UserIcon size={32} />
              </ItemMedia>

              <ItemContent>
                <ItemTitle>{player.fullName}</ItemTitle>
                <ItemDescription>Something about the player</ItemDescription>
              </ItemContent>

              <ItemActions>
                <Button variant="outline" size="icon">
                  <PenIcon size={32} />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserIcon size={32} />
            </EmptyMedia>
          </EmptyHeader>
        </Empty>
      )}
    </main>
  );
}
