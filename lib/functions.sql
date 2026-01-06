-- helper: is this user approved?
create or replace function public.is_approved()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.approved_at is not null
  );
$$;

-- helper: is admin?
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.approved_at is not null
  );
$$;