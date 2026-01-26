"use client";

// Next
import { useRouter } from "next/navigation";

// React Hook Form
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { createCategory } from "@/actions/categories";

// Validation Schema
import { createCategorySchema as schema } from "@/lib/validation/categories";

// Shadcn
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { toast } from "sonner";

// Zod
import { z } from "zod";

// Components
import TextField from "@/components/form/text-field";
import SingleImageField from "@/components/form/single-image-field";
import SubmitButton from "@/components/form/submit-button";

type FormValues = z.infer<typeof schema>;

export default function Page() {
  const router = useRouter();

  const { execute, isExecuting } = useAction(createCategory, {
    onSuccess: () => {
      toast.success("Categoría creada correctamente");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error("Error al crear la categoría.", {
        description: error.serverError,
      });
    },
  });

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      name: "",
      bannerUrl: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: FormValues) => {
    execute(data);
  };

  return (
    <main>
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Crear Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <FieldSet>
                  <TextField name="name" label="Nombre de la categoría" />
                  <SingleImageField
                    label="bannerUrl"
                    imageUrl="https://cxrm1jrl4b.ufs.sh/f/0ZoXJZw3chk9IucuU4nblKSLfvwsQpB6AUjG1EIPXhzCuJVr"
                  />
                  <SubmitButton
                    label="Crear Categoría"
                    isExecuting={isExecuting}
                  />
                </FieldSet>
              </FieldGroup>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </main>
  );
}
