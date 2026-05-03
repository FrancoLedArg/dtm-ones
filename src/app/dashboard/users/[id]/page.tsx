// Next
import { headers } from "next/headers";
import { notFound } from "next/navigation";

// Better Auth
import { auth } from "@/lib/auth/auth";

// Components
import DeleteUserButton from "@/components/dashboard/users/delete-user-button";
import EditUserForm from "@/components/dashboard/users/edit-user-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await auth.api.getUser({
    query: {
      id,
    },
    headers: await headers(),
  });

  if (!user) {
    notFound();
  }

  return (
    <main className="flex w-full flex-1 flex-col gap-8 p-6 md:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usuario</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Administra la información de la cuenta seleccionada.
          </p>
        </div>
        <DeleteUserButton userId={user.id} userEmail={user.email} />
      </div>

      <EditUserForm user={{ ...user, role: user.role ?? null }} />
    </main>
  );
}
