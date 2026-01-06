-- 0) enums
create type user_role as enum ('admin', 'participant');

-- 1) user profile table (your app-owned user data)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'participant',
  "group" text not null default 'Group 1',
  approved_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- auto-create profile row on signup (name can be filled later)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();


-- 2) "general params" (you can attach this to org/group later if needed)
create table public.general_params (
  id bigserial primary key,
  name text not null,
  codename text not null,
  total_original_weight numeric not null check (total_original_weight >= 0),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

-- photos for general params (store paths, not blobs)
create table public.general_photos (
  id bigserial primary key,
  general_params_id bigint not null references public.general_params(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);


-- 3) fractions
create table public.fractions (
  id bigserial primary key,
  fraction_type text not null,
  codename text not null,
  amount_weight numeric not null check (amount_weight >= 0),
  reuse_potential integer not null check (reuse_potential between 0 and 100),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.fraction_photos (
  id bigserial primary key,
  fraction_id bigint not null references public.fractions(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

-- 4) materials
create table public.materials (
  id bigserial primary key,
  material_name text not null,
  codename text not null,
  weight numeric not null check (weight >= 0),
  color text not null,
  can_be_reused boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.material_photos (
  id bigserial primary key,
  material_id bigint not null references public.materials(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

-- 5) questionnaire / voting
create table public.votes (
  id bigserial primary key,
  participant_id uuid not null references public.profiles(id),
  chosen_form text not null, -- if it's fixed options, make an enum
  created_at timestamptz not null default now(),
  unique (participant_id) -- one vote per participant (remove if you want multi)
);

create table public.ideas (
  id bigserial primary key,
  participant_id uuid not null references public.profiles(id),
  form text not null,
  idea text not null,
  created_at timestamptz not null default now()
);

-- 6) feedback
create table public.feedback (
  id bigserial primary key,
  participant_id uuid not null references public.profiles(id),
  describe_idea_and_process text not null,
  emotions text not null,
  necessary_strategies text not null,
  created_at timestamptz not null default now(),
  unique (participant_id) -- one feedback per participant (optional)
);