// components/defrag/CompleteProfileForm.tsx
"use client";

import { completeProfile } from "@/app/actions";
import { groups } from "@/app/static-data";
import { Button } from "@/components/ui/button";

export default function CompleteProfileForm() {
  return (
    <form action={completeProfile} className="space-y-4">
      <select
        name="group"
        required
        className="w-full border border-border bg-background p-2 text-xs"
      >
        <option value="" className="text-xs">
          Виберіть групу
        </option>
        {groups?.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>

      <Button type="submit" className="w-full">
        Далі
      </Button>
    </form>
  );
}
