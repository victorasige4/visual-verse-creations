# Visual Verse independent Studio Console — setup

This is a new, **separate** web application at /studio-console.html. The current public-site footer's /console/ gateway continues to point to the original ChatGPT-hosted workspace until the new console is tested, secured, and authorized to replace it. No workspace data has been copied.

## Security before launch
1. Create a Supabase project under the business's account.
2. In **Authentication > Providers > Email**, disable public user signups, keep email confirmation enabled, and configure email delivery (production SMTP is recommended).
3. In Supabase SQL Editor, run supabase/migrations/20261114_private_console.sql once. Verify RLS is enabled for console_members, console_clients, and console_projects.
4. In **Authentication > URL Configuration**, set the site URL and redirect allowlist to the exact deployed console address, currently:
   https://victorasige4.github.io/visual-verse-creations/studio-console.html
5. From **Authentication > Users > Add user > Send invitation**, invite the owner's email address (and later individual teammates). Avoid a public sign-up form.
6. Assign membership using the SQL editor. For example, replacing the placeholder:
   insert into public.console_members (user_id, display_name, role)
   select id, 'Studio owner', 'owner' from auth.users where email = 'OWNER_EMAIL_HERE';
   Use role 'member' for read-only access or 'admin' for editors. Do not expose admin membership changes to the browser.
7. Set public GitHub Actions **repository variables** VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY. These are designed to be public. NEVER put Supabase secret/service_role keys in the app, env variables prefixed VITE_, or the GitHub repo.
8. Deploy and test: uninvited visitor, invited owner, member-only account, revoked member, password reset, mobile login, and records. RLS must deny reads by anyone not in console_members.
9. Migrate old workspace records only when accurate exports and a verified mapping are available. Do not expose old business data in a public GitHub repository.
10. Only after successful verification should the public website /console/ gateway be redirected to /studio-console.html.

## Current implementation
- Email + password sign-in and password recovery; invitation-based first-password setup.
- Member check in database after login. Unlisted and inactive users see an access-denied page.
- Overview, clients, projects; owner/admin may create records and members have read-only access.
- Branded favicon and mark from the existing Visual Verse repository.
- Safe empty-state experience if no backend credentials are configured.
- No ChatGPT sign-in inside the new application.
- Not yet a migration or complete replacement of the original Business HQ console.

## Local development
Copy .env.example to .env.local and populate **publishable** values from the Supabase project settings. Then:
npm install
npm run dev
npm run typecheck
GITHUB_PAGES=true npm run build

Access /studio-console.html locally. GitHub Pages build requires the variables configured in the Pages workflow. Auth secret operations such as inviting users or assigning owner/admin privileges must occur via trusted Supabase administration, never from client-side code.
