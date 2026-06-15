# Uso não-interativo (cole as 3 variáveis antes de rodar):
#   $env:NEXT_PUBLIC_SUPABASE_URL = "https://xxx.supabase.co"
#   $env:NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJ..."
#   $env:SUPABASE_SERVICE_ROLE_KEY = "eyJ..."
#   .\scripts\add-supabase-vercel.ps1
#
# Ou interativo:
#   .\scripts\finalizar-supabase.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$url = $env:NEXT_PUBLIC_SUPABASE_URL
$anon = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY
$service = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $url -or -not $anon -or -not $service) {
  Write-Host "Defina as 3 variaveis de ambiente antes de rodar." -ForegroundColor Red
  Write-Host "Ou use: .\scripts\finalizar-supabase.ps1"
  exit 1
}

function Add-VercelEnv($name, $value) {
  Write-Host "Adicionando $name..."
  $value.Trim() | npx --yes vercel@latest env add $name production --force
}

Add-VercelEnv "NEXT_PUBLIC_SUPABASE_URL" $url
Add-VercelEnv "NEXT_PUBLIC_SUPABASE_ANON_KEY" $anon
Add-VercelEnv "SUPABASE_SERVICE_ROLE_KEY" $service

Write-Host "Redeploy..."
npx --yes vercel@latest --prod
Write-Host "Concluido: https://negociai-blue.vercel.app/entrar" -ForegroundColor Green
