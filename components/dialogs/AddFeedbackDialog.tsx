"use client";

import { addFeedback } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function AddFeedbackDialog({
  disabled,
}: {
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Додати рефлексію
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Додати рефлексію</DialogTitle>
        </DialogHeader>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <form
          className="space-y-3"
          action={async (fd) => {
            setErr(null);
            try {
              await addFeedback({
                describe_idea_and_process: String(fd.get("describe") || ""),
                emotions: String(fd.get("emotions") || ""),
                necessary_strategies: String(fd.get("strategies") || ""),
              });
              setOpen(false);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              setErr(e?.message ?? "Failed");
            }
          }}
        >
          <textarea
            name="describe"
            placeholder="Короткий опис про процес роботи над вашим об'єктом"
            className="w-full border border-border p-2 min-h-[90px]"
            required
          />
          <textarea
            name="emotions"
            placeholder="Які емоції виникали в процесі роботи з цим матеріалом?"
            className="w-full border border-border p-2 min-h-[90px]"
            required
          />
          <textarea
            name="strategies"
            placeholder="Які стратегії вважаєш необхідними для свідомої роботи із наслідками руйнувань та сприйняття руїн? "
            className="w-full border border-border p-2 min-h-[90px]"
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
