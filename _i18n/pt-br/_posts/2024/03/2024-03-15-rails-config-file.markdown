---

layout: post
title: "Rails Config File"
date: 2024-03-15
short_description: "In this article we'll explore about Application Templates and the Rails Config File"
cover: "https://railsware.com/blog/wp-content/uploads/2020/12/ruby-on-rails-guide.jpg"

read_time: true
toc: true
github_repo:

categories:
- Article
# - Portfolio
# - Product
- Tutorial

tags:
# Tech Tags
# - API
# - Design
# - Hotwire Turbo
# - Hotwire Stimulus
# - Python
# - P5.js
- Ruby
- Ruby On Rails
# - Spreadsheet
- Useful Gems
---

![cover](https://railsware.com/blog/wp-content/uploads/2020/12/ruby-on-rails-guide.jpg)

Olá a todos, deixe-me me apresentar!

Sou Lucas, um dos mais novos trainees da CodeMiners e tenho orgulho de fazer parte da equipe. Este é meu primeiro post no blog do codeminer, e estou animado em compartilhar este artigo, esperando que ele possa ser útil para quem está lendo.

Certo, vamos direto ao ponto. Se você clicou nesta postagem, provavelmente você é um desenvolvedor e, como desenvolvedor, provavelmente já ouviu falar sobre algumas configurações de ambientes que podem melhorar sua jornada de codificação.

Uma das configurações mais comuns que podemos fazer começa na ferramenta mais querida de um desenvolvedor, o **terminal**, então talvez você já esteja familiarizado com `.bashrc`, `.zshrc` ou algum outro *rc*... mas você já ouviu falar de `.railsrc`?

Neste artigo vamos nos aprofundar em como esse arquivo pode ser útil para você, principalmente, se você precisar montar vários projetos Rails conforme precisei no programa de trainee e na minha rotina de estudos.

## Rails Config File

`.railsrc` é um arquivo de configuração usado no desenvolvimento Ruby on Rails. Este arquivo permite pré-configurar certas opções para suas aplicações Rails. Essas opções podem ser encontradas quando você executa `rails -h` no console do seu terminal. Este comando irá listar todos as flags disponíveis que sua versão atual do Rails suporta.

Que o Rails é um framework robusto nós já sabemos, mas quando não o conhecemos, é comum criarmos um novo projeto com toneladas de recursos que não serão utilizados. Na verdade, se voce é um novo desenvolvedor rails, você provavelmente nem sabe o que elas fazem, mas vamos deixar isso para outro post... Um bom ponto de partida para melhorar suas habilidades de programação é remover os recursos desnecessários e adicioná-los por demanda, fazendo isso, você manterá a pasta do seu projeto organizada e limpa. Para exemplificar isso, você já viu um projeto Rails que usa Rspec como suíte de testes mas ainda possui a pasta `test` esquecida? coisas assim não cheiram bem...

À medida que você descobre e estuda o framework, você começa a entender mais sobre o que cada flag faz, por exemplo, `--database=postgresql` altera o esquema padrão do banco de dados Rails de *sqlite3* para *postgresql*, configurando o ambiente do seu projeto para funcionar com postgres. Outro exemplo é o sinalizador `--css=tailwind`, que, como você pode advinhar, configura o tailwind no projeto da jeito mais fácil.

Neste ponto, você pode se perguntar: *por que devo gastar algum tempo configurando meu arquivo de configuração se posso simplesmente escrever essas flags e começar a codificar?* E para ser honesto, talvez seu tempo não valha a pena para fazer isso. ~~Eu concordo com você~~, não é todo dia que precisamos iniciar um novo projeto Rails.

Mas, vamos supor que você esteja estudando o framework e expandindo o portfólio do seu projeto. Para projetos iniciais, você começa quase com a configuração padrão. À medida que suas aplicações crescem, você começa a adicionar *gems*, *variáveis de ambiente*, *arquivos customizados* e qualquer tipo de *recurso* que faça sentido para seu ambiente e casos de estudo.

Depois de alguns projetos em que você alcança suas realizações, fica chato configurar tudo novamente para o próximo projeto, e é por isso que o `.railsrc` pode ser útil para você. Para falar a verdade, a configuração do Rails é apenas o ponto de partida para automatizar as configurações dos projetos.

## Rails Templates

Uma das flags do Rails disponíveis quando você está criando um novo projeto Rails é o `-m` ou `--template`. Este sinalizador permite que você escolha um modelo a ser aplicado ao seu projeto.

Neste contexto, o 'template' do Rails não é uma *partial* ou um *layout*. É um gerador que você pode configurar conforme necessário para agilizar a configuração do novo projeto. Em vez de perder tempo copiando e colando o que você fez em outros projetos toda vez, considere fazer isso apenas uma vez, escrevendo um bom template que sirva para suas propósitos.

Antes de começarmos a mergulhar na codificação, recomendo que você aprenda um pouco sobre [Thor](http://whatisthor.com/), uma ferramenta Ruby poderosa que permite criar tarefas personalizadas para automatizar processos como a criação de um modelo, controlador e migração. Esta ferramenta CLI é fortemente recomendada pela comunidade e também é usada pelo framework Rails.

Certo, agora que você entendeu o problema que queremos resolver e conheceu as ferramentas que utilizamos para resolvê-lo, vamos para o código!

## Hands-on

Antes de começarmos a elaborar nosso template, vamos criar o `~/.railsrc`. Neste arquivo, você pode definir as flags de sua preferência. Considere que a sintaxe é exatamente igual à da linha de comando.

Neste caso, queremos apenas carregar um template customizado, desta forma, toda vez que executarmos `rails new project` o template será carregado por padrão, sem a necessidade de especificar o comando mais longo `rails new project --template= 'modelo.rb'`.

```rb
# place this code in ~/.railsrc
--template='~/.rails/template.rb'
```
{: file='~/.railsrc'}

O próximo passo é criar a pasta e o arquivo `template.rb`. Para fazer isso, em seu terminal execute:

```sh
mkdir ~/.rails
touch ~/.rails/template.rb
```
{: .nolineno}

Estes comandos criarão uma pasta oculta em seu diretório raiz e o arquivo *template.rb*. Use o editor de texto/codigo que preferir para editar isto.

Agora, as coisas começam a ficar mais interessantes. Para compor nosso template, o [Rails Guides Docs](https://guides.rubyonrails.org/generators.html#generator-helper-methods) fornece alguns métodos auxiliares e alguns exemplos de como implementá-los, além disso, eu recomendo que você verifique a [Documentação do Thor](https://www.rubydoc.info/gems/thor/Thor/Actions) e a [Documentação dos Geradores](https://api.rubyonrails.org/v7.1.3.2 /classes/Rails/Generators/Actions.html#method-i-gem) para descobrir mais sobre o que você pode fazer.

> NOTA: Neste artigo vamos cobrir apenas os [Modelos de Aplicação](https://guides.rubyonrails.org/generators.html#application-templates), isso funciona da mesma maneira que um gerador Rails, mas em vez de escrever classes Ruby, nós o escrevemos como um **script Ruby**.
{: .prompt-info }

### Compondo o Template

Vamos supor que nosso modelo irá adicionar algumas gems úteis como *faker, factory_bot, rspec, simplecov e pry-rails*, então, seguindo a documentação, escreva o código abaixo em seu arquivo `template.rb`.

```rb
gem 'faker'
gem 'factory_bot_rails'
gem 'pry-rails'
gem 'rspec-rails'
gem 'simplecov'
```
{: file='~/.rails/template.rb'}


Muito simples, você não concorda? ... Mas este script está incompleto. Rspec e SimpleCov precisam de mais alguns ajustes para serem configurados corretamente no projeto. Após adicionar o rspec, precisamos executar `rails g rspec:install` para gerar os arquivos de rspec, e para simplecov, precisamos adicionar algumas instruções em `spec/rails_helper.rb` para fazê-lo funcionar corretamente. Para fazer isso, adicione o seguinte código em `template.rb`

```rb
# ...

generate 'rspec:install'

insert_into_file 'spec/rails_helper.rb', before: "# This file is copied to spec/ when you run 'rails generate rspec:install'\n" do 
  <<-RUBY
    require 'simplecov'
    SimpleCov.start
  RUBY
end
```
{: file='~/.rails/template.rb'}

É isso, agora, quando você executar `rails new project`, o arquivo `.railsrc` irá carregar o script do template, e o template irá adicionar as gems ao *Gemfile*, irá gerar a instalação do rspec e finalizar os requisitos de configuração do simplecov.

Certo, tudo funcionando, agora é só relaxar, certo? ... hmm... bem, ainda não. As coisas podem se tornar mais complexas do que isso.

### Revisando o Código

Após uma rápida revisão, devo compartilhar três pontos negativos sobre esse script, a localização onde o código será inserido, a indentação e a dificuldade de customizar a instalação de seus recursos. Vamos nos aprofundar em cada um deles.

#### Posicionamento do Código

O primeiro ponto a observar, é que as *gems* que especificamos foram apenas incluídas no final do *Gemfile* sem seguir nenhuma ordem ou validação, mesmo que você use o `gem_group`, como no exemplo abaixo, esperando que o código estará no lugar certo, isto não acontecerá.

```rb
gem_group :development, :test do
  gem "rspec-rails"
end
```
{: file='~/.rails/template.rb'}

O problema disso é que as gems foram adicionadas em todos os ambientes (desenvolvimento, teste e produção), e quando definimos um *gem_group* o próprio grupo é duplicado, o que é considerado uma má prática.

![Gemfile example](https://i.ibb.co/FwJbB2S/Screenshot-1.png){: .w-75}


#### Indentação

Outro ponto que você deve considerar é a indentação do seu código de script e do código gerado por ele. O código do script parece estar indentado corretamente, mas quando você olhar para `spec/rails_helper.rb`, você notará que as instruções simplecov não estão (linhas 9, 10). Isso pode ser muito frustrante, pois para consertar você precisa fazer isso manualmente ou quebrar a indentação do script. Em ambos os casos, nenhum é recomendado.

![indentation example](https://i.ibb.co/ZKbc1zz/Screenshot-2.png){: .w-75}

Embora o código esteja funcionando, ele está mal indentado. Em breve mostrarei como lidar com isso. Por enquanto, imagine a mesma situação se você estiver tentando escrever um arquivo YML, como um  `database.yml`, é certo que você terá algumas dores de cabeça, e gastará muito tempo tentando consertar o script, criando um novo projeto, e validando se o código está no lugar esperado.

#### Instalação Personalizada

O próximo ponto a considerar é assumir que para o próximo projeto que você estiver criando, você não usará o rspec. Neste ponto você tem três opções: I. Não usar o template e configurar os recursos do projeto manualmente, II. duplicar e editar o arquivo de template, ou, III. Adicionar alguma lógica ao script. E como bons desenvolvedores, é claro que vamos escolher o último.

Vamos tentar manter as coisas o mais simples possível por enquanto. Seguindo o [exemplo de devise](https://guides.rubyonrails.org/generators.html#application-templates), podemos apenas perguntar ao usuário se ele deseja usar o rspec e ajustar a lógica para fazer a configuração apropriada.

Vamos atualizar o código...

```rb
# ...

use_rspec = yes?('Do you like to install Rspec?')
if use_rspec
  gem_group :development, :test do
    gem "rspec-rails"
  end
  generate 'rspec:install'
end

simplecov_config = <<-RUBY
  require 'simplecov'
  SimpleCov.start
RUBY

if use_rspec
  insert_into_file 'spec/rails_helper.rb', simplecov_config, 
    before: "# This file is copied to spec/ when you run 'rails generate rspec:install'\n"
else 
  insert_into_file 'test/test_helper.rb', simplecov_config, before: "module ActiveSupport" 
end
```
{: file='~/.rails/template.rb'}

Como você pode ver, uma escolha simples pode implicar em uma lógica mais complexa, além disso, você ainda estárá tendo problemas de indentação, e conforme a complexidade aumenta, a lógica linear pode quebrar o script facilmente. Por exemplo, se você tentar adicionar simplecov antes de gerar os arquivos de instalação do rspec, `insert_into_file` gerará um erro devido ao arquivo não existir.

E agora, o propósito de agilizar a montagem de um novo projeto, torna-se difícil devido a todos esses problemas que temos que resolver. Então vamos ver como lidar com eles.

## Melhorando o Template

Antes de continuarmos, é válido lembrar que é um exemplo simples, com apenas 5 gems, mas na realidade você provavelmente irá lidar com mais recursos. No programa de trainee, é comum precisarmos de recursos de setup como: *devise, factory_bot, faker, ffaker, font_awesome, pry_rails, rspec, ruby_lsp, simplecov, Shoulda_matchers, rswag, active_storage, action_text, sidekiq, i18n, rubocop*, e outros...

Dessa forma, resta apenas passar pelo doloroso e preguiçoso processo de configurar tudo cada vez que precisarmos de um novo projeto Rails, ou investir algum tempo lidando com o template. Para te ajudar, no final deste post compartilharei com vocês meu próprio template, mas para que valha a pena, fique comigo no processo de refatoração.

### Módulo Template Helper

Isto é o que vamos fazer. Primeiro, devemos criar `template_helper.rb` que servirá como um *módulo*. Neste arquivo iremos especificar todas as gems e suas instruções de instalação (se necessário). Este módulo permite isolar a lógica do template (o que e como queremos configurar), das etapas de instalação (o que precisamos fazer para configurá-lo corretamente).

No seu terminal, execute:

```sh
touch ~/.rails/template_helper.rb
```
{: .nolineno}

Isso irá criar o arquivo *template_helper.rb*. Nesse arquivo, vamos especificar um hash chamado `RESOURCES` que irá conter todas as gems que você deseja disponibilizar para seu próximo projeto Rails. Observe que usaremos o nome da gema como chaves do hash, e o valor, será outro hash, com as chaves `{ :required, :info, :order }`.

O `:required`, será um booleano, utilizado para habilitar a instalação do recurso por padrão. O `:info` será usado para descrever o que o recurso faz. Você pode definir como quiser, mas recomendo configurá-lo com o link repositório do github. E a `:order` é inteiro e opcional, e será usado apenas quando for necessário priorizar a ordem de instalação de um recurso, como *rspec*, que se estiver na lista de recursos para serem instalados, deve ser configurado primeiro, devido ao comportamento de outras gems, como *simplecov*.

```rb
module TemplateHelper

RESOURCES = {
 :factory_bot => {
    required: true,
    info: 'https://github.com/thoughtbot/factory_bot_rails',
  },
  :faker => {
    required: true,
    info: 'https://github.com/faker-ruby/faker',
  },
  :pry_rails => {
    required: true,
    info: 'https://github.com/pry/pry',
  },
   :rspec => {
    required: true,
    info: 'https://github.com/rspec/rspec-rails',
    order: 1
  },
   :simplecov => {
    required: true,
    info: 'https://github.com/simplecov-ruby/simplecov',
  },
}
```
{: file='~/.rails/template_helper.rb'}

### Lidando com a indentação

Para resolver o problema de indentação e local onde o código será inserido, vamos criar constantes para cada recurso e suas instruções de pós-instalação (se necessário).

Preste atenção em duas coisas, as constantes devem ser um **Proc**. Isso acontece porque a constante será interpretada como um `&block` quando usada como argumento em `template.rb`, e a segunda coisa, é que nosso arquivo não possui indentação em si, em vez disso, usamos `.indent (num_of_spaces)` para configurá-lo manualmente, desta forma, nosso código fica mais legível e fácil de editar. Assim como é possível lidar com o problema de indentação, também é possível adicionarmos linhas vazias, visando a boa formatação de onde o código irá ser inserido.

```rb
module TemplateHelper

# ...

FACTORY_BOT = Proc.new {
<<-RUBY.indent(2)
gem 'factory_bot_rails'
RUBY
}

FACTORY_BOT_HELPER = Proc.new {
<<-RUBY.indent(2)
# include FactoryBot methods to use in specs
config.include FactoryBot::Syntax::Methods

RUBY
}

FAKER = Proc.new { 
<<-RUBY.indent(2)
gem 'faker'
RUBY
}


SIMPLECOV = Proc.new {
<<-RUBY.indent(2)
gem 'simplecov', require: false
RUBY
}

SIMPLECOV_CONFIG = Proc.new {
<<-RUBY.indent(0)
require 'simplecov'
SimpleCov.start 
RUBY
}

PRY_RAILS = Proc.new {
<<-RUBY.indent(2)

# Use pry for debugging [https://github.com/pry/pry-rails]
gem 'pry-rails'

RUBY
}

RSPEC = Proc.new {
<<-RUBY.indent(2)
gem 'rspec-rails'
RUBY
}

RSPEC_URL_HELPERS = Proc.new {
<<-RUBY.indent(2)
# include url_helpers to use routes in specs
config.include Rails.application.routes.url_helpers, type: :request

RUBY
}
end
```
{: file='~/.rails/template_helper.rb'}


### Tornando o script dinâmico

Certo, a primeira parte está feita, agora, podemos atualizar a lógica do template do script. Em `template.rb` vamos estruturar as coisas de forma diferente, primeiro, vamos escrever um 'menu' que itera sobre cada `RESOURCE`, e deixar o usuário decidir se deseja usar o template padrão - baseado em no valor de `:required` do recurso - ou, se quiser, escolher qual recurso da lista será habilitado no projeto.

Depois que o usuário fizer sua escolha, a lógica do script irá iterar novamente sobre todos os `RESOURCES` - levando em consideração a chave `:order` (se estiver definida) que foi definida para a instalação - e invocará um método nomeado com o mesmo nome da chave, para realizar a configuração no recurso.

```rb
require_relative 'template_helper'

def show_menu
  if ask("Do you want to use template?", %i[blue bold], default: 'y', limited_to: %w[y n]) == 'y'
    say('The default template includes:')
    TemplateHelper::RESOURCES.each do |key, attr|
      say("• #{key}", (attr[:required] ? :green : :red))
    end
    
    unless ask('Use default template?', %i[blue], default: 'y', limited_to: %w[y n]) == 'y'
      TemplateHelper::RESOURCES.each do |key, attr|
        if ask("• #{key.to_s.ljust(25)} #{attr[:info]}", %i[white], default: 'y', limited_to: %w[y n]) == 'y'
          TemplateHelper::RESOURCES[key][:required] = true 
        else
          TemplateHelper::RESOURCES[key][:required] = false 
        end
      end
      say('Your custom template includes:', %i[blue])
      TemplateHelper::RESOURCES.each do |key, attr|
        say("• #{key}", (attr[:required] ? :green : :red))
      end
      ask('Press any key to continue, or CTRL + C to cancel...', %i[blue bold])
    end

    TemplateHelper::RESOURCES.sort_by{|key, attr| [attr[:order] || Float::INFINITY, key]}.each do |key, attr|
      if attr[:required]
        say("\nSetting up #{key}...", :green)
        send(key) 
        say("#{key} has been set up!\n", :green)
      end
    end

    say('Template has been applied!', %i[green bold])
  end
end

# ...

show_menu
```
{: file='~/.rails/template.rb'}

Aqui estão alguns pontos a serem observados nessa parte do código. Em vez de usar `yes?` estamos usando `ask`, desta forma podemos limitar as opções disponíveis, garantindo que a entrada do usuário será um valor pré-definido, e também definir uma resposta padrão para a pergunta. Também definimos algumas formatações de texto a serem aplicadas para manter a interface mais interativa, e caso o usuário não queira usar o template padrão, o recurso `:info` será usado como uma dica para o usuário enquanto ele decide qual recurso ele irá instalar.

![menu_interface](https://i.ibb.co/xLKRPBh/Screenshot-3.png){: .w-75}

A próxima etapa é adicionar os métodos para cada chave. **O método em si deve ser nomeado com a mesma chave de recurso.**

```rb
#...

def factory_bot
  insert_into_file 'Gemfile', TemplateHelper::FACTORY_BOT, after: "group :development, :test do\n"
  insert_into_file 'spec/rails_helper.rb', TemplateHelper::FACTORY_BOT_HELPER, 
    after: "RSpec.configure do |config|\n" if(TemplateHelper::RESOURCES[:rspec][:required])
end

def faker
  insert_into_file 'Gemfile', TemplateHelper::FAKER, after: "group :development, :test do\n"
end

def pry_rails
  insert_into_file 'Gemfile', TemplateHelper::PRY_RAILS, after: "group :development do\n"
end

def rspec
  insert_into_file 'Gemfile', TemplateHelper::RSPEC, after: "group :development, :test do\n"
  generate 'rspec:install'
  insert_into_file 'spec/rails_helper.rb', TemplateHelper::RSPEC_URL_HELPERS, after: "RSpec.configure do |config|\n"
  remove_dir 'test' 
end

def simplecov
  insert_into_file 'Gemfile', TemplateHelper::SIMPLECOV, after: "group :test do\n"
  if TemplateHelper::RESOURCES[:rspec][:required] 
    insert_into_file 'spec/rails_helper.rb', TemplateHelper::SIMPLECOV_CONFIG, 
      before: "# This file is copied to spec/ when you run 'rails generate rspec:install'\n"
  else
    insert_into_file 'test/test_helper.rb', TemplateHelper::SIMPLECOV_CONFIG, before: "module ActiveSupport"
  end
end

show_menu
```
{: file='~/.rails/template.rb'}

### Posicionando o código

A primeira coisa a notar é que como estamos lidando com um arquivo de script, **o `show_menu` deve ser depois de todos os métodos funcionarem corretamente**, e como antes, você pode notar que estamos usando métodos diferentes para configurar o projeto. Ao invés de usar o método `gem`, agora estamos usando `insert_into_file`, desta forma, podemos controlar onde exatamente o código será inserido, além disso, você também pode usar `append_to_file` se fizer mais sentido para alguns casos. Lembre-se, a indentação do que será inserido está definido no `template_helper.rb` e agora não precisamos mais lidar com recuo errado.

Outra vantagem de estruturar o código desta forma, é que você pode ordenar suas chaves de recursos e os métodos em ordem alfabética, isso mantém o código mais organizado, uma vez que o `:order` será usado para determinar o que será configurado primeiro.

### Terminando a configuração

Para finalizar este modelo, podemos adicionar uma etapa extra. O bloco `after_bundle`. Enquanto seu projeto está sendo configurado, uma das últimas etapas que o Rails faz é executar o comando `bundle` para instalar todas as dependências do projeto.

Portanto podemos utilizar esta instrução de bloco para realizar algumas configurações complementares, como fazer o commit inicial do projeto e iniciar o servidor de aplicação.

Então, vamos fazer isto. Coloque o código abaixo antes do `show_menu`.

```rb
#...

def git_init
  say('Intializing git...', :green)
  git :init
  git add: "."
  git commit: %Q{ -m 'Initial commit' }
  say('Git has been initialized!', :green)
end

def start_server
  after_bundle do
    if ask("Do you wish to start the application server?", :blue, default: 'y', limited_to: %w[y n]) == 'y'
      run './bin/dev' 
    end
  end
end

# ... 

show_code
```
{: file='~/.rails/template.rb'}

Para finalizar, anexe o código abaixo na fim do método `show_menu`.

```rb
#...

def show_menu
  # ...
  after_bundle do
    git_init
    start_server
  end
end

# ...
```
{: file='~/.rails/template.rb'}

Agora, após executar `rails new project` seu template será interativo e permitirá que você decida qual recurso deve ser utilizado no projeto que você está criando, e o melhor, é que você não precisa se preocupar com o fluxo de instalação de recursos, uma vez que cada recurso possui seu próprio método para fazer isto.

Uma vez definido seu template, você nunca mais perderá tempo configurando um novo projeto Rails como antigamente, mas lembre-se, em projetos do dia a dia é comum usarmos mais de cinco gems, e há muitas gems que são consideradas quase essenciais para todos os projetos de rails, independente do 'tipo' de aplicação que você irá desenvolver.

## Extra

E como prometi, você pode conferir [este gist](https://gist.github.com/lucasgeron/304c62c2330b332f377ef05799625e0f) para encontrar minha própria versão do template, com muitos recursos já definidos.

Meu template também possui dois recursos extras, a configuração do ambiente docker para o banco de dados Postgres (disponível apenas quando a flag `--database=postgresql` é declarada) e um relatório personalizado com todos os recursos instalados como na imagem abaixo. Claro, o relatório é opcional e é gerado após o término do processo de instalação.

![relatório](https://i.ibb.co/TB1f1W4/Captura-de-tela-21-3-2024-175236-127-0-0-1.jpg)

Obrigado pela leitura, espero que você tenha gostado e aprendido algo novo com este artigo! Fique ligado e considere se inscrever no blog do CodeMiner para receber mais postagens de nossa equipe.