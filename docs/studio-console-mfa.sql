
-- Enforce step-up MFA for any user who enrolled a verified authenticator factor.
-- Unenrolled invitees can establish their initial MFA factor after login.
create or replace function app_private.mfa_access_allowed()
returns boolean language sql stable security definer set search_path = ''
as $$
  select case
    when exists (
      select 1 from auth.mfa_factors f
      where f.user_id = (select auth.uid()) and f.status = 'verified'
    )
    then coalesce((select auth.jwt()->>'aal') = 'aal2', false)
    else true
  end
$$;
revoke all on function app_private.mfa_access_allowed() from public, anon;
grant execute on function app_private.mfa_access_allowed() to authenticated;

create policy studio_mfa_required_when_enrolled on public.profiles as restrictive for all to authenticated
using (app_private.mfa_access_allowed()) with check (app_private.mfa_access_allowed());
create policy studio_mfa_required_when_enrolled on public.team_memberships as restrictive for all to authenticated
using (app_private.mfa_access_allowed()) with check (app_private.mfa_access_allowed());
create policy studio_mfa_required_when_enrolled on public.clients as restrictive for all to authenticated
using (app_private.mfa_access_allowed()) with check (app_private.mfa_access_allowed());
create policy studio_mfa_required_when_enrolled on public.projects as restrictive for all to authenticated
using (app_private.mfa_access_allowed()) with check (app_private.mfa_access_allowed());
create policy studio_mfa_required_when_enrolled on public.project_members as restrictive for all to authenticated
using (app_private.mfa_access_allowed()) with check (app_private.mfa_access_allowed());
create policy studio_mfa_required_when_enrolled on public.tasks as restrictive for all to authenticated
using (app_private.mfa_access_allowed()) with check (app_private.mfa_access_allowed());
create policy studio_mfa_required_when_enrolled on public.documents as restrictive for all to authenticated
using (app_private.mfa_access_allowed()) with check (app_private.mfa_access_allowed());
create policy studio_mfa_required_when_enrolled on public.activity_logs as restrictive for all to authenticated
using (app_private.mfa_access_allowed()) with check (app_private.mfa_access_allowed());
create policy studio_mfa_required_when_enrolled on storage.objects as restrictive for all to authenticated
using (app_private.mfa_access_allowed()) with check (app_private.mfa_access_allowed());
