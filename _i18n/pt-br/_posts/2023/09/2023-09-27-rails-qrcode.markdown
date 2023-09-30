---

layout: post
title: "Rails QR Code"
date: 2023-09-27
short_description: "Neste artigo de leitura rápida vamos implementar o uso de QR Code para uma lista de contatos."
cover: https://i.ibb.co/mCgW0Fx/Tab-Rails-Qrcode.gif
categories:
- Tutorial
tags:
- Ruby On Rails
- Useful Gems
---

# Rails QR Code
Neste artigo de leitura rápida vamos implementar o uso de QR Code para uma lista de contatos.



Nos dias de hoje os QR Code (Quick Response Code) facilitam a vida de muitas pessoas. 

É tão comum, que nem percebemos o quão implicito eles estão em nosso dia a dia, para citar alguns exemplos:
- Cardápio Digital
- Pagamentos
- Wi-Fi
- Check-in
- Correspondências
- Realidade Aumentada
- E a lista continua...  

Ao se deparar com a imagem de um QR Code, é possível que você pense: como é possível que um monte de pixels aleatórios possam conter informações?

Bem, se você tiver curiosidade técnica, sugiro que pesquise a respeito da [ISO/IEC 18004:2015](https://www.iso.org/standard/62021.html).

Mas pra facilitar, posso te explicar de uma forma resumida, ao criar um QR Code, a informação é convertida e armazenada em uma matriz bidimensional. Essa matriz é então convertida em uma imagem, que pode ser lida por um leitor de QR Code. 

A sua principal diferença entre um código de barras e um QR Code, é que o QR Code pode armazenar muito mais informações, e também pode ser lido em qualquer direção, enquanto o código de barras só pode ser lido na horizontal.

Portanto, vamos implementar uma aplicação Rails simples para demonstrar o uso de QR Code.

## Criando a aplicação 
Em seu terminal, execute o comando abaixo para criar uma nova aplicação Rails:

```bash
rails new rails-qrcode --css=tailwind
```

Agora, vamos criar um scaffold para o nosso modelo de contato:

```bash
rails g scaffold Contact name:string email:string phone:string
```

Em seguida, vamos definir as rotas da aplicação para que a página inicial seja a lista de contatos:

```ruby
# config/routes.rb
Rails.application.routes.draw do
  root to: 'contacts#index'
  resources :contacts
end
```

## Implementando a Funcionalidade

Para implementar a funcionalidade de QR Code, vamos utilizar a gem [rqrcode](https://github.com/whomwah/rqrcode).

Em `Gemfile`, adicione as linhas:

```ruby
# rqrcode [https://github.com/whomwah/rqrcode].
gem "rqrcode", "~> 2.0"
```

Salve o arquivo, e execute `bundle` para instalar a gem.

Como o QR Code gerado será salvo em PNG, vamos utilizar recursos de ActiveStorage para armazenar o arquivo.

Em seu terminal execute:

```bash
rails active_storage:install
```
e em seguida:

```bash
rails db:migrate
```

Com isto feito, vamos definir que cada Contato pode ter um QR Code.
Em `app/models/contact.rb`, adicione a linha:

```ruby
# app/models/contact.rb
class Contact < ApplicationRecord
  has_one_attached :qrcode
end
```

Certo, as coisas começam a ficar interessante a partir de agora. 

Esta funcionalidade irá gerar um QR Code para cada contato, portanto, cada imagem deve ser única e ser gerada automaticamente quando um novo contato for criado.

Para que isto aconteça, vamos alterar o modelo conforme o código abaixo:

```ruby
class Contact < ApplicationRecord
  include Rails.application.routes.url_helpers

  has_one_attached :qrcode, dependent: :destroy

  before_commit :generate_qrcode, on: :create

  private

  def generate_qrcode
    # Generate QR Code
    # qrcode = RQRCode::QRCode.new("http://localhost:3000/contacts/#{self.id}")
    qrcode = RQRCode::QRCode.new(contact_url(self))
    # Convert QR Code the PNG file
    png = qrcode.as_png(
      size: 200
    )
    # Attach the PNG to the model
    self.qrcode.attach(
      io: StringIO.new(png.to_s),
      filename: "qrcode.png",
      content_type: "image/png"
    )
  end
end
```	

Vamos fazer uma pausa para entender o que está acontecendo aqui. 

A instrução `before_commit` é executada antes de um registro ser salvo no banco de dados.

O método `generate_qrcode` é responsável por fazer a mágica acontecer. 

`RQRCode::QRCode.new` recebe a URL do contato como parâmetro, e gera a matriz com os dados, retornando os dados em formato `RQRCode::QRCode`.

O parâmetro deste método poderia ser escrito de forma concatenada (conforme linha comentada), mas para boas práticas vamos utilizar `contact_url` que é fornecido pelo UrlHelper de Rails.
Para que isto esta acessível no modelo, é necessário incluir o módulo `Rails.application.routes.url_helpers` no topo do arquivo.

Certo, agora com nosso qrcode gerado, vamos converter isto para png. 

Para fazer isto, utilizamos o método `.as_png` que recebe como parâmetro o tamanho da imagem.

Vale destacar que o método `.as_png` retorna um objeto `ChunkyPNG::Image`, e que é possível informar mais argumentos para este método. (Consulte a [documentação](https://github.com/whomwah/rqrcode))


# Importante
O objeto **ChunkyPNG::Image é uma representação em memória de uma imagem PNG**. Quando você chama o método `.as_png`, ele retorna uma `string` de bytes que representa a imagem PNG. 

Por último, o PNG é anexado ao modelo através do método `attach`. Neste caso, `self` é representa o contato que esta sendo criado, `qrcode` seu atributo, e `attach` o método que anexa o arquivo.

Os parametros `io`, `filename` e `content_type` são necessários para que o ActiveStorage possa salvar o arquivo. 
Mas uma pergunta pode surgir: 

> Por que estamos utilizando `StringIO.new` e não `File.open` ou `File.new`?


A resposta para isto é porque `File.open` ou `File.new` seria usado se você tivesse um arquivo físico no sistema de arquivos que você queria abrir e ler. 
No entanto, neste caso, a imagem PNG já está em memória como uma string de bytes, então não há necessidade de um arquivo físico.

Portanto, o que está sendo passado para o `StringIO.new` é a string de bytes que representa a imagem PNG. 

Isso permite que ActiveStorage crie a imagem diretamente da memória, em vez de ter que escrevê-los em um arquivo físico primeiro e depois fazer a leitura do mesmo.

Por fim, este método será executado para todos contatos que forem criados, e um único QR Code será gerado para cada um deles.

## Exibindo o QR Code

Para exibir o QR Code, vamos utilizar o método `image_tag` do Rails.

Em `app/views/contacts/_contact.html.erb`, adicione o código logo em seguida de *email*:

```erb
<p class="my-5">
  <strong class="block font-medium mb-1">QR Code:</strong>
  <%= image_tag(contact.qrcode) %>
</p>
```

Para testar se tudo esta funcionando, vamos iniciar o servidor e criar um novo registro.

```bash
./bin/dev
```

O resultado deverá ser conforme o gif abaixo:
<img src="https://i.ibb.co/mCgW0Fx/Tab-Rails-Qrcode.gif">

## Conclusão
Ao escanear o QR Code, o link para o contato será aberto no navegador.

Portanto, adicionar a funcionalidade de QR Code em sua aplicação é muito simples, e pode ser feito em poucos minutos.
Neste artigo, utilizamos o link do contato como QR Code, mas você pode utilizar a informação que desejar. 

Espero que este artigo tenha sido útil para você.

Vale lembrar que este QR Code ficará hospedado em seu servidor, e que você pode utilizá-lo para diversas finalidades.
Neste cenário, como o link esta associado ao `id` do contato, é possível realizar alterações no registro, como por exemplo, alterar o nome do contato, que o QR Code continuará funcionando.

## Extra - Gerando Link Personalizado

Até o momento, a aplicação esta utilizando o link baseado em `id`, isto é: **http://127.0.0.1:3000/contacts/2**, mas você pode utilizar o link baseado em slug, algo como **http://127.0.0.1:3000/contacts/john-doe**.

Para isto, é necessário fazer algumas alterações no código. 

No arquivo `config/routes.rb` modifique o código para: 

```ruby
Rails.application.routes.draw do
  root to: 'contacts#index'
  resources :contacts, except: %i[show]
  get 'contacts/:slug', to: 'contacts#show'
end
```
Agora, em `app/controllers/contacts_controller.rb`, modifique o código para:

```ruby
class ContactsController < ApplicationController
  before_action :set_contact, only: %i[ edit update destroy ]
  before_action :set_contact_by_slug, only: %i[ show ]

  # ... index, show, new, edit - nothing change.

  # POST /contacts or /contacts.json
  def create
    @contact = Contact.new(contact_params)

    respond_to do |format|
      if @contact.save
        format.html { redirect_to contact_url(@contact.name.parameterize), notice: "Contact was successfully created." }
        format.json { render :show, status: :created, location: @contact }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @contact.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /contacts/1 or /contacts/1.json
  def update
    respond_to do |format|
      if @contact.update(contact_params)
        format.html { redirect_to contact_url(@contact.name.parameterize), notice: "Contact was successfully updated." }
        format.json { render :show, status: :ok, location: @contact }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @contact.errors, status: :unprocessable_entity }
      end
    end
  end

  # ... destroy - nothing change.

  private
   
    #... set_contact, contact_params - nothing change.

    def set_contact_by_slug
      name = params[:slug].tr('-', ' ').downcase
      @contact = Contact.find_by('lower(name) = ?', name)
    end

end
```

Para finalizar, em `app/views/contacts/_contact.html.erb`, altere o `link_to` de 'Show this contact' para: 

```erb  
<%= link_to "Show this contact", contact_path(contact.name.parameterize), class: "rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
```

Em `app/views/contacts/show.html.erb`, faça a mesma alteração, substituindo o `link_to` de 'Show this contact' para: 


```erb
<%= link_to "Show this contact", contact_path(@contact.name.parameterize), class: "ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
```

E para que o QR Code seja gerado corretamente, em `app/models/contact.rb`, altere o código para:

```ruby
# Generate QR code
qrcode = RQRCode::QRCode.new(contact_url(self)) # http://localhost:3000/contacts/1
```

Para:

```ruby
# Generate QR code
qrcode = RQRCode::QRCode.new(contact_url(self.name.parameterize)) # http://localhost:3000/contacts/john-doe
```

Lembre-se também de adicionar uma validação de segurança, para que não seja possível criar dois contatos com o mesmo nome, e também modificar o `before_commit` com a ação `:update`, para que o QR Code seja atualizado sempre que o nome do contato for alterado.

```ruby
# app/models/contact.rb
before_commit :generate_qrcode, on: [:create, :update]
validates :name, presence: true, uniqueness: true
```

Pronto!, Agora ao criar ou editar um registro, um novo QR Code será gerado com base no Slug, enquanto as demais ação continuam funcionando normalmente.


--- 

> ### Link do Repositório:
> ## [*lucasgeron/rails-qrcode*](https://github.com/lucasgeron/rails-qrcode)

--- 
#### **Gostou deste projeto?** *Deixe seu feedback!* 


