---

layout: post
title: "Select Dinâmico com Rails"
date: 2023-09-08
short_description: "Aprenda como implementar um select dinâmico com Rails e Hotwire. Neste tutorial te ensino a fazer isto do zero com um exemplo prático e muitos detalhes."
cover: https://i.ibb.co/fXTPZ6P/20230908-200356.gif
read_time: true
toc: true
github_repo: rails-dynamic-select
categories:
- Tutorial
tags:
- Ruby On Rails
- Hotwire Turbo
---

# Select Dinâmico com Rails

  <img src="https://i.ibb.co/1QcrgHP/20230908-192607.gif" alt="" class="">


## Introdução

Formulários dinâmicos são muito comuns em aplicações web e Rails nos fornece uma maneira muito simples de implementar isto.

Neste artigo, vou te ensinar como implementar um select dinâmico com Rails e Hotwire. 

Para isto, vamos criar uma aplicação Rails simples, com cadastro de autores e artigos e coleções. 

O usuário poderá adicionar/remover artigos a coleção, filtrando os artigos por autor antes de adicioná-los.


## Criando o Projeto

Em seu ambiente de Trabalho execute o comando abaixo para criar um novo projeto Rails:
```bash
rails new rails-dynamic-select --css=tailwind 
```

Em seguida, acesse a pasta do projeto com o comando:
```bash
cd rails-dynamic-select
```

## Criando os Modelos

Os modelos da aplicação serão:
- **Author**, contendo apenas o atributo *name*
- **Article**, contendo os atributos *title* e a referencia para o modelo **Author**
- **Collection**, contendo apenas o atributo *title*


Para criar os modelos, execute os comandos abaixo:
```bash
rails g scaffold Author name:string --no-jbuilder

rails g scaffold Article title:string author:references --no-jbuilder

rails g scaffold Collection title:string --no-jbuilder
```
Considere que uma coleção pode conter vários artigos e um artigo pode pertencer a várias coleções, portanto também precisamos criar uma tabela de relacionamento entre as duas tabelas e por fim, realizar as associações entre as classes.

Para criar a tabela de relacionamento, execute o comando abaixo:
```bash
rails g migration CreateArticlesCollections article:references collection:references
```

Em ***app/models/author.rb*** adicione o código abaixo:
```ruby
class Author < ApplicationRecord
  has_many :articles
end
```

Em ***app/models/collection.rb*** adicione o código abaixo:
```ruby
class Collection < ApplicationRecord
  has_and_belongs_to_many :articles
end
```

Em ***app/models/article.rb*** adicione o código abaixo:
```ruby
class Article < ApplicationRecord
  belongs_to :author
  has_and_belongs_to_many :collections
end
```

Para completar a criação dos modelos, execute o comando abaixo para criar as tabelas no banco de dados:
```bash
rails db:migrate
```

## Populando a Base de Dados

Como a intenção deste tutorial é demonstrar o select dinâmico, vamos criar alguns registros para popular o banco de dados diretamente no arquivo seed.

Abra o arquivo *db/seeds.rb* e adicione o código abaixo:
```ruby
author = Author.create(name: 'Albert Einstein')
Article.create(author: author, title: "Sobre a Teoria da Relatividade Especial")
Article.create(author: author, title: "A Natureza da Luz: Um Experimento de Pensamento")
Article.create(author: author, title: "Efeito Fotoelétrico: Uma Janela para a Física Quântica")
Article.create(author: author, title: "O Significado da E=mc²")
Article.create(author: author, title: "A Teoria da Relatividade Geral e a Curvatura do Espaço-Tempo")

author = Author.create(name: 'Charles Darwin')
Article.create(author: author, title: "A Origem das Espécies por Meio de Seleção Natural")
Article.create(author: author, title: "A Seleção Sexual e a Evolução das Características Secundárias")
Article.create(author: author, title: "A Descendência do Homem e a Seleção em Relação ao Sexo")
Article.create(author: author, title: "A Expressão das Emoções no Homem e nos Animais")
Article.create(author: author, title: "A Viagem do Beagle: Uma Aventura Científica")

author = Author.create(name: 'Marie Curie')
Article.create(author: author, title: "Descoberta dos Elementos Rádio e Polônio")
Article.create(author: author, title: "Radioatividade: Um Novo Fenômeno na Ciência")
Article.create(author: author, title: "Aplicações Médicas da Radioterapia")
Article.create(author: author, title: "A Vida e o Legado de Pierre Curie")
Article.create(author: author, title: "Contribuições para a Compreensão da Radioatividade")

Collection.create(title: 'Minha Coleção')
```

Em seguida, execute o comando abaixo para popular o banco de dados:
```bash
rails db:seed
```

## Iniciando a Aplicação

