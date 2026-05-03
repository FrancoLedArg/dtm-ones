// Next
import { headers } from "next/headers";
import Link from "next/link";

// Better Auth
import { auth } from "@/lib/auth/auth";

// Shadcn
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemGroup,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";

// Phosphor
import { UsersIcon } from "@phosphor-icons/react/ssr";

import CreateUserDialog from "@/components/dashboard/users/create-user-dialog";

export default async function Page() {
  const { users, total } = await auth.api.listUsers({
    query: {
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    headers: await headers(),
  });

  console.log(users);

  return (
    <main className="flex w-full flex-1 flex-col gap-8 p-6 md:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Cuentas registradas en el panel (Better Auth).
            {total > 0 ? (
              <span className="text-foreground">
                {" "}
                · {total} usuario{total === 1 ? "" : "s"}
              </span>
            ) : null}
          </p>
        </div>
        <CreateUserDialog />
      </div>

      <ItemGroup className="w-full h-full flex-col gap-4 rounded-lg border border-border bg-background p-4 shadox-xs dark:border-input dark:bg-input/30">
        {total === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UsersIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle>Sin usuarios</EmptyTitle>
              <EmptyDescription>
                Creá un usuario con &quot;Nuevo usuario&quot; o esperá a que se
                registren cuentas.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          users.map((user) => (
            <Item key={user.id} variant="outline" asChild>
              <Link href={`/dashboard/users/${user.id}`}>
                <ItemContent className="min-w-0">
                  <ItemTitle className="w-full max-w-full">
                    {user.name?.trim() ? user.name : "Sin nombre"}
                  </ItemTitle>
                  <ItemDescription>
                    {user.email}
                    <span className="text-muted-foreground/80">
                      {" · "}
                      Alta{" "}
                      {new Date(user.createdAt).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </ItemDescription>
                </ItemContent>
                <Badge variant="outline">{user.role ?? "user"}</Badge>
              </Link>
            </Item>
          ))
        )}
      </ItemGroup>
    </main>
  );
}
