
-- Owner bootstrap and private project-scoped file access.
-- Owner email is seeded separately into app_private.owner_invite_allowlist, never published in git.
create table if not exists app_private.owner_invite_allowlist (
  email text primary key,
  created_at timestamptz not null default now(),
  check (email = lower(btrim(email)))
);
revoke all on app_private.owner_invite_allowlist from public, anon, authenticated;

create or replace function app_private.activate_invited_owner()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.invited_at is not null
    and exists (
      select 1 from app_private.owner_invite_allowlist o
      where o.email = lower(btrim(new.email))
    )
  then
    insert into public.profiles (user_id, display_name)
    values (new.id, coalesce(split_part(new.email,'@',1),'Visual Verse Owner'))
    on conflict (user_id) do nothing;
    insert into public.team_memberships (user_id, role, status)
    values (new.id, 'super_admin'::public.studio_role, 'active'::public.membership_status)
    on conflict (user_id) do nothing;
  end if;
  return new;
end
$$;
revoke all on function app_private.activate_invited_owner() from public, anon, authenticated;
drop trigger if exists studio_owner_invite_provisioning on auth.users;
create trigger studio_owner_invite_provisioning
after insert or update of invited_at, email on auth.users
for each row execute function app_private.activate_invited_owner();

-- Lock upload authorization to project folder and non-viewer roles.
drop policy if exists documents_create on public.documents;
create policy documents_create on public.documents for insert to authenticated
with check (
  app_private.current_studio_role() in (
    'super_admin'::public.studio_role, 'admin'::public.studio_role,
    'project_manager'::public.studio_role, 'creative'::public.studio_role
  )
  and app_private.can_view_project(project_id)
  and uploaded_by = (select auth.uid())
  and left(storage_path, 37) = project_id::text || '/'
);

insert into storage.buckets (id,name,public,file_size_limit)
values ('studio-documents','studio-documents',false,26214400)
on conflict (id) do update set public=false, file_size_limit=26214400;

-- The prefix of every storage filename is the project UUID.
-- CASE prevents invalid UUID casts on unauthorized/malformed paths.
create or replace function app_private.can_access_storage_path(target_path text, write_access boolean default false)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select case
    when split_part(target_path,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      and position('/' in target_path) > 0
    then (
      case when write_access
      then app_private.current_studio_role() in (
        'super_admin'::public.studio_role, 'admin'::public.studio_role,
        'project_manager'::public.studio_role, 'creative'::public.studio_role
      ) else true end
    ) and app_private.can_view_project(split_part(target_path,'/',1)::uuid)
    else false
  end
$$;
revoke all on function app_private.can_access_storage_path(text,boolean) from public, anon;
grant execute on function app_private.can_access_storage_path(text,boolean) to authenticated;

create policy studio_documents_download on storage.objects for select to authenticated
using (bucket_id = 'studio-documents' and app_private.can_access_storage_path(name,false));
create policy studio_documents_upload on storage.objects for insert to authenticated
with check (bucket_id = 'studio-documents' and app_private.can_access_storage_path(name,true));
create policy studio_documents_delete on storage.objects for delete to authenticated
using (
  bucket_id = 'studio-documents'
  and case when split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then app_private.can_manage_project(split_part(name,'/',1)::uuid)
    else false end
);
