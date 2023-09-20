---

layout: post
title: "Rails Chat Room"
date: 2023-09-19
short_description: "Neste artigo te mostro como é fácil desenvolver sala de bate papo onde as mensagens são entregues a todos que estão conectados."
cover: https://i.ibb.co/VNTQvTd/Tab-Rails-Chat-Room-Post-2.gif
labels: "Ruby on Rails, Turbo, Hotwire, Stimulus, TIL, Tutorial"

---

# Rails Chat Room
Neste artigo te mostro como é fácil desenvolver sala de bate papo onde as mensagens são entregues a todos que estão conectados.

<div>
  <img src="https://i.ibb.co/VNTQvTd/Tab-Rails-Chat-Room-Post-2.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>


## Introdução

Nos dias atuais é super comum utilizarmos recursos disponibilizados pelas aplicações web e mobile para nos comunicarmos com outras pessoas ou até mesmo para utilizar ferramentas de trabalho compartilhadas. 

Mas você já parou para pensar como algumas destas ferramentas funcionam ou qual é a complexidade de desenvolver uma aplicação deste tipo?

No exemplo de hoje, vamos implementar uma sala de bate papo onde as mensagens são entregues a todos que estão conectados.

Esta aplicação será desenvolvida utilizando o framework Ruby on Rails e recursos de Turbo.

O objetivo deste artigo é de fato implementar esta aplicação simples, e compreender o fluxo de dados entre o servidor e o cliente, e como o Turbo nos ajuda a simplificar este fluxo.

## Configurando o Projeto

Abra o terminal em seu ambiente de trabalho e vamos criar um novo projeto Rails.

```bash
rails new rails-chat-room --css=tailwind
```

Nosso projeto terá apenas dois modelos, `Room`, representanto a sala de bate papo, e `Message`, representando as mensagens enviadas pelos usuários.

Para criar este dois modelos, execute os seguintes comandos:

```bash
rails g scaffold Room name:string
```

```bash
rails g model Message room:references content:text
```

Em seguida execute as migrations para criar as tabelas no banco de dados.

```bash
rails db:migrate
```

Em seguida, vamos configurar o relacionamento entre as classes. 

Em `app/models/room.rb` adicione a seguinte linha:

```ruby
class Room < ApplicationRecord
  has_many :messages, dependent: :destroy
end
```

Messages já esta configurado para pertencer a uma Room, portanto, não é necessário nenhuma alteração.

Neste projeto vamos utilizar recursos de Nested Routes, portanto, vamos adicionar a seguinte linha no arquivo `config/routes.rb`.

```ruby
Rails.application.routes.draw do
  resources :rooms do 
    resources :messages
  end

  root "rooms#index"
end
```

Agora podemos iniciar o servidor com o comando: 

