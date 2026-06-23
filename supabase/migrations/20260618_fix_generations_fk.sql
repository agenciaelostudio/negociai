-- fix-generations-fk
-- Corrige FK da tabela generations para apontar para auth.users

do $$ declare constraint_name text; begin
  select con.conname into constraint_name from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  where rel.relname = 'generations' and con.contype = 'f' and con.confrelid = 'public.users'::regclass;
  if constraint_name is not null then
    execute format('alter table public.generations drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.generations add constraint generations_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamptz not null default now()
);
