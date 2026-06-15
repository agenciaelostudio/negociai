Set-Location "D:\AGENTES_AI\projetos\negociai"

$gitExe = "C:\Program Files\Git\cmd\git.exe"
$out = "D:\git-push-stdout.txt"
$err = "D:\git-push-stderr.txt"

# Garantir safe.directory
& $gitExe config --global --add safe.directory "D:/AGENTES_AI/projetos/negociai" 2>&1 | Out-Null
& $gitExe config --global --add safe.directory "*" 2>&1 | Out-Null

# Configurar usuario
Write-Host "Configurando usuario Git..."
& $gitExe config user.email "agenciaelostudio@gmail.com" 2>&1 | Out-Null
& $gitExe config user.name "David" 2>&1 | Out-Null

# Adicionar todos os arquivos e commitar
Write-Host "Adicionando todos os arquivos..."
& $gitExe -C "D:\AGENTES_AI\projetos\negociai" add -A 2>&1

Write-Host "Commitando..."
& $gitExe -C "D:\AGENTES_AI\projetos\negociai" commit -m "fix: resolve o redirecionamento de callback usando NEXT_PUBLIC_SITE_URL" 2>&1

# Push
Write-Host "Fazendo push..."
$p = Start-Process -FilePath $gitExe `
  -ArgumentList "-C", "D:\AGENTES_AI\projetos\negociai", "push", "origin", "master:main", "--force", "--verbose" `
  -RedirectStandardOutput $out `
  -RedirectStandardError $err `
  -Wait -PassThru -NoNewWindow

Write-Host "=== EXIT CODE: $($p.ExitCode) ==="
Write-Host "=== STDOUT ==="
if (Test-Path $out) { Get-Content $out }
Write-Host "=== STDERR ==="
if (Test-Path $err) { Get-Content $err }
