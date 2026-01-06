// app/defragmentation/page.tsx
import BlockFractions from "@/components/blocks/BlockFractions";
import BlockGeneral from "@/components/blocks/BlockGeneral";
import { BlockHero } from "@/components/blocks/BlockHero";
import BlockMaterials from "@/components/blocks/BlockMaterials";
import BlockVoting from "@/components/blocks/BlockVoting";
import HeaderBar from "@/components/blocks/HeaderBar";
import CompleteProfileForm from "@/components/CompleteProfileForm";
import { ScrollProgress } from "@/components/ScrollProgress";
import { createClient } from "@/lib/supabase/server";

export default async function DefragPage({
  searchParams,
}: {
  searchParams: { gp?: string; group?: string };
}) {
  const { gp, group: selectedGroup } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user
    ? (
        await supabase
          .from("profiles")
          .select("id,name,role,group,approved_at")
          .eq("id", user.id)
          .single()
      ).data
    : null;

  const needsProfileCompletion = user && (!profile || !profile.group);
  if (needsProfileCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md border border-border bg-card p-6">
          <h1 className="text-lg mb-2">
            {user.user_metadata?.name}, майже готово!
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Будь ласка, завершіть свій профіль, вибравши свою групу.
          </p>

          <CompleteProfileForm />
        </div>
      </div>
    );
  }

  // pick selected general_params
  const { data: generalList } = await supabase
    .from("general_params")
    .select("id,name,codename,total_original_weight,created_at,group")
    .order("created_at", { ascending: false });

  const initialGpId = gp ? Number(gp) : generalList?.[0]?.id || null;
  const matchingGp = generalList?.find(
    (g) =>
      String(g.id) === String(initialGpId) &&
      (selectedGroup
        ? g.group === selectedGroup || selectedGroup === "all"
        : true)
  );

  const selectedGpId = matchingGp?.id ?? null;

  const general = selectedGpId
    ? (
        await supabase
          .from("general_params")
          .select("*")
          .eq("id", selectedGpId)
          .single()
      ).data
    : null;

  const generalPhotos = selectedGpId
    ? (
        await supabase
          .from("general_photos")
          .select("*")
          .eq("general_params_id", selectedGpId)
          .order("created_at", { ascending: false })
      ).data
    : [];

  const { data: fractions } = await supabase
    .from("fractions")
    .select("*, fraction_photos(id, storage_path, created_at)")
    .eq("general_params_id", selectedGpId)
    .order("created_at", { ascending: false });

  const materials = selectedGpId
    ? (
        await supabase
          .from("materials")
          .select("*, material_photos(id, storage_path, created_at)")
          .eq("general_params_id", selectedGpId)
          .order("created_at", { ascending: false })
      ).data
    : [];

  // voting stuff is per participant (current user)
  const votes = user
    ? (await supabase.from("votes").select("*").eq("participant_id", user.id))
        .data
    : [];
  const ideas = user
    ? (await supabase.from("ideas").select("*").eq("participant_id", user.id))
        .data
    : [];
  const feedback = user
    ? (
        await supabase
          .from("feedback")
          .select("*")
          .eq("participant_id", user.id)
          .maybeSingle()
      ).data
    : null;

  const votesAll = user
    ? (await supabase.from("votes").select("*, profiles(id, group)")).data
    : [];
  const ideasOther = user
    ? (await supabase.from("ideas").select("*").neq("participant_id", user.id))
        .data
    : [];
  const feedbackOther = user
    ? (
        await supabase
          .from("feedback")
          .select("*")
          .neq("participant_id", user.id)
      ).data
    : [];

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar
        user={user}
        profile={profile}
        generalList={generalList ?? []}
        selectedGpId={selectedGpId}
        selectedGroup={selectedGroup || "all"}
      />

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-16">
        <ScrollProgress />
        <BlockHero />
        <BlockGeneral
          user={user}
          general={general}
          photos={generalPhotos ?? []}
          generalList={generalList ?? []}
          selectedGpId={selectedGpId}
        />

        <BlockFractions
          user={user}
          general={general}
          fractions={fractions ?? []}
        />

        <BlockMaterials
          user={user}
          general={general}
          materials={materials ?? []}
        />

        <BlockVoting
          user={user}
          votes={votes ?? []}
          ideas={ideas ?? []}
          feedback={feedback}
          votesAll={votesAll ?? []}
          ideasOther={ideasOther ?? []}
          feedbackOther={feedbackOther ?? []}
          profile={profile}
        />
      </main>
    </div>
  );
}
