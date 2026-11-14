-- Visual Verse Studio Console: invitation-only, deny-by-default schema
-- No public signup or owner user is provisioned by this migration.
create schema if not exists app_private;
revoke all on schema app_private from public, anon;
grant usage on schema app_private to authenticated;

create type public.studio_role as enum ('super_admin','admin','project_manager','creative','viewer');
create type public.membership_status as enum ('active','suspended');

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.team_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.studio_role not null,
  status public.membership_status not null default 'active',
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  email text,
  phone text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id),
  name text not null check (length(btrim(name)) > 0),
  description text,
  status text not null default 'planning'
    check (status in ('planning','in_progress','in_review','delivered','on_hold','cancelled')),
  due_date date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.team_memberships(user_id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (project_id,user_id)
);
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null check (length(btrim(title)) > 0),
  description text,
  status text not null default 'todo'
    check (status in ('todo','in_progress','in_review','done')),
  assigned_to uuid references public.team_memberships(user_id) on delete set null,
  due_date date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null unique check (length(btrim(storage_path)) > 0),
  file_name text not null,
  content_type text,
  size_bytes bigint check (size_bytes >= 0),
  uploaded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create table public.activity_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index on public.projects(client_id);
create index on public.project_members(user_id);
create index on public.tasks(project_id);
create index on public.tasks(assigned_to);
create index on public.documents(project_id);
create index on public.activity_logs(created_at desc);

-- Helpers are outside the exposed API schema. Do not accept a caller-selected user id.
-- SECURITY DEFINER is narrowly scoped to trusted membership/assignment lookups.
create function app_private.current_studio_role()
returns public.studio_role
language sql stable security definer set search_path = ''
as $$
  select m.role from public.team_memberships m
  where m.user_id = (select auth.uid()) and m.status = 'active'
  limit 1
$$;
create function app_private.is_studio_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce(app_private.current_studio_role()
    in ('super_admin'::public.studio_role,'admin'::public.studio_role),false)
$$;
create function app_private.can_view_project(target_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select app_private.is_studio_admin()
  or (
    app_private.current_studio_role() is not null
    and exists (
      select 1 from public.project_members pm
      where pm.project_id = target_id and pm.user_id = (select auth.uid())
    )
  )
$$;
create function app_private.can_manage_project(target_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select app_private.is_studio_admin()
    or (
      app_private.current_studio_role() = 'project_manager'::public.studio_role
      and exists (
        select 1 from public.project_members pm
        where pm.project_id = target_id and pm.user_id = (select auth.uid())
      )
    )
$$;
create function app_private.can_view_client(target_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select app_private.is_studio_admin()
  or (
    app_private.current_studio_role() is not null
    and exists (
      select 1 from public.projects p
      inner join public.project_members pm on pm.project_id = p.id
      where p.client_id = target_id and pm.user_id = (select auth.uid())
    )
  )
$$;

revoke all on function app_private.current_studio_role() from public, anon;
revoke all on function app_private.is_studio_admin() from public, anon;
revoke all on function app_private.can_view_project(uuid) from public, anon;
revoke all on function app_private.can_manage_project(uuid) from public, anon;
revoke all on function app_private.can_view_client(uuid) from public, anon;
grant execute on function app_private.current_studio_role() to authenticated;
grant execute on function app_private.is_studio_admin() to authenticated;
grant execute on function app_private.can_view_project(uuid) to authenticated;
grant execute on function app_private.can_manage_project(uuid) to authenticated;
grant execute on function app_private.can_view_client(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.team_memberships enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks enable row level security;
alter table public.documents enable row level security;
alter table public.activity_logs enable row level security;

-- A signed-in user without an active team membership can see no studio records.
create policy profiles_read on public.profiles for select to authenticated
using (
  (user_id = (select auth.uid()) and app_private.current_studio_role() is not null)
  or app_private.is_studio_admin()
);
create policy profiles_edit_self on public.profiles for update to authenticated
using (user_id = (select auth.uid()) and app_private.current_studio_role() is not null)
with check (user_id = (select auth.uid()) and app_private.current_studio_role() is not null);

create policy memberships_read on public.team_memberships for select to authenticated
using (user_id = (select auth.uid()) or app_private.is_studio_admin());

create policy clients_read on public.clients for select to authenticated
using (app_private.can_view_client(id));
create policy clients_create on public.clients for insert to authenticated
with check (app_private.is_studio_admin() and created_by = (select auth.uid()));
create policy clients_edit on public.clients for update to authenticated
using (app_private.is_studio_admin())
with check (app_private.is_studio_admin());
create policy clients_delete on public.clients for delete to authenticated
using (app_private.current_studio_role() = 'super_admin'::public.studio_role);

create policy projects_read on public.projects for select to authenticated
using (app_private.can_view_project(id));
create policy projects_create on public.projects for insert to authenticated
with check (app_private.is_studio_admin() and created_by = (select auth.uid()));
create policy projects_edit on public.projects for update to authenticated
using (app_private.is_studio_admin())
with check (app_private.is_studio_admin());
create policy projects_delete on public.projects for delete to authenticated
using (app_private.current_studio_role() = 'super_admin'::public.studio_role);

create policy project_members_read on public.project_members for select to authenticated
using (app_private.can_view_project(project_id));
create policy project_members_create on public.project_members for insert to authenticated
with check (app_private.is_studio_admin());
create policy project_members_delete on public.project_members for delete to authenticated
using (app_private.is_studio_admin());

create policy tasks_read on public.tasks for select to authenticated
using (app_private.can_view_project(project_id));
create policy tasks_create on public.tasks for insert to authenticated
with check (app_private.can_manage_project(project_id) and created_by = (select auth.uid()));
create policy tasks_edit on public.tasks for update to authenticated
using (app_private.can_manage_project(project_id))
with check (app_private.can_manage_project(project_id));
create policy tasks_delete on public.tasks for delete to authenticated
using (app_private.can_manage_project(project_id));

create policy documents_read on public.documents for select to authenticated
using (app_private.can_view_project(project_id));
create policy documents_create on public.documents for insert to authenticated
with check (
  app_private.can_view_project(project_id)
  and uploaded_by = (select auth.uid())
);
create policy documents_delete on public.documents for delete to authenticated
using (app_private.can_manage_project(project_id));

create policy activity_logs_read on public.activity_logs for select to authenticated
using (app_private.is_studio_admin());

-- Only the authenticated role receives browser Data API privileges.
-- Membership creation, audit writes and owner provisioning are server-only.
revoke all on public.profiles, public.team_memberships, public.clients,
 public.projects, public.project_members, public.tasks,
 public.documents, public.activity_logs from anon;
grant select,update on public.profiles to authenticated;
grant select on public.team_memberships to authenticated;
grant select,insert,update,delete on public.clients to authenticated;
grant select,insert,update,delete on public.projects to authenticated;
grant select,insert,delete on public.project_members to authenticated;
grant select,insert,update,delete on public.tasks to authenticated;
grant select,insert,delete on public.documents to authenticated;
grant select on public.activity_logs to authenticated;

-- Secret and service-role API credentials must never be committed to the site.
