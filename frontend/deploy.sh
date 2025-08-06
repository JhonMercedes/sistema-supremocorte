#!/bin/bash

DOMAIN="supremocorteteste.surge.sh"
DIST="./publicar"
CONTAINER_ID="b82bdb65ad0a" 

# Limpa e cria pasta para publicação
rm -rf $DIST
mkdir -p $DIST

# Baixa a versão atualizada dos produtos direto para a pasta
curl -s http://172.21.0.2:80/produtos.json -o $DIST/produtos.json

# Copia arquivos do front
cp index.html $DIST/
cp style.css $DIST/
cp script.js $DIST/
cp -r imagens $DIST/

# Publica no Surge
surge teardown $DOMAIN || true
surge $DIST $DOMAIN
