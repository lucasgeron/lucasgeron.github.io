---

layout: post
title: "Rails Pixels App"
date: 2023-09-10
short_description: "Rails Pixels is a creative application designed to demonstrate how ActiveJobs and TurboStreams work. Let's color some pixels together?"
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
Rails Pixels App is a creative way to demonstrate the use of **ActiveJobs** and **Turbo Streams** in a Rails application.

To demonstrate these functionalities, we color the pixels in the background using an ActiveJob and send the result to the client via TurboStream in real-time.

Its main objective is simple, to color pixels. I know, this may sound boring, but believe me, it's fun and besides, it's a great way to understand how ActiveJobs and Turbo Streams work.

<img src="https://i.ibb.co/FXhkZsx/20230910-184020.gif" alt="" class="">


## Introduction
If you are new to Rails, you are probably used to traditional CRUDs, after all, scaffolding is one of the first things we learn when we start studying Rails.

But as our applications grow and become more complex, other Rails features begin to become necessary, such as **ActiveJobs** and **Turbo Streams**.

### ActiveJobs
Do you know when you need to perform a task that takes a long time to complete?

For example, sending an email to all users on your system. You don't want the user to wait until all the emails are sent, right?

That's where ActiveJobs comes in, it's a tool that allows us to perform tasks in the background, without the user having to wait.

In this application, we use ActiveJobs to color the pixels, because as you can imagine, coloring several pixels with different colors at once takes a while.

<!-- ## ActionCable
ActionCable is a tool that allows us to create features that use WebSockets with real-time updates, that is, applications that update automatically without the user having to refresh the page.

The most common application of ActionCable is to be used to create real-time chats, but this feature can also be used for many other things, such as progress bar, notifications, automatic saves, folder synchronization and even interactive dashboards. -->

### Turbo Streams
Turbo Streams is a tool that allows us to update specific parts of an HTML page, without the user having to refresh the page.

In this application, we use Turbo Stream resources to establish a communication channel that transmits information from colored pixels in real time to the client. Based on the information received, Turbo Stream is also responsible for updating the colored pixels on the page.

## Creating the Project

To create the project, we will use the `rails new` command with the `tailwind` CSS framework, to do this, in your work environment, execute the command:

```bash
rails new rails-pixels-app --css=tailwind
```

Then access the created directory:

```bash
cd rails-pixels-app
```

## Creating the Model

Unlike other projects, we will not use Scaffold resources, because we do not want to create a CRUD of pixels, but rather just a model to store the pixels.

For this application, our ***Pixel*** model will only have the `color` attribute. To create the model, run the command:

```bash
rails g model Pixel color:string
```

Then run the `rails db:migrate` command to create the table in the database.


```bash
rails db:migrate
```

## Creating the Controller
We will initially create a controller containing only the ***index*** action, which will be used as the application's main screen.

```bash
rails g controller Pixels index
```

## Configuring Routes

After creating the controller, it is possible to edit the `config/routes.rb` file and define the default route for the action ***index*** of `pixels_controller.rb`.

```ruby
rails.application.routes.draw
root "pixels#index"
end
```

## Starting the Server
Now that we have the model, controller and route, we can start the server and access the application.

```bash
./bin/dev
```

