---

layout: post
title: "To Do List Turbo"
date: 2023-09-06
short_description: "To Do List Turbo is a task list application that allows you to create, edit, and remove tasks. In this article, I'll show you how to do this with Hotwire Turbo."
cover: https://i.ibb.co/Ydyx6RS/20230906-142125.gif
read_time: true
toc: true
github_repo: to-do-list-turbo
categories:
- Tutorial
tags:
- Ruby On Rails
- Hotwire Turbo
---

# To Do List Turbo
To Do List Turbo is a task list application that allows you to create, edit, and remove tasks. It's also possible to mark tasks as complete or incomplete.

In this article, we will learn how to build this application with Hotwire Turbo.

<img src="https://i.ibb.co/Ydyx6RS/20230906-142125.gif" alt="" class="">

## Introduction

In this article, we will develop together a to-do list application using the Hotwire Turbo framework. This application is quite simple but is sufficient to demonstrate the power of Hotwire Turbo.

In a nutshell, Hotwire Turbo is a framework that allows parts of a page to be updated on request, without the need to reload the entire page. It's an alternative to using REST APIs and JavaScript and is a powerful ally for high performance. Read more about [Hotwire Turbo](https://turbo.hotwired.dev/handbook/introduction).

## Creating the Project

In your working environment, create a new project using the `rails new` command with the `--css=tailwind` option. This will create a Rails project with the Tailwind CSS framework installed.

``` shell   
rails new to-do-list-turbo --css=tailwind
```
Next, navigate to the folder of the created project.
``` shell
cd to-do-list-turbo
```

## Creating the Model

To create the model, we will use the Rails `scaffold` generator.

The model will have only two fields called `description`, which will be of type `string`, and `complete`, which will be of type `boolean`.

``` shell
rails g scaffold Task description:string complete:boolean --skip-controller new show --no-jbuilder
```

Please note that we've added some options to the `rails g scaffold` command.

The `--skip-controller new show` option will skip the creation of the `new` and `show` actions in the controller.

The `--no-jbuilder` option will skip the creation of `.json.jbuilder` files, which are used to render data in JSON format.

Both of these features won't be used in our application.

Therefore, let's **remove the views that won't be used and were created by the scaffold**. To do this, delete the `new.html.erb` and `show.html.erb` files located in `app/views/tasks/`.

Next, execute the database migrations with the following command.

``` shell
rails db:migrate
```
## Configuring Routes

Open the `config/routes.rb` file and set the application's root to `tasks#index`.

Once again, since we won't be using the `new` and `show` actions in our `tasks_controller.rb`, let's remove these routes from `resources`, as shown in the code below.

``` ruby 
Rails.application.routes.draw do
  root to: "tasks#index"
  resources :tasks, except: %i[ show new]
end
```

## Configuring Tailwind

To ensure that Tailwind works correctly, let's start the server using the command:

``` shell
./bin/dev
```
This will compile the Tailwind configuration files and style our application properly.

Once this is done, you can access the application's homepage at [http://localhost:3000](http://localhost:3000) and check if the page is styled correctly.

<img src="https://i.ibb.co/cX2G9j2/Screenshot-1.jpg" alt="" class="">
## Adapting the Project for Turbo

So far, we have our routes configured, the model created, and the homepage styled in the default Rails way.

**Turbo Frames** are custom elements with their own set of HTML attributes and JavaScript properties.

**Turbo Streams** is a response format that allows you to update parts of an HTML page without discarding the rest of the page.

Now, let's begin adapting our application to use Hotwire Turbo features by modifying the code and adding Turbo Frames and Turbo Streams where necessary.

## Modifying the Homepage

Our application will have the new task creation form displayed on the homepage. This way, we can create new tasks without the need to be redirected to another page.

In `index.html.erb`, let's remove the link to the new task creation page and replace it with the form for creating new tasks.

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

Please note that we are rendering the form by passing an `@task` object that hasn't been defined yet.

To fix this, in our `tasks_controller.rb`, let's define the `@task` object in the `index` method.


