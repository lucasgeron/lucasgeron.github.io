---

layout: post
title: "Rails Inifite Scroll with Turbo"
date: 2023-09-12
short_description: "Neste artigo te mostro como criar o efeito de rolagem infinita sem utilizar javascript. De bônus também vou te dar mais duas dicas que podem ajudar muito na hora de criar um blog."
cover: https://i.ibb.co/2ZsCWts/20230913-144634.gif
categories:
- Tutorial
tags:
- Ruby On Rails
- Hotwire Turbo
- Useful Gems
---

# Rails Inifite Scroll with Zero Javascript

<div class="w-full img-fluid rounded-3 mb-4 text-center">
 <iframe width="560" height="315" src="https://www.youtube.com/embed/b7j8jEAd2sc?si=zxuGFeGd-j7alaJz&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

Desta vez, vamos direto ao assunto, sem enrolação. Vamos criar um blog com rolagem infinita, sem utilizar javascript. Para isso, vamos utilizar apenas [Turbo](https://turbo.hotwire.dev/) e algumas gems como [Pagy](https://ddnexus.github.io/pagy/), [ActionText](https://github.com/rails/rails/tree/main/actiontext) e [Active Record Import](https://github.com/zdennis/activerecord-import).

## Criando o projeto 

Abra seu terminal e em seu ambiente de trabalho digite os comandos a seguir para criar e acessar o diretório do projeto.

```bash
rails new rails-infinite-scroll --css=tailwind
cd rails-infinite-scroll
```

## ActionText

Certo, a primeira dica é esta! Como vamos um blog, é interessante permitirmos que o usuário possa escrever seus artigos utilizando o editor de texto.

Para isso, vamos utilizar o ActionText, que é uma biblioteca que disponível em Rails que nos permite integrar um editor de texto [Trix](https://trix-editor.org/).

Este recurso permite que ao longo do artigo, o autor possa incluir imagens, por isto, é necessário instalar o Active Storage antes de instalarmos o ActionText.

Em seu terminal execute os comandos a seguir:
```bash
rails active_storage:install
rails action_text:install
```

**Importante:** Se você estiver utilizando WSL2, talvez seja necessário instalar a biblioteca `libvips`. Para fazer isto, basta executar o comando:
`sudo apt install libvips`. Caso já tenha ela instalado, basta seguir em frente. 

Além do Active Storage, Action Text utiliza a gem image_processing, que por padrão, vem comentada no Gemfile.

## Active Record Import

A segunda dica, também vem logo no começo do artigo! Como queremos simular a rolagem infinita das postagens de um blog, teremos que criar estes registros. Para isto, vamos utilizar a gem [Active Record Import](https://github.com/zdennis/activerecord-import).

Esta gem nos permite criar vários registros de uma só vez, o que é muito útil para criar registros de teste, como é o caso deste artigo. 

Portanto, vamos editar nosso arquivo ***Gemfile*** para incluir as gems necessárias e habilitar a gem `image_processing` que por padrão, está comentada.

Procure a linha que contém a gem `image_processing` e descomente-a. Em seguida, adicione as gems `activerecord-import`, `faker` e `pagy` conforme o trecho de código abaixo:

```ruby
# ...
# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
gem "image_processing", "~> 1.2"

gem 'activerecord-import'
gem 'faker'
gem 'pagy', '~> 6.0' 

# ...
```

**Faker** será utilizada para gerar dados aleatórios para o nosso blog, e **Pagy** para criar a paginação dos artigos.

Agora podemos instalar as gems com o bundle.

```bash
bundle install
```

Após isto vamos terminar a configuração da gem Pagy conforme recomenda a documentação.

Em `app/controllers/application_controller.rb` adicione o código abaixo:

```ruby
include Pagy::Backend
```

Em `app/helpers/application_helper.rb` adicione o código abaixo:
  
```ruby
include Pagy::Frontend
```
Tudo pronto para continuarmos...

## Criando o modelo
Nosso modelo de exemplo será ***Article*** que terá os atributos *title*, *cover_url* e *body*. Para criar o modelo e executar a criação do banco de dados, execute os comandos:

```bash
rails g model Article title:string cover_url:string body:rich_text
```

```bash
rails db:migrate
```

## Populando a base de Dados

Para criarmos vários artigos em nosso blog, podemos utilizar o arquivo `db/seeds.rb`. Provavelmente você deve estar habituado a escrever um trecho de código semelhante ha este:

```ruby
require 'faker'

100.times do 
  Article.create(  
    title: Faker::Book.title, 
    cover_url: "https://picsum.photos/id/#{i}/800/800")
end
```
Não há nada de errado em fazer isto desta forma, contudo, com o código acima, serão executadas **100 queries no banco de dados**. 

##### Com Active Record Import podemos criar os 100 registros (ou mais) com apenas uma query.

Para fazer isto, no arquivo `db/seeds.rb` adicione o código abaixo:

```ruby
require 'faker'

articles = []
bodies = []

10.times do |i|
  articles << Article.new(    
    title: Faker::Book.title, 
    cover_url: "https://picsum.photos/id/#{i}/800/800")
  bodies << ActionText::RichText.new(
    body: Faker::Lorem.paragraph(sentence_count: 20), 
    record_id: i+1, 
    record_type: "Article", 
    name: "body" )
end

p Article.import articles
p ActionText::RichText.import bodies 
```

Agora, para criar os registros, basta executar o comando:

```bash
rails db:seed
```
A saída deverá ser algo semelhante há:

  <img src="https://i.ibb.co/rFjX2t6/screen-shot-01.png" alt="" class="">

Isto nos informa que foi feito apenas uma inserção para cada tabela, contudo, todos os registros foram salvos por uma única query.

## Iniciando o Servidor
Agora que temos registros em nossa base de dados, podemos iniciar o servidor compilando os arquivos de tailwind.

```bash
./bin/dev
```

Para ver se tudo esta funcionando corretamente, acesse [http://localhost:3000/articles](http://localhost:3000/articles). Você deverá ser algo como:

  <img src="https://i.ibb.co/tsNkCpx/Screenshot-1.jpg" alt="" class="">

## Estilizando a página
Antes de adicionarmos as funcionalidades, vamos estilizar nossa aplicação para que a interface fique mais amigável. Para isto, vamos utilizar o Tailwind CSS.

No arquivo `app/views/layouts/application.html.erb` vamos alterar o elemento `main`, substituindo a classe *mt-28* por *my-4*. (isto removerá o espaçamento superior)

```erb
<main class="container mx-auto my-4 px-5 flex">
  <%= yield %>
</main>
```

Em `app/views/articles/_article.html.erb` vamos substituir todo o código pelo código abaixo:

```erb
<div id="<%= dom_id article %>">
  <%= link_to article do %>
    <div class="bg-cover bg-center <%= action_name == "show" ? 'h-96' : 'h-52'%> rounded-lg relative" style="background-image: url(<%= url_for(article.cover_url) %>)">
      <p class="text-xl text-white font-bold absolute bottom-0 rounded-b-lg w-full p-2 h-10 bg-gray-800/60">
        <%= article.id %> <%= article.title %>
      </p>
    </div>
  <%end%>

  <% if action_name == "show" %>
    <p class="my-5">
      <%= article.body %>
    </p>
  <% end %>
</div>
```

Em `app/views/articles/index.html.erb` por enquanto, vamos apenas incluir algumas classes a 'articles', e adicionar a paginação de Pagy.

```erb
<!-- .... -->
 <div id="articles" class="min-w-full grid grid-cols-1 md:grid-cols-3 gap-2 my-4">
   <%= render @articles %>
</div>

<div class="text-center text-xl">
  <%== pagy_nav(@pagy) if @pagy.pages > 1 %>
</div>
<!-- .... -->
```

Por fim, altere o arquivo `app/controllers/articles_controller.rb` para que fique semelhante ao código abaixo:

  ```ruby
# GET /articles or /articles.json
def index
  # @articles = Article.all
  @pagy, @articles = pagy(Article.all, items: 3)
end
```
Agora, nossa página de artigos deve estar com uma aparência melhor. 

  <img src="https://i.ibb.co/8rd1dP9/Captura-da-Web-12-9-2023-202434-127-0-0-1.jpg" alt="" class="">

Além disto, caso você tente editar um artigo, poderá ver o **ActionText** em ação! 

  <img src="https://i.ibb.co/89tHxPX/Captura-da-Web-12-9-2023-20260-127-0-0-1.jpg" alt="" class="">

Uma maravílha poder editar seus artigos com Rich Text, não é mesmo? E com Active Storage, tambem **é possível anexar imagens direto do editor!** Dica de ouro ein! 

## Adicionando Funcionalidades

Agora que temos uma base para trabalhar, vamos implementar o scroll infinito. 

Primeiro, vamos criar uma partial chamada `_article_placeholder.html.erb` em `app/views/articles/` e adicionar o código abaixo:

```erb
<div>
  <div class="bg-cover bg-center h-52 rounded-lg relative animate-pulse bg-gray-400" >
    <p class="text-xl text-white font-bold absolute bottom-0 rounded-b-lg w-full p-2 h-10 bg-gray-800/60 "></p>
    <div class="w-2/4 bg-gray-400 animate-pulse block h-6 rounded absolute bottom-2 left-2 mx-auto"></div>
  </div>
</div>
```
Este código será utilizado para renderizar um artigo sendo carregado enquanto a requisição é processada.

Agora, no arquivo `app/views/articles/index.html.erb` vamos incluir o trecho de código a seguir,  acima da div com id ***articles***:

```erb
<div id="articles_placeholder" class="min-w-full grid grid-cols-1 md:grid-cols-3 gap-2">
  <% 3.times do  %>
    <%= render partial: 'article_placeholder' %>
  <% end %>
</div>
```

Isto deverá renderizar 3 artigos com o efeito de loading.

  <img src="https://i.ibb.co/rkP2wvK/20230912-211039.gif" alt="" class="">

Continuando... vamos **remover** os artigos que são renderizados na div com id *articles*. Vamos fazer isto porque esta div passará ser um Turbo Frame, e seu conteúdo será atualizado com Turbo.

Além disto, como ja conferimos que nosso placeholder de carregamento esta semelhante ao artigo, podemos refatorar o código para que o placeholder seja renderizado no lugar dos artigos enquanto os mesmos são carregados.


Ainda em `index.html.erb` substitua o trecho de código do arquivo para:

```erb	
<!-- ... -->
  <div id="articles_placeholder" class="min-w-full grid grid-cols-1 md:grid-cols-3 gap-2">
    <% 3.times do  %>
      <%= render partial: 'article_placeholder' %>
    <% end %>
  </div>

  <div id="articles_list" class="min-w-full grid grid-cols-1 md:grid-cols-3 gap-2 my-4">
    <%= render @articles %>
  </div>
```
Por: 

```erb
<!-- ... -->
<%= turbo_frame_tag "articles_list_page_1", src: list_articles_url(page: @page), loading: :lazy, target:'_top', class:"min-w-full grid grid-cols-1 md:grid-cols-3 gap-2 my-2" do %>
  <% 3.times do  %>
    <%= render partial: 'article_placeholder' %>
  <% end %>
<%end%>
<%= turbo_frame_tag "articles_list_page_#{@pagy.next}" if @pagy.next.present?%>
```

Calma, eu sei que agora as coisas podem ter ficado um pouco confusas, mas já já tudo fará sentido.


Perceba que o atributo `src` do turbo_frame faz uma solicitação para list_articles_url, portanto, antes de seguirmos em frente, vamos criar a rota para `list` em `routes.rb`:

```ruby
  resources :articles do 
    get :list, on: :collection
  end
```

Agora, em `articles_controller.rb` vamos implementar `list` que será responsável por renderizar os artigos de acordo com a página que o usuário estiver. 

Em `articles_controller.rb` adicione o metódo `list`:

```ruby
def list
  @page = params[:page] ? params[:page].to_i : 1
  @pagy, @articles = pagy(Article.all, items: 3, page: @page)
end
```
Talvez neste momento você se pergunte, ué, mas não vamos usar Turbo? Porque então estamos criando uma action para renderizar os artigos em html? 

Bom, a resposta é simples (ou parece), o Turbo é um framework que permite responder diretamente com código html, portanto, iremos atualizar o turbo_frame com o conteúdo que será gerado em `list.html.erb`, que por sua vez, irá renderizar os artigos.


Agora, para implementarmos o comportamento esperado, vamos criar o arquivo `list.html.erb` em `app/views/articles/` e adicionar o código abaixo:

```erb
<%= turbo_frame_tag "articles_list_page_#{@page}" do %>
  <%= render @articles %>

  <%= turbo_stream.replace "articles_list_page_#{@pagy.next}" do %>
    <%= turbo_frame_tag "articles_list_page_#{@pagy.next}", src: list_articles_url(page: @pagy.next), loading: :lazy, target:'_top', class:"min-w-full grid grid-cols-1 md:grid-cols-3 gap-2 my-2"%>
    <%= turbo_frame_tag "articles_list_page_#{@pagy.next+1}" if @pagy.next < @pagy.last%>
  <% end if @pagy.next.present? %>

<% end %>
```
Tudo pronto para funcionar conforme o esperado. Simples, não? (kk eu sei que não... 😅)

Para fins de testes, vamos adicionar a função `sleep 1` nas actions  `index` e em `list`, e fazer uma pausa da entendermos o que está acontecendo até aqui.

  <img src="https://i.ibb.co/9t17rJv/20230912-222157.gif" alt="" class="">

## O que está acontecendo? 

1. A requisição `/articles` é feita e o servidor responde com o html da página `index.html.erb`.

2. O arquivo `index.html.erb` é renderizado, inicialmente carregando o placeholder dos artigos.

3. Ainda no arquivo `index.html.erb`, o turbo_frame renderizado possui o atributo `loading: :lazy` que define a renderização do elemento apenas quando ele estiver visível na tela. (isto evita que todos os artigos sejam carregados de uma única vez). Já o atributo `src`, solicita uma requisição para `list_articles_url(page: params[:page])`, ou seja, assim que o frame é renderizado,os placeholders são renderizados e a requisição de `src` é enviada para o servidor.

**OBS**: Ainda em `index.html.erb`, perceba que na última linha, existe um turbo_frame que será renderizado apenas se existir uma próxima página.

1. Ao interpretar a requisição de `articles_controller#list`, o servidor responde com o arquivo `list.html.erb`, que renderiza os artigos solicitados pela requisição no turbo_frame `articles_list_page_1` (primeira requisição).

2. Agora, **caso exista uma próxima página**, mais duas coisas acontecem. Na mesma resposta, um `turbo_stream.replace` é utilizado para substituir o turbo_frame `articles_list_page_2` criado anteriormente (caso exista), renderizando o conteúdo da próxima página no turbo_frame `articles_list_page_2`.

3. Neste cenário, o turbo_frame `articles_list_page_2` percorre o mesmo caminho da primeira requisição, porem, com `page: 2`, e logo renderiza seus devidos artigos. 

4. A segunda coisa que acontece é que *dentro da condição de existir uma próxima página*, a última linha do código cria o próximo o turbo_frame `articles_list_page_3`, apenas **caso exista uma próxima página** (próxima da próxima...) para que o comportamento se repita sucessivamente.

**NOTA 1.**: O atributo `target: '_top'` é utilizado para que o turbo_frame **não** substitua o conteúdo apenas do turbo_frame que o instanciou, alterando portanto todo o conteúdo da página ao acessar um artigo. 

**NOTA 2.**: O atributo `loading: :lazy` é quem controla o carregamento dos artigos. Turbo Frames com este atributo são renderizados apenas quando estão visíveis na tela, desta forma, ao rolar a página para baixo, o turbo_frame é renderizado e os artigos são carregados. Caso este atributo seja removido, os artigos devem ser carregados todos de uma vez, independente de estarem visíveis ou não. Portanto, vale destacar que se for para carregar todos os artigos de uma única vez, não faz sentido utilizar o scroll infinito, e a ação `Articles.all` de `index` seria recomendada.

Certo, agora que entendemos o que esta ocorrendo, vamos criar mais artigos e rolar!

## Testando o Scroll Infinito

Altere o número de artigos que deseja gerar - recomendo 50 - em `db/seeds.rb` e execute `rails db:reset`, em seguida, remova `sleep 1` de `index` e `list` teste novamente.

<div class="w-full img-fluid rounded-3 mb-4 text-center">
 <iframe width="560" height="315" src="https://www.youtube.com/embed/b7j8jEAd2sc?si=zxuGFeGd-j7alaJz&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

Agora é possível ver o scroll infinito funcionando como esperado, e o melhor de tudo, sem escrever uma linha de javascript.

## Extra 

Se você chegou aqui, talvez ainda esteja confuso em relação ao Turbo, já que não estamos usando `turbo_stream` como esperado. Sim, eu sei, parece estranho. Mas, acredite, o Turbo é muito mais do que apenas turbo_stream.  

Abra o console do navegador e navegue pela sua aplicação para acompanhar as requisições que estão sendo feitas. Além disto, esta implementação garante que `Turbo.visit()` seja executado conforme o esperado, isto significa que após acessar um artigo em seguida clicar no botão voltar do seu navegador, os artigos que já foram carregados, continuarão na tela, e o atributo `page` será mantido, permitindo que voce continue a rolar a página de onde parou. 

<div class="w-full img-fluid rounded-3 mb-4 text-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/d5aT4VQz368?si=Sjf7dbg9gAuISeJx&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

**Dica**: **As outras implementações que voce encontra por ai, talvez não tenham este comportamento implementado, algumas delas, só funcionam se você voltar a listagem desde o começo - vai por mim, eu testei!**

## Conclusão

Neste artigo, vimos como implementar **Scroll Infinito** em uma aplicação Rails utilizando Turbo. 

Também conhecemos alguns recursos de Rails que podem ser dicas valiosas. **Action Text**, que permite a criação de campos de texto como RichText, incluíndo upload de imagens. 

Também vimos a gem **Active Record Import** que permite criar vários registros com uma única query ao banco de dados, tornando o tempo de processamento e consumo de memória muito mais eficientes.

Por fim, exploramos um pouco do que a gem **Pagy** pode fazer, e como ela pode ser utilizada para implementar paginação simples e scroll infinito.