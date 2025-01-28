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

Hi everyone, let me introduce myself! 

I'm Lucas, one of the newest CodeMiners trainees, and proud to become part of the team. This is my first post on codeminer's blog, and I'm excited to share this article, hoping that his may be helpful for those who're reading. 

Right, let's go to the point. If you clicked on this post, probably you're a developer, and as a developer, you probably hear about some environments configurations that can improve your coding journey. 

One of the most commons configurations that we can do, starts on the most lovely tool of a developer, the **terminal**, so, maybe you're already familiar with `.bashrc`, `.zshrc` or some other *rc* file... but have you heard about `.railsrc`? 

In this article we'll dive into how this file can be helpful to you, specially, if you need to set up many rails projects as I needed on trainee program, and in my study routine.

## The Rails Config File 

`.railsrc` is a configuration file used in Ruby on Rails development. This file allows you to pre-configure certain options for your rails applications. These options can be found when you run `rails -h` on your terminal console. This command will print all available flags that your current rails version supports.

That rails is a robust framework we already know, but when we aren't familiar with him, it's common that we create a new project with tons of resources that won't be used.. In fact, if you're a new rails developer, you probably don't even know what they do. A good starting point for improving your programming skills is to remove unnecessary features and add them on demand, by doing this you will keep your project folder organized and clean. To exemplify this, have you ever seen a Rails project that uses Rspec as a test suite but still has the `test` folder forgotten? things like that don't smell good...

As follows as you discovery and study the framework, you start to understand more about what each flag does, for example, `--database=postgresql` change de the default rails database schema from *sqlite3* to *postgresql*, setting up the environment of your project to works with postgres. Another example, is the `--css=tailwind` flag, that, as you guessed, set up the tailwind to the project by the easiest way. 

At this point, you can ask yourself, *why should I spend some time to set up my config file if I can just write these statements and start coding?* And to be honest, maybe your time isn't worth to do it. ~~I agree with you~~, isn't every day that we need to start a new rails project. 

But, let's assume that you're studying the framework and are expanding your project's portfolio. For firsts' projects, you start with almost the default configuration. As your applications grows, you start to add *gems*, *env variables*, *custom files* and any kind of *resources* that makes sense for your environment and studies cases.

After a few projects that you achieve your accomplishments, it's getting boring to set up everything again for the next project, and there is why the `.railsrc` can be useful to you. To speak truly, the rails config is just the start point to automate projects configurations.

## Rails Templates

One of the rails flags available when you're creating a new rails project is the `-m` or `--template`. This flag allows you to choose a template to be applied to your project.

In this context, the rails 'template' isn't a *partial* or a *layout*. It is a generator that you can set as needed to speed up the new project setup. Instead of waste your time copying and pasting what you have done on other projects every time, consider to do it just once, writing a good template that serves for your purposes.

