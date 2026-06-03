# Conclusão do deploy — NegociAí

## ✅ Já feito

| Item | Status |
|------|--------|
| App na Vercel | https://negociai-blue.vercel.app |
| Projeto Vercel | `agenciaelostudios-projects/negociai` |
| CLI autenticada | conta `agenciaelostudio` |
| Commit local | branch `master`, commit `c097b6d` |
| Build em produção | passou na Vercel |

---

## 🔲 Falta você fazer (3 passos)

### 1. Variáveis de ambiente na Vercel

Painel: https://vercel.com/agenciaelostudios-projects/negociai/settings/environment-variables

Adicione em **Production**:

| Variável | Valor |
|----------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://negociai-blue.vercel.app` |
| `ACCESS_SECRET` | string longa aleatória (gere com o script abaixo) |
| `ASAAS_API_KEY` | sua chave do Asaas |
| `ASAAS_ENV` | `sandbox` (testes) ou `production` |
| `OPENAI_API_KEY` | opcional — sem ela usa gerador local |

**Ou pelo terminal:**

```powershell
cd D:\AGENTES_AI\projetos\negociai
$env:ASAAS_API_KEY = "SUA_CHAVE_ASAAS"
.\scripts\setup-vercel-env.ps1
npx vercel --prod
```

### 2. Asaas — URLs de retorno

No painel Asaas (sandbox ou produção), use como base:

- Sucesso: `https://negociai-blue.vercel.app/sucesso`
- Site: `https://negociai-blue.vercel.app`

O checkout já envia `successUrl` com `?ref=...` automaticamente.

### 3. GitHub (deploy automático a cada push)

1. Crie um repositório em https://github.com/new (ex: `negociai`, privado ou público).
2. No terminal:

```powershell
cd D:\AGENTES_AI\projetos\negociai
git remote add origin https://github.com/SEU_USUARIO/negociai.git
git push -u origin master
```

3. Na Vercel: **Settings → Git → Connect Repository** e selecione o repo.

---

## Testar em produção

1. Abra https://negociai-blue.vercel.app  
2. Clique em **COMEÇAR AGORA** → deve ir para o checkout Asaas (com `ASAAS_API_KEY`)  
3. Após pagar → `/sucesso` → `/formulario` → **GERAR MEU NEGOCIAÍ** → `/resultado`

Sem `ASAAS_API_KEY`, o fluxo funciona em **modo demo** (acesso direto ao formulário).

---

## Comandos úteis

```bash
npx vercel --prod          # novo deploy
npx vercel env ls          # listar variáveis
npx vercel logs            # logs de produção
```
