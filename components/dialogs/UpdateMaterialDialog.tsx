/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateMaterial } from "@/app/actions";
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

export default function UpdateMaterialDialog({
  material,
}: {
  material: {
    id: number;
    material_name: string;
    codename: string;
    weight: number;
    color: string;
    can_be_reused: boolean;
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
          <DialogTitle>Редагувати матеріал</DialogTitle>
        </DialogHeader>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <form
          className="space-y-3"
          action={async (fd) => {
            setErr(null);
            try {
              await updateMaterial({
                id: material.id,
                material_name: String(fd.get("material_name") || ""),
                codename: String(fd.get("codename") || ""),
                weight: Number(fd.get("weight") || 0),
                color: String(fd.get("color") || ""),
                can_be_reused: fd.get("can_be_reused") === "on",
                description: String(fd.get("description") || ""),
              });
              setOpen(false);
            } catch (e: any) {
              setErr(e?.message ?? "Failed");
            }
          }}
        >
          <input
            name="material_name"
            className="w-full border border-border p-2"
            placeholder="Material name"
            defaultValue={material.material_name}
            required
          />
          <input
            name="codename"
            className="w-full border border-border p-2"
            placeholder="Codename"
            defaultValue={material.codename}
            required
          />
          <input
            name="weight"
            type="number"
            step="0.01"
            className="w-full border border-border p-2"
            placeholder="Weight"
            defaultValue={material.weight}
            required
          />
          <input
            name="color"
            className="w-full border border-border p-2"
            placeholder="Color"
            defaultValue={material.color}
            required
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="can_be_reused"
              defaultChecked={material.can_be_reused}
            />
            Can be reused
          </label>
          <textarea
            name="description"
            className="w-full border border-border p-2"
            placeholder="Детальний опис"
            defaultValue={material.description}
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
