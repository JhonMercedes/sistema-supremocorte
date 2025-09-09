#!/bin/bash

DOMAIN="supremocorteteste.surge.sh"
DIST="./publicar"

# Limpa e cria pasta para publicação (com sudo para evitar permission denied)
rm -rf $DIST
mkdir -p $DIST

# Copia produtos.json do próprio backend
cp /var/www/html/produtos.json $DIST/

# Baixa arquivos do frontend via HTTP
echo "Baixando arquivos do frontend..."

# Tenta diferentes métodos para o index.html
echo "Tentando baixar index.html..."

# Método 1: Seguir redirects automaticamente
curl -L -v http://172.21.0.3:80/index.html -o $DIST/index.html

# Debug: mostra o que foi baixado
echo "Tamanho do arquivo baixado:"
ls -la $DIST/index.html

# Método 2: Tentar diretamente /index (sem .html)
if [ ! -s "$DIST/index.html" ]; then
    echo "Tentando baixar de /index..."
    curl -L -v http://172.21.0.3:80/index -o $DIST/index.html
fi

# Método 3: Forçar como HTML
if [ ! -s "$DIST/index.html" ]; then
    echo "Tentando com Content-Type específico..."
    curl -L -H "Accept: text/html" -v http://172.21.0.3:80/ -o $DIST/index.html
fi

# Verifica novamente
if [ ! -s "$DIST/index.html" ]; then
    echo "Falha ao baixar index.html"
    exit 1
fi

curl -s http://172.21.0.3:80/style.css -o $DIST/style.css  
curl -s http://172.21.0.3:80/script.js -o $DIST/script.js

# Cria pasta de imagens
mkdir -p $DIST/imagens
# Baixa imagens específicas se necessário
curl -s http://172.21.0.3:80/imagens/logo.png -o $DIST/imagens/logo.png || echo "logo.png não encontrada"

# Configurar surge sem prompt (temporário para teste)
# export SURGE_LOGIN="seu_email@gmail.com"
# export SURGE_TOKEN="seu_token_aqui"

# Verifica se o Surge está instalado
if ! command -v surge &> /dev/null; then
    echo "Instalando Surge..."
    npm install -g surge
fi

# Publica no Surge (usando --domain para evitar prompt)
echo "Publicando no Surge..."
surge teardown $DOMAIN || true

# Usa surge com parâmetros para evitar prompt
echo "Fazendo deploy para $DOMAIN..."
surge $DIST --domain $DOMAIN

echo "Deploy concluído! Site disponível em: https://$DOMAIN"