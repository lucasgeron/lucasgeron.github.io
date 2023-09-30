---
layout: post
title:  Mapeamento Comercial
date:   2022-11-16
short_description: Aplicativo desenvolvido como protótipo para mapeamento de clientes e turmas de formandos para a empresa Cross Formaturas.
cover: /assets/images/covers/all/mapeamento-comercial.png
categories: 
- Portfolio
- Product
tags:
- Spreadsheet
- App Sheet
---


# Mapeamento-Comercial

Aplicativo desenvolvido como protótipo para mapeamento de clientes e turmas de formandos para a empresa Cross Formaturas.

<div>
  <a href="https://www.appsheet.com/templates/Sistema-de-Intelig%C3%AAncia-Comercial-para-Empresas-de-Formaturas?appGuidString=a9436ec2-a586-494d-8352-bf38b8efe3af" target="_blank" class="text-decoration-none">
  <img src="/assets/images/covers/pt-br/mapeamento-comercial.png" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
  </a>
</div>

Desenvolva e monitore a estratégia de vendas da equipe comercial por meio de um aplicativo para uso coletivo.

Este projeto é um aplicativo construído no AppSheet e tem como principal objetivo mapear as turmas de alunos e novos clientes de maneira simples.

Este projeto foi desenvolvido para uma empresa que trabalha com festas de formatura no Brasil.
Este repositório é uma amostra vazia do aplicativo.

### [VERSÃO DEMO - Amostra Comercial de Mapeamento](https://www.appsheet.com/templates/Sistema-de-Intelig%C3%AAncia-Comercial-para-Empresas-de-Formaturas?appGuidString=a9436ec2-a586-494d-8352-bf38b8efe3af)

-----

# Guia de instalação:

- Crie um novo script autônomo no Google Apps Script
- Importe 'Scripts/script.gs' para o novo script autônomo.
- Substitua o 'DB_ID' pelo ID da planilha do seu banco de dados.
- Verifique o aplicativo [Amostra Comercial de Mapeamento](https://www.appsheet.com/templates/Sistema-de-Intelig%C3%AAncia-Comercial-para-Empresas-de-Formaturas?appGuidString=a9436ec2-a586-494d-8352-bf38b8efe3af) e faça uma cópia dele.
- No AppSheet, configure o "Script.gs" como fonte do script nas funções *automações*
- Lembre-se de editar suas configurações de compartilhamento, informações de marca e todas as outras configurações.
- Implante seu aplicativo. Aproveite.

### Ajustes finais ...

Configurando suas rotas de imagens
Para 'Empresas'
- Faça o upload das pastas "Empresas_Images" para a pasta raiz do seu Goggle Drive.
- No AppSheet, Data/Tabuleiros/Columns/ procure por 'Empresa Logo', edite-o e defina o caminho para a imagem na pasta raiz do seu Google Drive como diretório padrão.

Para 'Representantes'
- Faça o upload das pastas "Representantes_Images" para a pasta raiz do seu Goggle Drive.
- No AppSheet, Data/Representantes/ clique em 'Ver fonte', vá para a planilha 'Representates' e defina o caminho para a imagem na coluna 'avatar'.

Para 'Instituições'
- Faça o upload das pastas "Instituições_Images" para a pasta raiz do seu Goggle Drive.
- No AppSheet, Data/Instituições/ clique em 'Ver fonte', vá para a planilha 'Instituições' e defina o caminho para a imagem na coluna 'logo'.

### Lembre-se

Atualize a lista de emails nas tarefas de automação para receber notificações também.