``` ruby 
def index
  @tasks = Task.all
  @task = Task.new
end
```
With this done, the application's homepage should look like this:

![Homepage](https://i.ibb.co/qdpzJqc/Screenshot-2.jpg)

At this point, if you try to create a new task, you will notice that nothing different happens. 

This is because we haven't configured the form to send data via Turbo, and the view to receive data via Turbo.

## Configuring the Form

In the `_form.html.erb` file, let's add the `data-turbo-stream` attribute to the form so that it gets submitted via Turbo.

To do this, simply add the attribute `data: { turbo_stream: true }` to the form.

``` erb 
<%= form_with(model: task, class: "contents", data: { turbo_stream: true }) do |form| %>
```
For this to work as expected, we need our controller to handle and respond to the request properly.

So, in our `tasks_controller.rb`, let's adapt the `create` action as shown in the following code:

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
With this, after the record is successfully saved, the Turbo Stream will add the new record to the task list without the need to reload the page.

**Important**: This only works because in our `index.html.erb`, there is an element with `id=tasks` where the Turbo Stream will add the new record.

Before we continue, it's important to address a few situations:

- When trying to edit a record, our application still redirects the user to the edit page.
- If the record isn't saved successfully, nothing happens.
- No notifications are displayed to the user after successfully creating a new record.

We will address these issues shortly.

## Adding Notifications

As we are working with Turbo resources, we will use the `turbo_frame_tag` component to display success and error notifications.

To do this, create the `_flash.html.erb` file in `views/layouts` and add the following code:

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

Next, in `views/layouts/application.html.erb`, add the following code above the `<%= yield %>`
``` erb 
<%= turbo_frame_tag "flash", class:'absolute top-8' %>
```

Also, in the views section, in `index.html.erb`, you can **remove** the instructions:


``` erb 
<% if notice.present? %>
  <p class="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block" id="notice"><%= notice %></p>
<% end %>
```
Since this is no longer necessary, as the notifications will be displayed inside the `flash` element we created earlier.

Now, back to our `tasks_controller.rb`, let's add the code to render flash messages in the `create` action:

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
Things might seem a bit confusing at this point, but let's understand what's happening.

1. We created a partial called `_flash.html.erb` that will display success and error messages.
2. We added a `turbo_frame_tag` with the id `flash` in `views/layouts/application.html.erb` to display the messages.
3. In the controller, we send the update of the `flash` frame along with the update of the record so that messages and changes are displayed when requested.

Now, when creating a new task, the success message should be displayed as shown in the following image:

![Success Message](https://i.ibb.co/tKRc9YZ/20230906-123101.gif)

To test if the error message is working, let's add a presence validation to the `description` field in our `task.rb` model.

``` ruby 
class Task < ApplicationRecord
  validates :description, presence: true
end
```
Now, when you click Save, the message should be displayed as shown in the following image:

![image](https://i.ibb.co/HP20pdr/Screenshot-3.jpg)

Two of the previously reported issues have been resolved, but we still need to address the redirection problem when editing a record.

## Editing a Record

To resolve the redirection problem when editing a record, we will use the `turbo_frame_tag` component to make each rendered task (`@tasks`) act as an individual component.

In the `_task.html.erb` file, let's replace the line:

``` erb
<div id="<%= dom_id task %>">
... 
</div>
```

with the following code:


``` erb 
<turbo-frame id="<%= dom_id task %>" >
...
</turbo-frame>
```
Remember, Turbo Frames are custom elements that behave somewhat like a component, allowing you to replace parts of a page without reloading the entire page.

With this change, you'll notice that when you click on edit, the message **Content missing** is displayed.

![Content missing message](https://i.ibb.co/sQnXDH3/20230906-124527.gif)

This happens because the page being requested doesn't have an element with the same ID as the element being replaced.

To resolve this, simply add the same element that's being replaced on the requested page.

In `views/tasks/edit.html.erb`, add the following code:

``` erb
<turbo-frame id="<%= dom_id @task %>" >
...
</turbo-frame>
```

If everything works as expected, the edit form should be displayed without the need to reload the page.

![Edit Form](https://i.ibb.co/K0Hnf6L/20230906-125053.gif)

To keep things organized, we can simplify the `views/tasks/edit.html.erb` file to:


``` erb
<turbo-frame id="<%= dom_id @task %>">
  <%= render "form", task: @task %>
</turbo-frame>
```
At this point, the edit form is still not working correctly. 

This is happening because our controller is still trying to respond in a format other than `turbo_stream`.

So, let's adjust the `update` action with the following code:

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

**Important**: Notice that in the `create` action, we used the `turbo_stream.prepend` method, while for `update`, we used the `turbo_stream.update` method.

**prepend** adds content to the beginning of the element, while **update** replaces the content of the current element with the desired content.

To better understand the difference between the methods, refer to the [documentation](https://turbo.hotwire.dev/reference/streams#stream-actions).

![Turbo Stream Methods](https://i.ibb.co/2W1B2h9/20230906-125905.gif)

## Deleting a Record

By default, the button to delete a record is displayed in the `show` action, which we removed from our application.

So, let's add it manually directly in `_task.erb.html`.

Replace the line:

``` erb 
<%= link_to "Show this task", task, class: "rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
```

With the following code:

``` erb 
<%= button_to "Destroy this task", task_path(task), class:'rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium', method: :delete %>
```

When you click on delete, the **Content missing** message is displayed again.

This happens because the content of the element was removed, but the element itself still exists.

To resolve this, let's change the `destroy` action in the `tasks_controller` to respond in Turbo Stream format.


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
Note that we are now using the `turbo_stream.remove` method to remove the element from the page and once again updating the `flash` element to display the message.

![Turbo Stream Remove](https://i.ibb.co/F3QcFCp/20230906-131350.gif)

## Testing Turbo Features

Before we style our application, it's interesting to observe the requests and responses directly from the browser.

Open the browser console, then go to the **Network** tab and perform some actions in the application.

![Network Tab](https://i.ibb.co/CB8NDxq/20230906-132027.gif)

Notice that when you first access the page, a series of resources like fonts, scripts, and stylesheets are loaded. However, when interacting with the application, only one request is made to the server, and the content is updated without the need to completely reload the page.

With this, we can see that the application is much faster, and data consumption is much lower, resulting in a better user experience and server resource savings.

Now that our application is working, we can style it using the [Tailwind CSS](https://tailwindcss.com/) framework.

## Styling the Application

Since the focus of this article doesn't cover frontend concepts, you can customize the styling as you prefer or simply replace the code in the files with the following:

`app/assets/stylesheets/application.tailwind.css`
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

`app/views/layouts/application.html.erb`
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

`app/views/tasks/_form.html.erb`
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

`app/views/tasks/_task.html.erb`
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

`app/views/tasks/index.html.erb`

``` erb 
<div class="inner-container">

  <h1 class="title">Tasks</h1>

  <%= render "form", task: @task %>

  <div id="tasks" class="grid gap-2">
    <%= render @tasks %>
  </div>
</div>
```

## Completing Tasks

Notice that the checkbox for the `complete` attribute has been removed from the form. This is because we will now mark tasks as complete or incomplete directly in the task list, without the need to edit the record to change its status.

In summary, this behavior is implemented in `_task.html.erb` through the instructions:


``` erb 
<%= button_to task_path(task), params: {task: {complete: !task.complete }}, class:"btn-primary-light", method: :patch do %>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="<%= task.complete ? 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3' : 'M4.5 12.75l6 6 9-13.5' %>" />
  </svg>
<%end%>
```

Basically, what this button does is send a `PATCH` request with the inverted `complete` parameter. In other words, if the task is complete, the `complete` parameter will be `false`, and vice versa.

Since our controller is already configured to interpret this request, the record will be updated automatically, and the `complete` attribute will be updated.

## Final Result

![Final Result](https://i.ibb.co/gD5tP6d/20230906-141044.gif)
