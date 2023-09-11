---

layout: post
title: "To Do List Turbo"
date: 2023-09-06
short_description: "To Do List Turbo é uma aplicação de lista de tarefas que permite você criar, editar e remover tarefas. Neste artigo te mostro como criar isto com Hotwire Turbo."
cover: https://i.ibb.co/Ydyx6RS/20230906-142125.gif
labels: "Ruby on Rails, Hotwire Turbo, TIL, Tutorial"

---

# To Do List Turbo
To Do List Turbo é uma aplicação de lista de tarefas que permite você criar, editar e remover tarefas. Também é possível marcar as tarefas como completas ou incompletas. 

Neste artigo iremos aprender a fazer esta aplicação com Hotwire Turbo.

<div>
  <img src="https://i.ibb.co/Ydyx6RS/20230906-142125.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

# Introdução

Neste artigo vamos desenvolver juntos uma aplicação de lista de tarefas usando o framework Hotwire Turbo. Esta aplicação é bem simples, mas é o suficiente para demonstrar o poder do Hotwire Turbo.

De forma bem resumida, o Hotwire Turbo é um framework que permite que partes de uma página sejam atualizadas mediante uma solicitação, sem a necessidade de recarregar a página inteira. Ele é uma alternativa ao uso de APIs REST e JavaScript e um poderoso aliado ao alto desempenho. Leia mais sobre o [Hotwire Turbo](https://turbo.hotwired.dev/handbook/introduction).


# Índice
<ul>
<li> <a href="#1-criando-o-projeto"> 1. Criando o Projeto </a> </li>
<li> <a href="#2-criando-o-modelo"> 2. Criando o Modelo </a> </li>
<li> <a href="#3-configurando-as-rotas"> 3. Configurando as Rotas </a> </li>
<li> <a href="#4-configurando-o-tailwind"> 4. Configurando o Tailwind </a> </li>
<li> <a href="#5-adaptando-o-projeto-para-turbo">  5. Adaptando o projeto para Turbo </a> </li>
<li> <a href="#6-modificando-a-página-inicial"> 6. Modificando a Página Inicial </a> </li>
<li> <a href="#7-configurando-o-formulário"> 7. Configurando o Formulário </a> </li>
<li> <a href="#8-adicionando-notificações"> 8. Adicionando Notificações </a> </li>
<li> <a href="#9-editando-um-registro"> 9. Editando um Registro </a> </li>
<li> <a href="#10-excluindo-um-registro"> 10. Excluindo um Registro </a> </li>
<li> <a href="#11-testando-recursos-de-turbo"> 11. Testando Recursos de Turbo </a> </li>
<li> <a href="#12-estilizando-a-aplicação"> 12. Estilizando a Aplicação </a> </li>
<li> <a href="#13-marcando-tarefas-como-completadasincompletas"> 13. Marcando tarefas como Completadas/Incompletas </a> </li>
<li> <a href="#resultado-final"> Resultado Final </a> </li>
</ul>

# Vamos começar
---------


## 1. Criando o Projeto

Em seu ambiente de trabalho, crie um novo projeto, usando o comando `rails new` com a opção `--css=tailwind`. Isso vai criar um projeto Rails com o framework CSS Tailwind instalado. 

``` shell   
rails new to-do-list-turbo --css=tailwind
```
Em seguida, acesse a pasta do projeto criado.
``` shell
cd to-do-list-turbo
```

## 2. Criando o Modelo

Para criar o modelo, vamos usar o gerador de `scaffold` do Rails. 

O modelo terá apenas dois campo chamado `description` que será do tipo `string` e `complete` que será do tipo `boolean`.

``` shell
rails g scaffold Task description:string complete:boolean --skip-controller new show --no-jbuilder
```

Observe que adicionamos algumas opções ao comando `rails g scaffold`. 

A opção `--skip-controller new show` irá pular a criação das actions `new` e `show` no controller. 

A opção `--no-jbuilder` irá pular a criação dos arquivos `.json.jbuilder` que são utilizados para renderizar os dados em formato JSON. 

Ambos os recursos, não serão utilizados em nossa aplicação.

Portanto, vamos **remover as views que não serão utilizadas e que foram criadas por scaffold**. 

Para fazer isso, exclua os arquivos `new.html.erb`, `show.html.erb` que estão localizados em `app/views/tasks/`

Em seguida, execute as migrações do banco de dados através do comando.
``` shell
rails db:migrate
```

## 3. Configurando as Rotas

Abra o arquivo `config/routes.rb` e defina o root da aplicação para `tasks#index`. 

Novamente, como não utilizaremos as ações `new` e `show` do nosso `tasks_controller.rb`, vamos remover estas rotas do `resources`, conforme o código a seguir. 
``` ruby 
Rails.application.routes.draw do
  root to: "tasks#index"
  resources :tasks, except: %i[ show new]
end
```

## 4. Configurando o Tailwind

Para que o tailwind funcione corretamente, vamos instanciar o servidor utilizando o comando:
``` shell
./bin/dev
```
Isto irá compilar os arquivos de configuração do tailwind e estilizar nossa aplicação corretamente. 

Com isto feito, podemos acessar a página inicial da aplicação em `http://localhost:3000` e verificar se a página está estilizada corretamente.


<div>
  <img src="https://i.ibb.co/cX2G9j2/Screenshot-1.jpg" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>


## 5. Adaptando o projeto para Turbo

Até este momento, temos nossas rotas configuradas, o modelo criado e a página inicial estilizada do jeito padrão que rails funciona. 

**Turbo Frames** são elementos personalizados com seu próprio conjunto de atributos HTML e propriedades de Javascript. 

**Turbo Streams** é um formato de resposta que permite que você atualize partes de uma página HTML sem descartar o restante da página.


Agora, vamos começar a adaptar nossa aplicação para utilizar recursos Hotwire Turbo, modificando o código e adicionando Turbo Frames e Turbo Streams onde for necessário.

## 6. Modificando a Página Inicial

Nossa aplicação terá o formulário de criação de novas tasks sendo exibido na pagina inicial, desta forma, poderemos criar novas tarefas sem a necessidade de ser redirecionado para outra página.

Em `index.html.erb`, vamos remover o link para a página de criação de novas tasks e substituir pelo formulário de criação de novas tasks.
``` erb 
<div class="w-full">
  <% if notice.present? %>
    <p class="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block" id="notice"><%= notice %></p>
  <% end %>

  <div class="flex justify-between items-center">
    <h1 class="font-bold text-4xl">Tasks</h1>
  </div>

  <%= render "form", task: @task %>

  <div id="tasks" class="min-w-full">
    <%= render @tasks %>
  </div>
</div>
```
Observe que estamos renderizando o formulário passando um objeto `@task` que ainda não esta definido. 

Para corrigir isto, em nosso `tasks_controller.rb`, vamos definir o objeto `@task` no método `index`.

``` ruby 
def index
  @tasks = Task.all
  @task = Task.new
end
```
Com isto feito, a página inicial da aplicação deve estar assim:


<div>
  <img src="https://i.ibb.co/qdpzJqc/Screenshot-2.jpg" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

Neste momento, se você tentar criar uma nova task perceberá que nada de diferente acontece. 

Isto ocorre porque ainda não configuramos o formulário para enviar os dados via Turbo, e nem a view para receber os dados via Turbo.

## 7. Configurando o Formulário

No arquivo `_form.html.erb`, vamos adicionar o atributo `data-turbo-stream` ao formulário, para que ele seja enviado via Turbo. 

Para isto, basta adicionar o atributo `data: { turbo_stream: true }` ao formulário.
``` erb 
<%= form_with(model: task, class: "contents", data: { turbo_stream: true }) do |form| %>
```
Para que isto funcione conforme o esperado, precisamos que nosso controlador interprete e responda a requisição de forma adequada.

Portanto, em nosso `tasks_controller.rb` vamos adaptar a action `create` conforme o código a seguir:

``` ruby     
# POST /tasks or /tasks.json
def create
  @task = Task.new(task_params)

  respond_to do |format|
    format.turbo_stream do 
      if @task.save
        render turbo_stream: turbo_stream.prepend("tasks", partial: "tasks/task", locals: { task: @task })
      end
    end
  end
end
```

Com isto, após o registro ser salvo com sucesso, o Turbo Stream irá adicionar o novo registro na lista de tasks, sem a necessidade de recarregar a página. 

**Importante**: Isto só funciona porque em nosso `index.html.erb` existe um elemento com `id=tasks` que é onde o Turbo Stream irá adicionar o novo registro.

Antes de continuarmos, é importante percebermos algumas situações:

-  Ao tentar editar um registro, nossa aplicação ainda estará redirecionando o usuário para página de edição. 
-  Caso o registro não seja salvo com sucesso, nada acontece.
-  Nenhuma notificação foi exibida ao usuário após a criação de um novo registro com sucesso.

Iremos resolver estes problemas em seguida.

## 8. Adicionando Notificações

Como estamos trabalhando com recursos de Turbo, vamos utilizar o componente `turbo_frame_tag` para exibir as notificações de sucesso e erro.

Para isto, crie o arquivo `_flash.html.erb` em `views/layouts` e adicione o código a seguir:

``` erb 
<div class=" font-medium rounded-lg inline-block">
  <% case type %>
    <% when 'notice' %>
      <div class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 " role="alert">
        <span class="font-medium">Notice:</span> <%= message %>
      </div>
    <% when 'alert' %>
      <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 " role="alert">
        <span class="font-medium">Alert:</span> <%= message %>
      </div>
  <% end %>
</div>
```

Em seguida, em `views/layouts/application.html.erb`, adicione o código a seguir, em cima da tag `<%= yield >`
``` erb 
<%= turbo_frame_tag "flash", class:'absolute top-8' %>
```

Ainda na parte de views, em `index.html.erb` é possível **remover** as instruções:

``` erb 
<% if notice.present? %>
  <p class="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block" id="notice"><%= notice %></p>
<% end %>
```

Uma vez que isto não é mais necessário, pois as notificações serão exibidas dentro do elemento `flash` que criamos anteriormente.

Agora, voltando ao nosso `tasks_controller.rb`, vamos adicionar o código para renderizar as mensagens flash na action `create`:
``` ruby 
# POST /tasks or /tasks.json
def create
  @task = Task.new(task_params)

  respond_to do |format|
    format.turbo_stream do 
      if @task.save
        render turbo_stream: [
          turbo_stream.update('flash', partial: "layouts/flash", locals: { type:'notice', message:"Task was successfully created."}),
          turbo_stream.prepend("tasks", partial: "tasks/task", locals: { task: @task })
        ]
      else
        render turbo_stream: turbo_stream.update('flash', partial: "layouts/flash", locals: { type:'alert', message:@task.errors.full_messages.join(', ')})
      end
    end
  end
end
```

As coisas podem parecer um pouco confusa neste momento, mas vamos entender o que esta acontecendo. 

1. Criamos um partial chamado `_flash.html.erb` que irá exibir as mensagens de sucesso e erro.
2. Adicionamos um `turbo_frame_tag` com id `flash` em `views/layouts/application.html.erb` para que as mensagens sejam exibidas.
3. No controlador, enviamos a atualização do frame `flash` junto com a atualização do registro, para que as mensagens e alterações sejam exibidas quando requisitadas.

Agora, ao criar uma nova task, a mensagem de sucesso deve ser exibida conforme a imagem a seguir:

<div>
  <img src="https://i.ibb.co/tKRc9YZ/20230906-123101.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>


Para testarmos se a mensagem de erro esta funcionando, vamos adicionar uma validação de presença no campo `description` do nosso model `task.rb`.

``` ruby 
class Task < ApplicationRecord
  validates :description, presence: true
end
```

Agora, ao clicar em salvar, a mensagem de deverá ser exibida conforme a imagem a seguir:

<div>
  <img src="https://i.ibb.co/HP20pdr/Screenshot-3.jpg" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>


Dois dos problemas relatados anteriormente já foram resolvidos, mas ainda precisamos resolver o problema de redirecionamento ao editar um registro.

## 9. Editando um Registro

Para resolvermos o problema de redirecionamento ao editar um registro, vamos utilizar o componente `turbo_frame_tag` para fazer com que cada tarefa renderizada (`@tasks`), atue como um componente individual. 

No arquivo `_task.html.erb`, vamos substituir a linha:
``` erb
<div id="<%= dom_id task %>">
... 
</div>
```

Por:

``` erb 
<turbo-frame id="<%= dom_id task %>" >
...
</turbo-frame>
```
Lembre-se, Turbo Frames são elementos personalizados que interagem de modo semelhante a um componente, permitindo que você substitua partes de uma página sem recarregar a página inteira.

Com esta alteração, é possível perceber que ao clicar em editar, a mensagem **Content missing** é exibida.

<div>
  <img src="https://i.ibb.co/sQnXDH3/20230906-124527.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

Isto acontece porque a página que esta sendo requisitada, não possui um elemento com o mesmo ID do elemento que esta sendo substituído. 

Para resolver isto, basta adicionar o mesmo elemento que esta sendo substituído, na página que esta sendo requisitada.

Em `views/tasks/edit.html.erb`, adicione o código a seguir:

``` erb
<turbo-frame id="<%= dom_id @task %>" >
...
</turbo-frame>
```

Se tudo funcionar conforme o esperado, o formulário de edição deve ser exibido sem a necessidade de recarregar a página.

<div>
  <img src="https://i.ibb.co/K0Hnf6L/20230906-125053.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

Para deixar as coisas mais organizadas, podemos simplificar o arquivo `views/tasks/edit.html.erb` para:

``` erb
<turbo-frame id="<%= dom_id @task %>">
  <%= render "form", task: @task %>
</turbo-frame>
```
Neste momento, o formulário de edição ainda não esta funcionando corretamente. 

Isto acontece porque nosso controlador ainda esta tentando responder em um formato diferente de `turbo_stream`.  

Portanto, vamos ajustar a action `update` com o seguinte código:

``` ruby 
# PATCH/PUT /tasks/1 or /tasks/1.json
def update
  respond_to do |format|
    if @task.update(task_params)
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update(@task),
          turbo_stream.update('flash', partial: "layouts/flash", locals: { type:'notice', message:"Task ID:#{@task.id} was successfully updated."}),
        ]
      end
    else
      format.turbo_stream do
        render turbo_stream: turbo_stream.update('flash', partial: "layouts/flash", locals: { type:'alert', message:"Task ID: #{@task.id} - #{@task.errors.full_messages.join(', ')}"})
      end
    end
  end
end
```

**Importante**: Perceba que na ação `create` utilizamos o metodo `turbo_stream.prepend`, enquanto para `update` utilizamos o metodo `turbo_stream.update`. 

**prepend** adiciona conteúdo no inicio do elemento, enquanto **update** substitui o conteúdo do elemento atual com o conteúdo desejado.

Para entender melhor a diferença entre os métodos, acesse a [documentação](https://turbo.hotwire.dev/reference/streams#stream-actions).


<div>
  <img src="https://i.ibb.co/2W1B2h9/20230906-125905.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>


## 10. Excluindo um Registro

Por padrão, o botão para excluir um registro é exibido na action `show`, recurso que excluímos da nossa aplicação. 

Portanto, vamos adiciona-lo manualmente diretamente em `_task.erb.html`

Substitua a linha:
``` erb 
<%= link_to "Show this task", task, class: "rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
```

Por:

``` erb 
<%= button_to "Destroy this task", task_path(task), class:'rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium', method: :delete %>
```

Ao clicar em excluir, a mensagem **Content missing** é exibida novamente.

Isto acontece porque o conteúdo do elemento foi removido, mas o elemento em si ainda existe. 

Para resolver isto, vamos alterar a ação `destroy` do `tasks_controller` para responder em formato Turbo Stream.

``` ruby
# DELETE /tasks/1 or /tasks/1.json
def destroy
  @task.destroy

  respond_to do |format|
    format.turbo_stream do
      render turbo_stream: [
        turbo_stream.remove(@task),
        turbo_stream.update('flash', partial: "layouts/flash", locals: { type:'notice', message:"Task ID:#{@task.id} was successfully deleted."}),
      ]
    end
  end
end
```

Note que agora estamos utilizando o metodo `turbo_stream.remove` para remover o elemento da página, e novamente atualizando o elemento `flash` para exibir a mensagem.

<div>
  <img src="https://i.ibb.co/F3QcFCp/20230906-131350.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>


## 11. Testando Recursos de Turbo

Antes de estilizarmos nossa aplicação é interessante observar as requisições e respostas diretamente do navegador. 

Abra o console do navegador em seguida, acesse a aba **Network** e faça algumas ações na aplicação.


<div>
  <img src="https://i.ibb.co/CB8NDxq/20230906-132027.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>


Observe que ao acessar a página pela primeira vez uma série de recursos como fontes, scripts e folhas de estilo são carregados, porem, ao interagir com a aplicação, apenas uma requisição é feita para o servidor, e o conteúdo é atualizado sem a necessidade de recarregar a página por completo.

Com isto, podemos perceber que a aplicação esta muito mais rápida e que o consumo de dados é muito menor, resultando em uma melhor experiência para o usuário e na economia de recursos do servidor.

Agora que nossa aplicação esta funcionando, podemos estiliza-la utilizando o framework [Tailwind CSS](https://tailwindcss.com/).

## 12. Estilizando a Aplicação

Como o foco deste artigo não aborda conceitos de front-end, você pode personalizar a estilização da maneira que preferir, ou apenas substituir o código dos arquivos, pelos código abaixo:

### `app/assets/stylesheets/application.tailwind.css`
``` scss
@tailwind base;
@tailwind components;
@tailwind utilities;


@layer components {

  body {
    @apply bg-gray-700;
  }

  .container {
    @apply px-4 mx-auto mt-4 md:mt-28 shadow-lg;
  }

  .inner-container {
    @apply p-4 relative space-y-4 bg-white rounded-lg;
  }

  .contents {
    @apply w-full space-y-2 md:space-y-0 items-start justify-between gap-2;
  }

  .task {
    @apply w-full space-y-2 md:space-y-0 md:flex items-center;
  }

  .task-container{
    @apply flex md:grow items-center justify-between gap-2;
  }
  
  .task-icon {
    @apply rounded-lg py-2 px-2.5 bg-gray-100 inline-block font-medium;
  }

  .task-content {
    @apply grow flex items-center justify-between rounded-md border outline-none w-4/5 py-2.5 px-4 my-auto;
  }
  
  .task-badge {
    @apply rounded-md border outline-none py-0.5 px-2 my-auto  items-center bg-blue-100 border-blue-400 text-blue-700  text-xs sm:text-sm;
  }

  .task-buttons {
    @apply flex items-center justify-between gap-2;
  }

  .title {
    @apply font-bold text-2xl lg:text-4xl text-center py-4;
  }

  .form-input {
    @apply block rounded-md border border-gray-200 outline-none w-full;
  }

  .btn-primary {
    @apply  rounded-lg py-2.5 px-5 bg-blue-600 hover:bg-blue-700  text-white inline-block font-medium cursor-pointer;
  }
  .btn-primary-light {
    @apply  rounded-lg py-2.5 px-5 bg-gray-100 hover:bg-blue-200  text-blue-600 inline-block font-medium cursor-pointer;
  }
  .btn-danger-light {
    @apply  rounded-lg py-2.5 px-5 bg-gray-100 hover:bg-red-200  text-red-600 inline-block font-medium cursor-pointer;
  }
  .btn-secondary {
    @apply  rounded-lg py-2.5 px-5 bg-gray-100 hover:bg-gray-200   inline-block font-medium cursor-pointer;
  }
}
```

### `app/views/layouts/application.html.erb`
``` erb
<!DOCTYPE html>
<html>
  <head>
    <title>ToDoListTurbo</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>
    <%= stylesheet_link_tag "tailwind", "inter-font", "data-turbo-track": "reload" %>

    <%= stylesheet_link_tag "application", "data-turbo-track": "reload" %>
    <%= javascript_importmap_tags %>
  </head>

  <body>
    <main class="container">
      <%= turbo_frame_tag "flash", class:'absolute top-8' %>
      <%= yield %>
    </main>
  </body>
</html>
```

### `app/views/tasks/_form.html.erb`
``` erb
<%= form_with(model: task, class: "contents sm:flex", data: { turbo_stream: true }) do |form| %>

  <div class="grow">
    <%= form.text_field :description, placeholder:'Insert your Task', class: "form-input" %>
  </div>

  <div class="flex gap-2">
    <%= link_to "Cancel", tasks_path, class:'btn-secondary w-full text-center' if action_name == 'edit'%>
    <%= form.submit class: "btn-primary w-full" %>
  </div>
<% end %>
```

### `app/views/tasks/_task.html.erb`
``` erb 
<turbo-frame id="<%= dom_id task %>" class="task" >

  <div class="task-container">

    <% if task.complete %>
      <div class="task-icon bg-blue-100 border-blue-400 text-blue-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    <% else %>
      <div class="task-icon ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    <%end%>

    <div class="task-content">
      <p class="grow">
        <%= task.description %>
      </p>

      <% if task.complete %>
        <p class="task-badge hidden md:inline-flex">
          completed <%= time_ago_in_words(task.updated_at)%> ago
        </p>
      <% end %>
    </div>

  </div>

  <div class="task-buttons">
    <div class="flex gap-2">
      <% if task.complete %>
        <p class=" md:hidden task-badge">completed <%= time_ago_in_words(task.updated_at)%> ago</p>
      <%else%>
        <%= button_to task_path(task), class:'btn-danger-light md:ml-2', method: :delete do %>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        <%end%>

        <%= link_to edit_task_path(task), class: "btn-primary-light" do %>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        <%end%>
      <% end %>
    </div>

    <%= button_to task_path(task), params: {task: {complete: !task.complete }}, class:"btn-primary-light", method: :patch do %>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="<%= task.complete ? 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3' : 'M4.5 12.75l6 6 9-13.5' %>" />
      </svg>
    <%end%>
  </div>

</turbo-frame>
```

### `app/views/tasks/index.html.erb`

``` erb 
<div class="inner-container">

  <h1 class="title">Tasks</h1>

  <%= render "form", task: @task %>

  <div id="tasks" class="grid gap-2">
    <%= render @tasks %>
  </div>
</div>
```

## 13. Marcando tarefas como Completadas/Incompletas

Perceba que o checkbox referente ao atributo `complete` foi removido do formulário. Isso porque agora vamos marcar as tarefas como completas ou incompletas diretamente na lista de tarefas, sem ser necessário editar o registro para alterar seu status.

De forma bem resumida, este comportamento esta implementado em `_task.html.erb` atraves das instruções:


``` erb 
<%= button_to task_path(task), params: {task: {complete: !task.complete }}, class:"btn-primary-light", method: :patch do %>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="<%= task.complete ? 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3' : 'M4.5 12.75l6 6 9-13.5' %>" />
  </svg>
<%end%>
```

Basicamente o que este botão faz é enviar uma requisição do tipo `PATCH` com o parametro `complete` invertido, ou seja, se a tarefa estiver completa, o parametro `complete` será `false` e vice-versa.

Como nosso controlador já esta configurado para interpretar esta requisição, a atualização do registro será feita automaticamente e o atributo `complete` será atualizado.

## Resultado Final


<div>
  <img src="https://i.ibb.co/gD5tP6d/20230906-141044.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

O código deste projeto esta disponível no repostório [lucasgeron/to-do-list-turbo](https://github.com/lucasgeron/to-do-list-turbo).
