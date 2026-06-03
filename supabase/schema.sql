-- ============================================================
-- NegociAí — Schema do banco de dados (Supabase / PostgreSQL)
-- Execute no SQL Editor do Supabase.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- users ----------
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
alter table public.users enable row level security;
alter table public.generations enable row level security;
alter table public.payments enable row level security;
