---

layout: post
title: "Rails Pixels App"
date: 2023-09-10
short_description: "Rails Pixels é uma aplicação criativa feita para exemplicar o funcionamento de ActiveJobs e de TurboStreams. Vamos colorir alguns pixels juntos?"
cover: https://i.ibb.co/FXhkZsx/20230910-184020.gif
read_time: true
toc: true
github_repo: rails-pixels-app
categories:
- Tutorial
tags:
- Ruby On Rails
- Hotwire Turbo
- Design

---


# Rails Pixels App
Rails Pixels App é uma forma criativa de demonstrar o uso de **ActiveJobs** e **Turbo Streams** em uma aplicação Rails.

Para demonstrar essas funcionalidades, colorimos os pixels em segundo plano através de um ActiveJob e enviamos o resultado ao cliente via TurboStream em real-time.

Seu principal objetivo é simples, colorir pixels. Eu sei, isso pode parecer chato, mas acredite, é divertido e além disto, é uma ótima forma de entender como ActiveJobs e Turbo Streams funcionam.

  <img src="https://i.ibb.co/FXhkZsx/20230910-184020.gif" alt="" class="">


## Introdução
Se você é iniciante em Rails, provavelmente deve estar habituado com os CRUD's tradicionais, afinal, scaffold é uma das primeiras coisas que aprendemos quando começamos a estudar Rails.

Mas a medida nossas aplicações vão crescendo e se tornando mais complexas, outros recursos do Rails começam a se tornar necessários, como por exemplo, **ActiveJobs** e **Turbo Streams**. 

### ActiveJobs
Sabe quando você precisa executar uma tarefa que leva muito tempo para ser concluída? 

Por exemplo, enviar um e-mail para todos os usuários do seu sistema. Você não vai querer que o usuário fique esperando até que todos os e-mails sejam enviados, certo?

É aí que entra o ActiveJobs, ele é uma ferramenta que nos permite executar tarefas em segundo plano, sem que o usuário precise ficar esperando.

Nesta aplicação, utilizamos o ActiveJobs para colorir os pixels, pois como você deve imaginar, colorir vários pixels com cores distintas de uma vez só, leva um certo tempo.

<!-- ## ActionCable
ActionCable é uma ferramenta que nos permite criar funcionalidades que utilizam WebSockets com atualização em tempo real, ou seja, aplicações que se atualizam automaticamente sem que o usuário precise atualizar a página.

A aplicação mais comum de ActionCable é ser utilizado para criar chats em tempo real, mas este recurso também pode ser utilizado para muitas outras coisas, como por exemplo, barra de progresso, notificações, salvamentos automáticos, sincronização de pastas e até mesmo dashboards interativas. -->

### Turbo Streams
Turbo Streams é uma ferramenta que nos permite atualizar partes específicas de uma página HTML, sem que o usuário precise atualizar a página.

Nesta aplicação, utilizamos o recursos de Turbo Stream para estabelecer um canal de comunicação que transmite informação dos pixels coloridos em tempo real para o cliente. A partir das informações recebidas, Turbo Stream também se encarrega de atualizar os pixels coloridas na pagina. 

## Criando o Projeto

Para criar o projeto, vamos utilizar o comando `rails new` com o framework CSS `tailwind`, para isto, em seu ambiente de trabalho, execute o comando:

```bash
rails new rails-pixels-app --css=tailwind
```

Em seguida, acesse o diretório criado:

```bash
cd rails-pixels-app
```

## Criando o Modelo

Diferente dos outros projetos, não vamos utilizar recursos de Scaffold, até porque, não queremos criar um CRUD de pixels, mas sim, apenas um modelo para armazenar os pixels.

Para esta aplicação, nosso modelo ***Pixel*** terá apenas o atributo `color`. Para criar o modelo, execute o comando:

```bash
rails g model Pixel color:string
```

Em seguida, execute o comando `rails db:migrate` para criar a tabela no banco de dados.


```bash
rails db:migrate
```

## Criando o Controller
Vamos criar inicialmente um controlador contendo apenas a action ***index***, que será utilizado como tela principal da aplicação.

```bash
rails g controller Pixels index 
```

## Configurando as Rotas

Após criar o controlador, é possível editar o arquivo `config/routes.rb` e definir a rota padrão para a action ***index*** do `pixels_controller.rb`.

```ruby
Rails.application.routes.draw do
  root "pixels#index"
end
```

