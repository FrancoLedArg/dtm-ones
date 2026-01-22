import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { SignUpForm } from "@/components/auth/signup-form";

export default async function SignUpPage() {
  const session = await getSession();

  // If already authenticated, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold">Crear Cuenta</h1>
          <p className="text-muted-foreground text-sm">
            Crea una cuenta para acceder al dashboard
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
