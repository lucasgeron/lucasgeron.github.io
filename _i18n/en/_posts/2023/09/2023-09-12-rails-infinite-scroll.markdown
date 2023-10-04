---

layout: post
title: "Rails Inifite Scroll with Turbo"
date: 2023-09-12
short_description: "In this article I show you how to create the infinite scroll effect without using JavaScript. As a bonus, I will also give you two more tips that can help a lot when creating a blog."
cover: https://i.ibb.co/2ZsCWts/20230913-144634.gif
read_time: true
toc: true
github_repo: rails-infinite-scroll
categories:
- Tutorial
tags:
- Ruby On Rails
- Hotwire Turbo
- Useful Gems
---

# Rails Infinite Scroll



{% include youtube.html id="b7j8jEAd2sc" %}

This time, let's get straight to the point, without beating around the bush. Let's create a blog with infinite scrolling, without using javascript. For this, we will only use [Turbo](https://turbo.hotwire.dev/) and some gems like [Pagy](https://ddnexus.github.io/pagy/), [ActionText](https:/ /github.com/rails/rails/tree/main/actiontext) and [Active Record Import](https://github.com/zdennis/activerecord-import).

## Creating the project

Open your terminal and on your desktop type the following commands to create and access the project directory.

```bash
rails new rails-infinite-scroll --css=tailwind
cd rails-infinite-scroll
```

## ActionText

Okay, the first tip is this! As we are running a blog, it is interesting to allow the user to write their articles using the text editor.

To do this, we will use ActionText, which is a library available in Rails that allows us to integrate a text editor [Trix](https://trix-editor.org/).

This feature allows the author to include images throughout the article, which is why it is necessary to install Active Storage before installing ActionText.

In your terminal, run the following commands:
```bash
rails active_storage:install
rails action_text:install
```

**Important:** If you are using WSL2, you may need to install the `libvips` library. To do this, simply run the command:
`sudo apt install libvips`. If you already have it installed, just move on.

In addition to Active Storage, Action Text uses the image_processing gem, which by default is commented in the Gemfile.

## Active Record Import

The second tip also comes right at the beginning of the article! As we want to simulate the infinite scrolling of blog posts, we will have to create these records. To do this, we will use the [Active Record Import] gem (https://github.com/zdennis/activerecord-import).

This gem allows us to create multiple records at once, which is very useful for creating test records, as is the case in this article.

Therefore, let's edit our ***Gemfile*** file to include the necessary gems and enable the `image_processing` gem, which is commented out by default.

Look for the line containing the `image_processing` gem and uncomment it. Then, add the `activerecord-import`, `faker` and `pagy` gems as per the code snippet below:

```ruby
#...
# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
gem "image_processing", "~> 1.2"

gem 'activerecord-import'
gem 'faker'
gem 'pagy', '~> 6.0'

#...
```

**Faker** will be used to generate random data for our blog, and **Pagy** to create the pagination of the articles.

Now we can install the gems with the bundle.

```bash
bundle install
```

After this, we will finish configuring the Pagy gem as recommended in the documentation.

In `app/controllers/application_controller.rb` add the code below:

```ruby
include Pagy::Backend
```

In `app/helpers/application_helper.rb` add the code below:
 
```ruby
include Pagy::Frontend
```
Everything ready for us to continue...

## Creating the model
Our example model will be ***Article*** which will have the attributes *title*, *cover_url* and *body*. To create the model and perform database creation, run the commands:

```bash
rails g model Article title:string cover_url:string body:rich_text
```

```bash
rails db:migrate
```

## Populating the Database

To create several articles on our blog, we can use the file `db/seeds.rb`. You're probably used to writing a piece of code similar to this:

```ruby
require 'faker'

100.times
Article.create(
title: Faker::Book.title,
cover_url: "https://picsum.photos/id/#{i}/800/800")
end
```
There is nothing wrong with doing it this way, however, with the code above, **100 queries will be executed in the database**.

<h4 data-toc-skip> With Active Record Import we can create 100 records (or more) with just one query. </h4>

To do this, in the `db/seeds.rb` file add the code below:

```ruby
require 'faker'

articles = []
bodies = []

10.times |i|
articles << Article.new(
title: Faker::Book.title,
cover_url: "https://picsum.photos/id/#{i}/800/800")
bodies << ActionText::RichText.new(
body: Faker::Lorem.paragraph(sentence_count: 20),
record_id: i+1,
record_type: "Article",
name: "body" )
end

Article.import articles
ActionText::RichText.import bodies
```

Now, to create the records, just run the command:

```bash
rails db:seed
```
The output should be something similar to:

<img src="https://i.ibb.co/rFjX2t6/screen-shot-01.png" alt="" class="">

This tells us that only one insertion was made for each table, however, all records were saved by a single query.

## Starting the Server
Now that we have records in our database, we can start the server compiling the tailwind files.

```bash
./bin/dev
```

To see if everything is working correctly, go to [http://localhost:3000/articles](http://localhost:3000/articles). You should be something like:

<img src="https://i.ibb.co/tsNkCpx/Screenshot-1.jpg" alt="" class="">

## Styling the page
Before adding features, let's style our application to make the interface more user-friendly. For this, we will use Tailwind CSS.

In the `app/views/layouts/application.html.erb` file we will change the `main` element, replacing the *mt-28* class with *my-4*. (this will remove the top spacing)

```erb
<main class="container mx-auto my-4 px-5 flex">
<%= yield %>
</main>
```

In `app/views/articles/_article.html.erb` we will replace all the code with the code below:

```erb
<div id="<%= dom_id article %>">
<%= link_to article do %>
<div class="bg-cover bg-center <%= action_name == "show" ? 'h-96' : 'h-52'%> rounded-lg relative" style="background-image: url(<% = url_for(article.cover_url) %>)">
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

In `app/views/articles/index.html.erb` for now, let's just add some classes to 'articles', and add Pagy pagination.

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

Finally, change the `app/controllers/articles_controller.rb` file so that it looks similar to the code below:

```ruby
# GET /articles or /articles.json
def index
# @articles = Article.all
@pagy, @articles = pagy(Article.all, items: 3)
end
```
Now our articles page should look better.

<img src="https://i.ibb.co/8rd1dP9/Captura-da-Web-12-9-2023-202434-127-0-0-1.jpg" alt="" class="">

Additionally, if you try to edit an article, you will be able to see **ActionText** in action!

<img src="https://i.ibb.co/89tHxPX/Captura-da-Web-12-9-2023-20260-127-0-0-1.jpg" alt="" class="">

It's wonderful to be able to edit your articles with Rich Text, isn't it? And with Active Storage, **it's also possible to attach images directly from the editor!** Golden tip, eh!

## Adding Features

Now that we have a base to work from, let's implement infinite scrolling.

First, let's create a partial called `_article_placeholder.html.erb` in `app/views/articles/` and add the code below:

```erb
<div>
<div class="bg-cover bg-center h-52 rounded-lg relative animate-pulse bg-gray-400" >
<p class="text-xl text-white font-bold absolute bottom-0 rounded-b-lg w-full p-2 h-10 bg-gray-800/60"></p>
<div class="w-2/4 bg-gray-400 animate-pulse block h-6 rounded absolute bottom-2 left-2 mx-auto"></div>
</div>
</div>
```
This code will be used to render an article being loaded while the request is processed.

Now, in the file `app/views/articles/index.html.erb` we will include the following code snippet, above the div with id ***articles***:

```erb
<div id="articles_placeholder" class="min-w-full grid grid-cols-1 md:grid-cols-3 gap-2">
<% 3.times of %>
<%= render partial: 'article_placeholder' %>
<% end %>
</div>
```

This should render 3 articles with the loading effect.

<img src="https://i.ibb.co/rkP2wvK/20230912-211039.gif" alt="" class="">

Continuing... let's **remove** the articles that are rendered in the div with id *articles*. Let's do this because this div will become a Turbo Frame, and its content will be updated with Turbo.

Furthermore, as we have already verified that our loading placeholder is similar to the article, we can refactor the code so that the placeholder is rendered in place of the articles while they are loaded.


Still in `index.html.erb` replace the file code snippet with:

```erb
<!-- ... -->
<div id="articles_placeholder" class="min-w-full grid grid-cols-1 md:grid-cols-3 gap-2">
<% 3.times of %>
<%= render partial: 'article_placeholder' %>
<% end %>
</div>

<div id="articles_list" class="min-w-full grid grid-cols-1 md:grid-cols-3 gap-2 my-4">
<%= render @articles %>
</div>
```
Per:

```erb
<!-- ... -->
<%= turbo_frame_tag "articles_list_page_1", src: list_articles_url(page: @page), loading: :lazy, target:'_top', class:"min-w-full grid grid-cols-1 md:grid-cols-3 gap-2 my-2" do %>
<% 3.times of %>
<%= render partial: 'article_placeholder' %>
<% end %>
<%end%>
<%= turbo_frame_tag "articles_list_page_#{@pagy.next}" if @pagy.next.present?%>
```

Don't worry, I know things may have gotten a little confusing now, but everything will make sense now.


Note that the turbo_frame's `src` attribute makes a request to list_articles_url, so before we move forward, let's create the route to `list` in `routes.rb`:

```ruby
resources :articles
get :list, on: :collection
end
```

Now, in `articles_controller.rb` we will implement `list` which will be responsible for rendering the articles according to the page the user is on.

In `articles_controller.rb` add the `list` method:

```ruby
def list
@page = params[:page] ? params[:page].to_i : 1
@pagy, @articles = pagy(Article.all, items: 3, page: @page)
end
```
Maybe at this point you're asking yourself, hey, but aren't we going to use Turbo? Why then are we creating an action to render the articles in HTML?

Well, the answer is simple (or it seems like it), Turbo is a framework that allows you to respond directly with HTML code, therefore, we will update the turbo_frame with the content that will be generated in `list.html.erb`, which in turn, will render the articles.


Now, to implement the expected behavior, let's create the `list.html.erb` file in `app/views/articles/` and add the code below:

```erb
<%= turbo_frame_tag "articles_list_page_#{@page}" do %>
<%= render @articles %>

<%= turbo_stream.replace "articles_list_page_#{@pagy.next}" do %>
<%= turbo_frame_tag "articles_list_page_#{@pagy.next}", src: list_articles_url(page: @pagy.next), loading: :lazy, target:'_top', class:"min-w-full grid grid-cols -1 md:grid-cols-3 gap-2 my-2"%>
<%= turbo_frame_tag "articles_list_page_#{@pagy.next+1}" if @pagy.next < @pagy.last%>
<% end if @pagy.next.present? %>

<% end %>
```
Everything ready to work as expected. Simple, right? (kk I know not... 😅)

For testing purposes, let's add the `sleep 1` function to the `index` and `list` actions, and take a break from understanding what is happening so far.

<img src="https://i.ibb.co/9t17rJv/20230912-222157.gif" alt="" class="">

## Understanding the Request Flow

1. The `/articles` request is made and the server responds with the html of the `index.html.erb` page.

2. The `index.html.erb` file is rendered, initially loading the articles placeholder.

3. Still in the `index.html.erb` file, the rendered turbo_frame has the `loading: :lazy` attribute that defines the rendering of the element only when it is visible on the screen. (this prevents all articles from being loaded at once). The `src` attribute, on the other hand, requests a request for `list_articles_url(page: params[:page])`, that is, as soon as the frame is rendered, the placeholders are rendered and the `src` request is sent to the server .

**NOTE**: Still in `index.html.erb`, notice that in the last line, there is a turbo_frame that will only be rendered if there is a next page.

1. When interpreting the `articles_controller#list` request, the server responds with the `list.html.erb` file, which renders the articles requested by the request in the turbo_frame `articles_list_page_1` (first request).

2. Now, **if there is a next page**, two more things happen. In the same answer, a `turbo_stream.replace` is used to replace the previously created `articles_list_page_2` turbo_frame (if it exists), rendering the content of the next page in the `articles_list_page_2` turbo_frame.

3. In this scenario, the turbo_frame `articles_list_page_2` follows the same path as the first request, however, with `page: 2`, and then renders its appropriate articles.

4. The second thing that happens is that *within the condition that there is a next page*, the last line of code creates the next turbo_frame `articles_list_page_3`, only **if there is a next page** (next to the next one... .) so that the behavior is repeated successively.

**NOTE 1.**: The `target: '_top'` attribute is used so that the turbo_frame **does not** replace the content only of the turbo_frame that instantiated it, therefore changing the entire content of the page when accessing an article.

**NOTE 2.**: The `loading: :lazy` attribute controls the loading of articles. Turbo Frames with this attribute are rendered only when they are visible on the screen, this way, when scrolling down the page, the turbo_frame is rendered and the articles are loaded. If this attribute is removed, the articles must be loaded all at once, regardless of whether they are visible or not. Therefore, it is worth highlighting that if you are going to load all the articles at once, it does not make sense to use infinite scroll, and the `Articles.all` action of `index` would be recommended.

Okay, now that we understand what's going on, let's create more articles and get rolling!

## Testing Infinite Scroll

Change the number of articles you want to generate - I recommend 50 - in `db/seeds.rb` and run `rails db:reset`, then remove `sleep 1` from `index` and `list` test again.

{% include youtube.html id="b7j8jEAd2sc" %}

Now you can see infinite scroll working as expected, and best of all, without writing a line of javascript.

##Extra

If you've gotten here, you might still be confused about Turbo, since we're not using `turbo_stream` as expected. Yes, I know, it seems strange. But believe me, the Turbo is much more than just turbo_stream.

Open the browser console and navigate through your application to monitor the requests being made. Furthermore, this implementation guarantees that `Turbo.visit()` is executed as expected, this means that after accessing an article and then clicking the back button on your browser, the articles that have already been loaded will continue on the screen, and the `page` attribute will be retained, allowing you to continue scrolling where you left off.


{% include youtube.html id="d5aT4VQz368" %}


**Tip**: **The other implementations you find out there may not have this behavior implemented, some of them only work if you go back to the list from the beginning - trust me, I tested it!**

## Conclusion

In this article, we saw how to implement **Infinite Scroll** in a Rails application using Turbo.

We also know some Rails resources that can be valuable tips. **Action Text**, which allows the creation of text fields as RichText, including uploading images.

We also saw the **Active Record Import** gem that allows you to create multiple records with a single database query, making processing time and memory consumption much more efficient.

Finally, we explore a little of what the **Pagy** gem can do, and how it can be used to implement simple pagination and infinite scrolling.