# 📋 Levantamento de Requisitos – Projeto Totem Digital

## 🎯 Objetivo

Desenvolver uma aplicação web que será exibida em uma Smart TV, com o propósito de divulgar preços de carnes e promoções semanais de forma visualmente atrativa, sem necessidade de interação do usuário.

## 🖥️ Requisitos Funcionais (RF)
> Código	Descrição

- RF01	Exibir lista de produtos divididos em categorias: bovinos, suínos e aves.
- RF02	Dividir a categoria de bovinos em duas tabelas distintas para melhor aproveitamento de layout.
- RF03	Alternar automaticamente entre dois slides: um com as tabelas de preços e outro com a logo da empresa e data/hora.
- RF04	Tempo de exibição dos slides: 45s para tabela, 10s para logo/data/hora.
- RF05	Exibir uma área de destaque com "Oferta da Semana", trocando automaticamente a cada 10 segundos.
- RF06	Carregar produtos e ofertas a partir de um script embutido (script.js).
- RF07	Atualizar a data e hora em tempo real no slide da logo.
- RF08	Garantir compatibilidade com navegador embutido de Smart TVs (sem plugins ou dependências externas).

## 🎨 Requisitos Não Funcionais (RNF)
> Código	Descrição

- RNF01	A aplicação deve funcionar sem internet após carregada (offline-friendly).
- RNF02	Layout responsivo para adaptação ao formato widescreen da TV (16:9).
- RNF03	Interface deve ser legível a distância (fontes grandes, contraste elevado, cores vibrantes).
- RNF04	Código deve ser leve, com carregamento rápido mesmo em TVs com hardware limitado.
- RNF05	Todas as imagens (produtos, fundo, logo) devem estar incluídas localmente no projeto.

## ⚙️ Requisitos de Manutenção
> Código	Descrição

- RM01	Os preços e nomes dos produtos serão atualizados pelo técnico responsável.
- RM02	Organização de pastas e arquivos clara: separar HTML, CSS, JS e imagens.