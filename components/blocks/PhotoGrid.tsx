"use client";

import { deleteGeneralPhoto } from "@/app/actions";
import { X } from "lucide-react";
import { useState } from "react";

type PhotoItem = {
  id: number;
  url: string;
  storage_path: string;
};

export default function GeneralPhotoGrid({
  photos,
  canEdit,
}: {
  photos: PhotoItem[];
  canEdit: boolean;
}) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-2">
      {photos.map((p) => (
        <div
          key={p.id}
          className="relative group w-full aspect-square border border-border overflow-hidden"
        >
          <img
            src={p.url}
            alt="general photo"
            className="w-full h-full object-cover"
          />

          {canEdit && (
            <button
              type="button"
              disabled={deletingId === p.id}
              onClick={async () => {
                if (!confirm("Delete this photo?")) return;
                try {
                  setDeletingId(p.id);
                  await deleteGeneralPhoto({
                    photo_id: p.id,
                    storage_path: p.storage_path,
                  });
                } finally {
                  setDeletingId(null);
                }
              }}
              className="
                absolute top-1 right-1
                w-6 h-6 flex items-center justify-center
                rounded-full
                bg-black/60 text-white
                opacity-0 group-hover:opacity-100
                transition
                hover:bg-red-600
                disabled:opacity-60
              "
              aria-label="Delete image"
              title="Delete"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
