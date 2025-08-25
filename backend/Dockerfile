FROM php:8.2-apache

# Instalar Node.js, npm e sudo
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs sudo

WORKDIR /var/www/html
COPY . .

# Instalar o Surge globalmente
RUN npm install -g surge

# Configurar sudo sem senha para www-data executar scripts como root
RUN echo "www-data ALL=(root) NOPASSWD: /var/www/html/deploy.sh" >> /etc/sudoers

# Dar permissões corretas para todos os arquivos
RUN chmod +x /var/www/html/deploy.sh \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Habilitar CORS e módulos necessários
RUN a2enmod headers \
 && echo '<Directory /var/www/html>\n\
    Header set Access-Control-Allow-Origin "*"\n\
</Directory>\n' > /etc/apache2/conf-available/cors.conf \
 && a2enconf cors \
 && a2enmod rewrite

EXPOSE 80