# Cole a chave do Asaas (botão Copiar no modal) e pressione Enter.
# Depois configura a Vercel e faz deploy.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$key = Read-Host "Cole a ASAAS_API_KEY e pressione Enter"
$key = $key.Trim()
if (-not $key.StartsWith('$aact')) {
  Write-Host "Chave invalida. Deve comecar com `$aact" -ForegroundColor Red
  exit 1
}

$env:ASAAS_API_KEY = $key
$env:ASAAS_ENV = if ($key -match '_prod_') { 'production' } else { 'sandbox' }

Write-Host "Configurando Vercel (ASAAS_ENV=$($env:ASAAS_ENV))..."
& "$PSScriptRoot\setup-vercel-env.ps1"

Write-Host "Deploy em producao..."
npx --yes vercel@latest --prod

Write-Host ""
Write-Host "Testando checkout..."
Start-Sleep -Seconds 5
$r = Invoke-RestMethod -Uri "https://negociai-blue.vercel.app/api/checkout" -Method POST
if ($r.simulated) {
  Write-Host "Ainda em modo demo. Aguarde 1 min e teste de novo, ou rode: npx vercel --prod" -ForegroundColor Yellow
} elseif ($r.url -match 'asaas') {
  Write-Host "SUCESSO! Checkout Asaas ativo." -ForegroundColor Green
  Write-Host $r.url
} else {
  Write-Host "Resposta: $($r | ConvertTo-Json -Compress)"
}
