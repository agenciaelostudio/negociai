#!/bin/bash
# ============================================
# setup-vps.sh — Configuração inicial da VPS
# ============================================
# Uso: ssh root@SEU_IP 'bash -s' < setup-vps.sh
# ============================================
set -euo pipefail

echo "============================================"
echo "  NegociAí — Setup VPS"
echo "============================================"

# 1. Atualizar sistema
echo "[1/5] Atualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar Docker + Compose
echo "[2/5] Instalando Docker..."
curl -fsSL https://get.docker.com | bash
systemctl enable docker
systemctl start docker

# 3. Criar usuário para deploy (opcional)
echo "[3/5] Criando diretorio do app..."
mkdir -p /opt/negociai

# 4. Firewall básico
echo "[4/5] Configurando firewall..."
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw --force enable

# 5. Verificar instalação
echo "[5/5] Verificando..."
docker --version
docker compose version

echo ""
echo "============================================"
echo "  Setup concluido!"
echo "============================================"
echo ""
echo "Proximos passos:"
echo "  1. scp -r ./negociai root@SEU_IP:/opt/negociai/"
echo "  2. ssh root@SEU_IP"
echo "  3. cd /opt/negociai"
echo "  4. cp .env.production.template .env.production"
echo "  5. nano .env.production   # preencher variaveis"
echo "  6. docker compose up -d"
echo "  7. docker compose logs -f"
