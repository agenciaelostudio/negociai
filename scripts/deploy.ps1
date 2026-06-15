# Deploy completo: Git → GitHub → Vercel
# Uso: .\scripts\deploy.ps1

$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false
Set-Location $PSScriptRoot\..

Write-Host "=== NegociAi - Deploy Completo ===" -ForegroundColor Cyan
Write-Host ""

# ── 1. Git ──────────────────────────────────────────────────────────────────
if (-not (Test-Path ".git")) {
  Write-Host "[1/5] Inicializando repositorio Git..." -ForegroundColor Yellow
  git init
  git branch -M main
} else {
  Write-Host "[1/5] Repositorio Git ja existe." -ForegroundColor Green
}

# ── 2. Remote GitHub ─────────────────────────────────────────────────────────
$remote = git remote get-url origin 2>$null
if (-not $remote) {
  Write-Host "[2/5] Conectando ao GitHub..." -ForegroundColor Yellow
  git remote add origin https://github.com/agenciaelostudio/negociai.git
} else {
  Write-Host "[2/5] Remote ja configurado: $remote" -ForegroundColor Green
}

# ── 3. Commit e Push ─────────────────────────────────────────────────────────
Write-Host "[3/5] Commit e push para GitHub..." -ForegroundColor Yellow
git add .

$status = git status --porcelain
if ($status) {
  git commit -m "feat: deploy negociai"
} else {
  Write-Host "   Nada novo para commitar." -ForegroundColor Gray
}

git push -u origin main --force
Write-Host "   Push concluido!" -ForegroundColor Green

# ── 4. Variaveis de ambiente no Vercel ───────────────────────────────────────
Write-Host "[4/5] Configurando variaveis de ambiente no Vercel..." -ForegroundColor Yellow

function Add-VercelEnv($name, $value) {
  Write-Host "   $name" -ForegroundColor Gray
  $tmp = [System.IO.Path]::GetTempFileName()
  [System.IO.File]::WriteAllText($tmp, $value.Trim(), [System.Text.Encoding]::ASCII)
  $cmdStr = "npx --yes vercel@latest env add $name production --force < `"$tmp`""
  cmd /c $cmdStr
  Remove-Item $tmp -ErrorAction SilentlyContinue
}

# Site URL (corrige o redirect_uri_mismatch do localhost)
Add-VercelEnv "NEXT_PUBLIC_SITE_URL" "https://negociai-blue.vercel.app"

# Supabase (se ja estiverem no ambiente, adiciona automaticamente)
if ($env:NEXT_PUBLIC_SUPABASE_URL)    { Add-VercelEnv "NEXT_PUBLIC_SUPABASE_URL"  $env:NEXT_PUBLIC_SUPABASE_URL }
if ($env:NEXT_PUBLIC_SUPABASE_ANON_KEY) { Add-VercelEnv "NEXT_PUBLIC_SUPABASE_ANON_KEY" $env:NEXT_PUBLIC_SUPABASE_ANON_KEY }
if ($env:SUPABASE_SERVICE_ROLE_KEY)   { Add-VercelEnv "SUPABASE_SERVICE_ROLE_KEY" $env:SUPABASE_SERVICE_ROLE_KEY }

# Asaas (se ja estiverem no ambiente, adiciona automaticamente)
if ($env:ASAAS_API_KEY)  { Add-VercelEnv "ASAAS_API_KEY"  $env:ASAAS_API_KEY }
if ($env:ASAAS_WEBHOOK_TOKEN) { Add-VercelEnv "ASAAS_WEBHOOK_TOKEN" $env:ASAAS_WEBHOOK_TOKEN }

Write-Host "   Variaveis configuradas!" -ForegroundColor Green

# ── 5. Deploy Vercel ─────────────────────────────────────────────────────────
Write-Host "[5/5] Deploy na Vercel (producao)..." -ForegroundColor Yellow
npx --yes vercel@latest --prod --yes

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Deploy concluido!" -ForegroundColor Green
Write-Host " Acesse: https://negociai-blue.vercel.app" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: Teste o login com Google em:" -ForegroundColor Yellow
Write-Host "  https://negociai-blue.vercel.app/entrar" -ForegroundColor White
