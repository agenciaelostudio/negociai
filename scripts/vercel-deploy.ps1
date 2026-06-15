Set-Location "D:\AGENTES_AI\projetos\negociai"

$npxExe = "C:\Program Files\nodejs\npx.cmd"
$out = "D:\vercel-deploy-stdout.txt"
$err = "D:\vercel-deploy-stderr.txt"

Write-Host "Iniciando deploy na Vercel (Producao)..."

$p = Start-Process -FilePath $npxExe `
  -ArgumentList "vercel", "--prod", "--yes" `
  -WorkingDirectory "D:\AGENTES_AI\projetos\negociai" `
  -RedirectStandardOutput $out `
  -RedirectStandardError $err `
  -Wait -PassThru -NoNewWindow

Write-Host "=== EXIT CODE: $($p.ExitCode) ==="
Write-Host "=== STDOUT ==="
if (Test-Path $out) { Get-Content $out }
Write-Host "=== STDERR ==="
if (Test-Path $err) { Get-Content $err }
