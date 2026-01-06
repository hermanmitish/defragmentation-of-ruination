/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateGeneralParams } from "@/app/actions";
import { groups } from "@/app/static-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { useState } from "react";

export default function UpdateGeneralParamsDialog({
  general,
}: {
  general: {
    id: number;
    name: string;
    codename: string;
    total_original_weight: number;
    group?: string | null;
    total_processed_weight?: number | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Edit />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Змінити загальну інформацію про зразки</DialogTitle>
        </DialogHeader>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <form
          className="space-y-3"
          action={async (fd) => {
            setErr(null);
            try {
              await updateGeneralParams({
                id: general.id,
                name: String(fd.get("name") || ""),
                codename: String(fd.get("codename") || ""),
                total_original_weight: Number(
                  fd.get("total_original_weight") || 0
                ),
                group: String(fd.get("group") || "") || undefined,
                total_processed_weight: Number(
                  fd.get("total_processed_weight") || 0
                ),
              });
              setOpen(false);
            } catch (e: any) {
              setErr(e?.message ?? "Failed");
            }
          }}
        >
          <input
            name="name"
            placeholder="Назва"
            className="w-full border border-border p-2"
            required
            defaultValue={general.name}
          />
          <input
            name="codename"
            placeholder="Код"
            className="w-full border border-border p-2"
            required
            defaultValue={general.codename}
          />
          <input
            name="total_original_weight"
            type="number"
            step="0.01"
            placeholder="Загальна початкова вага (г)"
            className="w-full border border-border p-2"
            required
            defaultValue={general.total_original_weight}
          />
          <input
            name="total_processed_weight"
            type="number"
            step="0.01"
            placeholder="Загальна вага після обробки (г)"
            className="w-full border border-border p-2"
            required
            defaultValue={general.total_processed_weight || 0}
          />
          <select
            name="group"
            className="w-full border border-border p-2 text-sm"
            defaultValue={general.group || groups[0].value}
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
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
