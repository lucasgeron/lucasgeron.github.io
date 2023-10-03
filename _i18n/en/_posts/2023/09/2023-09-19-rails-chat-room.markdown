---

layout: post
title: "Rails Chat Room"
date: 2023-09-19
short_description: "In this article I show you how easy it is to develop a chat room where messages are delivered to everyone who is connected."
cover: https://i.ibb.co/VNTQvTd/Tab-Rails-Chat-Room-Post-2.gif
read_time: true
toc: true
github_repo: rails-chat-room
categories:
- Tutorial
tags:
- Ruby On Rails
- Hotwire Turbo
- Hotwire Stimulus

---

# Rails Chat Room
In this article I show you how easy it is to develop a chat room where messages are delivered to all connected users.

<img src="https://i.ibb.co/VNTQvTd/Tab-Rails-Chat-Room-Post-2.gif" alt="" class="">

## Introduction

Nowadays, it is super common to use resources made available by web and mobile applications to communicate with other people or even to use shared work tools.

But have you ever stopped to think about how some of these tools work or how complex it is to develop an application of this type?

In today's example, we will implement a chat room where messages are delivered to all connected users.

This application will be developed using the Ruby on Rails framework and Turbo resources.

The objective of this article is to actually implement this simple application, and understand the data flow between the server and the client, and how Turbo helps us simplify this flow.

## Configuring the Project

Open the terminal on your desktop and let's create a new Rails project.

```bash
rails new rails-chat-room --css=tailwind
```

Our project will only have two models, `Room`, representing the chat room, and `Message`, representing the messages sent by users.

To create these two models, run the following commands:

```bash
rails g scaffold Room name:string
```

```bash
rails g model Message room:references content:text
```

Then run the migrations to create the tables in the database.

```bash
rails db:migrate
```

Next, let's configure the relationship between classes.

In `app/models/room.rb` add the following line:

```ruby
class Room < ApplicationRecord
has_many :messages, dependent: :destroy
end
```

Messages are already configured to belong to a Room, so no changes are necessary.

In this project we will use Nested Routes resources, therefore, we will add the following line in the `config/routes.rb` file.

```ruby
rails.application.routes.draw
resources :rooms
resources :messages
end

root "rooms#index"
end
```

Now we can start the server with the command:

