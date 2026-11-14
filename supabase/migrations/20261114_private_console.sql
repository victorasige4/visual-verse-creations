-- Visual Verse Creations: standalone, invitation-only Studio Console.
-- Apply once in a private Supabase project using the SQL editor.
-- No secrets or production client records belong in the website repository.
-- Configure Supabase Auth to DISABLE public signups before inviting team members.

create extension if not exists pgcrypto;

create table if not exists public.console_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'member' check (role in ('owner','admin','member')),
  is_active boolean not null default true,
  added_at timestamptz not null default now()
);
alter table public.console_members enable row level security;
revoke all on public.console_members from anon;
grant select on public.console_members to authenticated;
drop policy if exists console_members_self_read on public.console_members;
create policy console_members_self_read on public.console_members
  for select to authenticated using (user_id = (select auth.uid()));

-- SECURITY DEFINER functions access the membership table without recursive RLS policies.
-- They only return the authenticated caller's role/membership.
create or replace function public.console_is_member()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.console_members
    where user_id = (select auth.uid()) and is_active = true
  );
$$;
create or replace function public.console_can_edit()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.console_members
    where user_id = (select auth.uid()) and is_active = true and role in ('owner','admin')
  );
$$;
revoke all on function public.console_is_member() from public, anon;
revoke all on function public.console_can_edit() from public, anon;
grant execute on function public.console_is_member() to authenticated;
grant execute on function public.console_can_edit() to authenticated;

create table if not exists public.console_clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  contact_email text,
  created_at timestamptz not null default now()
);
alter table public.console_clients enable row level security;
revoke all on public.console_clients from anon;
grant select, insert, update, delete on public.console_clients to authenticated;

drop policy if exists console_clients_read on public.console_clients;
drop policy if exists console_clients_insert on public.console_clients;
drop policy if exists console_clients_update on public.console_clients;
drop policy if exists console_clients_delete on public.console_clients;
create policy console_clients_read on public.console_clients for select to authenticated
  using ((select public.console_is_member()));
create policy console_clients_insert on public.console_clients for insert to authenticated
  with check ((select public.console_can_edit()));
create policy console_clients_update on public.console_clients for update to authenticated
  using ((select public.console_can_edit())) with check ((select public.console_can_edit()));
create policy console_clients_delete on public.console_clients for delete to authenticated
  using ((select public.console_can_edit()));

create table if not exists public.console_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  client_id uuid references public.console_clients(id) on delete set null,
  status text not null default 'Planned' check (status in ('Planned','In progress','On hold','Completed')),
  created_at timestamptz not null default now()
);
create index if not exists console_projects_client_id_idx on public.console_projects(client_id);
alter table public.console_projects enable row level security;
revoke all on public.console_projects from anon;
grant select, insert, update, delete on public.console_projects to authenticated;

drop policy if exists console_projects_read on public.console_projects;
drop policy if exists console_projects_insert on public.console_projects;
drop policy if exists console_projects_update on public.console_projects;
drop policy if exists console_projects_delete on public.console_projects;
create policy console_projects_read on public.console_projects for select to authenticated
  using ((select public.console_is_member()));
create policy console_projects_insert on public.console_projects for insert to authenticated
  with check ((select public.console_can_edit()));
create policy console_projects_update on public.console_projects for update to authenticated
  using ((select public.console_can_edit())) with check ((select public.console_can_edit()));
create policy console_projects_delete on public.console_projects for delete to authenticated
  using ((select public.console_can_edit()));

-- First user: invite in Authentication > Users > Send invitation, then assign membership.
-- NEVER put an actual team email or service secret in this migration.
-- Example manual statement for the Supabase SQL editor (replace placeholder):
-- insert into public.console_members (user_id,display_name,role)
-- select id, 'Studio owner', 'owner' from auth.users where email = 'OWNER_EMAIL_HERE';
