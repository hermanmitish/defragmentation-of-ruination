"use client";

import { addFractionPhoto } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function AddFractionPhotoDialog({
  fractionId,
}: {
  fractionId: number;
}) {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Додати фото</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Додати фото</DialogTitle>
        </DialogHeader>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <form
          className="space-y-3"
          action={async (fd) => {
            setErr(null);
            try {
              const file = fd.get("file") as File | null;
              if (!file || file.size === 0) throw new Error("Pick a file");

              const supabase = createClient();
              const ext = file.name.split(".").pop() || "jpg";
              const path = `${fractionId}/${crypto.randomUUID()}.${ext}`;

              const up = await supabase.storage
                .from("fraction-photos")
                .upload(path, file, { upsert: false });
              if (up.error) throw new Error(up.error.message);

              await addFractionPhoto({
                fraction_id: fractionId,
                storage_path: path,
              });
              setOpen(false);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              setErr(e?.message ?? "Failed");
            }
          }}
        >
          <input
            name="file"
            type="file"
            accept="image/*"
            className="w-full"
            required
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Відмінити
            </Button>
            <Button type="submit">Завантажити</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
