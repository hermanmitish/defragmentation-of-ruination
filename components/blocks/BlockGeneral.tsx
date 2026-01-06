// components/BlockGeneral.tsx
import { groups } from "@/app/static-data";
import { MetaCard } from "@/components/MetaCard";
import { SectionWrapper } from "@/components/SectionWrapper";

import AddGeneralParamsDialog from "@/components/dialogs/AddGeneralParamsDialog";
import AddGeneralPhotoDialog from "@/components/dialogs/AddGeneralPhotoDialog";

import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import UpdateGeneralParamsDialog from "../dialogs/UpdateGeneralParamsDialog";
import DeleteGP from "./DeleteGP";
import GeneralPhotoGrid from "./PhotoGrid";

type GeneralParams = {
  id: number;
  name: string;
  codename: string;
  total_original_weight: number;
  total_processed_weight: number;
  created_at: string;
  group?: string;
};

type GeneralPhoto = {
  id: number;
  general_params_id: number;
  storage_path: string;
  created_at: string;
};

export default async function BlockGeneral({
  user,
  general,
  photos,
  generalList,
  selectedGpId,
}: {
  user: User | null;
  general: GeneralParams | null;
  photos: GeneralPhoto[];
  generalList:
    | {
        id: string;
        name: string;
        codename: string;
        total_original_weight: string;
        created_at: string;
      }[]
    | null;
  selectedGpId: number | null;
}) {
  // For rendering images: easiest is signed URLs server-side (private bucket).
  // If your buckets are public, you can use getPublicUrl instead.
  const supabase = await createClient();

  const photoUrls = (photos ?? []).map((p) => ({
    id: p.id,
    storage_path: p.storage_path,
    url: supabase.storage.from("general-photos").getPublicUrl(p.storage_path)
      .data.publicUrl,
  }));

  return (
    <SectionWrapper
      id="block-general"
      label="БЛОК 1"
      question="Огляд матеріалу та фракції"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h3 className="mb-2 text-neutral-700">Загальні параметри</h3>
          <p className="text-sm text-muted-foreground">
            Основна інформація про зразок/набір даних.
          </p>
        </div>

        {!!user && (
          <div className="flex gap-2">
            <AddGeneralParamsDialog />
            {general?.id ? (
              <>
                <AddGeneralPhotoDialog generalParamsId={general.id} />
                <UpdateGeneralParamsDialog general={general} />
                <DeleteGP user={user} selectedGpId={selectedGpId} />
              </>
            ) : null}
          </div>
        )}
      </div>

      {!general ? (
        <div className="border border-border bg-card p-6">
          <div className="text-sm text-muted-foreground">
            Поки немає жодного запису.
          </div>
          {!!user && (
            <div className="mt-4">
              <AddGeneralParamsDialog />
            </div>
          )}
        </div>
      ) : (
        <>
          <h3 className="mb-6 text-neutral-700">
            З яким матеріалом ми працюємо?
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <MetaCard label="ID зразка" value={general.codename} />
            <MetaCard
              label="Дата аналізу"
              value={new Date(general.created_at).toLocaleDateString("uk-UA")}
            />
            <MetaCard
              label="Група"
              value={
                groups.find((g) => g.value === general.group)?.label ||
                general.group ||
                ""
              }
            />
            <MetaCard
              label="Вага до промивання"
              value={general.total_original_weight}
              unit="г"
            />
            <MetaCard
              label="Вага після промивання"
              value={general.total_processed_weight || "Дані відсутні"}
              unit={general.total_processed_weight ? "г" : ""}
            />
            <MetaCard
              label="Дельта"
              value={
                general.total_processed_weight
                  ? `-${
                      general.total_original_weight -
                      (general.total_processed_weight || 0)
                    }`
                  : "Дані відсутні"
              }
              unit={
                general.total_processed_weight
                  ? `г (${(
                      ((general.total_original_weight -
                        (general.total_processed_weight || 0)) /
                        general.total_original_weight) *
                      100
                    ).toFixed(1)}%)`
                  : ""
              }
              highlight={!!general.total_processed_weight}
            />
          </div>

          {/* Photos */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="text-xs text-foreground uppercase tracking-wide font-mono">
                  Фотографії
                </div>

                {!!user && general?.id ? (
                  <AddGeneralPhotoDialog generalParamsId={general.id} />
                ) : null}
              </div>

              {photoUrls.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">
                  Немає фотографій.
                </div>
              ) : (
                <GeneralPhotoGrid photos={photoUrls} canEdit={!!user} />
              )}
            </div>
            <div className="flex flex-col justify-center gap-5 p-6 border border-border bg-card">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-mono">
                  Загальна вага після обробки
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl text-foreground font-mono">
                    {general.total_processed_weight || "Дані відсутні"}
                  </span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {general.total_processed_weight ? "г" : ""}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-mono">
                  Втрата ваги при промиванні
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl text-foreground font-mono">
                    {general.total_processed_weight
                      ? `-${
                          general.total_original_weight -
                          (general.total_processed_weight || 0)
                        }`
                      : "Дані відсутні"}
                  </span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {general.total_processed_weight
                      ? `г (${(
                          ((general.total_original_weight -
                            (general.total_processed_weight || 0)) /
                            general.total_original_weight) *
                          100
                        ).toFixed(1)}%)`
                      : ""}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed">
                Промивання видалило пил, глину та дрібні частки, залишивши
                тільки структурний матеріал
              </div>
            </div>
          </div>
        </>
      )}
    </SectionWrapper>
  );
}
