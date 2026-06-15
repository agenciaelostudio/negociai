# Sobe o Next.js local na pasta do projeto (Windows / drive D:).
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Pasta: $(Get-Location)" -ForegroundColor Cyan

$port = 3000
Write-Host "Encerrando servidores node antigos..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

if (Test-Path ".next") {
  Write-Host "Limpando cache .next (evita Internal Server Error)..." -ForegroundColor Yellow
  Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
}

$inUse = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($inUse) {
  Write-Host "Porta $port ainda em uso. Aguarde ou reinicie o PC." -ForegroundColor Red
}

Write-Host ""
Write-Host "Iniciando servidor... Aguarde aparecer 'Ready'." -ForegroundColor Green
Write-Host "Depois abra: http://localhost:$port" -ForegroundColor Green
Write-Host "(Se aparecer outra porta no terminal, use essa URL.)" -ForegroundColor DarkGray
Write-Host ""

npm run dev
