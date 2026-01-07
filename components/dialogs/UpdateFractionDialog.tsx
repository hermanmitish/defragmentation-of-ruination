/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateFraction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useState } from "react";

export default function UpdateFractionDialog({
  fraction,
}: {
  fraction: {
    id: number;
    fraction_type: string;
    codename: string;
    amount_weight: number;
    reuse_potential: number;
    description?: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" type="button" className="ml-2">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редагувати фракцію</DialogTitle>
        </DialogHeader>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <form
          className="space-y-3"
          action={async (fd) => {
            setErr(null);
            try {
              await updateFraction({
                id: fraction.id,
                fraction_type: String(fd.get("fraction_type") || ""),
                codename: String(fd.get("codename") || ""),
                amount_weight: Number(fd.get("amount_weight") || 0),
                reuse_potential: Number(fd.get("reuse_potential") || 0),
                description: String(fd.get("description") || ""),
              });
              setOpen(false);
            } catch (e: any) {
              setErr(e?.message ?? "Failed");
            }
          }}
        >
          <input
            name="fraction_type"
            className="w-full border border-border p-2"
            placeholder="Fraction type"
            defaultValue={fraction.fraction_type}
            required
          />
          <input
            name="codename"
            className="w-full border border-border p-2"
            placeholder="Codename"
            defaultValue={fraction.codename}
            required
          />
          <input
            name="amount_weight"
            type="number"
            step="0.01"
            className="w-full border border-border p-2"
            placeholder="Amount / weight"
            defaultValue={fraction.amount_weight}
            required
          />
          <input
            name="reuse_potential"
            type="number"
            step="0.01"
            min="0"
            max="100"
            className="w-full border border-border p-2"
            placeholder="Reuse potential (0..1)"
            defaultValue={fraction.reuse_potential}
            required
          />
          <textarea
            name="description"
            className="w-full border border-border p-2"
            placeholder="Детальний опис"
            defaultValue={fraction.description}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
