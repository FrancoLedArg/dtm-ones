// Next
import Link from "next/link";

// Db + Drizzle
import { db } from "@/lib/db";
import { players, playerCategories } from "@/lib/db/schema";
import { and, desc, eq, exists, ilike } from "drizzle-orm";

// Components
import FilterButton from "@/components/dashboard/players/filter-button";
import SearchBar from "@/components/dashboard/players/search-bar";

// Shadcn
import { ItemGroup, Item, ItemTitle } from "@/components/ui/item";
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
import { PlusIcon, FolderOpenIcon } from "@phosphor-icons/react/ssr";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; c?: string | string[] }>;
}) {
  const { q, c } = await searchParams;

  const raw = c === undefined ? [] : Array.isArray(c) ? c : [c];

  const categoriesArray = [
    ...new Set(
      raw.map((s) => Number(s)).filter((n) => Number.isInteger(n) && n > 0),
    ),
  ];

  const allPlayers = await db
    .select()
    .from(players)
    .where(
      and(
        ilike(players.fullName, `%${q?.trim() ?? ""}%`),
        ...categoriesArray.map((categoryId) =>
          exists(
            db
              .select({ id: playerCategories.playerId })
              .from(playerCategories)
              .where(
                and(
                  eq(playerCategories.playerId, players.id),
                  eq(playerCategories.categoryId, categoryId),
                ),
              ),
          ),
        ),
      ),
    )
    .orderBy(desc(players.createdAt));

  const allCategories = await db.query.categories.findMany();

  return (
    <main className="p-10 flex flex-col gap-10">
      <h1 className="text-2xl font-bold">Players list</h1>

      <div className="flex items-center gap-10">
        <SearchBar />

        <div className="flex items-center gap-2">
          <FilterButton categories={allCategories} />
          <Button variant="outline" asChild>
            <Link href="/dashboard/players/create">
              <PlusIcon />
              Create player
            </Link>
          </Button>
        </div>
      </div>

      <ItemGroup>
        {allPlayers.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpenIcon />
              </EmptyMedia>
              <EmptyTitle>No players found</EmptyTitle>
              <EmptyDescription>
                Create a new player to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          allPlayers.map((player) => (
            <Item key={player.id} variant="muted">
              <ItemTitle>{player.fullName}</ItemTitle>
            </Item>
          ))
        )}
      </ItemGroup>
    </main>
  );
}
