"use client";

import { addMaterial } from "@/app/actions";
import { colorOptions } from "@/app/static-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function AddMaterialDialog({
  generalParamsId,
}: {
  generalParamsId: number;
}) {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Додайте матеріал</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Додайте матеріал</DialogTitle>
        </DialogHeader>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <form
          className="space-y-3"
          action={async (fd) => {
            setErr(null);
            try {
              await addMaterial({
                general_params_id: generalParamsId,
                material_name: String(fd.get("material_name") || ""),
                codename: String(fd.get("codename") || ""),
                weight: Number(fd.get("weight") || 0),
                color: String(fd.get("color") || colorOptions[0].value),
                can_be_reused: fd.get("can_be_reused") === "on",
              });
              setOpen(false);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              setErr(e?.message ?? "Failed");
            }
          }}
        >
          <input
            name="material_name"
            placeholder="Назва матеріалу"
            className="w-full border border-border p-2"
            required
          />
          <input
            name="codename"
            placeholder="Код"
            className="w-full border border-border p-2"
            required
          />
          <input
            name="weight"
            type="number"
            step="0.01"
            placeholder="Вага (г)"
            className="w-full border border-border p-2"
            required
          />

          <select
            name="color"
            className="w-full border border-border p-2"
            defaultValue={colorOptions[0].value}
          >
            {colorOptions.map((c) => (
              <option key={c.value} value={c.value}>
                Колір: {c.value}
              </option>
            ))}
          </select>
          <div className="px-2 py-2.5 border">
            <label className="flex items-center gap-2 text-sm">
              <input name="can_be_reused" type="checkbox" className="h-4 w-4" />
              Підлягає перевикористанню?
            </label>
          </div>

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
