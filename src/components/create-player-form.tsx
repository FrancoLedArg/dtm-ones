"use client";

// Next
import { useRouter } from "next/navigation";

// React Hook Form
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { createPlayer } from "@/actions/players";

// Validation Schema
import { createPlayerSchema as schema } from "@/lib/validation/players";

// Shadcn
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FieldGroup, FieldSet, FieldSeparator } from "@/components/ui/field";
import { toast } from "sonner";

// Zod
import { z } from "zod";

// Components
import TextField from "@/components/form/text-field";
import SelectField from "@/components/form/select-field";
import SubmitButton from "@/components/form/submit-button";

type FormValues = z.infer<typeof schema>;

export default function Form({
  playerCategories,
}: {
  playerCategories: { playerId: number; categoryId: number }[];
}) {
  const router = useRouter();

  const { execute, isExecuting } = useAction(createPlayer, {
    onSuccess: () => {
      toast.success("Jugador creado correctamente");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error("Error al crear el jugador.", {
        description: error.serverError,
      });
    },
  });

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      category: 0,
      position: 0,
      height: "",
      dateOfBirth: "",
      nationality: "",
      lastClub: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: FormValues) => {
    execute(data);
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Crear Jugador</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <TextField name="fullName" label="Nombre Completo" />
                <SelectField
                  name="category"
                  label="Categoría"
                  options={categories}
                />
                <SelectField
                  name="position"
                  label="Posición"
                  options={positions}
                />
                <TextField name="height" label="Altura" />
                <TextField
                  name="dateOfBirth"
                  label="Fecha de Nacimiento"
                  placeholder="DD/MM/YYYY"
                />
                <TextField name="nationality" label="Nacionalidad" />
                <TextField name="lastClub" label="Último Club" />
                <SubmitButton label="Crear Jugador" isExecuting={isExecuting} />
              </FieldSet>
            </FieldGroup>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