```bash
./bin/dev
```
Acesse o endereço `http://localhost:3000` e você verá a página inicial do projeto (*Room#Index*).

Crie uma sala com o nome que desejar.

## Adicionando Mensagens

Como estamos utilizando recursos mesclados, precisamos implementar um controlador para a classe `Message` e também definir suas visualizações.

Em vez de utilizar comandos scaffold, nesta etapa, é mais fácil criar os arquivos manualmente.

Portanto, crie o arquivo `app/controllers/messages_controller.rb` com o seguinte conteúdo:

```ruby
class MessagesController < ApplicationController

  before_action :set_room, only: %i[ new create destroy]
  before_action :set_message, only: %i[ destroy ]

  def new
    @message = @room.messages.new
  end

  def create
    @message = @room.messages.create!(message_params)
    respond_to do |format|
      format.html { redirect_to @room }
    end
  end

  def destroy
    @target = "message_#{@message.id}"
    @message.destroy
    respond_to do |format|
      format.html { redirect_to @room, notice: "Message was successfully destroyed." }
    end
  end

  private

  def set_room
    @room = Room.find(params[:room_id])
  end

  def set_message
    @message = Message.find(params[:id])
  end

  def message_params
    params.require(:message).permit(:content)
  end
  
end
```

Em seguida, vamos criar as views que serão utilizadas, sendo um formulário para criação de novas menssagens e uma para exibir a mensagem criada.

Em `app/views/`, crie o diretório `messages`.

Agora, em `app/views/messages/`, vamos criar o formulário de criação de mensagens.

Crie `_form.html.erb` com o seguinte conteúdo:

```erb
<%= form_with(model: [ message.room, message]) do |form| %>
  <% if message.errors.any? %>
    <div id="error_explanation" class="bg-red-50 text-red-500 px-3 py-2 font-medium rounded-lg mt-3">
      <h2><%= pluralize(message.errors.count, "error") %> prohibited this message from being saved:</h2>

      <ul>
        <% message.errors.each do |error| %>
          <li><%= error.full_message %></li>
        <% end %>
      </ul>
    </div>
  <% end %>

  <div class="my-5">
    <%= form.label :content %>
    <%= form.text_field :content, class: "block shadow rounded-md border border-gray-200 outline-none px-3 py-2 mt-2 w-full" %>
  </div>

  <div class="inline">
    <%= form.submit class: "rounded-lg py-3 px-5 bg-blue-600 text-white inline-block font-medium cursor-pointer" %>
  </div>

<% end %>
```

Agora, crie `new.html.erb` com o seguinte conteúdo:

```erb
<div class="mx-auto md:w-2/3 w-full">
  <h1 class="font-bold text-4xl">New Message</h1>

  <%= render "form", message: @message %>

  <%= link_to 'Back to rooms', @message.room, class: "ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
</div>
```
Em seguida, crique o arquivo `_message.html.erb` com o código abaixo:

```erb
<div class="flex" id="<%= dom_id message %>">
  <%= button_to 'Delete', room_message_path(message.room, message), method: :delete, form_class:'mr-2' %>
  <p><%= message.created_at.strftime('%b %d %H:%M:%S') %> : <%= message.content %></p>
</div>
```

Por fim, basta agora renderizarmos tanto o formulário de criação, quanto as mensagens associadas a sala de bate papo em sua página de exibição.

Para isso, em `app/views/rooms/show.html.erb`, adicione o seguinte código antes do fechamento das tags `</div>`:

```erb
<%# ... %>

<div id="messages">
  <p class="text-lg my-2">Room Messages:</p>
  <%= render @room.messages %>
</div>

<%= link_to 'New Message', new_room_message_path(@room), class:'rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium'%>

  </div>
</div>
```
Se tudo correu bem até aqui, você já deve ser capaz de criar novas mensagens e visualizar as mensagens criadas, porem, do jeito padrão de rails, isto é, sendo redirecionado a cada requisição, conforme o gif a seguir: 

<div>
  <img src="https://i.ibb.co/LdRpsKT/Tab-Rails-Chat-Room-Post.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

## Turbinando nossa aplicação

Agora que já temos uma aplicação funcional vamos aprimorar seus recursos adicionando recursos de Turbo. 

A primeira coisa que vamos fazer é renderizar o formulário de criação de mensagens diretamente na pagina de exibição da sala. 

Em `show.html.erb`, substitua o código: 
```erb
<%= link_to 'New Message', new_room_message_path(@room), class:'rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium'%>
```

por 
  
```erb
<%= turbo_frame_tag 'new_message', src: new_room_message_path(@room), target:'_top' %>
 ```

Observe que o atributo `src` esta indicando o mesmo caminho do link que foi substituído. Contudo, como estamos utilizando um `turbo_frame` é necessário envolver o formulário em um `turbo_frame_tag` com o mesmo id. 

Em `app/views/messages/_form.html.erb`, encapsule todo o conteúdo do arquivo com: 
  
  ```erb
<%= turbo_frame_tag 'new_message' do %>
  <%# _form.html.erb content here %>
<% end %>
```

Agora, ao acessar a página da sala, você poderá criar e ver as mensagens sem ser redirecionado, conforme o gif a seguir:

<div>
  <img src="https://i.ibb.co/L8GyHbk/Tab-Rails-Chat-Room-Post-1.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

Porem, apesar de não ser redirecionado para outra página, é possível notar que o formulário de criação de mensagens é recarregado a cada requisição.

<div class="text-center">
  <img src="https://i.ibb.co/4mVzjQJ/Screenshot-1.jpg" alt="" class=" w-75 img-fluid rounded-3 shadow mb-4">
</div>

Para resolver este problema, precisamos fazer com que nosso controlador interprete a requisição e responda a mesma em formato turbo.

Para fazer isto, em `messages_controller.rb` inclua um formato de resposta para ação `create`:

```ruby
def create
  @message = @room.messages.create!(message_params)
  respond_to do |format|
    format.html { redirect_to @room }
    format.turbo_stream
  end
end
```
Apenas incluindo este formato de resposta já é possível perceber a diferença na resposta do servidor.

<div class="text-center">
  <img src="https://i.ibb.co/r34FwGT/Screenshot-2.jpg" alt="" class=" w-75 img-fluid rounded-3 shadow mb-4">
</div>

Contudo, após esta pequena modificação, é possível notar que a mensagem parece não ter sido listada como antes, a não ser que a página seja atualizada manualmente.


<div>
  <img src="https://i.ibb.co/dtK63Vd/Tab-Rails-Chat-Room-Post-3.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

Isto acontece porque não definimos Rails não encontrou nenhuma instrução de resposta para o formato `turbo_stream`.

Para definir uma, vamos criar o arquivo `create.turbo_stream.erb` em `app/views/messages/`, seguindo a convenção do framework, com o seguinte conteúdo:

```erb
<%= turbo_stream.append 'messages' do %>
  <%= render @message %>
<% end %>
```

Agora, ao criar uma nova mensagem, a mesma será adicionada a lista de mensagens sem a necessidade de recaregar o conteúdo da página.


<div>
  <img src="https://i.ibb.co/k8BLfPS/Tab-Rails-Chat-Room-Post-4.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

Mas agora temos um novo problema, ao realizar a criação da mensagem, a mesma é mantida no campo do formulário. 

Para resolver este isto, será necessário utilizar recursos de Stimulus. Biblioteca complementar de Hotwire que permite a manipulação de elementos HTML através de JavaScript.

De forma resumida, Stimulus trabalha de uma maneira semelhante ao fluxo de rails. Ou seja, uma requisição é enviada para um controlador, que interpreta e responde a requisição da maneira mais adequada. 

A maior diferença, é que Rails responde com uma view, enquanto Stimulus responde com um JavaScript que manipula o DOM.

Para criar um controller de Stimulus, basta executar o seguinte comando:

```bash
rails g stimulus form
```

Isto irá criar o arquivo `app/javascript/controllers/form_controller.js`. 

Agora, vamos adicionar um método que irá limpar o formulário após a criação de uma nova mensagem.

```js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="form"
export default class extends Controller {
  reset() {
    this.element.reset()
  }
}
```

Agora, vamos atribuir este controlador ao formulário de mensagens, e informar qual ação deverá ser executada e quando isto deverá ocorrer.

Para isto, em `app/views/messages/_form.html.erb`, modifique a linha do formulário para: 
```erb
  <%= form_with(model: [ message.room, message], data: {controller: 'form', action: 'turbo:submit-end->form#reset'}) do |form| %>
```

De acordo com a [documentação](https://turbo.hotwired.dev/reference/events), `turbo:submit-end` é acionado após a conclusão da solicitação iniciada pelo envio do formulário.

Portanto, assim que o formulário for enviado, o método `reset` do controlador `form` será executado, limpando o formulário.

<div>
  <img src="https://i.ibb.co/0BNTCPg/Tab-Rails-Chat-Room-Post-5.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

Antes de seguirmos adiante, vamos implementar o mesmo comportamento para a exclusão de mensagens.

Para isto, basta adicionar o formato de resposta na action `destroy` de `messages_controller.rb`:

```ruby
def destroy
  @target = "message_#{@message.id}"
  @message.destroy
  respond_to do |format|
    format.html { redirect_to @room, notice: "Message was successfully destroyed." }
    format.turbo_stream
  end
end
```
Para responder da forma adequada, é necessário criar a view `destroy.turbo_stream.erb` em `app/views/messages/` com o seguinte conteúdo:

```erb
<%= turbo_stream.update @target do %>
  Mensagem Apagada
<% end %>
```

Com o código acima, a mensagem excluida será substituida pelo texto "Mensagem Apagada". Quando a página for recarregada, a mensagem não estará mais na lista.

Se preferir apenas remover a mensagem da lista, basta definir `destroy.turbo_stream.erb` como:

```erb
<%= turbo_stream.remove @target %>
```

## Sincronizando Mensagens

Agora que já temos nossa sala de bate papo implementada de forma eficiênte, é necessário fazer com que ela se comunique com os demais usuários. Afinal, neste momento, se um usuário enviar uma mensagem, apenas ele irá visualizar a mesma.

<div>
  <img src="https://i.ibb.co/0rP7sR9/20230919-181753.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

Obviamente, ao atualizar a página em outro cliente, a mensagem será recuperada. Mas isto não é o suficiente, pois o objetivo é que a mensagem seja exibida em tempo real.

Para fazer isto, vamos utilizar os recursos de Turbo Stream, que nos permitem estabelecer um canal de forma simples, e realizar o broadcast de informação a todos os clientes.

Leia mais sobre [Broadcasting](https://guides.rubyonrails.org/action_cable_overview.html#terminology-broadcastings).

Na página da sala de bate papo, vamos adicionar o seguinte código:

```erb
<%= turbo_stream_from @room %>
```
Este código irá criar um canal de comunicação entre o cliente e o servidor, que será utilizado para enviar as mensagens.

Nesta etapa é relevante fazermos uma observação:

> É possível fazer um broadcast de diversas maneiras, podendo ser diretamente pelo controlador, pelo terminal, por um serviço externo, entre outros. Cabe a você, desenvolvedor, decidir qual a melhor maneira de implementar o recurso.

Neste caso, vamos utilizar o própio modelo `Message` para realizar o broadcast sempre que houver modificações em uma mensagem.

Para isto, basta adicionar o seguinte código em `app/models/message.rb`:

```ruby
class Message < ApplicationRecord
  belongs_to :room
  broadcasts_to :room
end
```
Agora, sempre que uma mensagem for criada, atualizada ou excluída, o servidor irá enviar uma mensagem para todos os clientes conectados ao canal.

Simples, não é mesmo? Vamos testar? 

<div>
  <img src="https://i.ibb.co/xMWXTkf/20230919-183215.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

## Extra

Certo, já temos nossa sala de bate papo funcionando, mas ainda podemos melhorar um pouco mais.

As *Mensagens* da aplicação estão sendo exibidas baseado em Turbo, contudo, a *Sala* está sendo exibida de forma tradicional. 

Isto quer dizer, que ao tentar *editar* uma sala, você será redirecionado, e os usuários conectados não serão notificados.

Portanto, vamos fazer estas configurações para que as alterações da sala também sejam exibida de forma dinâmica.

De forma semelhante ao que fizemos com as mensagens, vamos envolver a renderização da sala em um `turbo_frame_tag` com um id específico.

Em `app/views/rooms/show.html.erb`, modifique o código para:

```erb
<%# ... %>
 <%= turbo_frame_tag 'room' do %>
      <%= render @room %>

      <%= link_to 'Edit this room', edit_room_path(@room), class: "mt-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
      <div class="inline-block ml-2">
        <%= button_to 'Destroy this room', room_path(@room), method: :delete, class: "mt-2 rounded-lg py-3 px-5 bg-gray-100 font-medium" %>
      </div>
      <%= link_to 'Back to rooms', rooms_path, class: "ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
    <%end%>
<%# ... %>
```

Agora, em vez de envolver o formulário no turbo_frame, vamos envolver parte do arquivo `app/views/rooms/edit.html.erb`. 

Isto será feito porque o formulário de edição será exibido na mesma página, e nela, teremos a ação de 'cancelar' a edição. Recurso que não temos apenas no formulário. 

Portanto, em `...rooms/edit.html.erb` modifique o código para:

```erb
<div class="mx-auto md:w-2/3 w-full">
  <h1 class="font-bold text-4xl">Editing room</h1>

  <%= turbo_frame_tag 'room' do %>
    <%= render "form", room: @room %>
    <%= link_to "Cancel", @room, class: "ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
  <%end%>
</div>
```

Sim, o botão '*Show this room*' foi removido uma vez que já estamos na página da sala. 

E o botão '*Back to rooms*' foi substituído por '*Cancel*', pois o objetivo é cancelar a edição e voltar para a página da sala.

Contudo, ainda não terminamos. 
Se você tentar acessar os botões, perceberá que nada parece funcionar direito. 


<div>
  <img src="https://i.ibb.co/yWqGQ0W/Tab-Rails-Chat-Room-Post-6.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

Deixo aqui um tempo para você tentar descobrir o que está acontecendo.

...

Pensou? Então, vamos lá.

A resposta é simples. Algumas requisições estão alterando o conteúdo do turbo_frame, enquanto deveriam substituir o mesmo.

Para resolver o problema, basta modificar os botões de `show.html.erb` para:

```erb
<%= link_to 'Edit this room', edit_room_path(@room), class: "mt-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium", data: {turbo_frame: 'room'} %>
      
<div class="inline-block ml-2">
  <%= button_to 'Destroy this room', room_path(@room), method: :delete, class: "mt-2 rounded-lg py-3 px-5 bg-gray-100 font-medium", data: {turbo_frame: '_top'} %>
</div>

<%= link_to 'Back to rooms', rooms_path, class: "ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium", data: {turbo_frame: '_top'} %>
```

Desta forma, estamos direcionando a resposta do turbo_frame para `room`, ou para o elemento fora do frame `_top`.

Certo, mas ainda não terminamos. Os botões estão funcionando, o formulário de edição esta sendo renderizado na mesma página, mas apesar disto, ao modificar as informações da sala, a informação não é replicada a todos os clientes. 

Para resolver este problema, vamos adicionar o seguinte código em `app/models/room.rb`:

```ruby
class Room < ApplicationRecord
  has_many :messages, dependent: :destroy
  broadcasts
end
```
Desta forma, assim que as informações de uma sala for atualizado, o servidor irá enviar uma mensagem para todos os clientes conectados ao canal.

Com isto, um último problema surge. 

<div>
  <img src="https://i.ibb.co/BB3FZgr/20230919-200736.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

Ao concluir a edição, o botões 'Show this room' e Edit this room' são renderizados. 

Isto acontece pois no arquivo `_room.html.erb` estamos renderizando os botões de forma condicional.
Contudo, como já movemos os botões para o formulário de edição, não precisamos mais renderizá-los no arquivo `_room.html.erb`, apenas em index. 

Portanto, *remova* a validação condicional de `_room.html.erb` conforme o código abaixo:

```erb
<div id="<%= dom_id room %>">
  <p class="my-5">
    <strong class="block font-medium mb-1">Name:</strong>
    <%= room.name %>
  </p>
</div>
```

Aproveitando... Para que o nome das salas também seja atualizado via turbo na página de listagem de salas, vamos alterar o seguinte código em `app/views/rooms/index.html.erb`:

```erb
  <div id="rooms" class="min-w-full">
    <%= render @rooms %>
  </div>
```

Para:
```erb
  <div id="rooms" class="min-w-full">
    <% @rooms.each do |room|%>
      <%= turbo_stream_from room %>
      <%= render room %>
      <%= link_to "Show this room", room, class: "rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
      <%= link_to 'Edit this room', edit_room_path(room), class: "rounded-lg py-3 ml-2 px-5 bg-gray-100 inline-block font-medium" %>
    <%end%>
  </div>
```
  
Desta forma, ao editar as informações de uma sala, o nome da mesma será atualizado tanto na página de listagem de salas, quanto na página da sala, e os botões para acessar a sala serão renderizados conforme esperado. 

<div>
  <img src="https://i.ibb.co/rM8srGG/20230919-202036.gif" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

---
### Link do Repositório
[lucasgeron/rails-chat-room](https://github.com/lucasgeron/rails-chat-room)
---

---

## Conclusão
 
Neste artigo (~~um pouco extenso~~),  vimos como utilizar o Turbo para criar uma aplicação Rails de Bate Papo. 

A aplicação foi implementada do zero, passando pelo jeito tradicional de uma requisição Rails, até a utilização de Turbo para atualizar o conteúdo da página de forma dinâmica.

Ao longo deste artigo, utilizamos:
- Turbo Frame: `turbo_frame_tag`
- Turbo Stream: `turbo_stream_from`, `format.turbo_stream`, `broadcasts_to`, `broadcasts`
- Turbo Stimulus: `turbo:submit-end->form#reset`
  
Ainda há muito a ser explorado sobre o Turbo, mas espero que este artigo tenha te ajudado a entender um pouco mais sobre o que é o Turbo e como utilizá-lo em uma aplicação Rails.

**Gostou deste projeto?** *Deixe seu feedback!* 


