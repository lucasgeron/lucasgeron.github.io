---

layout: post
title: "Rails Importar por CSV"
date: 2023-10-10
short_description: "Neste artigo vamos implementar os recursos de importar e exportar registros através de arquivos .CSV"
cover: https://i.ibb.co/qFd2VfN/Tab-Post-08.gif

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

![demo](https://i.ibb.co/qFd2VfN/Tab-Post-08.gif)

Para fazer isto vamos utilizar recursos de Rails (csv) e de Hotwire Turbo (streams).

A ideia é simples, teremos um formulário de importação de registros, onde o usuário poderá selecionar um arquivo .CSV e enviar para o servidor. 
Ao fazer o envio, um Job será utilizado para processar o arquivo e salvar os registros no banco de dados. 

O usuário também poderá ver em tempo real o progresso do processamento do arquivo, acompanhando a situação e possíveis mensagens de erros durante o processamento de cada linha através de um stream de atualização da página.

Para concluir, também vamos implementar a exportação de registros, onde o usuário poderá salvar todos os registros do banco de dados em um arquivo .CSV.


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

Rails nos permite definir rotas com o mesmo nome para diferentes métodos de requisição, então vamos definir a rota `import` para os métodos `GET` e `POST`. Apesar de possuir o mesmo nome, o controlador irá interpretar e responder baseado no tipo da requisição, onde o método `GET` irá renderizar o formulário de importação e o método `POST` irá processar o arquivo enviado pelo usuário.

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

O próximo passo, é criar a view, portanto, crie o arquivo `import.html.erb` dentro da pasta `app/views/visitors/` e adicione o código a seguir:

```erb
<div class="mx-auto md:w-2/3 w-full">
  <h1 class="font-bold text-4xl">Import Visitors</h1>
  <%= render "import_form", visitor: @visitor %>
  <%= link_to 'Back to visitors', visitors_path, class: " rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
</div>
```
{: file='app/views/visitors/import.html.erb'}

Observe que o formulário de importação é diferente do formulário de criação de registros, portanto,  precisamos criar o arquivo `_import_form.html.erb` dentro da pasta `app/views/visitors/` e adicionar o código a seguir:

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

Por convensão de rails, a rota para `*GET* já deve estar funcionando, uma vez que os arquivos estão no lugar esperado, contudo, o formulário ainda não está enviando o arquivo para o servidor. 

![import-form](https://i.ibb.co/VQ5fF5B/Tab-Post.gif)

Para que o arquivo enviado seja processado corretamente, e tornar as coisas mais interessantes, vamos incluir recursos de Turbo Streams para listar o processamento, enquanto processamos o arquivo através de um Job.

## Implementando o Job
Como citado anteriormente, este projeto será utilizado para falarmos sobre polimorfismo a seguir, portanto, vamos implementar um job que possa ser reutilizado em diferentes modelos, importando registros com diferentes atributos.

Para começar, vamos criar um novo job chamado `ImportJob` através do comando a seguir:

```bash
rails g job Import
```
{: .nolineno}

Em seguida, vamos adicionar o código a seguir no arquivo `app/jobs/import_job.rb`:

```ruby
require 'csv'

class ImportJob < ApplicationJob
  queue_as :default

  def perform(model, file)
    csv = CSV.read(file, headers: true)
    csv.each do |row|
      visitor = model.new(row.to_hash)
      visitor.save
      visitor.broadcast_append_to 'importVisitors'
    end
  end
end
```
{: file='app/jobs/import_job.rb'}

Observe que o job recebe dois argumentos, o primeiro é o modelo que será utilizado para importar os registros, e o segundo é o arquivo que será processado.

O arquivo então é lido através de `CSV.read`, e cada linha é convertida para um hash através do método `to_hash`, que é utilizado para criar um novo registro do modelo informado.

Para que este o job seja instânciado corretamente, precisaremos definir o método `import` no controller. 
  
```ruby
  # GET /visitors/import
  # POST /visitors/import
  def import 
    return ImportJob.perform_now(Visitor, params[:file]) if request.post?
  end
```
{: file='app/controllers/visitors_controller.rb'}

De uma forma simples, caso a requisição seja do tipo `POST`, o job será instânciado e executado imediatamente.
Caso a requisição seja do tipo `GET`, o método `import` será chamado, mas não irá executar o job, apenas renderizará a view conforme esperado. 

Isto já deve ser o suficiente para que a importação funcione, porém, você deve ter percebido que estamos fazendo um `broadcast` para o canal `importVisitors`, que ainda não existe. Para que as informações sejam replicadas na view, é necessário incluir a tag `turbo_stream_from` na view desejada, estabelecendo a conexão entre o canal e o job.

Outro ponto que vale destacar, é que `broadscast` também segue a convensão de Rails, portanto, caso não seja informado um target, o target utilizado será o nome do modelo no plural, neste caso, `visitors`. Desta forma, também é importante adicionarmos uma div com id 'visitors' para que o turbo stream funcione corretamente.


```erb
<div class="mx-auto md:w-2/3 w-full">
  <h1 class="font-bold text-4xl">Import Visitors</h1>
  <%= render "import_form" %>
  <%= link_to 'Back to visitors', visitors_path, class: " rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>

  <%= turbo_stream_from 'importVisitors' %>
  <div id="visitors"></div>

</div>
```
{: file='app/views/visitors/import.html.erb'}

Para que você possa testar isso na prática, elabore seu arquivo .CSV ou baixe os arquivos de exemplo: 
- [**data_set_01.csv**](){: .text-link-sm} : Contém 30 registros válidos
- [**data_set_02.csv**](){: .text-link-sm} : Contém 7 registros válidos e 3 inválidos.

Agora, tente importar o **data_set_01.csv** e você deverá ver o seguinte resultado.

![import-data-set-01](https://i.ibb.co/ZWfhNys/Tab-Post-02.gif)


Certo, isso foi relativamente simples, mas não acabamos por aqui.

Como estamos fazendo isto a partir de uma requisição do tipo POST, é esperado que a página seja redirecionada para a página de listagem de visitantes, porém, como estamos utilizando o Turbo e listando os registros na própria página, não queremos que isso aconteça.  

Porem, ao inspecionar o console do navegador, é possível ver a mensagem de erro a seguir: 

![redirect-fail](https://i.ibb.co/gS61nZc/Screenshot-1.jpg){: .w-50}

Para lidar com isto, basta criar o arquivo de resposta em formato `turbo_stream` seguindo a convensão. 

```erb
<%= turbo_stream.prepend 'visitors' do %>
  Import Finished
<% end %>
```
{: file='app/views/visitors/import.turbo_stream.erb'}

![turbo_stream response](https://i.ibb.co/9wrsvnJ/Tab-Post-03.gif)

Desta forma, Rails interpretará a requisição como Turbo, e responderá no formato adequado. Desta forma, o erro listado anteriormente deixará de ser exibido, e em seu lugar, a mensagem "Import Finished" é exibida antes da lista de registros importados.   

>  <span class="fs-6">O arquivo ***import.turbo_stream.erb*** existindo, já é suficiente para o erro pare de acontecer. <span>
{: .prompt-info}

A partir de agora, vamos começar a refinar esta feature, adicionando recursos como validação de dados, barra de progresso, e formatação condicional dos dados e métricas de importação.

## Adicionando a Barra de Progresso

Imagine que o *data_set* a ser importado possui milhares de linhas e que o processamento disto poderá levar alguns minutos. Neste caso, seria interessante que o usuário pudesse acompanhar o progresso da importação... Para isso, vamos adicionar uma barra de progresso.

> <span class='fs-6'>Caso existam milhões de linhas para serem processadas, é interessante modificar o código para que o job seja executado em background, porém, para manter a simplicidade, vamos manter o job sendo executado de forma síncrona.</span>

Ao iniciar o processamento do arquivo, vamos substituir o formulário atual pela barra de progresso. A cada registro importado, vamos atualizar o percentual de progressso, e quando a importação for concluída, vamos substituir a barra pelas métricas de importação.


Crie portanto uma partial com o conteúdo da barra de progresso, conforme o código a seguir: 

```erb 
<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-4">
  <div class="bg-blue-600 h-2.5 rounded-full" style="width: <%= percent %>%"></div>
</div>
```
{: file='app/views/visitors/_progress_bar.html.erb'}

Para manipular o formulário de importação, vamos adicionar um id ao mesmo. 

```erb
<%= form_with(url: import_visitors_path, class: "contents", id: 'import_form') do |form| %>
<%# ... %>
```
{: file='app/views/visitors/_import_form.html.erb'}

Agora, em ImportJob, modifique o código conforme o código aseguir: 


```ruby
require 'csv'

class ImportJob < ApplicationJob
  queue_as :default

  def perform(model, file)
    csv = CSV.read(file, headers: true)
    total = csv.count
    
    csv.each_with_index do |row, index|
      Turbo::StreamsChannel.broadcast_update_to 'importVisitors', target:'import_form', partial: 'visitors/progress_bar', locals: {percent: ((index+1)*100/total) }
      visitor = model.new(row.to_hash)
      visitor.save
      visitor.broadcast_append_to 'importVisitors'
    end
  end
end
```
{: file='app/jobs/import_job.rb'}

![progress-bar](https://i.ibb.co/kBp2Zcs/Tab-Post-04.gif)

## Adicionando as Métricas

Para substituir a barra de progresso pelas métricas de importação, vamos modificar o ImportJob conforme o código a seguir: 

```ruby
require 'csv'

class ImportJob < ApplicationJob
  queue_as :default

  def perform(model, file)
    
    imported_sucessfully = 0
    imported_unsucessfully = 0
    
    csv = CSV.read(file, headers: true)
    total = csv.count
    
    csv.each_with_index do |row, index|
      Turbo::StreamsChannel.broadcast_update_to 'importVisitors', target:'import_form', partial: 'visitors/progress_bar', locals: {percent: ((index+1)*100/total) }
      visitor = model.new(row.to_hash)
      visitor.save ? imported_sucessfully += 1 : imported_unsucessfully += 1
      visitor.broadcast_append_to 'importVisitors'#, partial: 'visitors/import_visitor', locals: {row: index} 
    end
    return{imported_sucessfully: imported_sucessfully, imported_unsucessfully: imported_unsucessfully, total: total}
  end
end
```
{: file='app/jobs/import_job.rb'}

Como estamos retornando um hash de valores, vamos associar este retorno em uma variavél. 

```ruby
# GET /visitors/import
# POST /visitors/import
def import 
  return @result = ImportJob.perform_later(Visitor, params[:file]) if request.post?
end
```
{: file='app/controllers/visitors_controller.rb'}

Com isto, estes valores estão acessíveis através de `@result`. Para que isto seja renderizado ao fim do processamento, basta alterar o arquivo *import.turbo_stream.erb* para listar os valores. 

```erb
<%= turbo_stream.replace 'import_form' do  %>

  <% if @result[:imported_sucessfully].positive? %>
    <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 " role="alert">
      <strong class="block sm:inline">You have imported <%= @result[:imported_sucessfully] %> visitors successfully.</strong>
    </div>
  <% end %>

  <% if @result[:imported_unsucessfully].positive? %>
    <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 " role="alert">
      <strong class="block sm:inline"><%= @result[:imported_unsucessfully] %> visitors could not be imported.</strong>
    </div>
  <% end %>

<% end %>
```
{: file='app/views/visitors/import.turbo_stream.erb'}


![import-metrics](https://i.ibb.co/ZV99Lkw/Tab-Post-05.gif)

## Adicionando Validações

Até o momento, podemos importar diversos registros sem fazer qualquer tipo de validação, até mesmo, criando registros em branco. 

Como uma boa prática para garantir a integridade dos dados é importante que os modelos sejam validados antes de serem salvos no banco de dados. 

Para fazer isto, adicione as validações no modelo Visitor.

```ruby
class Visitor < ApplicationRecord
  validates :name, presence: true
  validates :cpf, presence: true, uniqueness: true
end
```
{: file='app/models/visitor.rb'}

Caso tente enviar novamente o arquivo *data_set_01.csv* agora que um erro `ActionController::UrlGenerationError in Visitors#import` ocorreu.

Isto acontece porque estamos tentando renderizar a partial 'visitors/_visitor', a qual contém o url para edição de Visitor. Porém, como o registro não foi criado devido as validações, não é possível se obter um ID válido, ocasionando o erro. 

Neste caso, também seria interessante informar ao usuário qual o motivo do registro não ter sido importado com sucesso. 

Pois bem, para fazermos isto, vamos criar uma tabela, e listar os registros importados nas linhas da tabela.

Crie a partial *_import_table.html.erb* com o seguinte conteúdo:

```erb
<div class="relative overflow-x-auto rounded-lg ">
  <table class="w-full text-sm text-center text-gray-500">
    <thead class="text-xs text-gray-700 uppercase bg-gray-200 ">
      <tr>
        <th scope="col" class="px-2 py-3">
          Row
        </th>
        <th scope="col" class="px-6 py-3">
          Name
        </th>
        <th scope="col" class="px-6 py-3">
          CPF
        </th>
        <th scope="col" class="px-6 py-3">
          Status
        </th>
      </tr>
    </thead>
    <tbody id="visitors">
    </tbody>
  </table>
</div>
```
{: file='app/views/visitors/_import_table.html.erb'}

Em seguida, crie a partial *_import_visitor.html.erb* que será utilizada para renderizar as linhas do arquivo CSV.

```erb
<tr class="border-b border-x hover:bg-gray-100">
  <td class="px-2 py-3"><%= row %></td>
  <td class="px-6 py-3"><%= visitor.name %></td>
  <td class="px-6 py-3"><%= visitor.cpf %></td>
  <td class="px-6 py-3">
    <% if visitor.errors.any? %>
      <span class="text-red-600"><%= visitor.errors.full_messages.join(", ") %></span>
    <% else %>
      Imported Successfully
    <% end %>
  </td>
</tr>
```
{: file='app/views/visitors/_import_visitor.html.erb'}

Para concluir as modificações, basta atualizar o Job, para que utilze as partials corretas.

```ruby
require 'csv'

class ImportJob < ApplicationJob
  queue_as :default

  def perform(model, file)
    
    Turbo::StreamsChannel.broadcast_replace_to 'importVisitors', target:'visitors', partial: 'visitors/import_table'
    
    imported_sucessfully = 0
    imported_unsucessfully = 0
    
    csv = CSV.read(file, headers: true)
    total = csv.count
    
    csv.each_with_index do |row, index|
      Turbo::StreamsChannel.broadcast_update_to 'importVisitors', target:'import_form', partial: 'visitors/progress_bar', locals: {percent: ((index+1)*100/total) }
      visitor = model.new(row.to_hash)
      visitor.save ? imported_sucessfully += 1 : imported_unsucessfully += 1
      visitor.broadcast_append_to 'importVisitors', partial: 'visitors/import_visitor', locals: {row: index} 
    end
    return{imported_sucessfully: imported_sucessfully, imported_unsucessfully: imported_unsucessfully, total: total}
  end
end
```
{: file='app/jobs/import_job.rb'}

E agora, para testar, vamos utilizar o arquivo: ***data_set_02.csv***, o qual contém registros válidos e invalidos.

![import-validations](https://i.ibb.co/hsFjNRp/Tab-Post-06.gif)

Pronto, agora temos uma aplicação que permite a importação de arquivos CSV, com feedback em tempo real, e validações de dados.

## Exportando os Dados

Para finalizar, vamos adicionar a funcionalidade de exportar os dados para um arquivo CSV.

Seguindo a mesma ideia de utilizar um Job genérico para importação de modelos com atributos variádos, vamos fazer o mesmo para exportação.

Gere o Job *ExportJob* com o seguinte comando:

```bash
rails g job Export
```

Em seguida, adicione o seguinte código ao Job:

```ruby
require 'csv'

class ExportJob < ApplicationJob
  queue_as :default

  def perform(model, attributes)
    csv = CSV.generate(headers: true) do |csv|
      csv << attributes.map(&:to_s)
      model.all.each do |visitor|
        csv << attributes.map{ |attr| visitor.send(attr) }
      end
    end
  end

end
```
{: file='app/jobs/export_job.rb'}

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
    send_data ExportJob.perform_now(Visitor, %i[name cpf]), filename: "visitors-#{Date.today}.csv"
  end
```
{: file='app/controllers/visitors_controller.rb'}

Observe que o Job, recebe como parâmetro o modelo e os atributos que devem ser exportados.

> <span class="fs-6"> É possível implementar um formulário específico para cada modelo, aonde o usuário poderia selecionar os atributos que deseja exportar. Porém, para simplificar, vamos utilizar um formulário genérico, que exporta todos os atributos atribuíveis do modelo.</span>
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

![final](https://i.ibb.co/NL419BK/Tab-Post-07.gif)

## Conclusão

Neste artigo vimos como implementar uma aplicação Rails que permite a importação de arquivos CSV, com feedback em tempo real, e validações de dados.

Criamos um job que permite importar qualquer modelos com atributos variádos, assim como exportar as informações necessárias para um arquivo CSV.

Também utilizamos recursos de Turbo Streams para criar uma barra de progresso, e modificar elementos da aplicação de forma prática e eficiente.

Espero que este artigo tenha sido útil para você, e que possa ser aplicado em seus projetos.

### Próximo Projeto

Como citado no começo deste artigo, o próximo projeto será abordado polimorfismo. Nele, vamos criar um sistema de autorizações, onde Visitantes ou Trabalhadores terão autorizações (polimorficas) para acessar determinados locais. Portanto, iremos utilizar este repositório como base, uma vez que é possível importar registros com facilidade, e aproveitaremos seus recursos para importar as autorizações com base no CPF do visitante ou trabalhador.