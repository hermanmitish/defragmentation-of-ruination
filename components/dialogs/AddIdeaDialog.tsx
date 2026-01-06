"use client";

import { addIdea } from "@/app/actions";
import { artisticForms } from "@/app/static-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function AddIdeaDialog() {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Додати ідею обʼєкту</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Додати ідею обʼєкту</DialogTitle>
        </DialogHeader>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <form
          className="space-y-3"
          action={async (fd) => {
            setErr(null);
            try {
              await addIdea({
                form: String(fd.get("form") || ""),
                idea: String(fd.get("idea") || ""),
              });
              setOpen(false);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              setErr(e?.message ?? "Failed");
            }
          }}
        >
          <select
            name="form"
            className="w-full border border-border p-2 text-sm"
            defaultValue={artisticForms[0].value}
          >
            {artisticForms.map((c) => (
              <option key={c.value} value={c.value}>
                {c.value}
              </option>
            ))}
          </select>
          <textarea
            name="idea"
            placeholder="Опис художньої ідеї обʼєкту"
            className="w-full border border-border p-2 min-h-[120px]"
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
            <Button type="submit">Зберегти</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
