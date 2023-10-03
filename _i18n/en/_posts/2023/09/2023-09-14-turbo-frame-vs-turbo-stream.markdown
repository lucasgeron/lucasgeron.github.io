---

layout: post
title: "Turbo Frame vs Turbo Stream"
date: 2023-09-14
short_description: "Do you know the difference between the features that Hotwire Turbo offers? Then this article may be of interest to you!"
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
Do you know the difference between the features that Hotwire Turbo offers? Then this article may be of interest to you! This article was inspired by [mixandgo.com](https://mixandgo.com/learn/ruby-on-rails/turbo-frames-vs-turbo-streams) post.

<img src="https://i.ibb.co/J7G8Lyv/20230914-224204.gif" alt="" class="">

## Introduction

Using Turbo resources can make developing a web application much more productive and faster, however, things can seem confusing, especially if you are learning this technology.

In this article we will talk about two Turbo features: **Turbo Frame** and **Turbo Stream**. Let’s understand what each one does and when we should use each one.

Starting with Rails 7, Turbo features became standard in a new project, meaning you don't need to install anything to use these features.

However, it is interesting to know how to use these powerful resources to boost your application.

To explain it step by step, we will develop a simple project, and we will evolve from traditional mode to Turbo mode.

## Creating the Project

In your terminal, let's create and access a new Rails project, with the commands:

```bash
rails new turbo-frame-vs-turbo-stream --css=tailwind
cd turbo-frame-vs-turbo-stream
```

Next, let's create just one controller, to understand how these features work.
 
```bash
rails g controller site index first_page
```

It will configure the routes and generate the necessary files for the controller and views.

Before we start programming, let's change the root of the application, so that the root route is the home page of our website.

In `config/routes.rb`, let's change the root statement to:

```ruby
root "site#index"
```
Then, we can start the server and access the home page of our website, with the command:

```bash
./bin/dev
```

When you access [http://localhost:3000](http://localhost:3000), you should see this screen:

<img src="https://i.ibb.co/cNXky9M/Captura-da-Web-14-9-2023-151854-127-0-0-1.jpg" alt="" class="">

Let's add a button to access the first page of our website, first, let's do this the traditional way, using the turbo feature just to navigate between pages, as rails is already configured to do.

In `index.html.erb` add the following code snippet:

```erb
<div>
<%= link_to 'Load First Page (HTML)', site_first_page_path, class:'btn-primary'%>
</div>
```
To make things prettier, add the code snippet to the `app/assets/stylesheets/application.tailwind.css` file:

```css
@layercomponents {
.btn-primary {
@apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800;
}
}
```

Now that we have a button for our request, just click on it to access the first page of our website.

To understand what is happening, let's open the inspection menu of the browser you are using, and access the Network tab.

Right after the request, we will inspect the **Response** sub-tab to see what was returned by the server.

<img src="https://i.ibb.co/2vyK8JF/Screenshot-1.jpg" alt="" class="">

Note that when you click the button, a new page is loaded, containing all the necessary tags, that is, the header (*<head>*) with the import of all the scripts and styles necessary for everything to work.

In this scenario, Turbo (through Turbo Drive) takes care of loading only the files that were modified from the response, without the need to reload all the files on the page.

Now, let's implement a `turbo_frame` to see how it works.

## Turbo Frame

You can find the official Turbo Frame documentation [here](https://turbo.hotwire.dev/reference/frames).

In `index.html.erb` add the following code snippet:

```erb
<div>
<%= turbo_frame_tag 'frame' do %>
<%= link_to 'Load First Page (TURBO FRAME)', site_first_page_path, class:'btn-primary'%>
<% end %>
</div>
```

Note that the code is exactly the same as the previous one, except for being inside a `turbo_frame_tag` with id `frame`.

If you click the button, you will receive the message **Content missing** in response.

<img src="https://i.ibb.co/VNXvhpL/Screenshot-2.jpg" alt="" class="">

This happens because the response from the request file must contain a `turbo_frame` with the same id that was used in the request.

Therefore, to understand what is happening, in `first_page.html.erb` replace the entire contents of the file with the following code:

```erb
<div class="space-y-4">
<div class="border">
<p class="bg-red-600 text-white">This will be rendered only if it was an HTML response</p>
<h1 class="font-bold text-4xl">Site#first_page</h1>
<p>Find me in app/views/site/first.html.erb</p>
</div>

<div class="">
<%= turbo_frame_tag "frame" do %>
<div class='border'>
<p class="bg-blue-600 text-white">This will be rendered with HTML/TURBO_FRAME response</p>
<h1 class="font-bold text-4xl">Site#first_page TURBO_FRAME</h1>
<p>Find me in app/views/site/first.html.erb</p>
<% end %>
</div>
</div>
</div>
```

Let's look at the following image:

<img src="https://i.ibb.co/hd91pCb/20230914-160105.gif" alt="" class="">

When we click on the first button, the url is changed, and as we saw previously, the response is a complete HTML page, with all the resources necessary for the page to work.

When we click on the 'turbo frame' button, the url **is not** changed, and the response is only changed with the content that is within the `turbo_frame_tag` with id `frame`, keeping the rest of the page unchanged.

<img src="https://i.ibb.co/DzGLG4Z/Screenshot-3.jpg" alt="" class="">

When inspecting the response, it is possible to notice some changes, the main one being the absence of the header (<head>).

This happens because this content has already been loaded previously, and there is no need to load it again.

It is also possible to notice that although there is HTML code outside the `turbo_frame_tag` tag, it is not rendered when making a request via turbo_frame.

This occurs because Turbo Frame does not allow content outside the tag corresponding to the request to be rendered.


<img src="https://i.ibb.co/4jQXDm3/Screenshot-4.jpg" alt="" class="">

**Note 1.**: If you use Turbo Frame resources, it is recommended that all content be surrounded by a `turbo_frame_tag` tag.

**Note 2.** In the Frames documentation, it is possible to add the `target='_top'` attribute to a `turbo_frame`, or add the `data-turbo-frame='_top'` attribute to a `link` inside the turbo frame. By doing this, you will force the content to be rendered outside the frame, that is, on the main page. This implies the same behavior as the first button.
(This may be desired in some cases.)

In addition to these observations, it is also possible to notice that by clicking on the 'turbo frame' button, the button itself is replaced by the content of the response.

This happens because Turbo Frame, by default, replaces the content of the frame, however, it is possible to change the code so that this no longer happens.

In `index.html.erb` replace the code:

```erb
<div>
<%= turbo_frame_tag 'frame' do %>
<%= link_to 'Load First Page (TURBO FRAME)', site_first_page_path, class:'btn-primary'%>
<% end %>
</div>
```
Per
```erb
<div>
<%= link_to 'Load First Page (TURBO FRAME)', site_first_page_path, class:'btn-primary', data: {turbo_frame:'frame'}%>
</div>

<div>
<%= turbo_frame_tag 'frame' %>
</div>
```

This way, the button will not be replaced, and the response content will be rendered within the indicated frame.

<img src="https://i.ibb.co/fvZgDwt/20230914-163531.gif" alt="" class="">

Okay, before we move on to Turbo Streams, let's talk a little about the advantages and disadvantages of using Turbo Frames.

### Problems

- The first problem is that it is only possible to update a single frame per request. This means that if you need to update two parts of the page when clicking a button, this will not be possible with Frames.

- The second problem is that the content of the frame can only be 'updated', that is, the frame cannot be removed, or have content inserted before/after the current content, (unless the content is duplicated, which is not recommended).

- The third problem is that the content of the frame is only updated through user action, that is, it is not possible to send content directly from the server. The user must do this through a request.

### Benefits

- An advantage of Turbo Frame is that its implementation is relatively simple, you just need to wrap the content you want to update in a turbo_frame.

- A second advantage is that `turbo_frame` can have the `loading: :lazy` attribute, allowing heavier content to be loaded only when rendered, making page loading even faster. An example of this can be found in the article [infinite-scroll](https://lucasgeron.github.io/2023/09/12/rails-infinite-scroll.html)

- A third advantage is that through Turbo, Frames can be Cached, that is, in some cases, it is possible to update, go back or forward the page without the content of the frame being lost. (To test this feature, click on the 'turbo frame' button, then the 'html' button, and then return to the previous page via the browser button. You will notice that the content of the frame has not been lost).

<img src="https://i.ibb.co/f4TpRy0/20230914-230204.gif" alt="" class="">


Okay, now that we know a little about Turbo Frames, let's talk about Turbo Streams.

## Turbo Streams

Unlike Frames, **Turbo Streams** have no limitations regarding the amount of content that can be updated, and also have several advantages that we will discuss next.

To implement a Turbo Stream example, in the `index.html.erb` file, add the code snippet to the end of the file.

```erb
<div>
<%= link_to 'Load First Page (TURBO STREAM)', site_first_page_path, class:'btn-primary', data: {turbo_stream: true}%>
</div>

<div id="my_stream">
<p>Sample content for stream example</p>
</div>
```

Then create the file `app/views/site/first_page.turbo_stream.erb` with the following content:

```erb
<%= turbo_stream.update "my_stream" do %>
<p> replaced by turbo stream </p>
<%end%>
```

That simple! When clicking the 'turbo stream' button, the content of the frame will be replaced by the content of the response.

<img src="https://i.ibb.co/TmqSSRr/20230914-174231.gif" alt="" class="">

Let's inspect the response to understand what happened.

<img src="https://i.ibb.co/wypn6jZ/Screenshot-5.jpg" alt="" class="">

The Turbo Stream response is encapsulated in a `<template>` tag. This is necessary for the browser to interpret the response content correctly.

The `action` attribute indicates which action should be performed by the server, in this case `update`, and the `target` attribute indicates the element that should be affected, in this case `my_stream`.

To see the functionality of affecting multiple elements, let's add two more elements to the `index.html.erb` file:

```erb
<div id="other_stream">
<p>Other content:</p>
</div>

<div id="remove_me">
<p>Remove me</p>
</div>
```

Now in `first_page.turbo_stream.erb` we will add the following code to the end of the file:

```erb
<%= turbo_stream.remove "remove_me" %>

<%= turbo_stream.append "other_stream" do %>
<% 3.times do |i| %>
<p> something else <%= i+1 %> </p>
<%end%>
<% end %>
```

When you click the button, all of this happens in a single response, and all actions are performed as expected.

<img src="https://i.ibb.co/09M5wyy/20230914-175538.gif" alt="" class="">

Great, but in addition to this, Turbo Stream has another very interesting advantage, which is the possibility of receiving updates via WebSockets, that is, it is possible to update the page content without the user having to make a request.

More interesting than that, it is also possible to send this update to everyone who is on the application, something like a 'live stream'.

With the current code, if we open two browsers and test the Stream feature, you will see something like this:

<img src="https://i.ibb.co/7zRrYV0/20230914-180658.gif" alt="" class="">

In this case, the browsers are not synchronized, that is, if you click the button in one browser, the other will not be updated.

We could use ActionCable resources, and create a communication channel for browsers to communicate, but this would be a bit laborious, and is not necessarily mandatory in every case.

To facilitate this process, Turbo has a tag called `turbo_stream_for` that allows you to perform this behavior.

In `index.html.erb`, add the following code:

```erb
<div>
<%= link_to 'Load Stream Page (TURBO STREAM VIA WEBSOCKET)', site_stream_page_path, class:'btn-primary', data: {turbo_stream: true}%>
</div>

<%= turbo_stream_from "my_stream_from" %>
```

In `routes.rb`, add the route for `stream`.

```ruby
get 'site/stream_page'
```


Now in `site_controller.rb`, add the following code:

```ruby
def stream_page
Turbo::StreamsChannel.broadcast_update_to("my_stream_from", target: "my_stream", partial: 'site/stream')
end
```

This code snippet will create a communication channel between the browser and the server with the id `my_stream_from`, and will update the content of the `my_stream` element whenever it receives a request.

The `partial` attribute indicates which file (partial) should be rendered, so let's create this file.

In `app/views/site/` create the partial `_stream.html.erb` with the following content:

```erb
<p class="btn-primary bg-red-600">Hello from Turbo Streams at <%= Time.now.strftime("%H:%M:%S") %> </p>
```

And as we are making a request with `data-turbo-stream: true`, it will be necessary to create the file `stream_page.turbo_stream.erb`, in the `app/views/site/` directory.


This file can be blank, being used only by the rails convention as a turbo_stream response, or if you prefer, you can include the `turbo_stream` actions you want.

But remember! in the `stream_page.turbo_stream.erb` file, updates only occur on the client that made the request.

Whereas `Turbo::StreamsChannel.broadcast_update_to` sends the update to all connected clients.


To illustrate, let's add the following code to the `stream_page.turbo_stream.erb` file:

```erb
<%= turbo_stream.append "other_stream" do %>
<% 3.times do |i| %>
<p> something else added by stream_page <%= i+1 %> </p>
<%end%>
<% end %>
```

Now let's see in practice what happens!



<img src="https://i.ibb.co/b3HsCbS/20230914-215526.gif" alt="" class="">

### Understanding the Flow
- Click on Load Fist Page (TURBO_STREAM)
1. The `first_page` request in the `turbo_stream` format is made to the server.
2. The Server responds with the `first_page.turbo_stream.erb` file
3. The `my_stream` div is **update** with *'replaced by turbo'*.
4. The `remove_me` div is **removed (remove)**
5. the `other_stream` div is **receives (append)** 3 new paragraphs ('*something else*').


- Click on Load Stream Page (TURBO STREAM VIA WEBSOCKET)
1. The `stream_page` request in the `turbo_stream` format made to the server.
2. The server sends an **update (broadcast_update_to)** to the channel `my_stream_from` with the contents of the partial `site/stream` requesting that the div `my_stream` be updated.
3. The content of the partial (*'Hello from Turbo Stream + TIME'*) is **updated** in the `my_stream` div on all connected clients.
5. The Server responds to the client that made the request with the file `stream_page.turbo_stream.erb`
6. The `other_stream` div **receives (append)** 3 new paragraphs (*'something else added by stream_page'*).


- Click on Load Fist Page (TURBO_STREAM)
1. The `first_page` request in the `turbo_stream` format is made to the server.
2. The Server responds with the `first_page.turbo_stream.erb` file
3. The `my_stream` div is **update** with *'replaced by turbo stream'*, Replacing the previous information ('*Hello from Turbo Streams + TIME*').
4. the `other_stream` div **receives (append)** 3 new paragraphs ('*something else*').

- Click on Load Stream Page (TURBO STREAM VIA WEBSOCKET)
1. Step 2 is repeated, however, on another client.

and so on...

In this way, it is possible to create a dynamic application, which can receive content directly from a websocket and can also allow the user to perform actions individually, affecting only their browser, or globally.

An example of an application that can be created using this resource is:

- **Events Update (Football Game)**: Imagine an application where the application maintainer publishes the game's events and users can follow them in real time. In this application, the user can have the option to like the event or not, and this action can be sent to all connected users, or linked only to the user who performed the action.

- **Collective Poll**: Imagine an application where the maintainer creates any poll. All logged in users can vote. The poll results are updated in real time for all connected users. If the user has already voted, they can see the poll results, but cannot vote again.

- **Trend Topics**: Imagine an application where there is a top 10 of the most talked about topics. All connected users can see the top 10, and perform actions such as 'up/down', or suggest a new topic. As soon as a new topic enters the top 10, all connected users receive a notification.

- **Wedding Gift List**: The couple adds the desired items to a list, the guests can purchase an item, and this item is crossed off the list. All connected users can see the gift list, and perform the 'buy' action. When you do this, the list is updated for all connected users. The user who indicated the purchase is the only one who can cancel the purchase, and when doing so, the list is updated for all connected users, indicating that the product has returned to the gift list.

## Conclusion

Turbo is undoubtedly a powerful resource when developing web applications.

In addition to significantly reducing server responses, avoiding the forced loading of all files with each request, it also allows the user to have more immersive navigation, allowing the user to explore the application without the need to be redirected to each link accessed.

Turbo also allows heavier content to be loaded only when it is actually rendered, and for users to perform actions that only affect their experience, or actions that affect all connected users.

Finally, a comparative table between Turbo Frame and Turbo Stream taken from the article by [mixandgo.com](https://mixandgo.com/learn/ruby-on-rails/turbo-frames-vs-turbo-streams).

| Feature | Turbo Frames | Turbo Streams |
|---------|:------------:|:-------------:|
| Lazy-loading | ✔️ | ❌ |
| Caching | ✔️ | ❌ |
| Multiple Updates | ❌ | ✔️ |
| Multiple Shares | ❌ | ✔️ |
| Works with WebSockets | ❌ | ✔️ |
| Easy to Implement | ✔️ | 💭 |


