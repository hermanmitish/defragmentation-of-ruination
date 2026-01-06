alter table public.profiles enable row level security;

create policy "admins can do anything"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "owners can update their profiles"
on public.profiles for update
to authenticated
using (public.is_approved() and id = auth.uid())
with check (public.is_approved() and id = auth.uid());

-- similar policies can be created for other tables as needed

alter table public.materials enable row level security;

create policy "admins can do anything"
on public.materials for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "approved can do anything"
on public.materials for all
to authenticated
using (public.is_approved())
with check (public.is_approved());

-- similar policies can be created for other tables as needed

alter table public.material_photos enable row level security;

create policy "admins can do anything"
on public.material_photos for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "approved can do anything"
on public.material_photos for all
to authenticated
using (public.is_approved())
with check (public.is_approved());

-- similar policies can be created for other tables as needed

alter table public.general_params enable row level security;
create policy "admins can do anything"
on public.general_params for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "approved can do anything"
on public.general_params for all
to authenticated
using (public.is_approved())
with check (public.is_approved());

-- similar policies can be created for other tables as needed

alter table public.general_photos enable row level security;
create policy "admins can do anything"
on public.general_photos for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "approved can do anything"
on public.general_photos for all
to authenticated
using (public.is_approved())
with check (public.is_approved());

-- similar policies can be created for other tables as needed

alter table public.fractions enable row level security;
create policy "admins can do anything"
on public.fractions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "approved can do anything"
on public.fractions for all
to authenticated
using (public.is_approved())
with check (public.is_approved());

-- similar policies can be created for other tables as needed

alter table public.fraction_photos enable row level security;
create policy "admins can do anything"
on public.fraction_photos for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "approved can do anything"
on public.fraction_photos for all
to authenticated
using (public.is_approved())
with check (public.is_approved());

-- similar policies can be created for other tables as needed

alter table public.votes enable row level security;
create policy "admins can do anything"
on public.votes for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "approved can do anything"
on public.votes for all
to authenticated
using (public.is_approved())
with check (public.is_approved());

-- similar policies can be created for other tables as needed

alter table public.ideas enable row level security;
create policy "admins can do anything"
on public.ideas for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "approved can do anything"
on public.ideas for all
to authenticated
using (public.is_approved())
with check (public.is_approved());

-- similar policies can be created for other tables as needed

alter table public.feedback enable row level security;
create policy "admins can do anything"
on public.feedback for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "approved can do anything"
on public.feedback for all
to authenticated
using (public.is_approved())
with check (public.is_approved());
