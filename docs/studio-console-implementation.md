# Visual Verse Studio Console — implementation and secure activation

## Deployed foundation (14 November 2026)

- Independent Supabase project: **Visual Verse Studio Console**, ref `jajkrkeaatksmleohzif` (Europe West).
- Eight studio tables, active Row Level Security, server-only membership writes and audit writes.
- Private `studio-documents` file bucket (25 MB per file) with project-scoped access.
- Privately configured owner invitation allowlist; the email itself is **not stored in GitHub**.
- `studio-team` Edge Function: administrators can invite, inspect, suspend/reactivate members and change roles. MFA (AAL2) is mandatory for this function.
- Responsive branded console: `public/console-preview.html`, plus CSS and JS in `public/console-assets/`.
- Client/project/task views and creation, project member assignment, private file upload/download, team management, sign-in, password reset and account password setup.
- TOTP MFA enrollment and sign-in challenge; enrolled users' database/storage requests require AAL2.
- The public main website and old `/console/` redirect remain unchanged until private-console onboarding succeeds.
- Private keys are never added to browser code or Git. Supabase's **publishable** key is intentionally public and is protected by RLS.

## Owner activation — requires Supabase dashboard action

1. Open [Supabase Authentication users](https://supabase.com/dashboard/project/jajkrkeaatksmleohzif/auth/users).
2. Select **Add user → Send invitation** for the owner email provided privately in this conversation. Do not create a password or send credentials in chat.
3. Open [Authentication → URL Configuration](https://supabase.com/dashboard/project/jajkrkeaatksmleohzif/auth/url-configuration), set Site URL to `https://victorasige4.github.io/visual-verse-creations/console-preview.html`, and allow that exact redirect.
4. Open [Authentication → Sign In / Providers](https://supabase.com/dashboard/project/jajkrkeaatksmleohzif/auth/providers), turn **Allow new users to sign up** OFF and leave email confirmation enabled.
5. Accept the invitation from the owner inbox, set a long password through the console, then open the **Security** section and enroll a TOTP authenticator before inviting teammates.
6. Configure a custom SMTP provider if Supabase's built-in invitation email delivery is insufficient for the team.
7. Test first owner login, 2FA, invitation, project roles, revocation and file access using separate test accounts. Only then switch the old footer-linked `/console/` gateway over to the new console page.

## Live and preview URLs

- Website: https://victorasige4.github.io/visual-verse-creations/
- Console preview (sign-in, no private data without authorization): https://victorasige4.github.io/visual-verse-creations/console-preview.html
- Supabase: https://supabase.com/dashboard/project/jajkrkeaatksmleohzif
- Original console gateway: https://victorasige4.github.io/visual-verse-creations/console/

## Applied migrations

1. `studio_console_invite_only_foundation` (`docs/studio-console-invite-only.sql`).
2. `studio_console_least_privilege_hardening` (`docs/studio-console-least-privilege.sql`).
3. `studio_owner_invite_and_private_storage` (`docs/studio-console-owner-storage.sql`).
4. `studio_console_mfa_enforcement` (`docs/studio-console-mfa.sql`).

## Security QA completed

- No anonymous access to clients or projects.
- Browser-authenticated role cannot directly create memberships or write audit logs.
- All eight public studio tables have RLS enabled, plus restricted storage objects.
- Supabase security advisor returned zero findings before the activation handoff.
- The console JavaScript is syntax-checked in the GitHub Actions CI step.
- **Not yet end-to-end verified:** owner login, email invitation delivery, allowed redirect, MFA challenge and team-user permission matrix. Those require owner invitation acceptance and test accounts.

Avoid treating an active deployment as proof that sign-in or private data access has completed.