```bash
./bin/dev
```
Access the address `http://localhost:3000` and you will see the project home page (*Room#Index*).

Create a room with whatever name you want.

## Adding Messages

Since we are using merged resources, we need to implement a controller for the `Message` class and also define its views.

Instead of using scaffold commands at this stage, it is easier to create the files manually.

Therefore, create the file `app/controllers/messages_controller.rb` with the following content:

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

Next, we will create the views that will be used, including a form for creating new messages and one for displaying the created message.

In `app/views/`, create the `messages` directory.

Now, in `app/views/messages/`, let's create the message creation form.

Create `_form.html.erb` with the following content:

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

Now, create `new.html.erb` with the following content:

```erb
<div class="mx-auto md:w-2/3 w-full">
<h1 class="font-bold text-4xl">New Message</h1>

<%= render "form", message: @message %>

<%= link_to 'Back to rooms', @message.room, class: "ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
</div>
```
Then, create the `_message.html.erb` file with the code below:

```erb
<div class="flex" id="<%= dom_id message %>">
<%= button_to 'Delete', room_message_path(message.room, message), method: :delete, form_class:'mr-2' %>
<p><%= message.created_at.strftime('%b %d %H:%M:%S') %> : <%= message.content %></p>
</div>
```

Finally, now we just need to render both the creation form and the messages associated with the chat room on its display page.

To do this, in `app/views/rooms/show.html.erb`, add the following code before the closing `</div>` tags:

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
If everything went well so far, you should now be able to create new messages and view the created messages, however, in the standard rails way, that is, being redirected with each request, as shown in the following gif:

<img src="https://i.ibb.co/LdRpsKT/Tab-Rails-Chat-Room-Post.gif" alt="" class="">

## Boosting our application

Now that we have a working application, let's improve its features by adding Turbo features.

The first thing we're going to do is render the message creation form directly on the room display page.

In `show.html.erb`, replace the code:
```erb
<%= link_to 'New Message', new_room_message_path(@room), class:'rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium'%>
```

per
 
```erb
<%= turbo_frame_tag 'new_message', src: new_room_message_path(@room), target:'_top' %>
```

Note that the `src` attribute is indicating the same path as the link that was replaced, however, as we are using a `turbo_frame`, it is necessary to wrap the form in a `turbo_frame_tag` with the same id.

In `app/views/messages/_form.html.erb`, encapsulate the entire contents of the file with:
 
```erb
<%= turbo_frame_tag 'new_message' do %>
<%# _form.html.erb content here %>
<% end %>
```

Now, when accessing the room page, you will be able to create and view messages without being redirected, as shown in the following gif:

<img src="https://i.ibb.co/L8GyHbk/Tab-Rails-Chat-Room-Post-1.gif" alt="" class="">

Despite not being redirected to another page, it is possible to notice that the message creation form is reloaded with each request.

<img src="https://i.ibb.co/4mVzjQJ/Screenshot-1.jpg" alt="" class="w-75">

To solve this problem, we need to make our controller interpret the request and respond to it in turbo format.

To do this, in `messages_controller.rb` include a response format for the `create` action:

```ruby
def create
@message = @room.messages.create!(message_params)
respond_to do |format|
format.html { redirect_to @room }
format.turbo_stream
end
end
```
Just by including this response format it is possible to notice the difference in the server's response.

<div class="text-center">
<img src="https://i.ibb.co/r34FwGT/Screenshot-2.jpg" alt="" class=" w-75">
</div>

After this small modification, it is possible to notice that the message does not appear to be listed as before, unless the page is manually updated.


<img src="https://i.ibb.co/dtK63Vd/Tab-Rails-Chat-Room-Post-3.gif" alt="" class="">

This happens because we did not define Rails did not find any response instructions for the `turbo_stream` format.

To define one, let's create the file `create.turbo_stream.erb` in `app/views/messages/`, following the framework convention, with the following content:

```erb
<%= turbo_stream.append 'messages' do %>
<%= render @message %>
<% end %>
```

Now, when creating a new message, it will be added to the message list without the need to reload the page content.


<img src="https://i.ibb.co/k8BLfPS/Tab-Rails-Chat-Room-Post-4.gif" alt="" class="">

But now we have a new problem, when creating the message, it is kept in the form field.

To resolve this, it will be necessary to use Stimulus resources. Hotwire complementary library that allows the manipulation of HTML elements through JavaScript.

In short, Stimulus works in a similar way to rail flow. That is, a request is sent to a controller, which interprets and responds to the request in the most appropriate way.

The biggest difference is that Rails responds with a view, while Stimulus responds with JavaScript that manipulates the DOM.

To create a Stimulus controller, simply run the following command:

```bash
rails g stimulus form
```

This will create the file `app/javascript/controllers/form_controller.js`.

Now, let's add a method that will clear the form after creating a new message.

```js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="form"
export default class extends Controller {
reset() {
this.element.reset()
}
}
```

Now, let's assign this controller to the message form, and inform which action should be performed and when it should occur.

To do this, in `app/views/messages/_form.html.erb`, modify the form line to:
```erb
<%= form_with(model: [ message.room, message], data: {controller: 'form', action: 'turbo:submit-end->form#reset'}) do |form| %>
```

According to [documentation](https://turbo.hotwired.dev/reference/events), `turbo:submit-end` is triggered upon completion of the request initiated by form submission.

Therefore, once the form is submitted, the `reset` method of the `form` controller will be executed, clearing the form.

<img src="https://i.ibb.co/0BNTCPg/Tab-Rails-Chat-Room-Post-5.gif" alt="" class="">

Before we move forward, let's implement the same behavior for deleting messages.

To do this, simply add the response format in the `destroy` action of `messages_controller.rb`:

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
To respond appropriately, it is necessary to create the view `destroy.turbo_stream.erb` in `app/views/messages/` with the following content:

```erb
<%= turbo_stream.update @target do %>
Message Deleted
<% end %>
```

With the code above, the deleted message will be replaced with the text "Message Deleted". When the page is reloaded, the message will no longer be in the list.

If you'd rather just remove the message from the list, simply set `destroy.turbo_stream.erb` to:

```erb
<%= turbo_stream.remove @target %>
```

## Synchronizing Messages

Now that we have our chat room implemented efficiently, we need to make it communicate with other users. After all, at this moment, if a user sends a message, only he will see it.

<img src="https://i.ibb.co/0rP7sR9/20230919-181753.gif" alt="" class="">

Obviously, when refreshing the page on another client, the message will be retrieved. But this is not enough, as the objective is for the message to be displayed in real time.

To do this, we will use Turbo Stream resources, which allow us to simply establish a channel and broadcast information to all clients.

Read more about [Broadcasting](https://guides.rubyonrails.org/action_cable_overview.html#terminology-broadcastings).

On the chat room page, let's add the following code:

```erb
<%= turbo_stream_from @room %>
```
This code will create a communication channel between the client and the server, which will be used to send messages.

At this stage it is important to make an observation:

> It is possible to broadcast in several ways, which can be directly via the controller, via the terminal, via an external service, among others. It's up to you, the developer, to decide the best way to implement the feature.

In this case, we will use the `Message` model itself to broadcast whenever there are changes to a message.

To do this, simply add the following code to `app/models/message.rb`:

```ruby
class Message < ApplicationRecord
belongs_to :room
broadcasts_to :room
end
```
Now, whenever a message is created, updated or deleted, the server will send a message to all clients connected to the channel.

Simple, right? Lets test?

<img src="https://i.ibb.co/xMWXTkf/20230919-183215.gif" alt="" class="">

# Extra

Okay, we already have our chat room working, but we can still improve it a little more.

The application's *Messages* are being displayed based on Turbo, however, the *Room* is being displayed in a traditional way.

This means that when you try to *edit* a room, you will be redirected, and connected users will not be notified.

## Synchronizing Rooms

Let's make these settings so that room changes are also displayed dynamically.

Similar to what we did with messages, we will wrap the room rendering in a `turbo_frame_tag` with a specific id.

In `app/views/rooms/show.html.erb`, modify the code to:

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

Now, instead of wrapping the form in the turbo_frame, we will wrap part of the `app/views/rooms/edit.html.erb` file.

This will be done because the edit form will be displayed on the same page, and there, we will have the action to 'cancel' the edit. Feature that we don't just have in the form.

Therefore, in `app/views/rooms/edit.html.erb` modify the code to:

```erb
<div class="mx-auto md:w-2/3 w-full">
<h1 class="font-bold text-4xl">Editing room</h1>

<%= turbo_frame_tag 'room' do %>
<%= render "form", room: @room %>
<%= link_to "Cancel", @room, class: "ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
<%end%>
</div>
```

Yes, the '*Show this room*' button has been removed since we are already on the room page.

And the '*Back to rooms*' button was replaced by '*Cancel*', as the objective is to cancel the edit and return to the room page.

However, we are not finished yet.
If you try to access the buttons, you'll notice that nothing seems to work right.


<img src="https://i.ibb.co/yWqGQ0W/Tab-Rails-Chat-Room-Post-6.gif" alt="" class="">

I'll leave you some time here to try to figure out what's going on.

...

He thought? So, let's go.

The answer is simple. Some requests are changing the content of turbo_frame, while they should replace it.

To solve the problem, simply modify the `show.html.erb` buttons to:

```erb
<%= link_to 'Edit this room', edit_room_path(@room), class: "mt-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium", data: {turbo_frame: ' room'} %>
 
<div class="inline-block ml-2">
<%= button_to 'Destroy this room', room_path(@room), method: :delete, class: "mt-2 rounded-lg py-3 px-5 bg-gray-100 font-medium", data: {turbo_frame : '_top'} %>
</div>

<%= link_to 'Back to rooms', rooms_path, class: "ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium", data: {turbo_frame: '_top'} % >
```

This way, we are directing the turbo_frame response to `room`, or to the element outside the frame `_top`.

Okay, but we're not done yet. The buttons are working, the editing form is being rendered on the same page, but despite this, when modifying the room information, the information is not replicated to all clients.

To solve this problem, let's add the following code to `app/models/room.rb`:

```ruby
class Room < ApplicationRecord
has_many :messages, dependent: :destroy
broadcasts
end
```
This way, as soon as a room's information is updated, the server will send a message to all clients connected to the channel.

With this, one last problem arises.

<img src="https://i.ibb.co/BB3FZgr/20230919-200736.gif" alt="" class="">

When editing is complete, the 'Show this room' and 'Edit this room' buttons are rendered.

This happens because in the `_room.html.erb` file we are rendering the buttons conditionally.
However, as we have already moved the buttons to the display page, we no longer need to render them in the `_room.html.erb` file, only in index, which will be done soon.

Therefore, *remove* the conditional validation from `_room.html.erb` as per the code below:

```erb
<div id="<%= dom_id room %>">
<p class="my-5">
<strong class="block font-medium mb-1">Name:</strong>
<%= room.name %>
</p>
</div>
```

Enjoying... So that the name of the rooms is also updated via turbo on the room listing page, let's change the following code in `app/views/rooms/index.html.erb`:

```erb
<div id="rooms" class="min-w-full">
<%= render @rooms %>
</div>
```

For:
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
 
This way, when editing a room's information, the name of the room will be updated both on the room listing page and on the room page, and the buttons to access the room will be rendered as expected.

<img src="https://i.ibb.co/rM8srGG/20230919-202036.gif" alt="" class="">

---

## Conclusion
 
In this article (~~a little long~~), we saw how to use Turbo to create a Rails Chat application.

The application was implemented from scratch, using the traditional way of a Rails request, to using Turbo to update the page content dynamically.

Throughout this article, we use:
- Turbo Frame: `turbo_frame_tag`
- Turbo Stream: `turbo_stream_from`, `format.turbo_stream`, `broadcasts_to`, `broadcasts`
- Turbo Stimulus: `turbo:submit-end->form#reset`
 
There is still a lot to be explored about Turbo, but I hope this article helped you understand a little more about what Turbo is and how to use it in a Rails application.

