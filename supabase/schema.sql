-- ============================================================
-- NegociAí — Schema do banco de dados (Supabase / PostgreSQL)
-- Execute no SQL Editor do Supabase.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- profiles (vinculado ao auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  business_name text default '',
  profession text default '',
  services text default '',
  price_range text default '',
  differentials text default '',
  objections text default '',
  tone text default 'Profissional',
  has_paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- users (legado) ----------
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamptz not null default now()
);

-- ---------- generations ----------
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete set null,
  profession text,
  data jsonb,
  generated_content jsonb,
  created_at timestamptz not null default now()
);

create index if not exists generations_user_id_idx on public.generations (user_id);
create index if not exists generations_created_at_idx on public.generations (created_at desc);

-- ---------- payments ----------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete set null,
  plan text,
  amount numeric(10, 2),
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists payments_user_id_idx on public.payments (user_id);

-- ---------- Row Level Security ----------
-- O app grava via service_role (server-side), que ignora RLS.
-- Habilite RLS e ajuste policies conforme sua necessidade de acesso pelo client.
alter table public.profiles enable row level security;
alter table public.users enable row level security;
alter table public.generations enable row level security;
alter table public.payments enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);
