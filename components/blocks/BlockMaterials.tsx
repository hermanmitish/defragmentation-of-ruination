// components/BlockMaterials.tsx
import { SectionWrapper } from "@/components/SectionWrapper";
import MaterialsClient from "@/components/blocks/MaterialsClient";
import AddMaterialDialog from "@/components/dialogs/AddMaterialDialog";
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

type MaterialPhoto = { id: string; storage_path: string; url: string };
type Material = {
  id: number;
  general_params_id: number;
  material_name: string;
  codename: string;
  weight: number;
  color: string;
  can_be_reused: boolean;
  material_photos?: MaterialPhoto[];
};

export default async function BlockMaterials({
  user,
  general,
  materials,
}: {
  user: User | null;
  general: { id: number } | null;
  materials: Material[];
}) {
  const supabase = await createClient();

  const materialsUpdated = (materials ?? []).map((p) => ({
    ...p,
    material_photos: (p.material_photos || []).map((fp) => ({
      ...fp,
      url: supabase.storage
        .from("material-photos")
        .getPublicUrl(fp.storage_path).data.publicUrl,
    })),
  }));
  return (
    <SectionWrapper
      id="block-materials"
      label="БЛОК 2"
      question="Склад матеріалів"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="mb-2 text-neutral-700">Матеріали</h3>
          <p className="text-sm text-muted-foreground">
            Додавайте матеріали та фотографії, аналізуйте склад.
          </p>
        </div>

        {!!user && general?.id ? (
          <AddMaterialDialog generalParamsId={general.id} />
        ) : null}
      </div>

      {!materials || materials.length === 0 ? (
        <div className="border border-border bg-card p-6 text-sm text-muted-foreground">
          Немає матеріалів.
        </div>
      ) : (
        <MaterialsClient user={user} materials={materialsUpdated} />
      )}
    </SectionWrapper>
  );
}
