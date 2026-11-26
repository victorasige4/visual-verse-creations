create table public.website_requests (
 id uuid primary key, created_at timestamptz not null default now(),
 source text not null check(source in ('contact','quote')),
 channel text not null check(channel in ('email','whatsapp')),
 name text not null check(char_length(name) between 2 and 100),
 email text not null check(char_length(email) between 3 and 200),
 subject text not null check(char_length(subject) between 3 and 240),
 brief text not null check(char_length(brief) between 10 and 6000),
 status text not null default 'new' check(status in ('new','reviewed','closed'))
);
alter table public.website_requests enable row level security;
revoke all on public.website_requests from public,anon,authenticated;
grant select on public.website_requests to authenticated;
grant update(status) on public.website_requests to authenticated;
grant select,insert on public.website_requests to service_role;
create policy requests_read on public.website_requests for select to authenticated using (app_private.is_studio_admin() and app_private.has_password_session() and app_private.mfa_access_allowed());
create policy requests_review on public.website_requests for update to authenticated using (app_private.is_studio_admin() and app_private.has_password_session() and app_private.mfa_access_allowed()) with check (app_private.is_studio_admin() and app_private.has_password_session() and app_private.mfa_access_allowed());
create index website_requests_email_recent on public.website_requests(lower(email),created_at desc);
create index website_requests_recent on public.website_requests(created_at desc);
create function public.capture_website_request(p_id uuid,p_source text,p_channel text,p_name text,p_email text,p_subject text,p_brief text) returns text language plpgsql security invoker set search_path='' as $$
begin
 perform pg_catalog.pg_advisory_xact_lock(684739502);
 if exists(select 1 from public.website_requests where id=p_id) then return 'saved'; end if;
 if (select count(*) from public.website_requests where created_at > now()-interval '1 hour' and lower(email)=lower(p_email)) >= 5 or (select count(*) from public.website_requests where created_at > now()-interval '1 hour') >= 100 then return 'limited'; end if;
 insert into public.website_requests(id,source,channel,name,email,subject,brief) values(p_id,p_source,p_channel,p_name,lower(p_email),p_subject,p_brief);
 return 'saved';
end; $$;
revoke all on function public.capture_website_request(uuid,text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.capture_website_request(uuid,text,text,text,text,text,text) to service_role;