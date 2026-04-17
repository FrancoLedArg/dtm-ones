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
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
} from "@/components/ui/field";
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
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {categories.map((cat) => {
          const checked = playerCategories.some((c) => c.categoryId === cat.id);
          return (
            <label
              key={cat.id}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                className="size-4 rounded border border-input accent-primary"
                checked={checked}
                onChange={() => toggleCategory(cat.id)}
              />
              <span>{cat.name}</span>
            </label>
          );
        })}
      </div>
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
    resolver: zodResolver(schema),
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

  type FormStepConfig = {
    title: string;
    description: string;
    renderFields: () => React.ReactNode;
  };

  const stepConfigs: FormStepConfig[] = [
    {
      title: "Datos personales",
      description: "Identidad básica del jugador.",
      renderFields: () => (
        <>
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
        </>
      ),
    },
    {
      title: "Perfil y club",
      description:
        "Características físicas, último club y categorías en las que participa.",
      renderFields: () => (
        <>
          <TextField name="height" label="Altura" placeholder="1,85 m" />
          <TextField
            name="lastClub"
            label="Último club"
            placeholder="Nombre del club"
          />
          <CategoryPicker categories={categories} />
        </>
      ),
    },
  ];

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
          {stepConfigs.map((step, index) => (
            <FieldSet key={index} className="flex flex-row items-stretch gap-4">
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="w-8 h-8 text-sm bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs">{index + 1}</span>
                </div>
                <div className="w-[1px] flex-1 bg-muted" />
              </div>

              <div className="w-full flex flex-col gap-6">
                <div>
                  <FieldLegend>{step.title}</FieldLegend>
                  <FieldDescription>{step.description}</FieldDescription>
                </div>

                <FieldGroup>{step.renderFields()}</FieldGroup>
              </div>
            </FieldSet>
          ))}

          <SubmitButton label="Crear Jugador" isExecuting={isExecuting} />
        </form>
      </FormProvider>
    </div>
  );
}
