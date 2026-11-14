-- Visual Verse Studio Console: a temporary email invite/recovery session must NOT
-- unlock studio data. Require a verified password-authenticated JWT (AMR= password)
-- as well as the existing membership/project/MFA policies.
-- Supabase Auth still handles invitation and password recovery; no changes to auth.users.
create or replace function app_private.has_password_session()
returns boolean
language sql stable set search_path = ''
as $$
  select coalesce(
    ((select auth.jwt()) -> 'amr') @> '[{"method":"password"}]'::jsonb,
    false
  )
$$;

revoke all on function app_private.has_password_session() from public, anon;
grant execute on function app_private.has_password_session() to authenticated;

-- A restrictive policy is combined with every permissive table policy using AND.
-- This applies even to the user's own team membership, avoiding an invite-session bypass.
do $policy$
declare t text;
begin
  foreach t in array array[
    'profiles','team_memberships','clients','projects','project_members',
    'tasks','documents','activity_logs'
  ] loop
    execute format(
      'create policy studio_password_required on public.%I
       as restrictive for all to authenticated
       using (app_private.has_password_session())
       with check (app_private.has_password_session())', t
    );
  end loop;
end
$policy$;

-- Only restrict files owned by the studio's bucket, leaving unrelated buckets alone.
create policy studio_password_required on storage.objects
as restrictive for all to authenticated
using (
  bucket_id <> 'studio-documents'
  or app_private.has_password_session()
)
with check (
  bucket_id <> 'studio-documents'
  or app_private.has_password_session()
);
