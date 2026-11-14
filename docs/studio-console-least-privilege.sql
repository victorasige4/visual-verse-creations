-- Reduce Supabase default grants to only the operations authorized by RLS.
-- The original tables remain intact; no data is deleted.
revoke all privileges on public.profiles,
  public.team_memberships, public.clients, public.projects,
  public.project_members, public.tasks, public.documents,
  public.activity_logs from anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select on public.team_memberships to authenticated;
grant select, insert, update, delete on public.clients to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, delete on public.project_members to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
grant select, insert, delete on public.documents to authenticated;
grant select on public.activity_logs to authenticated;

revoke all privileges on sequence public.activity_logs_id_seq from anon, authenticated;

-- Suspended accounts should not be able to enumerate even their own membership row.
drop policy if exists memberships_read on public.team_memberships;
create policy memberships_read on public.team_memberships for select to authenticated
using (
  (user_id = (select auth.uid()) and status = 'active')
  or app_private.is_studio_admin()
);
