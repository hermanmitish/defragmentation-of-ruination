// components/defrag/dialogs/AddFractionDialog.tsx
"use client";

import { addFraction } from "@/app/actions";
import { fractionTypes } from "@/app/static-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function AddFractionDialog({
  generalParamsId,
}: {
  generalParamsId: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Додати фракцію</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Додати фракцію</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-3"
          action={async (fd) => {
            await addFraction({
              general_params_id: generalParamsId,
              fraction_type: String(fd.get("fraction_type")),
              codename: String(fd.get("codename")),
              amount_weight: Number(fd.get("amount_weight")),
              reuse_potential: Number(fd.get("reuse_potential")),
            });
            setOpen(false);
          }}
        >
          <select
            name="fraction_type"
            className="w-full border border-border p-2 text-sm"
            defaultValue={fractionTypes[0].value}
          >
            {fractionTypes.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            name="codename"
            placeholder="Кодова назва"
            className="w-full border p-2"
            required
          />
          <input
            name="amount_weight"
            type="number"
            step="0.01"
            placeholder="Вага (г)"
            className="w-full border p-2"
            required
          />
          <input
            name="reuse_potential"
            type="number"
            min="0"
            max="100"
            placeholder="Круговий потенціал (0-100)"
            className="w-full border p-2"
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
