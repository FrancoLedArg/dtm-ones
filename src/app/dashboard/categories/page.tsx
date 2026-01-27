// Next
import Link from "next/link";
import Image from "next/image";

// Db + Drizzle
import { db } from "@/lib/db";
import { categories, players } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

// Shadcn
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";

// Phosphor
import {
  FolderOpenIcon,
  ImageBrokenIcon,
  PenIcon,
} from "@phosphor-icons/react/ssr";

export default async function Page() {
  const allCategories = await db.query.categories.findMany({
    orderBy: [desc(categories.createdAt)],
  });

  if (allCategories.length === 0) {
    return (
      <main>
        <Card>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpenIcon size={32} />
              </EmptyMedia>
              <EmptyTitle>No hay categorías aún</EmptyTitle>
              <EmptyDescription>
                No agregaste ningun categoría aún. Comienza agregando una.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/dashboard/categories/create">
                  Agregar categoría
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 className="text-2xl font-bold">Categorías</h1>
        <p className="text-sm text-muted-foreground">
          Lista de todas las categorías registradas
        </p>
      </div>

      <ItemGroup>
        {allCategories.map((eachCategory) => (
          <Item key={eachCategory.id} variant="outline" asChild>
            <Link href={`/dashboard/categories/${eachCategory.id}`}>
              <ItemMedia variant="image">
                {eachCategory.bannerUrl ? (
                  <Image
                    src={eachCategory.bannerUrl || ""}
                    alt={eachCategory.name}
                    width={100}
                    height={100}
                  />
                ) : (
                  <ImageBrokenIcon size={24} />
                )}
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{eachCategory.name}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button
                  asChild
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  aria-label="Editar categoría"
                >
                  <Link href={`/dashboard/categories/${eachCategory.id}`}>
                    <PenIcon size={32} />
                  </Link>
                </Button>
              </ItemActions>
            </Link>
          </Item>
        ))}
      </ItemGroup>
    </main>
  );
}
