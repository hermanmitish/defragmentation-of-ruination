"use server";

import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function mustUser(user: User | null) {
  if (!user) throw new Error("Not authenticated");
  return user;
}

// -------- general_params --------
export async function addGeneralParams(input: {
  name: string;
  codename: string;
  total_original_weight: number;
  group?: string;
  total_processed_weight?: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  mustUser(user);

  const { error } = await supabase.from("general_params").insert({
    name: input.name,
    codename: input.codename,
    total_original_weight: input.total_original_weight,
    created_by: user?.id,
    group: input.group,
    total_processed_weight: input.total_processed_weight,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function addGeneralPhoto(input: {
  general_params_id: number;
  storage_path: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  mustUser(user);

  const { error } = await supabase.from("general_photos").insert({
    general_params_id: input.general_params_id,
    storage_path: input.storage_path,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

// -------- materials --------
export async function addMaterial(input: {
  general_params_id: number;
  material_name: string;
  codename: string;
  weight: number;
  color: string; // your enum
  can_be_reused: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  mustUser(user);

  const { error } = await supabase.from("materials").insert({
    general_params_id: input.general_params_id,
    material_name: input.material_name,
    codename: input.codename,
    weight: input.weight,
    color: input.color,
    can_be_reused: input.can_be_reused,
    created_by: user?.id,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function addMaterialPhoto(input: {
  material_id: number;
  storage_path: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  mustUser(user);

  const { error } = await supabase.from("material_photos").insert({
    material_id: input.material_id,
    storage_path: input.storage_path,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

// -------- fraction_photos --------
export async function addFraction(form: {
  general_params_id: number;
  fraction_type: string;
  codename: string;
  amount_weight: number;
  reuse_potential: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("fractions").insert({
    ...form,
    created_by: user.id,
  });

  revalidatePath("/");
}

export async function addFractionPhoto(input: {
  fraction_id: number;
  storage_path: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  mustUser(user);

  const { error } = await supabase.from("fraction_photos").insert({
    fraction_id: input.fraction_id,
    storage_path: input.storage_path,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

// -------- vote / idea / feedback --------
export async function addVote(input: { chosen_form: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  mustUser(user);

  const { error } = await supabase.from("votes").insert({
    participant_id: user?.id,
    chosen_form: input.chosen_form,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function addIdea(input: { form: string; idea: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  mustUser(user);

  const { error } = await supabase.from("ideas").insert({
    participant_id: user?.id,
    form: input.form,
    idea: input.idea,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function addFeedback(input: {
  describe_idea_and_process: string;
  emotions: string;
  necessary_strategies: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  mustUser(user);

  const { error } = await supabase.from("feedback").insert({
    participant_id: user?.id,
    describe_idea_and_process: input.describe_idea_and_process,
    emotions: input.emotions,
    necessary_strategies: input.necessary_strategies,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function completeProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const group = String(formData.get("group"));
  if (!group) throw new Error("Group is required");

  const res = await supabase.from("profiles").upsert(
    {
      id: user.id,
      group,
      name: user.user_metadata.full_name,
    },
    {
      onConflict: "id",
    }
  );
  console.log("completeProfile res", res);

  revalidatePath("/");
}

export async function deleteGeneralPhoto(input: {
  photo_id: number;
  storage_path: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // 1) delete from storage
  const { error: storageError } = await supabase.storage
    .from("general-photos")
    .remove([input.storage_path]);

  if (storageError) throw new Error(storageError.message);

  // 2) delete DB record
  const { error: dbError } = await supabase
    .from("general_photos")
    .delete()
    .eq("id", input.photo_id);

  if (dbError) throw new Error(dbError.message);

  revalidatePath("/");
}

export async function deleteFractionPhoto(input: {
  fraction_photo_id: number;
  storage_path: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // delete from storage
  const { error: storageError } = await supabase.storage
    .from("fraction-photos")
    .remove([input.storage_path]);
  if (storageError) throw new Error(storageError.message);

  // delete DB row
  const { error: dbError } = await supabase
    .from("fraction_photos")
    .delete()
    .eq("id", input.fraction_photo_id);
  if (dbError) throw new Error(dbError.message);

  revalidatePath("/");
}

export async function deleteMaterialPhoto(input: {
  material_photo_id: string;
  storage_path: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // delete from storage
  const { error: storageError } = await supabase.storage
    .from("material-photos")
    .remove([input.storage_path]);
  if (storageError) throw new Error(storageError.message);

  // delete DB row
  const { error: dbError } = await supabase
    .from("material_photos")
    .delete()
    .eq("id", input.material_photo_id);
  if (dbError) throw new Error(dbError.message);

  revalidatePath("/");
}

export async function deleteVote(voteId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("votes").delete().eq("id", voteId);

  revalidatePath("/");
}

export async function deleteIdea(ideaId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("ideas").delete().eq("id", ideaId);

  revalidatePath("/");
}

export async function deleteFeedback(feedbackId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("feedback").delete().eq("id", feedbackId);

  revalidatePath("/");
}

export async function deleteMaterial(materialId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("materials").delete().eq("id", materialId);

  revalidatePath("/");
}

export async function deleteFraction(fractionId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("fractions").delete().eq("id", fractionId);

  revalidatePath("/");
}

export async function deleteGeneralParams(gpId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("general_params").delete().eq("id", gpId);

  revalidatePath("/");
}

export async function updateGeneralParams(input: {
  id: number;
  name: string;
  codename: string;
  total_original_weight: number;
  group?: string;
  total_processed_weight?: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("general_params")
    .update({
      name: input.name,
      codename: input.codename,
      total_original_weight: input.total_original_weight,
      group: input.group,
      total_processed_weight: input.total_processed_weight,
    })
    .eq("id", input.id);

  if (error) throw new Error(error.message);
  revalidatePath("/");
}
