---
layout: post
title:  SenderApp for WhatsApp
date:   2022-11-15 14:47:51 -0300
short_description: Send hundreds of personalized text messages in minutes without adding contacts to your mobile device with SenderApp for WhatsApp.
cover: https://mir-s3-cdn-cf.behance.net/project_modules/fs/384f5f157902067.63815a43aa8e8.png
labels: Bot, GAS, Python, Spreadsheets.gs, WhatsApp API
---


![](https://mir-s3-cdn-cf.behance.net/project_modules/fs/3c18ec157902067.63815a43a623d.png){: .img-fluid}
![](https://mir-s3-cdn-cf.behance.net/project_modules/fs/4c62a7157902067.63815a43a9672.png){: .img-fluid}
![](https://mir-s3-cdn-cf.behance.net/project_modules/fs/cd92bc157902067.63815a43a8524.png){: .img-fluid}
![](https://mir-s3-cdn-cf.behance.net/project_modules/fs/88b3a8157902067.63815a43a7426.png){: .img-fluid}
![](https://mir-s3-cdn-cf.behance.net/project_modules/fs/0f5063157902067.63815a43a3f17.png){: .img-fluid}
<!-- ![](https://mir-s3-cdn-cf.behance.net/project_modules/fs/79736e157902067.63815a43a50ac.png){: .img-fluid} -->
![](https://mir-s3-cdn-cf.behance.net/project_modules/fs/d4837c157902067.63815a43aba5f.png){: .img-fluid}

# SenderApp for WhatsApp

##### Server Specifications:  
![](https://img.shields.io/static/v1?label=Hosted%20on&message=Google%20Apps%20Scripts%20%2F%20Google%20Cloud%20Project&color=important)

##### Client Specifications:
![](https://img.shields.io/static/v1?label=SenderApp&message=v1.1&color=blue) ![](https://img.shields.io/static/v1?label=Python&message=v.3.7&color=brightgreen)


**SenderApp for WhatsApp* is a batch messaging bot that allows you to send up to **100 text messages** in a few seconds, **every hour**.

> Misuse of this tool may result in the banning of your WhatsApp account. It is recommended to read the Technical Article [How WhatsApp Fights Bulk Messaging and Automated Behavior](https://scontent.fgpb4-1.fna.fbcdn.net/v/t39.8562-6/299842918_397263792546125_6219151513993243581_n.pdf?_nc_cat=107&ccb=1-7&_nc_sid=ae5e01&_nc_ohc=Rmmm-0GP-bIAX_2WITo&_nc_ht=scontent.fgpb4-1.fna&oh=00_AfCAG5ZpQQEYz8hy2L-Ca2bHU8bU3jwmRYomsLcgehQ8og&oe=636A5C8A).

## How to Use

A version of the service, hosted on Google (WebApps) is used as the application's communication server.

To use the service, simply [create your account](https://script.google.com/macros/s/AKfycbyyVrXZ2nmgwuPBcrrL2OWQWVbLKf_PkVWNIXT_kZ4UAgkhk0HrGxm7MgvxVtMx9PePjg/exec?a=r) and follow the recommended guidelines.

**TIP**: If you want more information about the product or how to install it, it is recommended to read the [help](https://script.google.com/macros/s/AKfycbyyVrXZ2nmgwuPBcrrL2OWQWVbLKf_PkVWNIXT_kZ4UAgkhk0HrGxm7MgvxVtMx9PePjg/exec?a=h) section.

---

> **IMPORTANT**: If you want to implement your own server instead of using the version mentioned above, follow the instructions available in './scripts/more-info.md'

## Next Steps - Spreadsheet

After completing your registration, a google spreadsheet will be shared with your email address.

#### Spreadsheet Settings
The spreadsheet settings menu is hidden by default. To access it, click on the menu button on the spreadsheet tabs and select the "Settings" spreadsheet. All settings have notes with guidelines.

#### Variable Data
The SenderApp allows the use of `02 Variable Data`, being `@Nome` and `@Info`.
**Tip**: The capital letter of the variable must be respected so that it is correctly replaced.

#### Configuring Message
The message to be sent must be entered in `'Messages!A3'` of the spreadsheet.
The message can contain a maximum size of characters, and if it exceeds this limit, the cell will turn red and the bot cannot be started.

The messages are only in `TEXT` format and can contain `links` and `text formatting`.
**Tip**: To break a line in the message body, use the `'ctrl' + 'enter'` shortcut.

---

**IMPORTANT**: For everything to work correctly, all data from the **Message** and **Contacts** spreadsheets must be formatted as `Plain Text`. When pasting information from other data sources, check if the data is formatted in plain text.


 ## Next Steps - SenderApp Desktop

After [downloading the application](https://mega.nz/file/xcpnkZqb#stGI2EibhJ7b3rmou6reKFLXrxI5cpuy6v6alyDV8kU), don't forget to **run it as an administrator.**

Complete the configuration by entering your `email` and your `activation token`.
**Tip**: Your activation token is sent to your email when you complete your registration.

### SenderApp.conf
To change the registered email address, you can either delete the configuration file and make a new configuration, or just change it with notepad.

     C:\Program Files\Common Files\SenderApp.conf

## Next Steps - First Shipment

It is necessary to have WhatsApp Desktop installed and open on your computer.
Don't worry, the first shipment will be sent to a test number prepared to receive these messages.

With WhatsApp logged in, ready to be used, and SenderApp running simultaneously, just click on **`Start Shipping`**. Remember, you need to run as an administrator for the bot to actually send the messages.

When the shipment is finished, a success message will be displayed and you will have used `10 quotas`.

# Message Quotas
As a way to limit the misuse of the tool, a shipping quota system is established, where the rules are
- Each user has `100 quotas by default`.
- **Each message sent, where the shipping request is successfully made, regardless of the response to the request, consumes** `01 quota`.
- For the bot to start, it is necessary to have at least `10 valid numbers` in your contact list.
- The *SenderApp for WhatsApp* Server recycles `02 quotas every minute`. Therefore, it is not necessary to wait 01 hour necessarily to make the next shipment, just have at least 10 available quotas and valid contacts to make shipments more frequently.
- The server does not have secure authentication, such as oAuth or Authentication APIs, when making a request to the server, your **email** and **token** are validated before having their data returned to the application. Although it is not completely secure authentication, the message is sent by the number that is logged into WhatsApp Desktop, that is, it would not make sense for someone else to send your message from another number, considering that only you have access to the spreadsheet and can edit the message.


# Roadmap - Future Implementations:

 - [ ] Image Sending
 - [ ] Audio Sending
 - [ ] Scheduled / Programmed Shipments - with Notifications
