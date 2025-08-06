FROM php:8.2-apache

WORKDIR /var/www/html
COPY . .

# Habilitar CORS e módulos necessários
RUN a2enmod headers \
 && echo '<Directory /var/www/html>\n\
    Header set Access-Control-Allow-Origin "*"\n\
</Directory>\n' > /etc/apache2/conf-available/cors.conf \
 && a2enconf cors \
 && a2enmod rewrite \
 && chown -R www-data:www-data /var/www/html \
 && chmod -R 755 /var/www/html

EXPOSE 80
