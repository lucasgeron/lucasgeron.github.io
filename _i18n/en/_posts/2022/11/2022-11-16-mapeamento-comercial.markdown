---
layout: post
title:  AppSheet - Comercial Mapping
date:   2022-11-16
short_description: Application developed as a prototype for mapping clients and graduating classes for the Cross Formaturas company
cover: /assets/images/covers/all/mapeamento-comercial.png
labels: AppSheet, Spreadsheets.gs, WebApp
---


# Comercial Mapping (Mapeamento Comercial)
![version](https://img.shields.io/badge/version-1.0-blue)

Application developed as a prototype for mapping clients and graduating classes for the Cross Formaturas company

<div>
  <a href="https://www.appsheet.com/templates/Sistema-de-Intelig%C3%AAncia-Comercial-para-Empresas-de-Formaturas?appGuidString=a9436ec2-a586-494d-8352-bf38b8efe3af" target="_blank" class="text-decoration-none">
  <img src="/assets/images/covers/pt-br/mapeamento-comercial.png" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
  </a>
</div>

Develop and monitor the sales strategy of the commercial team through an application for collective use.

This project is an app builded on AppSheet and has the main objective of mapping the classes of students and new client by a simple way.

This project was developed to a company who works with graduations party in brazil. 
This repository is a empty sample of the app.

## [LIVE DEMO - Mapeamento Comercial Sample](https://www.appsheet.com/templates/Sistema-de-Intelig%C3%AAncia-Comercial-para-Empresas-de-Formaturas?appGuidString=a9436ec2-a586-494d-8352-bf38b8efe3af)

----


# Instalation Guide: 

- Create a new Stand alone script in Google Apps Script
- Import 'Scripts/script.gs' into the new stand alone script.
- Replace the 'DB_ID' to your database sheet id.
- Check the [Mapeamento Comercial Sample](https://www.appsheet.com/templates/Sistema-de-Intelig%C3%AAncia-Comercial-para-Empresas-de-Formaturas?appGuidString=a9436ec2-a586-494d-8352-bf38b8efe3af) App and make a copy of it. 
- In AppSheet, configure the "Script.gs" as script source in *automations* functions
- Remeber to edit your share settings, branding info and all other configurations.
- Deploy your app. Enjoy it. 

### Final adjustiments...

Setting your Images Routes
For 'Empresas'
- Upload the folders "Empresas_Images" to your Goggle Drive Root Folder.
- In AppSheet, Data/Tabuleiros/Columns/ search for 'Empresa Logo', edit it, and set the path to the image in your Google Drive Root Folder as default directory.

For 'Representantes'
- Upload the folders "Representantes_Images" to your Goggle Drive Root Folder.
- In AppSheet, Data/Representantes/ click 'View Source', go to the sheet 'Representates' and set the path to image in column 'avatar'.

For 'Instituições'
- Upload the folders "Instituições_Images" to your Goggle Drive Root Folder.
- In AppSheet, Data/Instituições/ click 'View Source', go to the sheet 'Instituições' and set the path to image in column 'logo'.

### Remember

Update the list of emails on automations tasks to recive notifications as well.
