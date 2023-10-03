---

layout: post
title: "Rails dynamic Select"
date: 2023-09-08
short_description: "Learn how to implement a dynamic select with Rails and Hotwire. In this tutorial, I'll show you how to do it from scratch with a practical example and lots of details."
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
# Dynamic Select with Rails

  ![Image](https://i.ibb.co/1QcrgHP/20230908-192607.gif)

## Introduction

Dynamic forms are very common in web applications and Rails provides us with a very simple way to implement this.

In this article, I will teach you how to implement a dynamic select with Rails and Hotwire. 

For this, we will create a simple Rails application, with registration of authors and articles and collections. 

The user will be able to add/remove articles to the collection, filtering the articles by author before adding them.


## Creating the Project

In your Work environment execute the command below to create a new Rails project:

```bash
rails new rails-dynamic-select --css=tailwind 
```

Next, access the project folder with the command:
```bash
cd rails-dynamic-select
```

## Creating the Models

The application models will be:
- **Author**, containing only the *name* attribute
- **Article**, containing the *title* attributes and the reference to the **Author** model
- **Collection**, containing only the *title* attribute

To create the models, execute the commands below:

```bash
rails g scaffold Author name:string --no-jbuilder

rails g scaffold Article title:string author:references --no-jbuilder

rails g scaffold Collection title:string --no-jbuilder
```
Consider that a collection can contain several articles and an article can belong to several collections, so we also need to create a relationship table between the two tables and finally, make the associations between the classes.

To create the relationship table, execute the command below:
```bash
rails g migration CreateArticlesCollections article:references collection:references
```

In ***app/models/author.rb***  add the code below:
```ruby
class Author < ApplicationRecord
  has_many :articles
end
```

In ***app/models/collection.rb***  add the code below:
```ruby
class Collection < ApplicationRecord
  has_and_belongs_to_many :articles
end
```

In ***app/models/article.rb***  add the code below:
```ruby
class Article < ApplicationRecord
  belongs_to :author
  has_and_belongs_to_many :collections
end
```
To complete the creation of the models, execute the command below to create the tables in the database:

```bash
rails db:migrate
```
## Populating the Database

As the intention of this tutorial is to demonstrate dynamic select, let's create some records to populate the database directly in the seed file.

Open the file *db/seeds.rb* and add the following code:

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

Next, run the command below to populate the database:
```bash
rails db:seed
```

## Starting the Application

Before we start the server, let's configure the application's routes.

In ***config/routes.rb***, set the root of the application to the *collections* controller and the *index* action:

```ruby
Rails.application.routes.draw do
  root "collections#index"
  
  resources :collections
  resources :articles
  resources :authors

end
```
Next, start the server with the command below: 
```bash
./bin/dev 
```

Access the application at http://localhost:3000, and you will see the screen below:

![homepage](https://i.ibb.co/9GSkQHQ/Captura-da-Web-8-9-2023-181735-127-0-0-1.jpg")

## Creating the Dynamic Form

Now that we have the application up and running, let's create the dynamic form.

**Note**: It's worth mentioning that there are various ways to implement forms with Rails, especially forms with relationships between tables. Keep in mind that the goal of this tutorial is to demonstrate how to implement a dynamic select with Rails and Hotwire.

In ***app/views/collections/*** create the partial ***_articles_form.html.erb*** and add the following code:

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
Please note that the form in question is sending data to the *add_article* action of the *collections* controller.

In this tutorial, we will also be handling the removal of articles from the collection.

So, let's add a route for the *add_article* action and another one for *remove_article* in the *collections* controller, which will be implemented next.

In ***config/routes.rb***, edit the line *resources :collections* as follows:

```ruby
resources :collections do 
  post :add_article, on: :member
  delete :remove_article, on: :member
end
```
Next, we will add a test to display the form or the total number of articles in the collection, depending on the current user's request.

In ***app/views/collections/_collection.html.erb***, add the following code right after the collection title:

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
This way, in the *index* action, the total number of articles in the collection will be displayed, while in the *show* action, the form to add articles to the collection will be displayed.

![index](https://i.ibb.co/cxhmgHQ/20230908-183630.gif)

Please note that we are populating only the author select, while the article select is empty. This is because the article select is dynamic and will be populated based on the selected author.

## Populating the Article Select

Now that we have the form, let's implement the logic to populate the article select based on the selected author.

To do this, we will use a Stimulus controller that listens for the *change* event of the author select and sends a request to the server to fetch articles from the selected author.

To simplify our code, we will use the [requestjs-rails](https://github.com/rails/requestjs-rails) gem.

In ***Gemfile***, add the following line:

```ruby
gem 'requestjs-rails'
```

Next, run `bundle` to install the gem.
```bash
bundle install
```

**Remember to restart the server after installing the gem.**

Now, let's create the Stimulus controller.

In ***app/javascript/controllers/***, create the file ***collection_controller.js***and add the following code::
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
Please note that our request URL is `/articles/filter/`. Therefore, we need to define the route for this URL.

In ***config/routes.rb***, modify the line for *resources :articles* as follows:

```ruby
resources :articles do 
  get :filter, on: :collection
end 
```
Now, let's implement the *filter* action in the *articles* controller.

In ***app/controllers/articles_controller.rb***, add the following code:

```ruby
# GET /articles/filter
def filter
  @articles = Article.where(author_id: params[:author_id])
  respond_to do |format|
    format.turbo_stream
  end
end
```
Please note that our request expects a responseKind of type *turbo-stream*. Therefore, we need to create the *filter.turbo_stream.erb* template to return the data in the expected format.

In ***app/views/articles/*** create the file ***filter.turbo_stream.erb*** and add the following code:

```erb
<%= turbo_stream.update 'article_ids' do %>
  <%= options_from_collection_for_select @articles, :id, :title %>
<% end %>
```
Now, let's add the *collection_controller* to the author select.

In ***app/views/collections/_articles_form.html.erb***, update the *form_with* statement with the data-attribute, *controller :collection*.

```erb
<%= form_with(url: add_article_collection_path(collection), class: "contents", data: {controller: 'collection'}) do |form| %>
```
To test if the controller is working correctly, uncomment the code in the *connect* function of the *collection_controller*, access the collection page, and inspect the browser console. The message *Hello from collection_controller!* should be displayed.

Now, in the author select, let's add the data-attribute *action: change->collection#filter_articles*.

```erb
<div class="my-5">
  <%= form.label :author %>
  <%= form.collection_select :author, Author.all, :id, :name, {prompt: ''}, {data: {action: 'change->collection#filter_articles'}} %>
</div>
```
This way, when the user changes the author, the *collection_controller* will send a request to the *articles_controller*, which will populate the article select with articles from the selected author.

With the Stimulus controller configured correctly, the form should populate the articles as expected.

![stimulus-controller](https://i.ibb.co/1QcrgHP/20230908-192607.gif)

## Adding Articles to the Collection

To complete the form, let's implement the logic for adding articles to the collection.

In ***app/controllers/collections_controller.rb***, add the following code:

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
In addition to this code, two more lines need to be modified.

On line 2, we need to add *before_action :set_collection* so that the *set_collection* method is executed before the *add_article* and *remove_article* actions.

```ruby
before_action :set_collection, only: %i[ show edit update destroy add_article remove_article]
```
And in the *collection_params* method, we need to add the *article_ids* attribute.

```ruby
def collection_params
  params.require(:collection).permit(:title, :article_ids)
end
```
An important note at this stage is that due to the implementation allowing only one article to be added to the collection at a time, we are permitting the parameter :article_ids. In other scenarios where it's possible to associate a collection of items at once, it is recommended to use an array of elements, such as article_ids: [ ].

## Listing and Removing Articles from the Collection

To complete this tutorial, we will implement the listing and removal of articles from the collection.

Again, in the partial ***_collection.html.erb***, right after the rendering tag for the form, add the following code:

```erb
<% collection.articles.each do |article| %>
  <%= render article %>
  <%= button_to "Remover", remove_article_collection_path(collection, article_ids: article.id), method: :delete%>
<%end%>
```
Finally, in the file ***app/views/articles/_article.html.erb***, change the line:

```erb
<%= article.author_id %>
```

To:

```erb
<%= article.author.name %>
```

This way, when accessing the collection, articles will be listed, and the user can add new records or remove them from the collection.

![final](https://i.ibb.co/ZcjCj7Z/20230908-195142.gif)
## Conclusion

In this tutorial, we learned how to create a form with dynamic fields using the Ruby on Rails framework and Hotwire Turbo/Stimulus.

The source code for this tutorial is available in the GitHub repository.

Feel free to customize the code and implement new features, as well as customize the application's styles.
