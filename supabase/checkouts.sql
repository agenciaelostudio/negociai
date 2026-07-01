-- Tabela para rastrear checkouts do Asaas
-- Permite encontrar pagamentos pelo user_id ou email mesmo sem o ref na URL
create table if not exists public.checkouts (
  id text primary key, -- mesmo valor do externalReference
  user_id uuid references public.users (id) on delete set null,
  email text, -- fallback quando auth nao consegue recuperar o user_id (PKCE bug)
  asaas_checkout_id text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists checkouts_user_id_idx on public.checkouts (user_id);
create index if not exists checkouts_email_idx on public.checkouts (email);
create index if not exists checkouts_status_idx on public.checkouts (status);

-- RLS: apenas server-side (service_role) deve acessar
alter table public.checkouts enable row level security;

create policy "checkouts_service_role_all"
  on public.checkouts
  using (true)
  with check (true);