# Configura variáveis de ambiente na Vercel (Production).
# Execute na pasta do projeto, após: npx vercel login
#
# Uso:
#   $env:ASAAS_API_KEY = "sua_chave_asaas"
#   .\scripts\setup-vercel-env.ps1

$ErrorActionPreference = "Stop"
$appUrl = "https://negociai-blue.vercel.app"

function Add-VercelEnv($name, $value) {
  if (-not $value) { Write-Warning "Pulando $name (vazio)"; return }
  Write-Host "Adicionando $name..."
  $value | npx --yes vercel@latest env add $name production --force
}

Add-VercelEnv "NEXT_PUBLIC_APP_URL" $appUrl
Add-VercelEnv "NEXT_PUBLIC_PRICE_BRL" "19.90"
Add-VercelEnv "ASAAS_ENV" "sandbox"

if ($env:ASAAS_API_KEY) {
  Add-VercelEnv "ASAAS_API_KEY" $env:ASAAS_API_KEY
} else {
  Write-Host ""
  Write-Host "Defina ASAAS_API_KEY antes de rodar, ou adicione no painel da Vercel."
}

if ($env:ACCESS_SECRET) {
  Add-VercelEnv "ACCESS_SECRET" $env:ACCESS_SECRET
} else {
  $secret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  Write-Host "Gerando ACCESS_SECRET..."
  Add-VercelEnv "ACCESS_SECRET" $secret
  Write-Host "Guarde este ACCESS_SECRET em local seguro: $secret"
}

if ($env:OPENAI_API_KEY) {
  Add-VercelEnv "OPENAI_API_KEY" $env:OPENAI_API_KEY
}

Write-Host ""
Write-Host "Concluido. Rode: npx vercel --prod"
