"use client";

import { addGeneralParams } from "@/app/actions";
import { groups } from "@/app/static-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function AddGeneralParamsDialog() {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Додати інформацію про зразки</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Додати інформацію про зразки</DialogTitle>
        </DialogHeader>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <form
          className="space-y-3"
          action={async (fd) => {
            setErr(null);
            try {
              await addGeneralParams({
                name: String(fd.get("name") || ""),
                codename: String(fd.get("codename") || ""),
                total_original_weight: Number(
                  fd.get("total_original_weight") || 0
                ),
                total_processed_weight: Number(
                  fd.get("total_processed_weight") || 0
                ),
                group: String(fd.get("group") || groups[0].value),
                // total_processed_weight can be added later
              });
              setOpen(false);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              setErr(e?.message ?? "Failed");
            }
          }}
        >
          <input
            name="name"
            placeholder="Назва зразка"
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
            name="total_original_weight"
            type="number"
            step="0.01"
            placeholder="Загальна початкова вага (г)"
            className="w-full border border-border p-2"
            required
          />
          <input
            name="total_processed_weight"
            type="number"
            step="0.01"
            placeholder="Загальна вага після обробки (г)"
            className="w-full border border-border p-2"
            required
          />
          <select
            name="group"
            className="w-full border border-border p-2 text-sm"
            defaultValue={groups[0].value}
          >
            {groups.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
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
