"use client";

// Next
import Link from "next/link";
import { useRouter } from "next/navigation";

// React Hook Form
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { createPlayer } from "@/actions/players";

// Validation Schema
import { createPlayerSchema as schema } from "@/lib/validation/players";

// Shadcn
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Zod
import { z } from "zod";

// Components
import TextField from "@/components/form/text-field";
import SubmitButton from "@/components/form/submit-button";

// Phosphor
import { XIcon } from "@phosphor-icons/react/dist/ssr";

type FormValues = z.infer<typeof schema>;

interface CategoryShape {
  id: number;
  name: string;
}

interface Props {
  categories: CategoryShape[];
}

function CategoryPicker({ categories }: { categories: CategoryShape[] }) {
  const { watch, setValue, getValues } = useFormContext<FormValues>();
  const playerCategories = watch("playerCategories") ?? [];

  const toggleCategory = (categoryId: number) => {
    const current = getValues("playerCategories") ?? [];
    const exists = current.some((c) => c.categoryId === categoryId);
    setValue(
      "playerCategories",
      exists
        ? current.filter((c) => c.categoryId !== categoryId)
        : [...current, { categoryId }],
      { shouldValidate: true, shouldDirty: true },
    );
  };

  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay categorías en el sistema. Podés crear el jugador y asignar
        categorías más adelante.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium leading-none">Categorías</p>
      <FieldGroup>
        <div
          data-slot="checkbox-group"
          className="flex flex-wrap gap-x-6 gap-y-3"
        >
          {categories.map((cat) => {
            const checked = playerCategories.some(
              (c) => c.categoryId === cat.id,
            );
            const fieldId = `player-category-${cat.id}`;
            return (
              <Field key={cat.id} orientation="horizontal">
                <Checkbox
                  id={fieldId}
                  checked={checked}
                  onCheckedChange={() => toggleCategory(cat.id)}
                />
                <FieldLabel htmlFor={fieldId} className="font-normal">
                  {cat.name}
                </FieldLabel>
              </Field>
            );
          })}
        </div>
      </FieldGroup>
    </div>
  );
}

export default function Form(props: Props) {
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
    resolver: zodResolver(schema as never),
    defaultValues: {
      fullName: "",
      height: "",
      dateOfBirth: "",
      nationality: "",
      lastClub: "",
      playerCategories: [],
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: FormValues) => {
    execute(data);
  };

  const { categories } = props;

  return (
    <div className="p-10 flex flex-col gap-8">
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Crear Jugador</h1>
          <p className="text-sm text-muted-foreground">
            Crea un nuevo jugador para tu equipo.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">
            <XIcon size={24} />
            Cancelar
          </Link>
        </Button>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <FieldSet className="flex flex-col gap-6">
            <div>
              <FieldLegend>Datos personales</FieldLegend>
              <FieldDescription>Identidad básica del jugador.</FieldDescription>
            </div>
            <FieldGroup>
              <TextField
                name="fullName"
                label="Nombre completo"
                placeholder="Juan Pérez"
              />
              <TextField
                name="dateOfBirth"
                label="Fecha de nacimiento"
                placeholder="DD/MM/YYYY"
              />
              <TextField
                name="nationality"
                label="Nacionalidad"
                placeholder="Argentina"
              />
            </FieldGroup>
          </FieldSet>

          <FieldSet className="flex flex-col gap-6">
            <div>
              <FieldLegend>Perfil y club</FieldLegend>
              <FieldDescription>
                Características físicas, último club y categorías en las que
                participa.
              </FieldDescription>
            </div>
            <FieldGroup>
              <TextField name="height" label="Altura" placeholder="1,85 m" />
              <TextField
                name="lastClub"
                label="Último club"
                placeholder="Nombre del club"
              />
              <CategoryPicker categories={categories} />
            </FieldGroup>
          </FieldSet>

          <SubmitButton label="Crear Jugador" isExecuting={isExecuting} />
        </form>
      </FormProvider>
    </div>
  );
}
