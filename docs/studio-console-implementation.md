# Visual Verse Studio Console — secure backend checkpoint

**Project:** Visual Verse Studio Console (separate Supabase project)  
**Project ref:** `jajkrkeaatksmleohzif`  
**Supabase region:** Europe West (`eu-west-1`)  
**Status:** Backend foundation built; standalone console login/application NOT YET deployed.

## Applied migrations

1. `studio_console_invite_only_foundation` — eight tables (`profiles`, `team_memberships`, `clients`, `projects`, `project_members`, `tasks`, `documents`, `activity_logs`); role enum; project-scoped helpers; restrictive RLS policies.
2. `studio_console_least_privilege_hardening` — removes broad default browser grants and tightens suspended membership visibility.

SQL source files:
- `docs/studio-console-invite-only.sql`
- `docs/studio-console-least-privilege.sql`

## Confirmed security checks (2026-11-14)

- All eight public data tables have RLS enabled.
- Supabase security advisor returned zero findings.
- Anonymous role has no SELECT grant to `clients` or `projects`.
- Authenticated browser role has no INSERT grant to `team_memberships` or `activity_logs`.
- No profiles, accounts, clients, or private studio files were imported or created.

This is **not** yet a complete invitation-only login implementation: Supabase Auth signup configuration and owner bootstrap have not been completed.

## Required production hardening

1. In Supabase Auth settings, **disable new-user public signup**. Keep invitation-only `auth.admin.inviteUserByEmail` on a trusted server or Edge Function; never place the secret/service-role key in a static site.
2. Create the owner login using their confirmed email and establish the initial `super_admin` membership through a privileged server/database operation. Do not invent an owner email, credentials or user ID.
3. Set approved redirect origins and configure reliable invitation email delivery. Add MFA for the owner/admins.
4. Implement server-side invitations, permission-checked membership management, suspension/session controls, and audit records.
5. Add a **private** Supabase Storage bucket and project-scoped policies before enabling document uploads or downloads.
6. Build and deploy the standalone React console with the Visual Verse repository's actual `logo-mark.png` / `favicon.ico` assets, a signed-in dashboard and mobile support. Use only the public publishable key in its browser bundle.
7. Test role permissions with real invite-only accounts (including suspended, unassigned, creative, manager, admin); verify object storage policies and cross-project access.
8. Update the public website's `/console/` redirect only **after** the standalone app is secure and verified. Current ChatGPT workspace gateway should remain undisturbed until then.

## Architecture and access

- The public GitHub Pages website remains public and retains its subtle Studio Console footer link.
- New private console application and database are logically separate from older Supabase projects.
- Server-side authorization combines an active team membership with role and project assignment; no registered user gains access by registration alone.
- Privileged `app_private` lookup functions are outside the exposed public API schema and derive identity from `auth.uid()`, not client-supplied user IDs.
- All SQL and console planning live on `feature/invite-only-studio-console` until reviewed; no secret values are stored in Git.

**Dashboard:** https://supabase.com/dashboard/project/jajkrkeaatksmleohzif
