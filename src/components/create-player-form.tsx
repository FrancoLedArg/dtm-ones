"use client";

// Next
import Link from "next/link";
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
import SelectField from "@/components/form/select-field";
import SubmitButton from "@/components/form/submit-button";

// Phosphor
import { XIcon } from "@phosphor-icons/react/dist/ssr";

type FormValues = z.infer<typeof schema>;

interface CategoryShape {
  id: number;
  name: string;
}

interface Props {
  positions: CategoryShape[];
  roles: CategoryShape[];
  contractStatuses: CategoryShape[];
  availabilityStatuses: CategoryShape[];
  developmentStages: CategoryShape[];
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
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: FormValues) => {
    execute(data);
  };

  const {
    positions,
    roles,
    contractStatuses,
    availabilityStatuses,
    developmentStages,
  } = props;

  type FormStepConfig = {
    title: string;
    description: string;
    renderFields: () => React.ReactNode;
  };

  const stepConfigs: FormStepConfig[] = [
    {
      title: "Datos Personales",
      description: "Información basica sobre la identidad del jugador.",
      renderFields: () => (
        <>
          <TextField
            name="fullName"
            label="Nombre Completo"
            placeholder="Juan Pérez"
          />
          <TextField
            name="dateOfBirth"
            label="Fecha de Nacimiento"
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
      title: "Perfil Deportivo",
      description:
        "Informacion clave sobre su rol y características en la cancha.",
      renderFields: () => (
        <>
          <SelectField name="position" label="Posición" options={positions} />
          <SelectField name="role" label="Rol" options={roles} />
          <TextField name="height" label="Altura" />
        </>
      ),
    },
    {
      title: "Situacion Profesional",
      description: "Estado actual del jugador y disponibilidad para competir.",
      renderFields: () => (
        <>
          <SelectField
            name="contractStatus"
            label="Estado de Contrato"
            options={contractStatuses}
          />
          <SelectField
            name="availabilityStatus"
            label="Disponibilidad"
            options={availabilityStatuses}
          />
          <SelectField
            name="developmentStage"
            label="Etapa de Desarrollo"
            options={developmentStages}
          />
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
