"use client";

// React
import { useState } from "react";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { createPlayerMedia } from "@/actions/player-media";

// Types
import type {
  PlayerMediaData,
  CreatePlayerMediaData,
} from "@/lib/validation/player-media";

// Shadcn
import {
  Card,
  CardContent,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { toast } from "sonner";

// Components
import UploadFileButton from "@/components/supabase/upload-file-button";

export default function PlayerMediaManager({
  playerId,
  files,
}: {
  playerId: string;
  files: PlayerMediaData[];
}) {
  const [file, setFile] = useState<File | null>(null);
  const { execute, isExecuting } = useAction(createPlayerMedia, {
    onSuccess: () => {
      console.log("Media created successfully");
    },
    onError: ({ error }) => {
      console.log(error);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Image Gallery</CardTitle>
        <CardDescription>Manage the media for the player</CardDescription>
      </CardHeader>
      <CardContent>
        <CardAction className="w-full flex flex-row gap-2">
          <Input
            className="w-full"
            type="file"
            accept="image/*"
            autoComplete="off"
            onChange={(event) => {
              const picked = event.target.files?.[0] ?? null;

              if (!picked) {
                setFile(null);
                return;
              }

              if (!picked.type.startsWith("image/")) {
                toast.error("Only image files are allowed");
                setFile(null);
                event.target.value = "";
                return;
              }

              setFile(picked);
            }}
          />
          <UploadFileButton
            file={file}
            namespace={"players"}
            onSuccess={({ id, path, fullPath }) => {
              const payload: CreatePlayerMediaData = {
                id: id,
                playerId: playerId,
                mediaType: "image",
                mimeType: file?.type ?? "",
                storagePath: path,
              };

              execute(payload);
            }}
          />
        </CardAction>
      </CardContent>

      <CardContent>
        {files.length === 0 ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyTitle>No files uploaded</EmptyTitle>
              <EmptyDescription>
                Select a file and click upload to start.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-2">
            {files.map((item) => (
              <p
                key={item.id}
                className="text-sm text-muted-foreground truncate"
              >
                {item.storagePath}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