Antes de iniciarmos o servidor, vamos configurar as rotas da aplicação.

Em ***config/routes.rb*** defina o root da aplicação para o controller *collections* e a action *index*:
```ruby
Rails.application.routes.draw do
  root "collections#index"
  
  resources :collections
  resources :articles
  resources :authors

end
```

Em seguida, inicie o servidor com o comando abaixo:
```bash
./bin/dev 
```

Acesse a aplicação em http://localhost:3000 e você verá a tela abaixo:

  <img src="https://i.ibb.co/9GSkQHQ/Captura-da-Web-8-9-2023-181735-127-0-0-1.jpg" alt="" class="">


## Criando o Formulário Dinâmico

Agora que já temos a aplicação funcionando, vamos criar o formulário dinâmico. 

**Nota**: É válido lembrar que existem várias formas possível de implementar formulários com Rails, principalmente, formulários com relacionamentos entre tabelas. Tenha em mente que o objetivo deste tutorial é demonstrar como implementar um select dinâmico com Rails e Hotwire.

Em ***app/views/collections/*** crie a partial ***_articles_form.html.erb*** e adicione o código abaixo:
```erb
<%= form_with(url: add_article_collection_path(collection), class: "contents") do |form| %>

  <div class="my-5">
    <%= form.label :author %>
    <%= form.collection_select :author, Author.all, :id, :name, {prompt: ''} %>
  </div>

  <div class="my-5">
    <%= form.label :article_ids %>
    <%= form.collection_select :article_ids, Article.none, :id, :title, {prompt: ''}, {data: {collection_target: 'articles'}} %>
  </div>

  <div class="inline">
    <%= form.submit 'Add Article', class: "rounded-lg py-3 px-5 bg-blue-600 text-white inline-block font-medium cursor-pointer" %>
  </div>
  
<% end %>
```
Observe que o formulário em questão esta enviando os dados para a action *add_article* do controller *collections*. 

Neste tutorial, também faremos a remoção dos artigos da coleção. 

Portanto, vamos adicionar uma rota para a action add_article, e outra para remove_article do controller collections, que será implementado em seguida.


Em ***config/routes.rb*** edite a linha *resources :collections* conforme  o código abaixo:
```ruby
resources :collections do 
  post :add_article, on: :member
  delete :remove_article, on: :member
end
```

Em seguida, vamos adicionar uma teste para exibir o formulário ou o total de artigos da coleção, dependendo da requisição atual do usuário.

Em ***app/views/collections/_collection.html.erb*** adicione o código a seguir, logo após o título da coleção:
```erb
<p class="my-5">
  <strong class="block font-medium mb-1">Articles: </strong>
  <% if action_name =='show' %>
  <%= render partial: 'articles_form', locals: {collection: @collection} %>
  <% else %>
    <%= collection.articles.count %>
  <% end %>
</p>
```

Desta forma, na ação *index* será exibido o número total de artigos na coleção, enquanto na ação *show*, será exibido o formulário para adicionarmos artigos na coleção.


  <img src="https://i.ibb.co/cxhmgHQ/20230908-183630.gif" alt="" class="">


Observe que estamos populando apenas o select dos autores, enquanto o select de artigos esta vazio. Isso ocorre porque o select de artigos é dinâmico e será populado de acordo com o autor selecionado.

## Populando o Select de Artigos

Agora que já temos o formulário, vamos implementar a lógica para popular o select de artigos de acordo com o autor selecionado.

Para fazer vamos utilizar um controlador Stimulus que irá escutar o evento *change* do select de autores e enviar uma requisição para o servidor para obter os artigos do autor selecionado.

Para simplificar nosso código, iremos utilizar a Gem [requestjs-rails](https://github.com/rails/requestjs-rails)

Em ***Gemfile*** adicione a linha abaixo:
```ruby
gem 'requestjs-rails'
```

Em seguida, execute o comando abaixo para instalar a Gem:
```bash
bundle install
```

**Lembre-se de reiniciar o servidor após instalar a gem.**

Agora vamos criar o controlador stimulus.


Em ***app/javascript/controllers/***, crie o arquivo ***collection_controller.js*** adicione o código abaixo:
```javascript
import { Controller } from "@hotwired/stimulus"
import { get } from '@rails/request.js'

export default class extends Controller {

  connect() {
    // console.log("Hello from collection_controller!")
  }

  filter_articles(event) {
    let author_id = event.currentTarget.value
    let url = `/articles/filter?author_id=${author_id}`
    get(url, { responseKind: "turbo-stream"})
  }   
}
```

Observe que nossa url de requisição é `/articles/filter/`. Portanto, precisamos definir a rota para esta url.

Em ***config/routes.rb*** modifique a linha de *resources :articles* conforme o código abaixo:
```ruby
resources :articles do 
  get :filter, on: :collection
end 
```

Agora, vamos implementar a action *filter* do controller *articles*.

Em ***app/controllers/articles_controller.rb*** adicione o código abaixo:
```ruby
# GET /articles/filter
def filter
  @articles = Article.where(author_id: params[:author_id])
  respond_to do |format|
    format.turbo_stream
  end
end
```

Observe que nossa requisição espera um responseKind do tipo *turbo-stream*. Portanto, precisamos criar o template *filter.turbo_stream.erb* para retornar os dados no formato esperado.

Em ***app/views/articles/*** crie o arquivo ***filter.turbo_stream.erb*** e adicione o código abaixo:
```erb
<%= turbo_stream.update 'article_ids' do %>
  <%= options_from_collection_for_select @articles, :id, :title %>
<% end %>
```

Agora, vamos adicionar o controlador *collection_controller* ao select de autores.

Em ***app/views/collections/_articles_form.html.erb*** atualize a instrução de *form_with* com o data-attribute, *controller : collection*. 
```erb
<%= form_with(url: add_article_collection_path(collection), class: "contents", data: {controller: 'collection'}) do |form| %>
```

Para testar o controller esta funcionando corretamente, descomente o código da função *connect* do controller *collection_controller*, acesse a página da coleção e inspecione o console do navegador. A mensagem *Hello from collection_controller!* deve ser exibida.

Agora, no select do autor, vamos adicionar o data-attribute *action: change->collection#filter_articles*.
```erb
<div class="my-5">
  <%= form.label :author %>
  <%= form.collection_select :author, Author.all, :id, :name, {prompt: ''}, {data: {action: 'change->collection#filter_articles'}} %>
</div>
```

Desta forma, quando o usuário alterar o autor, o controlador *collection_controller* irá enviar uma requisição para o controlador *articles_controller* que irá popular o select de artigos com os artigos do autor selecionado.

Com o controlador stimulus configurado corretamente, o formulário deve popular os artigos conforme esperado.

  <img src="https://i.ibb.co/1QcrgHP/20230908-192607.gif" alt="" class="">

## Adicionando Artigos na Coleção

Para concluir o formulário, vamos implementar a lógica para adicionar artigos na coleção.

Em ***app/controllers/collections_controller.rb*** adicione o código abaixo:
```ruby
# POST /collections/1/add_article
def add_article
  @collection.articles << Article.find(params[:article_ids]) unless @collection.articles.include?(Article.find(params[:article_ids]))
  redirect_to collection_url(@collection)
end

# DELETE /collections/1/remove_article
def remove_article
  @collection.articles.delete(Article.find(params[:article_ids])) 
  redirect_to collection_url(@collection)
end
```

Além deste código, é necessário modificar mais duas linhas.

Na linha 2, precisamos adicionar o *before_action :set_collection* para que o método *set_collection* seja executado antes das actions *add_article* e *remove_article*.
```ruby
before_action :set_collection, only: %i[ show edit update destroy add_article remove_article]
```

e no método *collection_params* precisamos adicionar o atributo *article_ids*.
```ruby
def collection_params
  params.require(:collection).permit(:title, :article_ids)
end
```
Uma observação importante nesta etapa é que devido a implementação feita adicionar apenas um único artigo por vez a coleção, estamos permitindo o parâmetro :article_ids.
Em outros cenários onde é possível vincular uma coleção de elementos em uma única vez, é recomendado utilizar uma array de elementos, como article_ids: [ ].


## Listando e Removendo Artigos da Coleção

Para concluirmos este tutorial, vamos implementar a listagem e remoção de artigos da coleção. 

Novamente, na partial ***_collection.html.erb***, logo após a tag de renderização do formulário, adicione o código abaixo:
```erb
<% collection.articles.each do |article| %>
  <%= render article %>
  <%= button_to "Remover", remove_article_collection_path(collection, article_ids: article.id), method: :delete%>
<%end%>
```

Por fim, no Arquivo ***app/views/articles/_article_.html.erb***, altere a linha:
```erb
<%= article.author_id %>
```

Por: 
```erb
<%= article.author.name %>
```

Desta forma, ao acessar a coleção, os artigos serão listados e o usuário poderá adicionar novos registros ou removê-los da coleção.

  <img src="https://i.ibb.co/ZcjCj7Z/20230908-195142.gif" alt="" class="">

## Conclusão

Neste tutorial, aprendemos como criar um formulário com campos dinâmicos utilizando o framework Ruby on Rails e Hotwire Turbo/Stimulus.

O código fonte deste tutorial está disponível no repositorio do GitHub

Fique a vontade para personalizar o código e implementar novas funcionalidades, assim como customizar os estilos da aplicação.

