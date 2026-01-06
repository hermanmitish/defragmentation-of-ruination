"use client";

import { addVote } from "@/app/actions";
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

export default function AddVoteDialog({ disabled }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Вибрати художню форму
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вибрати художню форму</DialogTitle>
        </DialogHeader>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <form
          className="space-y-3"
          action={async (fd) => {
            setErr(null);
            try {
              await addVote({
                chosen_form: String(fd.get("chosen_form") || ""),
              });
              setOpen(false);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              setErr(e?.message ?? "Failed");
            }
          }}
        >
          <select
            name="chosen_form"
            className="w-full border border-border p-2 text-sm"
            defaultValue={artisticForms[0].value}
          >
            {artisticForms.map((c) => (
              <option key={c.value} value={c.value}>
                {c.value}
              </option>
            ))}
          </select>

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
