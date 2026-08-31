-- LTLINE SERVICE — Dashboard aggregate for public frontend
-- Returns only aggregate counts; no client or service row data is exposed.

create or replace function public.get_dashboard_stats()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'projects', (select count(*) from public.projects where status = 'active'),
    'assets', (select count(*) from public.assets where status = 'active'),
    'warranties', (select count(*) from public.warranties where status = 'active'),
    'open_services', (select count(*) from public.service_requests where status in ('open','in_progress','planned'))
  );
$$;

revoke all on function public.get_dashboard_stats() from public;
grant execute on function public.get_dashboard_stats() to anon, authenticated;
