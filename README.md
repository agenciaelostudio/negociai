# NegociAí

> A resposta certa na hora da negociação.

Transforme seu WhatsApp em uma máquina de fechar negócios. O usuário responde
algumas perguntas e a IA gera, em segundos, um sistema completo de respostas
rápidas (apresentação, quebra de objeções, follow-ups, fechamento, urgência e
pós-venda) pronto para colar no WhatsApp Business.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + componentes estilo **shadcn/ui**
- **OpenAI** para geração das mensagens (com gerador local de fallback)
- **Supabase** para persistência (`users`, `generations`, `payments`)
- **Asaas** (PIX, cartão e boleto) para pagamento
- Deploy na **Vercel**

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# preencha as chaves (opcional — o app funciona sem elas)

# 3. Rodar em desenvolvimento
npm run dev
```

Acesse http://localhost:3000

> **Funciona sem chaves!** Sem `OPENAI_API_KEY`, o app usa um gerador local de
> mensagens personalizadas. Sem Supabase, ele apenas não persiste os dados.
> Sem `ASAAS_API_KEY`, o checkout leva direto ao formulário.

## Fluxo do app

1. **Landing / página de venda** (`/`) — headline, benefícios, preço e CTA.
2. **Checkout** — o CTA chama `/api/checkout`, que cria um **Checkout no Asaas**
   (PIX/cartão) e redireciona o cliente para pagar.
3. **Sucesso** (`/sucesso?ref=...`) — após o pagamento, o Asaas redireciona de
   volta. A página confirma o pagamento via `/api/payment-status` e libera o
   acesso (cookie assinado).
4. **Formulário** (`/formulario`) — nome, profissão, serviços, faixa de preço,
   diferenciais, objeções e tom de comunicação.
5. **Resultado** (`/resultado`) — mensagens organizadas por categoria, com
   botão **Copiar** em cada bloco e **Copiar Tudo** no topo.

> **Gating de pagamento:** a rota `/api/generate` só exige pagamento quando
> `ASAAS_API_KEY` está configurada. Sem a chave (modo demo), o fluxo libera o
> acesso automaticamente para você testar tudo localmente.

## Variáveis de ambiente

Veja `.env.example`. Principais:

| Variável | Descrição |
| --- | --- |
| `OPENAI_API_KEY` | Chave da OpenAI (geração via IA) |
| `OPENAI_MODEL` | Modelo (padrão `gpt-4o-mini`) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service_role (server-side) |
| `ASAAS_API_KEY` | Chave de API do Asaas (pagamento) |
| `ASAAS_ENV` | `sandbox` (padrão) ou `production` |
| `NEXT_PUBLIC_PRICE_BRL` | Preço exibido (padrão `19,90`) |

## Banco de dados

Execute o script `supabase/schema.sql` no SQL Editor do Supabase para criar as
tabelas `users`, `generations` e `payments`.

## Categorias geradas

Apresentação · Diferenciais · Valores · Pedido de Informações · Quebra de
Objeções · Follow-up · Fechamento · Urgência · Pós-venda

Total de **30+ mensagens** com atalhos como `/apresentacao`, `/caro`,
`/desconto`, `/fup7`, `/fechar`, `/ultimasvagas`, `/indicacao`, etc.

## Deploy na Vercel

### Opção A — pelo site (recomendado)

1. Suba o código para GitHub/GitLab/Bitbucket (veja abaixo).
2. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório.
3. A Vercel detecta Next.js automaticamente (`vercel.json` usa `next build`).
4. Em **Environment Variables**, adicione (Production):

| Variável | Obrigatório | Observação |
| --- | --- | --- |
| `ASAAS_API_KEY` | Para cobrar | Sandbox ou produção |
| `ASAAS_ENV` | Sim, se usar Asaas | `sandbox` ou `production` |
| `ACCESS_SECRET` | Sim, em produção | String longa e aleatória |
| `OPENAI_API_KEY` | Opcional | Sem ela usa gerador local |
| `NEXT_PUBLIC_APP_URL` | Recomendado | Ex: `https://seu-app.vercel.app` (callbacks Asaas) |
| `NEXT_PUBLIC_PRICE_BRL` | Opcional | Padrão `19.90` |
| `NEXT_PUBLIC_SUPABASE_URL` | Opcional | Banco |
| `SUPABASE_SERVICE_ROLE_KEY` | Opcional | Server-side |

> Se não definir `NEXT_PUBLIC_APP_URL`, o app usa `VERCEL_URL` automaticamente nos redirects.

5. Clique em **Deploy**.

### Opção B — CLI

```bash
npx vercel login
npx vercel --prod
```

### Primeiro commit local (Git)

```bash
git add .
git commit -m "Deploy inicial NegociAí"
git remote add origin https://github.com/SEU_USUARIO/negociai.git
git push -u origin main
```
