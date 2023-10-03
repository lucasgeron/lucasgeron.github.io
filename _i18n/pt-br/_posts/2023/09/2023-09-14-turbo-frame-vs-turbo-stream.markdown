---

layout: post
title: "Turbo Frame vs Turbo Stream"
date: 2023-09-14
short_description: "Você sabe qual a diferença entre os recursos que Hotwire Turbo oferece? Então esse artigo pode ser de seu interesse!"
cover: https://i.ibb.co/J7G8Lyv/20230914-224204.gif
read_time: true
toc: true
github_repo: rails-turbo-frame-vs-turbo-stream
categories:
- Tutorial
tags:
- Ruby On Rails
- Hotwire Turbo

---

# Turbo Frame vs Turbo Stream
Você sabe qual a diferença entre os recursos que Hotwire Turbo oferece? Então esse artigo pode ser de seu interesse! Este artigo foi inspirado na postagem de [mixandgo.com](https://mixandgo.com/learn/ruby-on-rails/turbo-frames-vs-turbo-streams).

  <img src="https://i.ibb.co/J7G8Lyv/20230914-224204.gif" alt="" class="">

## Introdução

Utilizar recursos de Turbo pode tornar o desenvolvimento de uma aplicação web muito mais produtiva e rápida, contudo, as coisas podem parecer confusas, principalmente se você esta aprendendo esta tecnologia. 

Neste artigo vamos falar sobre dois recursos do Turbo: **Turbo Frame** e **Turbo Stream**. Vamos entender o que cada um faz e quando devemos utilizar cada um deles.

A partir de Rails 7, os recursos de Turbo se tornaram padrão em um novo projeto, ou seja, não é necessário instalar nada para utilizar esses recursos.

Porem, é interessante saber como utilizar estes recursos poderosos para deixar sua aplicação 'turbinada'. 

Para explicar passo a passo, vamos desenvolver um projeto simples, e vamos evoluir do modo tradicional para o modo Turbo. 

## Criando o Projeto

Em seu terminal, vamos criar e acessar um novo projeto Rails, com os comandos:

```bash
rails new turbo-frame-vs-turbo-stream --css=tailwind
cd turbo-frame-vs-turbo-stream
```

Em seguida, vamos criar um apenas um controlador, para entender como estes recursos funcionam. 
  
```bash
rails g controller site index first_page
```

Irá configurar as rotas e gerar os arquivos necessários para o controlador e as views. 

Antes de começarmos a programar, vamos alterar o root da aplicação, para que a rota raiz seja a página inicial do nosso site. 

Em `config/routes.rb`, vamos alterar a instrução de root para:

```ruby
  root "site#index"
```
Em seguida, podemos iniciar o servidor e acessar a página inicial do nosso site, com o comando:

```bash
./bin/dev
```

Ao acessar [http://localhost:3000](http://localhost:3000), você deve ver esta tela:

  <img src="https://i.ibb.co/cNXky9M/Captura-da-Web-14-9-2023-151854-127-0-0-1.jpg" alt="" class="">

Vamos adicionar um botão para acessar a primeira página do nosso site, primeiro, vamos isto do jeito tradicional, utilizando recurso do turbo apenas para navegar entre as páginas, como rails já esta configurado para fazer.

Em `index.html.erb` adicione o trecho de código a seguir:

```erb
<div>
  <%= link_to 'Load First Page (HTML)', site_first_page_path, class:'btn-primary'%>
</div>
```
Para deixar as coisas mais bonitas, adicione o trecho de código ao arquivo `app/assets/stylesheets/application.tailwind.css`:

```css
@layer components {
  .btn-primary {
    @apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800;
  }
}
```

Agora que temos um botão para nossa requisição, basta clicar nele para acessar a primeira página do nosso site.

Para entendermos o que esta acontecendo, vamos abrir o menu de inspeção do navegador que esta utilizando, e acessar a aba Network. 

Logo após a requisição, vamos inspecionar a sub-aba **Resposta**, para ver o que foi retornado pelo servidor.

  <img src="https://i.ibb.co/2vyK8JF/Screenshot-1.jpg" alt="" class="">

Observe que ao clicar no botão, uma nova página é carregada, contendo todas as tags necessárias, ou seja, o cabeçalho (*<head>*) com a importação de todos os scripts e estilos necessários para que tudo funcione. 

Neste cenário, Turbo (através de Turbo Drive) se encarega de carregar apenas os arquivos que foram modificado da resposta, sem a necessidade de recarregar todos os arquivos da página.

Agora, vamos implementar um `turbo_frame` para ver como ele funciona.

## Turbo Frame

Voce pode encontrar a documentação oficial do Turbo Frame [aqui](https://turbo.hotwire.dev/reference/frames). 

Em `index.html.erb` adicione o trecho de código a seguir:

```erb
<div>
  <%= turbo_frame_tag 'frame' do %>
    <%= link_to 'Load First Page (TURBO FRAME)', site_first_page_path, class:'btn-primary'%>
  <% end %>
</div>
```

Perceba que o código é exatamente igual ao anterior, exceto por estar dentro de um `turbo_frame_tag` com id `frame`.

Se você clicar no botão, receberá a mensagem **Content missing** como resposta. 

  <img src="https://i.ibb.co/VNXvhpL/Screenshot-2.jpg" alt="" class="">

Isto acontece porque a resposta do arquivo solicitar, deve conter um `turbo_frame` com o mesmo id que foi utilizado na requisição.

Portanto, para entendermos o que esta acontencendo, em `first_page.html.erb` substitua todo o conteúdo do arquivo pelo código a seguir:

```erb
<div class="space-y-4">
  <div class="border">
    <p class="bg-red-600 text-white">This will be render only if was an HTML response</p>
    <h1 class="font-bold text-4xl">Site#first_page</h1>
    <p>Find me in app/views/site/first.html.erb</p>
  </div>

  <div class="">
    <%= turbo_frame_tag "frame" do %>
      <div class='border'>
        <p class="bg-blue-600 text-white">This will be render with HTML/TURBO_FRAME response</p>
        <h1 class="font-bold text-4xl">Site#first_page TURBO_FRAME</h1>
        <p>Find me in app/views/site/first.html.erb</p>
      <% end %>
    </div>
  </div>
</div>
```

Vejamos a imagem a seguir:

  <img src="https://i.ibb.co/hd91pCb/20230914-160105.gif" alt="" class="">

Ao clicarmos no primeiro botão, a url é alterada, e como vimos anteriormente, a resposta é uma página HTML completa, com todos os recursos necessários para que a página funcione.

Ao clicarmos no botão 'turbo frame', a url **não** é alterada, e a resposta é alterada apenas com o conteúdo que esta dentro do `turbo_frame_tag` com id `frame`, mantendo o restante da página sem alterações.

  <img src="https://i.ibb.co/DzGLG4Z/Screenshot-3.jpg" alt="" class="">

Ao inspecionarmos a resposta, é possível perceber algumas mudanças, sendo a principal, a ausência do cabeçalho (<head>).

Isto acontece, porque este conteúdo já foi carregado anteriormente, e não é necessário carregar novamente.

Também é possível notar que apesar de existir um código HTML fora da tag `turbo_frame_tag`, ele não é renderizado ao fazer uma requisição via turbo_frame. 

Isto ocorre porque o Turbo Frame não permite que o conteúdo fora da tag correspondente a solicitação seja renderizado.


  <img src="https://i.ibb.co/4jQXDm3/Screenshot-4.jpg" alt="" class="">

**Nota 1.**: Caso utilize recursos de Turbo Frame, é recomendado que todo o conteúdo seja envolvido por uma tag `turbo_frame_tag`.

**Nota 2.** Na documentação de Frames, é possível adicionarmos o atributo `target='_top'` à um `turbo_frame`, ou adicionar o atributo `data-turbo-frame='_top'` à um `link` dentro do turbo frame. Fazendo isto, você irá forçar o conteúdo a ser renderizado fora do frame, ou seja, na página principal. Isso implica no mesmo comportamento do primeiro botão.
(Isto pode ser desejado em alguns casos).

Além destas observações, também é possível perceber que clicar no botão 'turbo frame', o próprio botão é substituido pelo conteúdo da resposta. 

Isto acontece porque o Turbo Frame, por padrão, substitui o conteúdo do frame, contudo, é possível alterarmos o código para que isto não aconteça mais.

Em `index.html.erb` substitua o código:

```erb
<div>
  <%= turbo_frame_tag 'frame' do %>
    <%= link_to 'Load First Page (TURBO FRAME)', site_first_page_path, class:'btn-primary'%>
  <% end %>
</div>
```
Por 
```erb
<div>
  <%= link_to 'Load First Page (TURBO FRAME)', site_first_page_path, class:'btn-primary', data: {turbo_frame:'frame'}%>
</div>

<div>
  <%= turbo_frame_tag 'frame' %>
</div>
``` 

Desta forma, o botão não será substituido, e o conteúdo da resposta será renderizado dentro do frame indicado.

  <img src="https://i.ibb.co/fvZgDwt/20230914-163531.gif" alt="" class="">

Certo, antes de avançarmos para Turbo Streams, vamos falar um pouco sobre as vantagens e desvantagens de utilizar Turbo Frames.

### Problemas 

- O primeiro problema é que só é possível atualizar um único frame por requisição. Isto quer dizer que se você precisa atualizar duas partes da página ao clicar em um botão, isto não será possível com Frames.

- O segundo problema é que o conteúdo do frame só pode ser 'atualizado', ou seja, o frame não pode ser removido, ou ter conteúdo inserido antes/depois do conteúdo atual, (a não ser que o conteúdo seja duplicado, o que não é recomendado).

- O terceiro problema, é que o conteúdo do frame só é atualizado mediante a ação do usuário, ou seja, não é possível enviar conteúdo diretamente do servidor. É necessário que o usuário faça isto através de uma requisição.

### Vantagens

- Uma vantagem de Turbo Frame, é que sua implementação é relativamente simples, bastando apenas envolver o conteúdo que deseja atualizar em um turbo_frame.

- Uma segunda vantagem é que `turbo_frame` pode ter o atributo `loading: :lazy`, permitindo que conteúdos mais pesados sejam carregados apenas quando renderizados, tornando o carregamento da página ainda mais rápido. Um exemplo disso pode ser encontrado no artigo [infinite-scroll](https://lucasgeron.github.io/2023/09/12/rails-infinite-scroll.html) 

- Uma terceira vantagem, é que através de Turbo, Frames podem ter Caching, ou seja, em alguns casos, é possível atualizar, voltar ou avançar a página sem que o conteúdo do frame seja perdido. (Para testar este recurso, clique no botão 'turbo frame', em seguida, no botão 'html', e depois volte para a página anterior pelo botão do navegador. Você irá perceber que o conteúdo do frame não foi perdido).

  <img src="https://i.ibb.co/f4TpRy0/20230914-230204.gif" alt="" class="">


Certo, agora que já conhecemos um pouco sobre Turbo Frames, vamos falar sobre Turbo Streams.

## Turbo Streams

Diferente de Frames, **Turbo Streams** não possuem limitações em relação a quantidade de conteúdo que pode ser atualizado, e também possuí várias vantagens que vamos abordar em seguida.

Para implementar um exemplo de Turbo Stream, no arquivo `index.html.erb`, adicione o trecho de código ao fim do arquivo.

```erb
<div>
  <%= link_to 'Load First Page (TURBO STREAM)', site_first_page_path, class:'btn-primary', data: {turbo_stream: true}%>
</div>

<div id="my_stream">
  <p>Sample content for stream example</p>
</div>
``` 

Em seguida, crie o arquivo `app/views/site/first_page.turbo_stream.erb` com o seguinte conteúdo:

```erb
<%= turbo_stream.update "my_stream" do %>
  <p> replaced by turbo stream </p>
<%end%>
```

Simples assim! Ao clicar no botão 'turbo stream', o conteúdo do frame será substituido pelo conteúdo da resposta.

  <img src="https://i.ibb.co/TmqSSRr/20230914-174231.gif" alt="" class="">

Vamos inspecionar a resposta para entendermos o que aconteceu.

  <img src="https://i.ibb.co/wypn6jZ/Screenshot-5.jpg" alt="" class="">

A resposta de Turbo Stream é encapsulada em uma tag `<template>`. Isto é necessário para que o navegador interprete o conteúdo da resposta corretamente.

O atributo `action` indica qual ação deve ser realizada pelo servidor, neste caso `update`, e o atributo `target` indica o elemento que deve ser afetado, neste caso `my_stream`.

Para vermos a funcionalidade de afetar multiplos elementos, vamos adicionar mais dois elementos ao arquivo `index.html.erb`:

```erb
<div id="other_stream">
  <p>Other content:</p>
</div>

<div id="remove_me">
   <p>Remove me</p>
</div>
```

Agora em `first_page.turbo_stream.erb` vamos adicionar ao final do arquivo o seguinte código:

```erb
<%= turbo_stream.remove "remove_me" %>

<%= turbo_stream.append "other_stream" do %>
  <% 3.times do |i| %>
  <p> something else <%= i+1 %>  </p>
  <%end%>
<% end %>
```

Ao clicar no botão, tudo isso acontece em uma única resposta, e todas as ações são executadas conforme esperado.

  <img src="https://i.ibb.co/09M5wyy/20230914-175538.gif" alt="" class="">

Ótimo, mas além disto, Turbo Stream possui uma outra vantagem muito interessante, que é a possibilidade de receber atualizações via WebSockets, ou seja, é possível atualizar o conteúdo da página sem que o usuário precise fazer uma requisição.

Mais interessante que isso, é que também possível enviar esta atualização para todos que estejam na aplicação, algo como um 'live stream'.

Com o código atual, se abrirmos dois navegadores e testarmos o recurso de Stream, você vera algo como isto:

  <img src="https://i.ibb.co/7zRrYV0/20230914-180658.gif" alt="" class="">

Neste caso, os navegadores não estão sincronizados, ou seja, se você clicar no botão em um navegador, o outro não será atualizado.

Poderiamos utilizar recursos de ActionCable, e criar um canal de comunicação para que os navegadores se comuniquem, mas isto seria um pouco trabalhoso, e não é necessáriamente obrigatório para todo caso.

Para facilitar este processo, Turbo possui uma tag chamado `turbo_stream_for` que permite realizar este comportamento. 

Em `index.html.erb`, adicione o código a seguir: 

```erb
<div>
  <%= link_to 'Load Stream Page (TURBO STREAM VIA WEBSOCKET)', site_stream_page_path, class:'btn-primary', data: {turbo_stream: true}%>
</div>

<%= turbo_stream_from "my_stream_from" %>
``` 

Em `routes.rb`, adicione a rota para `stream`.

```ruby
  get 'site/stream_page'
```


Agora em `site_controller.rb`, adicione o seguinte código:

```ruby
def stream_page
  Turbo::StreamsChannel.broadcast_update_to("my_stream_from", target: "my_stream", partial: 'site/stream')
end
```

Este trecho de código irá criar um canal de comunicação entre o navegador e o servidor com o id `my_stream_from`, e irá atualizar o conteúdo do elemento `my_stream` sempre que receber houver uma requisição. 

O atributo `partial` indica qual arquivo (partial) deverá ser renderizado, portanto, vamos criar este arquivo.

Em `app/views/site/` crie a partial `_stream.html.erb` com o seguinte conteúdo:

```erb
<p class="btn-primary bg-red-600">Hello from Turbo Streams at <%=  Time.now.strftime("%H:%M:%S") %> </p>
```

E como estamos fazendo uma requisição com `data-turbo-stream: true`, será necessário criar o arquivo `stream_page.turbo_stream.erb`, no diretório `app/views/site/`. 


Este arquivo poderá ser em branco, sendo utilizado apenas pela convensão rails como resposta turbo_stream, ou se você preferir, pode incluir as ações `turbo_stream` que desejar. 

Mas lembre-se! no arquivo `stream_page.turbo_stream.erb`, as atualizações ocorrem apenas no cliente que fez a requisição. 

Enquanto que `Turbo::StreamsChannel.broadcast_update_to` envia a atualização para todos os clientes conectados.


Para exemplicar, vamos adicionar o seguinte código no arquivo `stream_page.turbo_stream.erb`:

```erb
<%= turbo_stream.append "other_stream" do %>
  <% 3.times do |i| %>
    <p> something else added by stream_page <%= i+1 %>  </p>
  <%end%>
<% end %>
```

Agora vamos ver na prática o que acontece!



  <img src="https://i.ibb.co/b3HsCbS/20230914-215526.gif" alt="" class="">

### Entendendo o Fluxo 
- Clique em Load Fist Page (TURBO_STREAM)
  1. A requisição `first_page` no formato `turbo_stream` é feita para o servidor.
  2. O Servidor responde com o arquivo `first_page.turbo_stream.erb`
  3. A div `my_stream` é **atualizada (update)** com *'replaced by turbo'*.
  4. A div `remove_me` é **removida (remove)**
  5. a div `other_stream` é **recebe (append)** 3 novos parágrafos ('*something else*').


- Clique em Load Stream Page (TURBO STREAM VIA WEBSOCKET)
  1. A requisição `stream_page` no formato `turbo_stream` feita para o servidor.
  2. O servidor envia uma **atualização (broadcast_update_to)** para o canal `my_stream_from` com o conteúdo da partial `site/stream` solicitando que a div `my_stream` seja atualizada.
  3. O conteúdo da partial (*'Hello from Turbo Stream + TIME'*) é **atualizado** na div `my_stream` em todos os clientes conectados.
  5. O Servidor responde ao cliente que fez a requisição com o arquivo `stream_page.turbo_stream.erb`
  6. A div `other_stream` **recebe (append)** 3 novos parágrafos (*'something else added by stream_page'*).


- Clique em Load Fist Page (TURBO_STREAM)
  1. A requisição `first_page` no formato `turbo_stream` é feita para o servidor.
  2. O Servidor responde com o arquivo `first_page.turbo_stream.erb`
  3. A div `my_stream` é **atualizada (update)** com *'replaced by turbo stream'*, Substituindo a informação ('*Hello from Turbo Streams + TIME*') anterior.
  4. a div `other_stream` **recebe (append)** 3 novos parágrafos ('*something else*').

- Clique em Load Stream Page (TURBO STREAM VIA WEBSOCKET) 
  1. O passo 2 se repete, porém, em outro cliente.

e assim por diante...

Desta forma, é possível criar uma aplicação dinamica, que pode receber conteúdo diretamente de um websocket e também pode permitir que o usuário realize ações de maneira individual, afetando apenas seu navegador, ou de maneira global. 

Um exemplo de aplicação que pode ser criada utilizando este recurso é:

- **Atualização de Eventos (Jogo de Futebol)** : Imagine uma aplicação onde o mantenedor da aplicação publica os acontecimentos do jogo e os usuários pode acompanhar em tempo real. Nesta aplicação, o usuário pode ter a opção de curtir ou não o acontecimento, e esta ação pode ser enviada para todos os usuários conectados, ou vinculada apenas para o usuário que realizou a ação.

- **Enquete Coletiva** : Imagine uma aplicação onde o mantenedor cria uma enquete qualquer. Todos os usuários conectados podem votar. O resultado da enquete é atualizado em tempo real para todos os usuários conectados. Caso o usuário já tenha votado, ele pode ver o resultado da enquete, mas não pode votar novamente.

- **Trend Topics** : Imagine uma aplicação onde existe um top 10 de assuntos mais comentados. Todos os usuários conectados podem ver o top 10, e realizar ações como 'up/down', ou sugerir um novo tópico. Assim que um novo assunto entra no top 10, todos os usuário conectados recebem uma notificação.

- **Lista de Presentes de Casamento** : O casal adiciona os items desejados a uma lista, os convidos, podem realizar a compra de um item, e este item é riscado da lista. Todos os usuários conectados podem ver a lista de presentes, e realizar a ação de 'comprar'. Ao fazer isto, a lista é atualizada para todos os usuários conectados. O usuário que indicou a compra é o único que pode cancelar a compra, e ao fazer isto, a lista é atualizada para todos os usuários conectados, indicando que o produto voltou para lista de presentes.

## Conclusão

O Turbo sem dúvida é um recurso poderoso na hora de desenvolver aplicações web.

Além de reduzir significativamente as respostas do servidor, evitando o carregamento forçado de todos os arquivos a cada requisição, ele também permite levar ao usuário uma navegação mais imersiva, podendo explorar a aplicação sem a necessidade de ser redirecionado a cada link acessado.

Turbo também permite que o conteúdos mais pesados sejam carregados apenas quando forem de fato renderizado, e que usuário realize ações que afetam apenas sua experiência, ou ações que afetam todos os usuários conectados.

Para finalizar, uma tabela comparativa entre o Turbo Frame e Turbo Stream retirada do artigo de [mixandgo.com](https://mixandgo.com/learn/ruby-on-rails/turbo-frames-vs-turbo-streams).

| Feature | Turbo Frames | Turbo Streams |
|---------|:------------:|:-------------:|
| Lazy-loading | ✔️ | ❌ |
| Caching | ✔️ | ❌ |
| Múltiplas Atualizações | ❌ | ✔️ |
| Múltiplas Ações | ❌ | ✔️ |
| Funciona com WebSockets | ❌ | ✔️ |
| Fácil de Implementar | ✔️ | 💭 |