When accessing [http://127.0.0.1:3000](http://127.0.0.1:3000), you should see something like:

<img src="https://i.ibb.co/K7zgszB/Screenshot-1.jpg" alt="" class="">

## Creating and Rendering Pixels
As our application does not have a CRUD, we will create several pixels using the `db/seeds.rb` file and render them in the `app/views/pixels/index.html.erb` view.

In `db/seeds.rb`, add the code snippet below.

```ruby
370.times
Pixel.create(color: "default")
end
```

Then run the `rails db:seed` command to create the pixels in the database.

```bash
rails db:seed
```

Now, in our controller `app/controllers/pixels_controller.rb`, let's add the code define **@pixels** in the action ***index***.

```ruby
def index
@pixels = Pixel.all
end
```

To render each pixel, we will create a partial `app/views/pixels/_pixel.html.erb` with the code below:

```erb
<div id="<%= dom_id(pixel) %>" class="pixel <%= pixel.color %>"></div>
```
Next, we will render the partial in the `app/views/pixels/index.html.erb` view with the code below:

```erb
<div class="space-y-4">
<h1 class="font-bold text-4xl">Pixels#index</h1>
<div class="flex flex-wrap">
<%= render @pixels %>
</div>
</div>
```

Finally, let's style the pixels in the `app/assets/stylesheets/application.tailwind.css` file with the code below:

```css
@tailwind base;
@tailwindcomponents;
@tailwind utilities;

@layercomponents {

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

This file establishes styles for the pixels, for the button that will be used to color the pixels and also increases the height of the Turbo progress bar, which will be used next.

When you refresh the page, you should see something like:

<img src="https://i.ibb.co/4prL1Vw/Captura-da-Web-10-9-2023-152346-127-0-0-1.jpg" alt="" class="">

## Coloring the Pixels
Let's add two buttons right after the `h1` tag in the `app/views/pixels/index.html.erb` view, one to color the pixels and another to reset the colors.

```erb
<%= button_to 'Reset', pixels_reset_path, class:'btn-primary', method: :post %>

<%= button_to 'Colorize Action', pixels_colorize_path, class:'btn-primary', method: :post %>
```

Next, we will create the routes for the ***colorize*** and ***reset*** actions in the `config/routes.rb` file, add the routes below:

```ruby
post 'pixels/colorize'
post 'pixels/reset'
```

To facilitate code implementation, we can define a constant `COLORS` in the ***Pixels*** model with the available colors, in this case, *red*, *green* and *blue*.

In `app/models/pixel.rb` add the code below:

```ruby
COLORS = %w[red green blue].freeze
```

In the controller, we will define the ***reset*** and ***colorize*** actions.

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

Before seeing the pixels being colored, it is still necessary to modify another file.

In `config/tailwind.config.js`, add the code below:

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
This ensures that the class is included in the styling file build even if there are no elements with the assigned class.

Now, when you click on the ***Colorize Action*** button, you should see something like:

<img src="https://i.ibb.co/Kw3mZzL/20230910-154531.gif" alt="" class="">

When you click reset, the colors should return to normal in the blink of an eye.

I know, you must have gotten bored just watching this gif, seeing how long it takes to paint the pixels, but don't worry, we're going to make it better...

Still with this implementation, it is possible to notice that if the user clicks on the ***Colorize Action*** button and then on the ***Reset*** button, the pixels will be colored again, as Turbo does not interrupt the previous request .

And if the user accesses another page or updates the current page in the middle of the request, the progress bar is lost...

<img src="https://i.ibb.co/5Lm2vZQ/20230910-155302.gif" alt="" class="">

This makes it all seem a little strange, doesn't it?
Now that things start to get interesting...

## Using Active Jobs

To solve the problem of concurrent requests, we will use **Active Jobs**, which is a Rails library that allows you to execute tasks in the background.

To create the Job, run the command below:

```bash
rails g job ColorizePixels
```

This will create the file `app/jobs/colorize_pixels_job.rb`. In this file, we will add the same logic contained in the controller's `colorize` action to the `perform` method, except the redirection instruction.


```ruby
def perform(*args)
Pixel.all.each do |pixel|
pixel.update(color: Pixel::COLORS.sample)
end
end
```

To call the Job, let's add another button in `index.html.erb`, right after the ***Colorize Action*** button.

```erb
<%= button_to 'Colorize Job', pixels_colorize_job_path, class:'btn-primary', id:'btn-job', method: :post %>
```

Next, let's create the route for the Job in the `config/routes.rb` file:

```ruby
post 'pixels/colorize_job'
```

Now, let's add the code below to the `app/controllers/pixels_controller.rb` file:

```ruby
def colorize_job
ColorizePixelsJob.perform_later
end
```

When you click the ***Colorize Job*** button, a few things should happen:

- The progress bar will NOT be displayed;
- The page will NOT be stuck in a loading state;
- If you refresh the page or access another page, the Job will continue to run in the background.

<img src="https://i.ibb.co/yXgRwWg/20230910-160852.gif" alt="" class="">

It is important to note that if the user clicks on the ***Colorize Job*** button and then on the ***Reset*** or ***Colorize Action*** button, it is possible that the error `SQLite3::BusyException : database is locked` is displayed, this occurs because there are already several requests being processed simultaneously.

Okay, now that we have our Job running in the background, it is still necessary to update the page manually to follow the pixel colorization process, which is not very cool...

## Using Stream Channels

To make pixels color in real time, we will use **Turbo Streams**, which is a Rails library that allows real-time communication between the server and the client in a simple way.

In `index.html.erb` add the code snippet to the end of the file:
 
```erb
<%= turbo_stream_from 'pixels' %>
```

This instruction will create a communication channel identified by `pixels` that will be used to receive information from the server.

Now, in our job, `colorize_pixels_job.rb`, let's add the code below:

```ruby
def perform(*args)
Pixel.all.each do |pixel|
pixel.update(color: Pixel::COLORS.sample)
Turbo::StreamsChannel.broadcast_update_to('pixels', target: "pixel_#{pixel.id}", partial: 'pixels/pixel', locals: { pixel: pixel })
end
end
```

Note that the `Turbo::Stream` instruction is being used to send a message to the '*pixels*' channel requesting that the pixel be updated with the colored pixel.


<img src="https://i.ibb.co/sK3MZVm/20230919-114450.gif" alt="" class="">


This leaves the pixels being colored as the Job is executed. But note that the 'Colorize Job' button is still available to be clicked, which can cause some problems...

Therefore, we will disable the button while there is a request being processed.

To make this more interesting, we will use the button as a 'progress bar' informing how many pixels have been processed so far.

Therefore, create the file `app/views/pixels/_btn_job.html.erb` with the code below:

```erb
<div id="btn-job">
<%= button_to defined?(btn_text) ? btn_text : 'Colorize Job', pixels_colorize_job_path, class: defined?(btn_class) ? btn_class : 'btn-primary', method: :post %>
</div>
```

In `index.html.erb` replace the ***Colorize Job*** button tag with the code below:

```erb
<%= render partial:'btn_job'%>
```

For the style to be applied correctly, add the code snippet below to the `app/assets/stylesheets/application.tailwind.css` file:

```scss
.btn-job-disabled {
@apply btn-primary bg-blue-600 text-white pointer-events-none;
}
```

Add the `btn-job-disabled` class to the `safe_list` list in `config/tailwind.config.js`:

Now, again in `colorize_pixels_job.rb`, let's change the code as below:

```ruby
def perform(*args)
pixels = Pixel.all
total = pixels.count
pixels.each_with_index do |pixel, index|
pixel.update(color: Pixel::COLORS.sample)
Turbo::StreamsChannel.broadcast_update_to('pixels', target: "pixel_#{pixel.id}", partial: 'pixels/pixel', locals: { pixel: pixel })
Turbo::StreamsChannel.broadcast_replace_to('pixels', target: "btn-job", partial: 'pixels/btn_job', locals: { btn_text: "Colorizing: #{index+1} / #{total}", btn_class: 'btn-job-disabled' })
end
Turbo::StreamsChannel.broadcast_replace_to('pixels', target: "btn-job", partial: 'pixels/btn_job')
end
```

This way, with each iteration of the loop, the button will be updated with the number of pixels already processed. At the end of the loop, the button will be updated back to its initial state.

<img src="https://i.ibb.co/LhMCcKt/20230919-114526.gif" alt="" class="">


<!-- ## Using ActionCable

To solve this problem, we will use **ActionCable**, which is a Rails library that allows real-time communication between the server and the client.

To create the Channel, run the command below:

```bash
rails g channel ColorizePixel
```

For our channel to work correctly, it is necessary to carry out some configurations. Let's do it by steps...

In `app/javascript/channels/colorize_pixel_channel.js` we will add just a few logging statements to check if the channel is working correctly.

```js
import consumer from "channels/consumer"

consumer.subscriptions.create("ColorizePixelChannel", {
connected() {
console.log("Connected to the colorize_pixel_channel");
},

disconnected() {
console.log("Disconnected from the colorize_pixel_channel");
},

received(date) {
console.log("Received data from the colorize_pixel_channel");
}
});
```

Now in `app/channels/colorize_pixel_channel.rb` change the subscribed method code to:

```ruby
def subscribed
stream_from "ColorizePixelChannel"
end
```

If everything goes well, when you access the page and inspect the browser console, you should see the message ***Connected to the colorize_pixel_channel***.


<img src="https://i.ibb.co/zZLyPzy/Screenshot-2.jpg" alt="" class="">

Now, let's add the code for our Job to send progress information to the channel.

In `app/jobs/colorize_pixels_job.rb`, we will change the code as below:

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

Note that we are sending an object with the pixel information, the index and the total number of pixels to the channel at each iteration of the loop. This information will be used to update the job progress on the page.

Additionally, we are sending an object with the channel disconnect instruction at the end of the loop. This information will be used to inform the customer that the job has been completed.

For now, if you click the Colorize Job button, you can see that the job's progress is displayed in the browser console.

As element updates will be done via javascript, we will add an ID to the Colorize Job button so that we can manipulate it in the future.

```erb
<%= button_to 'Colorize Job', pixels_colorize_job_path, class:'btn-primary', id:'btn-job', method: :post %>
```

Now returning to our channel, let's add the code below to `app/javascript/channels/colorize_pixel_channel.js`:

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

received(date) {
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
In case you are not familiar with this code, we are basically interacting with the pixel through its ID and changing its class so that it is colored as the job runs.

Additionally, the *Colorize Job* button will be disabled and modified to display the job's progress while it is running.

Now, if you click on the *Colorize Job* button, you can see that the job progress is reflected live on the page, however, if the page is updated, there is a delay until the client is connected to the channel again.


<img src="https://i.ibb.co/h8JWmHj/20230910-173702.gif" alt="" class="">


To solve this problem, simply add an interval between each interaction.

In `app/jobs/colorize_pixels_job.rb` add include `sleep 0.1` in the last line inside the loop:

```ruby
#...
pixels.each_with_index do |pixel, index|
pixel.update(color: Pixel::COLORS.sample)
ActionCable.server.broadcast('ColorizePixelChannel', { pixel: pixel, index: index+1, total: total } )
sleep 0.1
end
```
This way, the job will be executed with an interval of 0.1 seconds between each iteration, and if there is a new connection on the channel, it may be successful within this interval.

<img src="https://i.ibb.co/Drv1nnc/20230910-174301.gif" alt="" class="">

Note: It is clear that with this interval, the job takes longer to execute, however, it is possible to notice that the progress is displayed correctly. The objective of this article is to exemplify the use of these resources, however, it is up to you to decide whether this range is acceptable or not for your application, as well as the need to execute the task in the background, or communicate in real-time with the client. -->

## Making the application more fun

Now that we have a working application, let's add some features to make it cooler.

Ruby allows us to render information repeatedly using the `XX.times do` instruction.

Let's use this feature to render the ***@pixels*** collection on the page 6 times. In addition, we will make the button menu responsive, optimizing the layout.

In `app/views/pixels/index.html.erb`, let's change the code to:

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
<% 6.times of %>
<%= render @pixels %>
<% end %>
</div>
</div>

<%= turbo_stream_from 'pixels' %>

```

When you refresh the page, it should look similar to the image below:

<img src="https://i.ibb.co/b743wCm/Captura-da-Web-10-9-2023-175242-127-0-0-1.jpg" alt="" class="">

However, if you run the job, you will see that the progress is only displayed in the first section of pixels.

<img src="https://i.ibb.co/wJr8x2g/20230910-175410.gif" alt="" class="">

This happens because our channel is updating the element based on its ID, and as all pixels have the same ID, only the first element is updated.

To change this behavior, let's add the element ID to its class, and change the channel code to update all elements that have the pixel class.

In `app/views/pixels/_pixel.html.erb`, let's change the code to:

```erb
<div id="<%= dom_id(pixel) %>" class="pixel <%= pixel.color%> pixel_<%=pixel.id%>"></div>
```

Now, in `colorize_pixels_job`, just update the `target` attribute to `targets`.

```ruby
Turbo::StreamsChannel.broadcast_update_to('pixels', targets: ".pixel_#{pixel.id}", partial: 'pixels/pixel', locals: { pixel: pixel })
```

Note that now, we are informing a CSS selector as target, and no longer an ID.
Also note that the word needs to be in the plural.


This way, the code will update all elements that contain the pixel class. As we are repeating the pixel rendering several times, the code will update all elements that have the class, as we can see below:

<img src="https://i.ibb.co/XsRSMK0/20230910-180517.gif" alt="" class="">

Although we are processing the collection of pixels, this is happening linearly... but we can make this more fun with just one line of code!

In our active job, right after the `pixels = Pixel.all` line, we will add the following line to shuffle the collection before running the loop:
 
```ruby
pixels = pixels.shuffle
```

<img src="https://i.ibb.co/ZcKhTzk/20230910-180907.gif" alt="" class="">

Still, there seems to be a certain pattern in the way pixels are colored, right?

To make this even more fun, let's shuffle the collection of pixels when rendering the page by adding the `.shuffle` method to the `render` instruction.

In ***app/views/pixels/index.html.erb***, let's change the code to:

```erb
<% 6.times of %>
<%= render @pixels.shuffle %>
<%end%>
```

<img src="https://i.ibb.co/M8F9BDZ/20230910-181511.gif" alt="" class="">

However, with this change, every time the page is accessed the pixels will be shuffled in a different way. It is up to you whether this is desirable or not.

<img src="https://i.ibb.co/ky6Mk6S/20230910-181606.gif" alt="" class="">

Finally, you can also add more color options by adding the color classes in `app/assets/stylesheets/application.tailwind.css`, then adding the new colors in the `COLORS` constant, defined in `app/models /pixel.rb`, and forcing the new classes to load in `config/tailwind.config.js`

To help you, I implemented this in the project repository, and you can copy the content through the following raw files:

- [app/assets/stylesheets/application.tailwind.css](https://raw.githubusercontent.com/lucasgeron/rails-pixels-app/main/app/assets/stylesheets/application.tailwind.css){: .text-link-sm }
- [config/tailwind.config.js](https://raw.githubusercontent.com/lucasgeron/rails-pixels-app/main/config/tailwind.config.js){: .text-link-sm }
- [app/models/pixel.rb](https://raw.githubusercontent.com/lucasgeron/rails-pixels-app/main/app/models/pixel.rb){: .text-link-sm }

Feel free to modify pixel size, as well as the number of pixels rendered on the page.

<img src="https://i.ibb.co/WWj82Tx/20230910-183055.gif" alt="" class="">

## Conclusion


In this article, you learned how to create and run services in the background to process information without making the client wait for the task to complete.

You also learned how to use TurboStreams features, configuring a transmission channel, to update the content of a page in real time.

I hope this article was useful to you, and that you can apply these concepts to your projects.
