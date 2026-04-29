// Shadcn
import { Button } from "@/components/ui/button";

// Phosphor
import { TrashIcon } from "@phosphor-icons/react";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { deleteUploadThingFile } from "@/actions/uploadthing";

// Shadcn
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function DeleteImageButton({ imageUrl }: { imageUrl: string }) {
  const { execute, isExecuting } = useAction(deleteUploadThingFile, {
    onSuccess: () => {
      toast.success("Imagen eliminada correctamente");
    },
    onError: () => {
      toast.error("Error al eliminar la imagen");
    },
  });

  return (
    <Button variant="outline" size="icon" onClick={() => execute({ imageUrl })}>
      {isExecuting ? <Spinner /> : <TrashIcon className="size-4" />}
    </Button>
  );
}
