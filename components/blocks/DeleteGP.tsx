"use client";

import { deleteGeneralParams } from "@/app/actions";
import { User } from "@supabase/supabase-js";
import { Delete } from "lucide-react";
import { Button } from "../ui/button";

export default function DeleteGP({
  selectedGpId,
  user,
}: {
  selectedGpId: number | null;
  user: User;
}) {
  return (
    <>
      {!!user && (
        <Button
          variant={"outline"}
          type="button"
          size={"icon"}
          onClick={async () => {
            if (!confirm("Видалити всю інформацію про зразок?")) return;
            if (selectedGpId) await deleteGeneralParams(selectedGpId);
          }}
          disabled={!selectedGpId}
        >
          <Delete />
        </Button>
      )}
    </>
  );
}