## Iniciando o Servidor
Agora que já temos o modelo, o controlador e a rota, podemos iniciar o servidor e acessar a aplicação.

```bash
./bin/dev
```

Ao Acessar [http://127.0.0.1:3000](http://127.0.0.1:3000), você deve ver algo como:

  <img src="https://i.ibb.co/K7zgszB/Screenshot-1.jpg" alt="" class="">

## Criando e Renderizando Pixels 
Como nossa aplicação não possui um CRUD, vamos criar vários pixels através do arquivo `db/seeds.rb` e renderizá-los na view `app/views/pixels/index.html.erb`.

Em `db/seeds.rb`, adicione o trecho de código abaixo.

```ruby
370.times do 
  Pixel.create(color: "default")
end
```

Em Seguida, execute o comando `rails db:seed` para criar os pixels no banco de dados.

```bash
rails db:seed
```

Agora, em nosso controlador `app/controllers/pixels_controller.rb`, vamos adicionar o código definir **@pixels** na action ***index***.

```ruby
def index
  @pixels = Pixel.all
end
```

Para renderizar cada pixel, vamos criar uma partial `app/views/pixels/_pixel.html.erb` com o código abaixo:

```erb
<div id="<%= dom_id(pixel) %>" class="pixel <%= pixel.color %>"></div>
```
Em seguida, vamos renderizar a partial na view `app/views/pixels/index.html.erb` com o código abaixo:

```erb
<div class="space-y-4">
  <h1 class="font-bold text-4xl">Pixels#index</h1>
  <div class="flex flex-wrap">
    <%= render @pixels %>
  </div>
</div>
```

Por fim, vamos estilizar os pixels no arquivo `app/assets/stylesheets/application.tailwind.css` com o código abaixo:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {

  .btn-primary {
    @apply py-2 px-4 bg-gray-200 hover:text-white hover:bg-blue-600 rounded-lg;
  }
  
  .pixel {
    @apply w-5 h-5 ;
  }

  .default {
    @apply bg-gray-200;
  }

  .red {
    @apply bg-red-500;
  }

  .green {
    @apply bg-green-500;
  }

  .blue {
    @apply bg-blue-500;
  }

}

.turbo-progress-bar {
  height: 20px;
}
```

Este arquivo estabelece estilos para os pixels, para o botão que será utilizado para colorir os pixels e também aumenta a altura da barra de progresso do Turbo, que será utilizada em seguida.

Ao atualizar a página, você deve ver algo como:

  <img src="https://i.ibb.co/4prL1Vw/Captura-da-Web-10-9-2023-152346-127-0-0-1.jpg" alt="" class="">

## Colorindo os Pixels
Vamos adicionar dois botões logo após a tag `h1` na view `app/views/pixels/index.html.erb`, um para colorir os pixels e outro para redefinir as cores.

```erb
<%= button_to 'Reset', pixels_reset_path, class:'btn-primary', method: :post %>

<%= button_to 'Colorize Action', pixels_colorize_path, class:'btn-primary', method: :post %>
```

Em seguida, vamos criar as rotas para as actions ***colorize*** e ***reset*** no arquivo `config/routes.rb`, adicione as rotas abaixo:

```ruby
post 'pixels/colorize'
post 'pixels/reset'
```

Para facilitar a implementação de código, podemos definir uma constante `COLORS` no modelo ***Pixels*** com as cores disponíveis, neste caso, *red*, *green* e *blue*.

Em `app/models/pixel.rb` adicione o código abaixo:

```ruby
COLORS = %w[red green blue].freeze
```

No controlador, vamos definir as ações ***reset*** e ***colorize*** .

```ruby
def reset
  Pixel.update_all(color:'default')
  redirect_to root_path
end

def colorize
  Pixel.all.each do |pixel|
    pixel.update(color: Pixel::COLORS.sample)
  end
end
```

Antes de ver os pixels serem coloridos ainda é necessário modificar um outro arquivo.

Em `config/tailwind.config.js`, adicione o código abaixo:

```js
// ... 
safelist: [
  'default',
  'green',
  'red',
  'blue',
],
// ...
```
Isto garante que a classe seja incluida na build do arquivo de estilização mesmo que não existam elementos com a classe atribuída.

Agora sim, ao clicar no botão ***Colorize Action***, você deve ver algo como:

  <img src="https://i.ibb.co/Kw3mZzL/20230910-154531.gif" alt="" class="">

Ao clicar em reset, as cores devem voltar ao normal em um piscar de olhos.

Eu sei, você deve ter ficado entediado só de ver este gif, vendo a demora  para pintar os pixels, mas não se preocupe, vamos melhorar isso...

Ainda com esta implementação, é possível perceber que caso o usuário clique no botão ***Colorize Action*** e em seguida no botão ***Reset***, os pixels serão coloridos novamente, pois o Turbo não interrompe a requisição anterior.

E caso o usuário acesse outra página ou atualize a página atual no meio da requisição, a barra de progresso é perdida...

  <img src="https://i.ibb.co/5Lm2vZQ/20230910-155302.gif" alt="" class="">

Isto faz tudo parecer um pouco estranho, não é mesmo?
Agora que as coisas começam a ficar interessantes...

## Utilizando o Active Jobs

Para resolver o problema de requisições concorrentes, vamos utilizar o **Active Jobs**, que é uma biblioteca do Rails que permite executar tarefas em segundo plano.

Para criar o Job, execute o comando abaixo:

```bash
rails g job ColorizePixels
```

Isto irá criar o arquivo `app/jobs/colorize_pixels_job.rb`. Neste arquivo, vamos adicionar a mesma lógica contida na action `colorize` do controlador no método `perform`, exceto a instrução de redirecionamento.


```ruby
def perform(*args)
  Pixel.all.each do |pixel|
    pixel.update(color: Pixel::COLORS.sample)
  end
end
```

Para chamar o Job, vamos adicionar mais um botão em `index.html.erb`, logo após o botão ***Colorize Action***.

```erb
<%= button_to 'Colorize Job', pixels_colorize_job_path, class:'btn-primary', id:'btn-job', method: :post %>
```

Em seguida, vamos criar a rota para o Job no arquivo `config/routes.rb`:

```ruby
post 'pixels/colorize_job'
```

Agora, vamos adicionar o código abaixo no arquivo `app/controllers/pixels_controller.rb`:

```ruby
def colorize_job
  ColorizePixelsJob.perform_later
end
```

Ao clicar no botão ***Colorize Job***, algumas coisas devem acontecer:

- A barra de progresso NÃO será exibida;
- A página NÃO ficará travada em estado de loading;
- Caso atualize a página ou acesse outra página, o Job continuará sendo executado em segundo plano.

  <img src="https://i.ibb.co/yXgRwWg/20230910-160852.gif" alt="" class="">

É importante perceber que caso o usuário clique no botão ***Colorize Job*** e em seguida no botão ***Reset*** ou ***Colorize Action***, é possível que o erro `SQLite3::BusyException: database is locked` seja exibido, isto ocorre porque já existem diversas requisições sendo processadas simultaneamente.

Certo, agora que já temos nosso Job esteja rodando em segundo plano, ainda é necessário atualizar a página de forma manual para acompanhar o processo de colorização dos pixels, o que não é muito legal...

## Utilizando Stream Channels

Para fazer com que os pixels sejam coloridos em tempo real, vamos utilizar o **Turbo Streams**, que é uma biblioteca do Rails que permite a comunicação em tempo real entre o servidor e o cliente de forma simples.

Em `index.html.erb` adicione o trecho de código ao fim do arquivo:
  
```erb
<%= turbo_stream_from 'pixels' %>
```

Esta instrução ira criar um canal de comunicação identificado por `pixels` que será utilizado para receber informações do servidor.

Agora, no nosso job, `colorize_pixels_job.rb`, vamos adicionar o código abaixo:

```ruby
def perform(*args)
  Pixel.all.each do |pixel|
    pixel.update(color: Pixel::COLORS.sample)
    Turbo::StreamsChannel.broadcast_update_to('pixels', target: "pixel_#{pixel.id}", partial: 'pixels/pixel', locals: { pixel: pixel })
  end
end
```

Observe que a instrução `Turbo::Stream` está sendo utilizada para enviar uma mensagem para o canal '*pixels*' solicitando que o pixel seja atualizado com o pixel colorido.


  <img src="https://i.ibb.co/sK3MZVm/20230919-114450.gif" alt="" class="">


Isto já deixa os pixels sendo coloridos conforme o Job é executado. Mas perceba que o botão 'Colorize Job' continua disponível para ser clicado, o que pode causar alguns problemas...

Portanto, vamos desabilitar o botão enquanto existir uma requisição sendo processada. 

Para tornar isto mais interessante, vamos utilizar o botão como 'barra de progresso' informando quantos pixels foram processados até o momento. 

Crie portanto o arquivo `app/views/pixels/_btn_job.html.erb` com o código abaixo:

```erb
<div id="btn-job">
  <%= button_to defined?(btn_text) ? btn_text : 'Colorize Job', pixels_colorize_job_path, class: defined?(btn_class) ? btn_class : 'btn-primary',  method: :post %>
</div>
```

Em `index.html.erb` substitua a tag do botão ***Colorize Job*** pelo código abaixo:

```erb
<%= render partial:'btn_job'%>
```

Para que o estilo seja aplicado corretamente, adicione o trecho de código abaixo no arquivo `app/assets/stylesheets/application.tailwind.css`:

```scss
.btn-job-disabled {
  @apply btn-primary bg-blue-600 text-white pointer-events-none;
}
```

Inclua a classe `btn-job-disabled` na lista de `safe_list` em `config/tailwind.config.js`:

Agora, novamente em `colorize_pixels_job.rb`, vamos alterar o código conforme abaixo:

```ruby
def perform(*args)
  pixels = Pixel.all
  total = pixels.count
  pixels.each_with_index do |pixel, index|
    pixel.update(color: Pixel::COLORS.sample)
    Turbo::StreamsChannel.broadcast_update_to('pixels', target: "pixel_#{pixel.id}", partial: 'pixels/pixel', locals: { pixel: pixel })
    Turbo::StreamsChannel.broadcast_replace_to('pixels', target: "btn-job", partial: 'pixels/btn_job', locals: { btn_text: "Colorizing: #{index+1} / #{total}", btn_class:'btn-job-disabled' })
  end
  Turbo::StreamsChannel.broadcast_replace_to('pixels', target: "btn-job", partial: 'pixels/btn_job')
end
```

Desta forma, a cada iteração do loop, o botão será atualizado com o número de pixels já processados. Ao final do loop, o botão será atualizado novamente para o estado inicial.

  <img src="https://i.ibb.co/LhMCcKt/20230919-114526.gif" alt="" class="">


<!-- ## Utilizando o ActionCable

Para resolver este problema, vamos utilizar o **ActionCable**, que é uma biblioteca do Rails que permite a comunicação em tempo real entre o servidor e o cliente.

Para criar o Channel, execute o comando abaixo:

```bash
rails g channel ColorizePixel
```

Para que nosso canal funcione corretamente, é necessário realizar algumas configurações. Vamos por partes...

Em `app/javascript/channels/colorize_pixel_channel.js` vamos adicionar apenas algumas instruções de log para verificar se o canal está funcionando corretamente.

```js
import consumer from "channels/consumer"

consumer.subscriptions.create("ColorizePixelChannel", {
  connected() {
    console.log("Connected to the colorize_pixel_channel");
  },

  disconnected() {
    console.log("Disconnected from the colorize_pixel_channel");
  },

  received(data) {
    console.log("Received data from the colorize_pixel_channel");
  }
});
```

Agora em `app/channels/colorize_pixel_channel.rb` altere o código do método subscribed para:

```ruby
def subscribed
  stream_from "ColorizePixelChannel"
end
```

Se tudo correr bem, ao acessar a página e inspecionar o console do navegador, você deve ver a mensagem ***Connected to the colorize_pixel_channel***.


  <img src="https://i.ibb.co/zZLyPzy/Screenshot-2.jpg" alt="" class="">

Agora, vamos adicionar o código para que nosso Job envie as informações de progresso para o canal.

Em `app/jobs/colorize_pixels_job.rb`, vamos alterar o código conforme abaixo:

```ruby
def perform(*args)
  pixels = Pixel.all
  total = pixels.count
  pixels.each_with_index do |pixel, index|
    pixel.update(color: Pixel::COLORS.sample)
    ActionCable.server.broadcast('ColorizePixelChannel', { pixel: pixel, index: index+1, total: total } )
  end
  ActionCable.server.broadcast('ColorizePixelChannel', { command: 'disconnect' } )
end
```

Perceba que estamos enviando um objeto com as informações do pixel, o índice e o total de pixels para o canal a cada iteração do loop. Estas informações servirão para atualizar o progresso do job na página.

Além disso, estamos enviando um objeto com a instrução de desconexão do canal ao final do loop. Esta informação será utilizada para informar ao cliente que o job foi finalizado.

Por enquanto, se você clicar no botão Colorize Job, é possível perceber que o progresso do job é exibido no console do navegador.

Como as atualizações dos elementos serão feitas via javascript, vamos adicionar uma ID ao botão Colorize Job para que possamos manipulá-lo futuramente.

```erb
<%= button_to 'Colorize Job', pixels_colorize_job_path, class:'btn-primary', id:'btn-job', method: :post %>
```

Voltando agora a nosso canal, vamos adicionar o código abaixo em `app/javascript/channels/colorize_pixel_channel.js`:

```js
import consumer from "channels/consumer"

window.btn_job = document.getElementById('btn-job');

consumer.subscriptions.create("ColorizePixelChannel", {
  connected() {
    // console.log("Connected to the colorize_pixel_channel");
  },

  disconnected() {
    // console.log("Disconnected from the colorize_pixel_channel");
    window.btn_job.innerHTML = 'Colorize Job';
    window.btn_job.className = 'btn-primary';
  },

  received(data) {
    // console.log("Received data from the colorize_pixel_channel");
    switch (data.command) {
      case 'disconnect':
        return this.disconnected();
      default:
        window.btn_job.innerHTML = 'Colorizing: ' + data.index + ' / ' + data.total;
        window.btn_job.className = 'btn-primary bg-blue-600 text-white pointer-events-none animate-pulse';

        let pixel = document.getElementById('pixel_' + data.pixel.id)
        pixel.className = 'pixel ';
        pixel.classList.add(data.pixel.color);

        break;
    }
  }
});
```
Caso você não esteja familiarizado com este código, basicamente estamos interagindo com o pixel através de seu ID e alterando sua classe para que ele seja colorido à medida que o job é executado. 

Além disto, o botão *Colorize Job* será desabilitado e modificado para exibir o progresso do job enquanto ele estiver em execução.

Agora, se você clicar no botão *Colorize Job*, é possível perceber que o progresso do job é refletido ao vivo na página, porém, caso a página seja atualizada, existe um delay até que o cliente seja conectado novamente ao canal. 


  <img src="https://i.ibb.co/h8JWmHj/20230910-173702.gif" alt="" class="">


Para Solucionar este problema, basta adicionar um intervalo entre cada interação. 

Em `app/jobs/colorize_pixels_job.rb` adicione inclua `sleep 0.1` na última linha dentro do loop:

```ruby
#...
pixels.each_with_index do |pixel, index|
  pixel.update(color: Pixel::COLORS.sample)
  ActionCable.server.broadcast('ColorizePixelChannel', { pixel: pixel, index: index+1, total: total } )
  sleep 0.1
end
```
Desta forma, o job será executado com um intervalo de 0.1 segundos entre cada iteração, e caso existe uma nova conexão no canal, ela poderá ser bem-sucedida neste intervalo.

  <img src="https://i.ibb.co/Drv1nnc/20230910-174301.gif" alt="" class="">

Nota: É nítido que com este intervalo, o job demora mais para ser executado, porém, é possível perceber que o progresso é exibido corretamente. O objetivo deste artigo é exemplificar a utilização destes recursos, contudo, cabe a você decidir se este intervalo é aceitável ou não para sua aplicação, assim como a necessidade de executar a tarefa em segundo plano, ou comunicar em real-time com o cliente. -->

## Deixando a aplicação mais divertida

Agora que já temos uma aplicação funcional, vamos adicionar alguns recursos para deixá-la mais legal. 

Ruby nos permite renderizar informações repetidar vezes utilizando a instrução `XX.times do`. 

Vamos utilizar este recurso para renderizar 6 vezes a coleção ***@pixels*** na página. Além disto, vamos tornar o menu de botões responsivo, otimizando o layout.

Em `app/views/pixels/index.html.erb`, vamos alterar o código para:

```erb
<div class="space-y-4">
  <div class="sm:flex justify-between">
    <h1 class="font-bold text-4xl">Pixels#index</h1>
    <div class="flex grow justify-end space-x-2">
      <%= button_to 'Reset', pixels_reset_path, class:'btn-primary', method: :post %>
      <%= button_to 'Colorize Action', pixels_colorize_path, class:'btn-primary', method: :post %>
      <%= render partial:'btn_job'%>
    </div>
  </div>
  <div class="flex flex-wrap">
    <% 6.times do %>
      <%= render @pixels %>
    <% end %>
  </div>
</div>

<%= turbo_stream_from 'pixels' %>

```

Ao atualizar a página, ela deverá esta semelhante a imagem abaixo:

  <img src="https://i.ibb.co/b743wCm/Captura-da-Web-10-9-2023-175242-127-0-0-1.jpg" alt="" class="">

Contudo, se você executar o job, verá que o progresso é exibido apenas na primeira seção de pixels.

  <img src="https://i.ibb.co/wJr8x2g/20230910-175410.gif" alt="" class="">

Isto acontece porque nosso canal esta atualizando o elemento baseado em seu ID, e como todos os pixels possuem o mesmo ID, apenas o primeiro elemento é atualizado.

Para alterar este comportamento, vamos adicionar o ID do elemento a sua classe, e alterar o código do canal para atualizar todos os elementos que possuem a classe do pixel.

Em `app/views/pixels/_pixel.html.erb`, vamos alterar o código para:

```erb
<div id="<%= dom_id(pixel) %>" class="pixel <%= pixel.color%> pixel_<%=pixel.id%>"></div>
```

Agora, em `colorize_pixels_job`, basta atualizar o atributo `target` para `targets`.

```ruby
Turbo::StreamsChannel.broadcast_update_to('pixels', targets: ".pixel_#{pixel.id}", partial: 'pixels/pixel', locals: { pixel: pixel })
```	

Perceba, que agora, estamos informando um seletor CSS como target, e não mais um ID.
Perceba também que a palavra precisa estar no plural.


Desta forma, o código atualizará todos os elementos que contenham a classe do pixel. Como estamos repetindo a renderização do pixel diversas vezes, o código irá atualizar todos os elementos que possuem a classe, como podemos ver abaixo:

  <img src="https://i.ibb.co/XsRSMK0/20230910-180517.gif" alt="" class="">

Apesar de estar processando a coleção de pixels, isto está ocorrendo de forma linear... mas podemos deixar isto mais divertido com apenas uma linha de código! 

Em nosso active job, logo após a linha `pixels = Pixel.all`, vamos adicionar a linha a seguir para embaralhar a coleção antes de executar o loop:
  
```ruby
pixels = pixels.shuffle
```

  <img src="https://i.ibb.co/ZcKhTzk/20230910-180907.gif" alt="" class="">

Ainda assim, parece existir um certo padrão na forma como os pixels são coloridos, não é mesmo? 

Para tornar isto ainda mais divertido, vamos embaralhar a coleção de pixels ao renderizar a página, adicionando o metodo `.shuffle` na instrução de `render`.

Em ***app/views/pixels/index.html.erb***, vamos alterar o código para:

```erb
<% 6.times do  %>
  <%= render @pixels.shuffle %>
<%end%>
```

<img src="https://i.ibb.co/M8F9BDZ/20230910-181511.gif" alt="" class="">

Contudo, com esta alteração, toda vez que a página for acessada os pixels serão embaralhados de uma maneira diferente. Fica a seu critério se isto é desejável ou não.

  <img src="https://i.ibb.co/ky6Mk6S/20230910-181606.gif" alt="" class="">

Por fim, você também pode adicionar mais opções de cores, adicionando as classes de cores em `app/assets/stylesheets/application.tailwind.css`, em seguida adicionando as novas cores na constante `COLORS`, definida em `app/models/pixel.rb`, e forçando o carregamento das novas classes em `config/tailwind.config.js`

Para te ajudar, implementei isto no repositório do projeto, e você pode copiar o conteudo através dos arquivos raw a seguir:

- [app/assets/stylesheets/application.tailwind.css](https://raw.githubusercontent.com/lucasgeron/rails-pixels-app/main/app/assets/stylesheets/application.tailwind.css){: .text-link-sm }
- [config/tailwind.config.js](https://raw.githubusercontent.com/lucasgeron/rails-pixels-app/main/config/tailwind.config.js){: .text-link-sm }
- [app/models/pixel.rb](https://raw.githubusercontent.com/lucasgeron/rails-pixels-app/main/app/models/pixel.rb){: .text-link-sm }

Sinta-se livre para modificar tamanho dos pixels, assim como o número de pixels renderizados na página.

  <img src="https://i.ibb.co/WWj82Tx/20230910-183055.gif" alt="" class="">

## Conclusão


Neste artigo, você aprendeu como criar e executar serviços em segundo plano para processar informações sem fazer que o cliente precise ficar aguardando a conclusão da tarefa.

Você também aprendeu a utilizar recursos de TurboStreams, configurando um  canal de transmissão, para atualizar o conteúdo de uma página em tempo real.

Espero que este artigo tenha sido útil para você, e que você possa aplicar estes conceitos em seus projetos. 


Até a próxima!