Before we start to dive into coding, i recommend you to learn just a little bit about [Thor](http://whatisthor.com/), a powerful ruby tool that allows you to create custom tasks to automate process like the creation of a model, controller and migration. This CLI tool is strong  recommended by community, and also, is used by rails framework.

Right, now that you have understood the problem that we want to solve, and knew the tools that we use to solve it, let's code!

## Hands-on

Before we start to elaborate our template, let's create the `~/.railsrc`. In this file, you can set the flags that you prefer. Consider the syntax is exactly the same as the command line.

In this case, we want just to load a custom template, by this way, every time that we run `rails new project` the template will be loaded by default, without needed to specify the longest command `rails new project --template='template.rb'`.


```rb
--template='~/.rails/template.rb'
```
{: file='~/.railsrc'}

The next step is to create the folder and the `template.rb` file. To do it, on your terminal run:

```sh
mkdir ~/.rails
touch ~/.rails/template.rb
```
{: .nolineno}

These commands will create a hidden folder on your root directory and the *template.rb* file. Feel free to use your favorite text/code editor to edit it.

Now, the things start to getting more interesting. To compose our template, the [Rails Guides Docs](https://guides.rubyonrails.org/generators.html#generator-helper-methods) provides some helper methods and a few examples of how to implement it, in addiction, I recommend you to check the [Thor Docs](https://www.rubydoc.info/gems/thor/Thor/Actions) and the [Generators Docs](https://api.rubyonrails.org/v7.1.3.2/classes/Rails/Generators/Actions.html#method-i-gem) to discover more about what you can do.

> NOTE: In this article we gonna cover just the [Application Templates](https://guides.rubyonrails.org/generators.html#application-templates), this works by the same way as a rails generator, but insted of writing ruby classes, we write it as a **ruby script**.
{: .prompt-info }


### Composing the Template

Let's assume that our template will add some useful gems like *faker, factory_bot, rspec, simplecov and pry-rails*, so, following the docs, write the code below on your `template.rb` file.

```rb
gem 'faker'
gem 'factory_bot_rails'
gem 'pry-rails'
gem 'rspec-rails'
gem 'simplecov'
```
{: file='~/.rails/template.rb'}


Quite simple, don't you agree? ... But, this script is incomplete. Rspec and SimpleCov requires a few more adjustments to be set up correctly  to the project. After add rspec, we need to run `rails g rspec:install` to generates the rspec files, and for simplecov, we need to add a few instructions into `spec/rails_helper.rb` to make it work correctly. To do it, append the following code in `template.rb`

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

That's it, now, when you run `rails new project`, the `.railsrc` file will load the template script, and the template will add the gems to the *Gemfile*, will generate rspec installation and finish the simplecov configuration requirements.     

Right, all working, now is just relax, right? ... hmm... well, not yet. Things may can become more complex than this. 

### Reviewing the code

After a quick review, I must share three negative things about that script, the localization where the code will be inserted, the indentation, and the difficulty of customizing your resource installations. Let's dig into each one. 

#### Code placement

The first point to observe, it is that the *gems* that we specify were just appended to the bottom of *Gemfile* without follow any order or validation, even if you use the `gem_group` as the example below, expecting that the code will be in the right place, the code won't be.

```rb
gem_group :development, :test do
  gem "rspec-rails"
end
```
{: file='~/.rails/template.rb'}


The problem of this, is that the gems were added to all environments (development, test and production), and when we define a *gem_group*, the group itself is duplicated, what is considered a bad practice.

![Gemfile example](https://i.ibb.co/FwJbB2S/Screenshot-1.png){: .w-75}

#### Indentation

Other point you have to consider is the indentation of your script code, and the code generated by him. The script code appears to be indented correctly, but when you look to `spec/rails_helper.rb`, you will notice that the simplecov instructions aren't (lines 9, 10). This can be a very frustrating, due to fix it you need to do it manually, or break the script indentation. In both cases, none is recommended. 

![indentation example](https://i.ibb.co/ZKbc1zz/Screenshot-2.png){: .w-75}

Although the code is working, it is bad indented. Soon I will show you how to deal with it. For now, imagine the same situation if you're trying to write a YML file, like a  `database.yml`, it's certain that you will have some headaches, and will spend a lot of time trying to fix the script, creating a new project, and validating if the code is in the expected place. 

#### Custom Installation

The next point to consider is to assume that for the next project that you're creating, you won't use rspec. At this point you have three options: I. Don't use the template and set up the project resources manually, II. duplicate and edit the template file, or, III. Add some logic to the script. And as good developers, of course we gonna chose the last one. 

Let's try to keep things as simple as possible for now. Following the [devise example](https://guides.rubyonrails.org/generators.html#application-templates), we can just ask the user if he wants to use the rspec and adjust the logic to do the appropriate configuration.

Let's update the code...

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

As you can see, a simple choice can imply into a more complex logic, in addiction, you're still having the indent problems, and as the complexity increases, the linear logic can break the script easily. For example, if you try to add simplecov before generating rspec installation files, the `insert_into_file` will raise an error due to file not existing.

And now, what is the purpose of speed up the setup of a new project, becomes painful due to all these problems that we have to handle. So let's see how to deal with them.

## Improving the template

Before we continue, it's valid to remember that is a simple example, with just 5 gems, but in the reality, you probably will handle more resources. In the trainee program, it's common that we need setup resources like: *devise, factory_bot, faker, ffaker, font_awesome, pry_rails, rspec, ruby_lsp, simplecov, shoulda_matchers, rswag, active_storage, action_text, sidekiq, i18n, rubocop*, and others...

By this way, it only remains to pass through the painful and lazy process to set it all up each time we need a new rails project, or to invest some time dealing with the template. To help you with it, at the end of this post, I will share with you my own template, but to make it worth, stay with me into the refactoring process.

### Template Helper Module 

This is what we're going to do. First, we must create `template_helper.rb` that will serve as a *module*. In this file we'll specify all the gems and they installations instructions (if needed). This module allows isolating the template logic (what and how we want to set up), from the installation steps (what we need to do to set it up properly).

On your terminal run:

```sh
touch ~/.rails/template_helper.rb
```
{: .nolineno}

This will create the *template_helper.rb* file. In that file, let's specify a hash named `RESOURCES` that will contain all the gems that you want to make available for your next rails project. Observe that we will use the gem name as the keys of the hash, and the value, will be another hash, with the keys `{ :required, :info, :order }`. 

The `:required`, will be a boolean, used to enable the installation of the resource by default. The `:info`, will be used to describe what the resource do. You can set as you want, but i recomended to set it with the link of github repo. And the `:order` is integer and optional, and will be used just when it is needed to prioritize the installation order of a resource, like *rspec*, which, if it is in the list of features to be installed, must be configured first, due to the behavior of other gems, like *simplecov*. 


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

### Handling the Indentation

To deal with the indent problem, and the place where the code will be inserted, we're going to create constants for each resource and her post-installation instructions (if needed). 

Pay attention to two things, the constants must be a **Proc**. This happens because the constant will be evaluated as a `&block` when used as an argument in `template.rb`, and the second thing, is that our file does not have indentation itself, instead we use `.indent (num_of_spaces)` to configure it manually, this way our code is more readable and easier to edit. Just as it is possible to deal with the indentation problem, it is also possible to add empty lines, aiming for good formatting where the code will be inserted.

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

### Making the script dynamic

Right, the first part is done, now, we can update the script template logic. In `template.rb` we will structure things differently, first, we're going to write a 'menu' that iterate over each `RESOURCE`, and let the user decide if he wants to use the default template - based on `:required` value of the resource - or, if he wants to choose what resource of the list will be enabled on the project.

After the user make her choice, the script logic will iterate again over all `RESOURCES` - taking in consideration the `:order` key (if is set) that was set for the installation - and will invoke a method named with the same named key, to perform the configuration on the resource.

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

Here are some points to observe in that part of the code. Instead of use `yes?` we are using `ask`, this way, we can limit the available options, ensuring that the user input will be a pre-defined value, and also set a default answer for the question. We also set some text formatting to be applied to keep the interface more interactive, and if the user doesn't want to use the default template, the resource `:info` will be used as a hint to the user while he decides which resource he will install.

![menu_interface](https://i.ibb.co/xLKRPBh/Screenshot-3.png){: .w-75}

The next step is to add the methods for each key. **The method itself must be named with the same resource key.**


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


### Fixing the code placement

The first thing to notice, is that as we're handling a script file, **the `show_menu` must be after all the methods to work correctly**, and as before, you can notice that we're using different methods to configure the project. Instead of use `gem` method, now we're using `insert_into_file`, this way, we can control where exactly the code will be inserted, in addiction, you can also use `append_to_file` if it makes more sense for some cases. Remember, the indentation of what will be inserted/appended is defined on the `template_helper.rb` and now we no longer have to deal with wrong indentation. 

Other vantage to struct the code like this, is that you can sort your resource keys and the methods in alphabetical order, it keeps the code more organized, once the `:order` will be used to determine what will be set up firstly.

### Finishing the setup

To finish this template, we can add an extra step. The `after_bundle` block. While your project is setting up, one of the lasts steps that rails do, is run `bundle` command to install all projects dependencies. 

So we can use this block statement to perform some complementary settings, like do the initial commit of the project and start the application server.

So, let's do it. Place the code below before the `show_menu`.

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

To finish, append the code below to the bottom of `show_menu` method. 

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

Now, after run `rails new project` your template will be interactive and will allow you to decide what resource should be used in the project that you're creating, and the best part, is that you don't have to be worry about the flow of resources installation once each resource has his own method to do it. 

Once your template is defined, you'll never spend time again to set up a new rails project as the old way, but remember, in day-by-day projects its common that we use more than five gems, and there are a lot of gems that is considered almost essential to every rails projects, independent of the 'kind' of application that you'll develop.

## Extra

And as i promised, you can check [this gist](https://gist.github.com/lucasgeron/304c62c2330b332f377ef05799625e0f) to find my own version of the template, with many resources already defined.

My template also has two extra features, the setup of docker environment for Postgres Database (only available when flag `--database=postgresql` is declared), and a custom report with all installed resources as the image below. Of course, the report is optional and is generated after the installation process over.  

![report](https://i.ibb.co/TB1f1W4/Captura-de-tela-21-3-2024-175236-127-0-0-1.jpg)

Thanks for read, hope you have enjoyed it and learned something new with this article! Stay in tune and consider subscribing to the CodeMiner's blog to receive more posts from our team.