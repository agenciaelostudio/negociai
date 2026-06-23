-- ============================================================
-- Migração: corrige FK da tabela generations
-- ============================================================
-- A tabela generations.user_id referenciava public.users (legado)
-- mas os IDs dos usuários vêm de auth.users.
-- ============================================================

-- 1. Dropar a FK antiga (descobre o nome automático)
do $$
declare
  constraint_name text;
begin
  select con.conname into constraint_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  where rel.relname = 'generations'
    and con.contype = 'f'
    and con.confrelid = 'public.users'::regclass;

  if constraint_name is not null then
    execute format('alter table public.generations drop constraint %I', constraint_name);
    raise notice 'Dropped FK constraint: %', constraint_name;
  end if;
end $$;

-- 2. Criar FK correta apontando para auth.users
alter table public.generations
  add constraint generations_user_id_fkey
  foreign key (user_id) references auth.users (id)
  on delete set null;

-- 3. Criar também a tabela public.users legada caso alguém precise
-- (opcional, mas não atrapalha)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamptz not null default now()
);

-- Verificação
select
  tc.table_schema,
  tc.table_name,
  kcu.column_name,
  ccu.table_schema as foreign_schema,
  ccu.table_name as foreign_table,
  ccu.column_name as foreign_column
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
join information_schema.constraint_column_usage ccu
  on tc.constraint_name = ccu.constraint_name
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_name = 'generations';