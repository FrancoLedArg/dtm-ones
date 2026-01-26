"use client";

// Hooks
import { useState, useCallback } from "react";

// Uploadthing
import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { useUploadThing } from "@/utils/uploadthing";

// Shadcn
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function MultipleImageField() {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, routeConfig, isUploading } = useUploadThing(
    "singleImageUploader",
    {
      onClientUploadComplete: () => {
        toast.success("Imagen subida correctamente.");
      },
      onUploadError: () => {
        toast.error("Error al subir la imagen.");
      },
      onUploadBegin: () => {
        toast.info(`Subiendo imagen...`);
      },
    },
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  return (
    <Field>
      <FieldLabel>Imagen de la categoría</FieldLabel>
      <FieldContent {...getRootProps()}>
        <input {...getInputProps()} />
        <div>
          {files.length > 0 && (
            <button onClick={() => startUpload(files)}>
              Upload {files.length} files
            </button>
          )}
        </div>
        Drop files here!
      </FieldContent>
      <FieldError>{/*{error && <p>{error.message}</p>}*/}</FieldError>
    </Field>
  );
}
