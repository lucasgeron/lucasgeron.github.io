---

layout: post
title: "Rails Importar por CSV"
date: 2023-10-10
short_description: "Neste artigo vamos implementar os recursos de importar e exportar registros através de arquivos .CSV"
cover: https://i.ibb.co/k6fngMj/Tab-Post.gif


read_time: true
toc: true
github_repo: rails-import-by-csv

categories:
# - Article
# - Portfolio
# - Product
- Tutorial

tags:
# Tech Tags
# - API
# - Design
- Hotwire Turbo
# - Hotwire Stimulus
# - Python
# - P5.js
# - Ruby
- Ruby On Rails
# - Spreadsheet
# - Useful Gems
---

# Rails Importar por CSV

Neste artigo vamos implementar os recursos de importar e exportar registros através de arquivos .CSV. 

![demo](https://i.ibb.co/k6fngMj/Tab-Post.gif)

Para fazer isto vamos utilizar recursos de Rails (csv) e de Hotwire Turbo (streams).

A ideia é simples, teremos um formulário onde o usuário poderá enviar um arquivo .CSV para ser processado. Ao fazer o envio, um `Service` será instanciado e irá interpretar o arquivo. Durante o processo, os registros deverão ser salvos no banco de dados caso sejam válidos, ou então, serão ignorados e o usuário será informado sobre o erro.

O usuário poderá ver em tempo real o progresso do processamento do arquivo, acompanhando a situação e possíveis mensagens de erros durante o processamento de cada linha através de um stream de atualização da página.

Para concluir, também vamos implementar a exportação de registros, onde o usuário poderá salvar todos os registros do banco de dados em um arquivo .CSV. Vale destacar que esta etapa também será possível escolher qual atributo do modelo será exportado.


## Conhecimentos Relevantes

Antes de começarmos a implementar o código, gostaria de compartilhar alguns conhecimentos que podem ser relevante para este projeto. 

Em um primeiro momento, enquanto elaborava este artigo, desenvolvi este projeto utilizando recursos de ActiveJob para processar os arquivos, porém, ao fazer mais pesquisas sobre como implementar isto corretamente, encontrei muitas discussões sobre o assunto, sendo que a maioria recomendada o uso de Services Objects para lidar com tal ação. Mas afinal, qual a diferença entre ActiveJob e Services Objects e porque devemos utilizar um ao invés do outro?

### Active Jobs

Active Jobs é um recurso do Rails que permite executar tarefas em segundo plano. Normalmente, as tarefas são específicas e atribuídas a um ou mais modelos do sistema. O exemplo mais comum de seu uso é por exemplo o envio de um lote de e-mails, possibilitando que o usuário possa navegar na aplicação enquanto os emails são enviados em segundo plano. Apesar disto, é possível executar tarefas em primeiro plano com o método `perform_now`. Seguindo o mesmo exemplo, imagine que um email de ativação de conta deve ser enviado assim que o usuário se cadastrar, neste caso, o método `perform_now` pode ser utilizado para executar a tarefa em primeiro plano.

Este recursos por ser executado em segundo plano tem algumas boas práticas como por exemplo receber o mínimo de parâmetros, e realizar a lógica pesada de processamento ao ser executado. Por exemplo, em vez de você enviar um arquivo inteiro para o ActiveJob processar, você deve enviar apenas o caminho do arquivo, e então, o ActiveJob irá ler o arquivo e processar os dados.

Outra coisa importante é que ActiveJobs, quando executado de forma assíncrona, não tem acesso ao contexto da requisição, ou seja, não tem acesso a sessão do usuário, nem variáveis de instância e também não consegue renderizar views ou retornar valores para o controlador.

É importante destacar que existem muitas utilidades para este recurso, e que em seu conceito, tem o objetivo de realizar uma tarefa específica que pode ter um tempo de processamento mais demorado que o restante de aplicação. 

### Service Objects

Service Objects tem como objetivo encapsular a lógica de negócio da aplicação. Em outras palavras, é uma classe que tem como objetivo realizar uma tarefa específica, e que pode ser reutilizada em diferentes partes da aplicação, sem ser específica de um determinado modelo, mas sim de um contexto.

Em alguns exemplos pela internet, é possível encontrar Service Objects sendo utilizados como comunicação com API's, processamento de Arquivos e até mesmo para realizar ações em lote com modelos do banco de dados.

A grande vantagem de utilizar Service Objects é que eles podem ser reutilizados em diferentes partes da aplicação, e que podem ser testados de forma isolada, sem a necessidade de criar um modelo para testar a lógica de negócio.

Diferente de ActiveJobs, os Services são executados de forma síncrona, ou seja, o restante do código só é executado após o serviço ser concluído. Além disso, Services possuem acesso ao contexto da requisição, e podem retornar valores para o controlador. 


### ActiveJob ou Service Objects?

Bem, agora que já sabemos um pouco sobre cada recurso, podemos concluir que o ActiveJob é mais indicado para tarefas mais específicas e que devem ser executadas em segundo plano, enquanto Service Objects é mais indicado para lógica de negócios que podem ser utilizadas em vários cenários e que devem ser executadas de forma síncrona.

Portanto, para este projeto, a função "Importar por CSV" por ser considerada como uma lógica de negocio, na qual, cria diversos modelos a partir do input do arquivo .csv. Também é possível afirmar que seu comportamento desejado é síncrono, ou seja, o usuário deve acompanhar o processamento do arquivo para validar as informações processadas e em seguida, continuar utilizando a aplicação.

#### Importar arquivos grandes?
Existe outro ponto crucial que também pode ser levado em conta na hora de optar por um Service ou um ActiveJob, que é o tamanho do arquivo que será processado. Considere que possa existir um arquivo contendo milhares de registros, e que o renderizar todas essas informações na tela pode não ser a melhor alternativa. Neste caso, o ActiveJob`.perform_later` pode ser uma boa escolha, contudo, o usuário não poderá ter acesso ao progresso do processamento do arquivo em real-time, e os registros processados que contenham erros deverão ser tratados de outra forma.

Pesquisando a respeito disto, uma possível implementação seria criar um modelo com atributos que representam o progresso do processamento do arquivo, e então, o ActiveJob iria atualizar o modelo a cada registro processado. Vale destacar que para realizar a tarefa em segundo plano, o arquivo inputado pelo usuário deve ser salvo como anexo ao modelo em questão, e então, ser implementado as views para que o usuário possa acompanhar o andamento da tarefa. Uma grande vantagem desta implementação, é que o usuário pode processar vários arquivos simultaneamente e que o arquivo processado ficará no histórico da aplicação, podendo ser acessado a qualquer momento.

---
Certo, agora que já sabemos um pouco sobre cada recurso, podemos começar a implementação do projeto.

## Configurando o Projeto

Para começar, abra seu terminal e crie um novo projeto Rails informando o argumento 'tailwind' para utilizar o framework de CSS Tailwind.

```bash
rails new rails-import-by-csv --css=tailwindcss
```
{: .nolineno}

Vamos criar através de *scaffold* um modelo chamado `Visitor` com os atributos `name` e `cpf`.

> O modelo **Visitor** será re-utilizado no próximo artigo, onde vamos abordar **Polimorfismo**.
{: .prompt-tip }

```bash
rails g scaffold Visitor name:string cpf:string
```
{: .nolineno}

Em seguida, vamos rodar as migrações e compilar os assets de tailwind. 

```bash
rails db:migrate
rails tailwindcss:build 
```
{: .nolineno}

Antes de avançarmos para a implementação, ajuste o arquivo `config/routes.rb` para que a rota raiz seja a página de visitantes.

```ruby
Rails.application.routes.draw do
  root "visitors#index"
  resources :visitors
end
```
{: file='config/routes.rb'}

Agora, podemos iniciar o servidor e acessar a página de visitantes.

```bash
rails s
```
{: .nolineno}

## Implementando a Feature 

Rails nos permite definir rotas com o mesmo nome para diferentes métodos de requisição, então vamos definir a rota `import` para os métodos `GET` e `POST`. Apesar de possuir o mesmo nome, o controlador irá interpretar e responder baseado no tipo da requisição, onde o método `GET` irá renderizar o formulário de importação e o método `POST` irá processar o arquivo enviado pelo usuário. Se preferir, voce pode fazer rotas com nomes diferentes, como `import` e `import_process`.

```ruby
Rails.application.routes.draw do
  root "visitors#index"
  resources :visitors do 
    get :import, on: :collection
    post :import, on: :collection
  end
end
```
{: file='config/routes.rb'}

Agora que já temos a rota definida, vamos adicionar o botão para acessar a página de importação de registros. 

Modifique as instruções de *index.html.erb* para incluir o botão conforme o código a seguir:

```erb
<%# ... %> 
<div class="flex justify-between items-center">
    <h1 class="font-bold text-4xl">Visitors</h1>
    <div class="flex gap-2">
      <%= link_to 'New visitor', new_visitor_path, class: "rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium" %>
      <%= link_to 'Import visitors', import_visitors_path, class: "rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium" %>
    </div>
  </div>
<%# ... %>
```
{: file='app/views/visitors/index.html.erb'}

O próximo passo é criar a view, portanto, crie o arquivo `import.html.erb` dentro da pasta `app/views/visitors/` e adicione o código a seguir:

```erb
<div class="mx-auto md:w-2/3 w-full">
  <h1 class="font-bold text-4xl">Import Visitors</h1>
  <%= render "import_form" %>
  <%= link_to 'Back to visitors', visitors_path, class: " rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
</div>
```
{: file='app/views/visitors/import.html.erb'}

Observe que o formulário de **importação** é diferente do formulário de **criação** de registros, portanto,  precisamos criar o arquivo `_import_form.html.erb` dentro da pasta `app/views/visitors/` e adicionar o código a seguir:

```erb
<%= form_with(url: import_visitors_path, class: "contents") do |form| %>
  <div class="my-5">
    <%= form.file_field :file, accept: ".csv", class: "block shadow rounded-md border border-gray-200 outline-none px-3 py-2 mt-2 w-full" %>
  </div>

  <div class="inline">
    <%= form.submit "Import", class: "rounded-lg py-3 px-5 bg-blue-600 text-white inline-block font-medium cursor-pointer mr-2" %>
  </div>
<% end %>
```
{: file='app/views/visitors/_import_form.html.erb'}

Por convensão de rails, a rota para `*GET* já deve estar funcionando, uma vez que os arquivos estão no lugar esperado, porém, o formulário ainda não está enviando o arquivo para o servidor. 

![import-form](https://i.ibb.co/VQ5fF5B/Tab-Post.gif)

Para que o arquivo enviado seja processado corretamente, é necessário implementar o Service, e atualizar o código do controlador.

## Implementando o Serviço

Seguindo o conceito de um Service Object, que é um objeto que encapsula uma lógica de negócio, vamos criar um novo arquivo chamado `import_service.rb` dentro da pasta `app/services`. Rails não oferece nenhum comando para criar isto, portanto, é necessário fazer isto manualmente. 

Uma boa prática para utilização de serviços, segundo [Amin Shah Gilani](https://www.toptal.com/ruby-on-rails/rails-service-objects-tutorial), é estruturar o código de forma que todos os serviços herdem as funções básicas de um serviço genérico, evitando repetição de código.

Em seu terminal, execute os comandos a seguir para criar o diretório e os respectivos arquivos.

```bash
mkdir app/services
touch app/services/application_service.rb
touch app/services/import_service.rb
```
{: .nolineno}

Agora, em seu editor, adicione o código a seguir no arquivo `app/services/application_service.rb`:
```ruby
class ApplicationService
  def self.call(*args)
    new(*args).call
  end
end
```
{: file='app/services/application_service.rb'}  

Este código permite que qualquer serviço herde a função `call`, que é responsável por instanciar o serviço e chamar o método `call` de sí mesmo.

Em seguida, edite o arquivo `app/services/import_service.rb` adicionando o código a seguir:

```ruby
class ImportService < ApplicationService
  require('csv')

  def initialize(model, file)
    @model = model
    @file = file
  end

  def call
    csv = CSV.read(@file, headers: true)

    csv.each_with_index do |row, index|
      @record = @model.new(row.to_hash)
      @record.save 
      @record.broadcast_append_to 'import_visitors'
    end
  end
end
```
{: file='app/services/import_service.rb'}

> É necessário reiniciar o servidor para que os serviços sejam carregados.
{: .prompt-info}

Um pouco diferente de ActiveJob, o método principal de um serviço não é `perform`, mas sim `call`.

Vamos entender um pouco melhor este código. Em `application_service.rb` definimos um **método de instância** (precedido por `self.`) que cria um novo serviço - o que foi invocado - e chama o método `call` de sí mesmo. Em outras palavras, ele permite fazer algo como: `ImportService.call(MyModel, params[:file])`. Perceba que `self.call` recebe `*args`, porém, estes argumentos são utilizados para instanciar o serviço, e não para executar o método `call`.

Portanto, `import_service.rb` herda de `application_service.rb`, ao chamar o método `.call`, o método `initialize` é invocado, e os argumentos são passados para o construtor, par que em seguida, a lógica implementada seja executada. 

Caso isto não fosse feito desta maneira, seria necessário instanciar o serviço e chamar o método `call` de forma manual, como por exemplo: `ImportService.new(MyModel, params[:file]).call`.

Por mais simples que isso pareça, esta abordagem permite que o código seja mais legível, e que o serviço seja utilizado de forma mais simples, como se fosse um método estático.

Agora, a lógica implementada para importação é relativamente simples, o arquivo é lido e para linha do arquivo, um novo registro é criado e salvo no banco.

> Estamos utilizando new/save ao invés de create! pois em caso de erro, o comportamento seja condicionado de forma adequada. 
{: .prompt-info}

Agora, para fazer o formulário funcionar corretamente, vamos implementar o método `import` no `visitors_controller.rb` adicionando o trecho de código abaixo: 
  
```ruby
  # GET /visitors/import
  # POST /visitors/import
  def import 
    ImportService.call(Visitor, params[:file]) if request.post?
  end
```
{: file='app/controllers/visitors_controller.rb'}

Caso a requisição seja do tipo `POST`, o ImportService será instânciado e executado imediatamente.

Caso a requisição seja do tipo `GET`, o método `import` será chamado, mas não irá executar o serviço, apenas renderizará a view conforme a convensão. 

Isto já deve ser o suficiente para que a importação funcione, porém, você deve ter percebido que estamos fazendo um `broadcast` para o canal `import_visitors`, que ainda não existe. Para que as informações sejam replicadas na view, é necessário incluir a tag `turbo_stream_from` na view desejada, estabelecendo a conexão entre o cliente e servidor.

Outro ponto que vale destacar, é que `broadscast` também segue a convensão de Rails, portanto, caso não seja informado um `target`, o mesmo será tido como o nome do modelo no plural, neste caso, `visitors`. Desta forma, também é importante adicionarmos uma div com `id` '*visitors*' para que o turbo stream funcione corretamente.


```erb
<div class="mx-auto md:w-2/3 w-full">
  <h1 class="font-bold text-4xl">Import Visitors</h1>
  <%= render "import_form" %>
  <%= link_to 'Back to visitors', visitors_path, class: " rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>

  <%= turbo_stream_from 'import_visitors' %>
  <div id="visitors"></div>

</div>
```
{: file='app/views/visitors/import.html.erb'}

Para que você possa testar isso na prática, elabore seu arquivo .CSV ou baixe os arquivos de exemplo: 
- [**data_set_01.csv**](https://raw.githubusercontent.com/lucasgeron/rails-import-by-csv/main/data_set_01.csv){: .text-link-sm} : Contém 30 registros válidos
- [**data_set_02.csv**](https://raw.githubusercontent.com/lucasgeron/rails-import-by-csv/main/data_set_02.csv){: .text-link-sm} : Contém 7 registros válidos e 3 inválidos.
- [**data_set_03.csv**](https://raw.githubusercontent.com/lucasgeron/rails-import-by-csv/main/data_set_03.csv){: .text-link-sm} : Contém 250 registros válidos

Agora, tente importar o **data_set_01.csv** e você deverá ver o seguinte resultado.

![import-data-set-01](https://i.ibb.co/ZWfhNys/Tab-Post-02.gif)

Ao inspecionar o console do navegador, é possível ver a mensagem de erro a seguir: 

![redirect-fail](https://i.ibb.co/gS61nZc/Screenshot-1.jpg){: .w-50}

Como estamos fazendo isto a partir de uma requisição do tipo `POST`, é esperado que a página seja redirecionada para outra página qualquer, porém, como estamos utilizando o Turbo e listando os registros na própria página, não queremos que isso aconteça.

Para lidar com isto, basta criar o arquivo de resposta em formato `turbo_stream` seguindo a convensão. 

```erb
<%= turbo_stream.prepend 'visitors' do %>
  Import Finished
<% end %>
```
{: file='app/views/visitors/import.turbo_stream.erb'}

![turbo_stream response](https://i.ibb.co/9wrsvnJ/Tab-Post-03.gif)

Desta forma, Rails interpretará a requisição como Turbo, e responderá no formato adequado. Desta forma, o erro listado anteriormente deixará de ser exibido, e em seu lugar, a mensagem "Import Finished" é exibida antes da lista de registros importados.   

>  <span class="fs-6">Basta o arquivo ***import.turbo_stream.erb*** existir para que o a resposta seja interpretada como Turbo. <span>
{: .prompt-info}

A partir de agora, vamos começar a refinar esta feature, adicionando recursos como validação de dados, barra de progresso, e formatação condicional dos dados e métricas de importação.

## Adicionando a Barra de Progresso

Imagine que o *data_set* a ser importado possui milhares de linhas e que o processamento disto poderá levar alguns minutos. Neste caso, seria interessante que o usuário pudesse acompanhar o progresso da importação... Para isso, vamos adicionar uma barra de progresso.

> <span class='fs-6'>Caso existam milhões de linhas para serem processadas, é interessante modificar o código para um ActiveJob que seja executado em background conforme sugerido em [Importar arquivos grandes](/tutorial/2023/10/10/rails-import-by-csv.html#importar-arquivos-grandes).</span>

A ideia é que ao iniciar o processamento do arquivo, o formulário atual seja substituído pela barra de progresso. A cada registro importado, vamos atualizar o percentual de progressso, e quando a importação for concluída, vamos substituir a barra pelas métricas de importação.

Como estamos implementando um Serviço e queremos que ele seja replicado para qualquer ambiente de nossa aplicação, crie uma partial em `layouts/shared/` com o conteúdo da barra de progresso, conforme o código a seguir: 

```erb 
<div class="flex justify-between mb-1 mt-4">
  <span class="text-base font-medium  ">Importing...</span>
  <span class="text-sm font-medium  "><%= index %> / <%= total %> (<%= percentage %>%)</span>
</div>
<div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
  <div class="bg-blue-600 h-2.5 rounded-full" style="width: <%= percentage %>%"></div>
</div>
```
{: file='app/views/layouts/shared/_progress_bar.html.erb'}

Para manipular o formulário de importação, vamos adicionar um id ao mesmo. 

```erb
<%= form_with(url: import_visitors_path, class: "contents", id: 'import_form') do |form| %>
<%# ... %>
```
{: file='app/views/visitors/_import_form.html.erb'}

Agora, em `import_service.rb`, modifique o código conforme o código aseguir: 


```ruby
class ImportService < ApplicationService
  require('csv')

  def initialize(model, file)
    @total = 0
    @model = model
    @file = file
  end

  def call
    csv = CSV.read(@file, headers: true)
    @total = csv.count

    csv.each_with_index do |row, index|
      @record = @model.new(row.to_hash)
      @record.save # ? import_success(index) : import_fail(index)
      update_progress_bar(index)
      @record.broadcast_append_to 'import_visitors'
    end
  end
  
  private 

  # update the progress bar
  def update_progress_bar(index)
    Turbo::StreamsChannel.broadcast_update_to "import_visitors",
         target:'import_form', 
         partial: 'layouts/shared/progress_bar', 
         locals: { index: index+1, total: @total, percentage: percentage(index+1, @total) }
    sleep 0.01 # delay to update progress bar
  end

  # calculate the percentage of the progress bar
  def percentage(index, total)
    (index)*100/total
  end

end
```
{: file='app/services/import_service.rb'}

![progress-bar](https://i.ibb.co/17ZLTMd/Tab-Post-09.gif)

Antes de seguirmos adiante, perceba que ImportService esta violando um de seus princípios fazendo broadcast diretamente para 'import_visitors'. Considere que caso este serviço seja utilizado para importar outros modelos, os dados serão enviados ao canal errado. portanto, vamos modificar isto para que o serviço seja mais genérico. 

Em `initialize` adicione a diretiva: ``` @target = @model.to_s.downcase.pluralize ``` e substitua as `strings` '*import_visitors*' por "*import_#{@target}*" no método `call` e `update_progress_bar`. 


```ruby
# ...

def initialize(model, file)
  #... 
  @target = @model.to_s.downcase.pluralize
end

def call
  #...
    @record.broadcast_append_to "import_#{@target}"
  #...
end

private 

# update the progress bar
def update_progress_bar(index)
  Turbo::StreamsChannel.broadcast_update_to "import_#{@target}",
    #...
end

# ...

```
{: file='app/services/import_service.rb'}

Desta forma, deixamos o serviço mais generico e podemos utiliza-lo para importar outros modelos.

## Adicionando as Métricas

Perceba que até o momento, a aplicação esta adicionando uma linha na tabela de visitantes a cada registro importado. Isto ocorre através da diretiva `@record.broadcast_append_to "import_#{@target}"` que adiciona o registro ao final da tabela.

Para deixar isto mais interessante, vamos modificar um pouco este comportamento. Ao invés de adicionar o registro após sua importação, ao iniciar o processamento, vamos renderizar todos os arquivos contidos no arquivo CSV e adicionar uma coluna de status, então, a cada registro importado, vamos apenas atualizar a coluna status, reduzindo assim a mudança drastica de HTML gerado pelo serviço, melhorando o desempenho ao retornar menos conteúdo, e deixando a interface mais amigável para o usuário.

Da mesma forma que a barra de progresso é utilizada pelo serviço, a tabela de importação também será generica e poderá ser utilizada para importar qualquer modelo.

Portanto, vamos criar uma partial para a tabela de importação em `layouts/shared/` com o conteúdo a seguir: 

```erb
<div class="relative overflow-x-auto rounded-lg my-4">
  <table class="w-full text-sm text-center text-gray-500">
    <thead class="text-xs text-gray-700 uppercase bg-gray-200 ">
      <tr>
        <% (['row'] + csv.headers + ['status']).each do |attr| %>
          <th scope="col" class="px-2 py-3">
            <%= attr %>
          </th>
        <% end %>
      </tr>
    </thead>
    <tbody>
      <% csv.each_with_index do |row, index| %>
        <tr class="border-b border-x hover:bg-gray-100">
          <td class="px-2 py-3"><%= index + 1 %></td>
          <% row.fields.each do |field| %>
            <td class="px-2 py-3"><%= field %></td>
          <% end %>
          <td class="px-2 py-3" id='<%=target%>_<%=index%>'><span class='px-3 py-2 text-sm text-gray-800 rounded-lg bg-gray-100'>In Queue</span></td>
        </tr>
      <% end %>
    </tbody>
  </table>
</div>
```
{: file='app/views/layouts/shared/_import_table.html.erb'}

Esta partial renderiza a tabela de importação com os dados do arquivo CSV, independente de quantas colunas o arquivo possua, e adiciona a coluna `row` e `status` para serem utilizadas pelo serviço.

Para renderizar as metricas de importação após o processamento do arquivo, vamos modificar o arquivo `import.turbo_stream.rb` conforme o código a seguir: 

```erb
<%= turbo_stream.replace 'import_form' do  %>

  <div class="p-4 my-4 text-sm text-blue-800 rounded-lg bg-blue-50 " role="alert">
    <strong class="block sm:inline"><b><%= @service.file.original_filename %> </b> with <b><%= @service.total %> <%= @service.model %></b> was processed successfully.</strong>
  </div>

  <% if @service.imported_successfully.positive? %>
    <div class="p-4 my-4 text-sm text-green-800 rounded-lg bg-green-50 " role="alert">
      <strong class="block sm:inline">You have imported <%= @service.imported_successfully %> visitors successfully.</strong>
    </div>
  <% end %>

  <% if @service.imported_unsuccessfully.positive? %>
    <div class="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 " role="alert">
      <strong class="block sm:inline"><%= @service.imported_unsuccessfully %> visitors could not be imported.</strong>
    </div>
  <% end %>
<% end %>
```
{: file='app/views/imports/import.turbo_stream.rb'}

Desta forma, ao invés de renderizar "*Import Finished*", serão renderizados informações detalhadas a respeito da importação.

Contudo, para que isto estes dados cheguem até a view, estamos utilizando a variável `@service`, esta variável por sua vez, deve receber o serviço que esta sendo executado, portanto, vamos modificar o método `import` do controller `visitors_controller` conforme o código a seguir: 

```ruby
  # GET /visitors/import
  # POST /visitors/import
  def import 
    @service = ImportService.call(Visitor, params[:file]) if request.post?
  end
```
{: file='app/controllers/visitors_controller.rb'}

E por fim, fazer as devidas alterações no serviço para que renderize a tabela completa ao ser iniciado, atualize a coluna de status durante o processamento dos dados e por fim, contabilize as métricas de importação para que possam ser renderizadas em seguida.

```ruby
class ImportService < ApplicationService
  require('csv')

  # Make the following attributes accessible outside of the class
  attr_reader :imported_successfully, :imported_unsuccessfully, :total, :model, :file

  def initialize(model, file)
    @imported_successfully = 0
    @imported_unsuccessfully = 0
    @total = 0
    @model = model
    @file = file
    @target = @model.to_s.downcase.pluralize
  end

  def call
    csv = CSV.read(@file, headers: true)
    @total = csv.count

    render_import_table(csv)

    csv.each_with_index do |row, index|
      @record = @model.new(row.to_hash)
      @record.save ? import_success(index) : import_fail(index)
      update_progress_bar(index)
    end
    self # return ImportService object to attr_reader attributes can be accessed
  end
  
  private 

  # render the import table
  def render_import_table(csv)
    Turbo::StreamsChannel.broadcast_replace_to "import_#{@target}",
         target: @target, 
         partial: "layouts/shared/import_table", 
         locals: {csv: csv, target: @target}
  end
  
  # increment imported_successfully and broadcast to the import target
  def import_success(index)
    @imported_successfully +=1 
    Turbo::StreamsChannel.broadcast_update_to "import_#{@target}",
         target: "#{@target}_#{index}", 
         content: "<span class='px-3 py-2 text-sm text-green-800 rounded-lg bg-green-50'>Imported Successfully</span>"
  end

  # increment imported_unsuccessfully and broadcast to the import target
  def import_fail(index)
    @imported_unsuccessfully +=1
    Turbo::StreamsChannel.broadcast_update_to "import_#{@target}",
         target: "#{@target}_#{index}", 
         content: "<span class='px-3 py-2 text-sm text-red-800 rounded-lg bg-red-50'>#{@record.errors.full_messages.join(", ")}</span>"
  end

  # update the progress bar
  def update_progress_bar(index)
    Turbo::StreamsChannel.broadcast_update_to "import_#{@target}",
         target:'import_form', 
         partial: 'layouts/shared/progress_bar', 
         locals: { index: index+1, total: @total, percentage: percentage(index+1, @total) }
    sleep 0.01 # delay to update progress bar
  end

  # calculate the percentage of the progress bar
  def percentage(index, total)
    (index)*100/total
  end

end
```
{: file='app/services/import_service.rb'}

Agora, ao importar um arquivo, você deve ver algo como a imagem a seguir (imagem com velocidade reduzida):

![import_table](https://i.ibb.co/82nQ7Jt/Tab-Post-10.gif)

## Adicionando Validações

Até o momento, estamos importando os registros sem fazer qualquer tipo de validação, permitindo criar registros em branco ou duplicados. 

Como uma boa prática para garantir a integridade dos dados é importante que os modelos sejam validados antes de serem salvos no banco de dados. 

Para fazer isto, adicione as validações no modelo Visitor.

```ruby
class Visitor < ApplicationRecord
  validates :name, presence: true
  validates :cpf, presence: true, uniqueness: true
end
```
{: file='app/models/visitor.rb'}

Para testar, vamos utilizar o arquivo: ***data_set_02.csv***, o qual contém registros válidos e invalidos.

![import-validations](https://i.ibb.co/9nVYw9C/Tab-Post-11.gif)

Pronto, agora temos uma aplicação que permite a importação de arquivos CSV, com feedback em tempo real, e validações de dados.

## Exportando os Dados

Para finalizar, vamos adicionar a funcionalidade de exportar os dados para um arquivo CSV.

Seguindo a mesma ideia de utilizar um Service genérico para importação de modelos com atributos variádos, vamos fazer o mesmo para exportação.

Gere o Service *ExportService* com o seguinte comando:

```bash
touch app/services/export_service.rb
```

Em seguida, adicione o seguinte código ao Serviço:

```ruby
class ExportService < ApplicationService
  require('csv')

  def initialize(model, attributes)
    @model = model
    @attributes = attributes
  end
  
  def call
    csv = CSV.generate(headers: true) do |csv|
      csv << @attributes.map(&:to_s)
      @model.all.each do |record|
        csv << @attributes.map{ |attr| record.send(attr) }
      end
    end
  end

end
```
{: file='app/services/export_service.rb'}

Adicione as rotas para exportação no arquivo *routes.rb*:

```ruby
Rails.application.routes.draw do
  root "visitors#index"
  resources :visitors do 
    get :import, on: :collection
    post :import, on: :collection
    post :export, on: :collection
  end
end
```
{: file='config/routes.rb'}

Em seguida, implemente o método no controlador:
  
```ruby
# POST /visitors/export
def export
  send_data ExportService.call(Visitor, %i[name cpf]), filename: "visitors-#{Date.today}.csv"
end
```
{: file='app/controllers/visitors_controller.rb'}

Observe que agora, o ExportService, recebe como parâmetro o modelo e os atributos que devem ser exportados.

> É possível implementar um formulário específico para cada modelo, aonde o usuário poderia selecionar os atributos que deseja exportar. Porém, para simplificar, vamos utilizar um formulário genérico, que exporta todos os atributos atribuíveis do modelo.
{: .prompt-info}

E por fim, adicione o botão de download em *index.html.erb*:
  
  ```erb
  <%# ... %>
  <div class="flex justify-between items-center">
    <h1 class="font-bold text-4xl">Visitors</h1>
    <div class="flex gap-2">
      <%= link_to 'New visitor', new_visitor_path, class: "rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium" %>
      <%= link_to 'Import visitors', import_visitors_path, class: "rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium" %>
      <%= button_to 'Export visitors', export_visitors_path, data: {turbo: false}, class: "rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium" %>
    </div>
  </div>
  <%# ... %>
```
{: file='app/views/visitors/index.html.erb'}

Observe que de forma semelhante ao botão de importação, é esperado um 'redirect' para outra página após a requisição post. Para evitar isto, basta adicionar o atributo *data: {turbo: false}* ao botão, forçando que a requisição seja feita de forma tradicional.

Ao clicar no botão, o arquivo CSV será baixado de acordo com os atributos especificados.

## Removendo todos os Registros

Para fins de testes e demonstração, vamos adicionar um botão para remover todos os registros do banco de dados.
Isto tem o objetivo de facilitar na hora de testar a importação de arquivos, pois não será necessário remover os registros manualmente.

Nas rotas, adicione a rota para o método *delete_all*:

```ruby
Rails.application.routes.draw do
  root "visitors#index"
  resources :visitors do 
    get :import, on: :collection
    post :import, on: :collection
    post :export, on: :collection
    post :delete_all, on: :collection
  end
end
```
{: file='config/routes.rb'}

Em seguida, adicione o método no controlador:

```ruby
  # POST /visitors/delete_all
  def delete_all
    Visitor.delete_all
    redirect_to visitors_url, notice: "All visitors were successfully destroyed."
  end
```
{: file='app/controllers/visitors_controller.rb'}

E por fim, adicione o botão no *index.html.erb*:

  ```erb
  <%# ... %>
  <div class="flex justify-between items-center">
    <h1 class="font-bold text-4xl">Visitors</h1>
    <div class="flex gap-2">
      <%= link_to 'New visitor', new_visitor_path, class: "rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium" %>
      <%= link_to 'Import visitors', import_visitors_path, class: "rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium" %>
      <%= button_to 'Export visitors', export_visitors_path, data: {turbo: false}, class: "rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium" %>
      <%= button_to 'Delete visitors', delete_all_visitors_path, class: "rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium" %>
    </div>
  </div>
  <%# ... %>
```
{: file='app/views/visitors/index.html.erb'}

Se você chegou até aqui, sua aplicação deve estar assim:

![final](https://i.ibb.co/jLC7YmQ/Post-10.gif)
## Conclusão

Neste artigo vimos como implementar uma aplicação Rails que permite a importação de arquivos CSV, com feedback em tempo real, e validações de dados.

Fizemos isto utilizando um Service Objett que permite importar qualquer modelo da aplicação com atributos variádos.

Também implementamos outro serviço que permite exportar as informações desejadas para um arquivo CSV.

Utilizamos recursos de Turbo Streams para criar uma barra de progresso, modificar elementos da view e deixar a aplicação mais prática e eficiente.

Espero que este artigo tenha sido útil para você, e que possa ser aplicado em seus projetos.

### Próximo Projeto

Como citado no começo deste artigo, o próximo projeto será abordado polimorfismo. Nele, vamos criar um sistema de autorizações, onde Visitantes ou Trabalhadores terão autorizações (polimorficas) para acessar determinados locais. Portanto, iremos utilizar este repositório como base, uma vez que é possível importar registros com facilidade, e aproveitaremos seus recursos para importar as autorizações com base no CPF do visitante ou trabalhador.