// components/BlockFractions.tsx
import FractionsClient from "@/components/blocks/FractionsClient";
import AddFractionDialog from "@/components/dialogs/AddFractionDialog"; // you already have this earlier
import { SectionWrapper } from "@/components/SectionWrapper";
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

type Fraction = {
  id: number;
  general_params_id: number;
  fraction_type: string;
  codename: string;
  amount_weight: number;
  reuse_potential: number;
  created_at: string;
  description?: string;
  fraction_photos?: {
    id: number;
    storage_path: string;
    created_at: string;
  }[];
};

export default async function BlockFractions({
  user,
  general,
  fractions,
}: {
  user: User | null;
  general: { id: number } | null;
  fractions: Fraction[];
}) {
  const supabase = await createClient();

  const fractionsUpdated = (fractions ?? []).map((p) => ({
    ...p,
    fraction_photos: (p.fraction_photos || []).map((fp) => ({
      ...fp,
      url: supabase.storage
        .from("fraction-photos")
        .getPublicUrl(fp.storage_path).data.publicUrl,
    })),
  }));
  return (
    <SectionWrapper
      id="block-fractions"
      label="БЛОК 1.2"
      question="Фракції та циркулярний потенціал"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="mb-2 text-neutral-700">
            Які фракції складають щебінь?
          </h3>
          <p className="text-sm text-muted-foreground">
            Додавайте фракції та оцінюйте потенціал повторного використання.
          </p>
        </div>

        {!!user && general?.id ? (
          <AddFractionDialog generalParamsId={general.id} />
        ) : null}
      </div>

      {!fractions || fractions.length === 0 ? (
        <div className="border border-border bg-card p-6 text-sm text-muted-foreground">
          Немає фракцій.
        </div>
      ) : (
        <FractionsClient user={user} fractions={fractionsUpdated} />
      )}
    </SectionWrapper>
  );
}
