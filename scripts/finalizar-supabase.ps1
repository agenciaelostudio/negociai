# Adiciona Supabase na Vercel e faz redeploy.
# Pegue as chaves em: Supabase → Project Settings → API

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "=== NegociAi - Configurar Supabase na Vercel ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "No Supabase: Project Settings > API"
Write-Host "  - Project URL"
Write-Host "  - anon public"
Write-Host "  - service_role (secret)"
Write-Host ""

$url = Read-Host "Cole NEXT_PUBLIC_SUPABASE_URL"
$anon = Read-Host "Cole NEXT_PUBLIC_SUPABASE_ANON_KEY"
$service = Read-Host "Cole SUPABASE_SERVICE_ROLE_KEY"

$url = $url.Trim()
$anon = $anon.Trim()
$service = $service.Trim()

if (-not $url.StartsWith("https://") -or -not $url.Contains("supabase")) {
  Write-Host "URL invalida. Deve ser https://xxxx.supabase.co" -ForegroundColor Red
  exit 1
}

function Add-VercelEnv($name, $value) {
  Write-Host "Adicionando $name..." -ForegroundColor Green
  $value | npx --yes vercel@latest env add $name production --force
}

Add-VercelEnv "NEXT_PUBLIC_SUPABASE_URL" $url
Add-VercelEnv "NEXT_PUBLIC_SUPABASE_ANON_KEY" $anon
Add-VercelEnv "SUPABASE_SERVICE_ROLE_KEY" $service

Write-Host ""
Write-Host "Redeploy obrigatorio (NEXT_PUBLIC_* entra no build)..." -ForegroundColor Yellow
npx --yes vercel@latest --prod

Write-Host ""
Write-Host "Pronto! Teste: https://negociai-blue.vercel.app/entrar" -ForegroundColor Green
Write-Host "No Supabase SQL Editor, rode supabase/schema.sql se ainda nao rodou."
