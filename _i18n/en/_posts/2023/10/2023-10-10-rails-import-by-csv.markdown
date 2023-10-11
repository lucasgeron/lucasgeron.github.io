---

layout: post
title: "Rails Import by CSV"
date: 2023-10-10
short_description: "In this article we will implement the features of importing and exporting records through .CSV files"
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

# Rails Import via CSV

In this article we will implement the features of importing and exporting records through .CSV files.

![demo](https://i.ibb.co/k6fngMj/Tab-Post.gif)

To do this we will use Rails (csv) and Hotwire Turbo (streams) resources.

The idea is simple, we will have a form where the user can send a .CSV file to be processed. When sending, a `Service` will be instantiated and will interpret the file. During the process, the records must be saved in the database if they are valid, or they will be ignored and the user will be informed of the error.

The user will be able to see the progress of file processing in real time, monitoring the situation and possible error messages during the processing of each line through a page update stream.

To conclude, we will also implement record export, where the user will be able to save all database records in a .CSV file. It is worth noting that at this stage it will also be possible to choose which attribute of the model will be exported.


## Relevant Knowledge

Before we start implementing the code, I would like to share some knowledge that may be relevant to this project.

At first, while preparing this article, I developed this project using ActiveJob resources to process the files, however, when doing more research on how to implement this correctly, I found many discussions on the subject, with the majority recommending the use of Services Objects to handle such action. But after all, what is the difference between ActiveJob and Services Objects and why should we use one instead of the other?

### Active Jobs

Active Jobs is a Rails feature that allows you to run tasks in the background. Typically, tasks are specific and assigned to one or more system models. The most common example of its use is, for example, sending a batch of emails, allowing the user to navigate the application while the emails are sent in the background. Despite this, it is possible to perform tasks in the foreground with the `perform_now` method. Following the same example, imagine that an account activation email must be sent as soon as the user registers, in this case, the `perform_now` method can be used to execute the task in the foreground.

This resource, running in the background, has some good practices, such as receiving a minimum of parameters, and carrying out heavy processing logic when executed. For example, instead of sending an entire file to ActiveJob to process, you send just the file path, and then ActiveJob will read the file and process the data.

Another important thing is that ActiveJobs, when executed asynchronously, does not have access to the request context, that is, it does not have access to the user session, nor instance variables and it also cannot render views or return values ​​to the controller.

It is important to highlight that there are many uses for this resource, and that in its concept, it has the objective of carrying out a specific task that may take longer to process than the rest of the application.

### Service Objects

Service Objects aim to encapsulate the application's business logic. In other words, it is a class that aims to perform a specific task, and that can be reused in different parts of the application, without being specific to a certain model, but rather to a context.

In some examples on the internet, it is possible to find Service Objects being used to communicate with APIs, process Files and even to perform batch actions with database models.

The great advantage of using Service Objects is that they can be reused in different parts of the application, and that they can be tested in isolation, without the need to create a model to test the business logic.

Unlike ActiveJobs, Services are executed synchronously, that is, the rest of the code is only executed after the service is completed. Furthermore, Services have access to the request context, and can return values ​​to the controller.


### ActiveJob or Service Objects?

Well, now that we know a little about each resource, we can conclude that ActiveJob is better suited for more specific tasks that must be executed in the background, while Service Objects are better suited for business logic that can be used in various scenarios. and which must be executed synchronously.

Therefore, for this project, the "Import by CSV" function is considered as a business logic, in which it creates several models based on the input from the .csv file. It is also possible to state that its desired behavior is synchronous, that is, the user must monitor the file processing to validate the processed information and then continue using the application.

#### Import large files?
There is another crucial point that can also be taken into account when choosing a Service or an ActiveJob, which is the size of the file that will be processed. Consider that there may be a file containing thousands of records, and that rendering all this information on the screen may not be the best alternative. In this case, ActiveJob`.perform_later` may be a good choice, however, the user will not be able to access the file processing progress in real-time, and processed records that contain errors must be treated differently.

Researching this, a possible implementation would be to create a model with attributes that represent the progress of file processing, and then ActiveJob would update the model with each record processed. It is worth noting that to carry out the task in the background, the file input by the user must be saved as an attachment to the model in question, and then views must be implemented so that the user can monitor the progress of the task. A great advantage of this implementation is that the user can process several files simultaneously and that the processed file will be in the application's history and can be accessed at any time.

---
Okay, now that we know a little about each resource, we can start implementing the project.

## Configuring the Project

To get started, open your terminal and create a new Rails project using the 'tailwind' argument to use the Tailwind CSS framework.

```bash
rails new rails-import-by-csv --css=tailwindcss
```
{: .nolineno}

Let's create through *scaffold* a model called `Visitor` with the attributes `name` and `cpf`.

> The **Visitor** model will be re-used in the next article, where we will discuss **Polymorphism**.
{: .prompt-tip }

```bash
rails g scaffold Visitor name:string cpf:string
```
{: .nolineno}

Next, we will run the migrations and compile the tailwind assets.

```bash
rails db:migrate
rails tailwindcss:build
```
{: .nolineno}

Before we move into implementation, adjust the `config/routes.rb` file so that the root route is the guest page.

```ruby
rails.application.routes.draw
root "visitors#index"
resources :visitors
end
```
{: file='config/routes.rb'}

Now, we can start the server and access the guest page.

```bash
rails s
```
{: .nolineno}

## Implementing the Feature

Rails allows us to define routes with the same name for different request methods, so let's define the `import` route for the `GET` and `POST` methods. Despite having the same name, the controller will interpret and respond based on the type of request, where the `GET` method will render the import form and the `POST` method will process the file sent by the user. If you prefer, you can create routes with different names, such as `import` and `import_process`.

```ruby
rails.application.routes.draw
root "visitors#index"
resources :visitors do
get :import, on: :collection
post :import, on: :collection
end
end
```
{: file='config/routes.rb'}

Now that we have the route defined, let's add the button to access the record import page.

Modify the *index.html.erb* instructions to include the button as per the following code:

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

The next step is to create the view, so create the `import.html.erb` file inside the `app/views/visitors/` folder and add the following code:

```erb
<div class="mx-auto md:w-2/3 w-full">
<h1 class="font-bold text-4xl">Import Visitors</h1>
<%= render "import_form" %>
<%= link_to 'Back to visitors', visitors_path, class: "rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
</div>
```
{: file='app/views/visitors/import.html.erb'}

Note that the **import** form is different from the record **creation** form, so we need to create the `_import_form.html.erb` file inside the `app/views/visitors/` folder and add the following code:

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

By rails convention, the route to `*GET* should already be working, since the files are in the expected place, however, the form is not yet sending the file to the server.

![import-form](https://i.ibb.co/VQ5fF5B/Tab-Post.gif)

For the sent file to be processed correctly, it is necessary to implement the Service and update the controller code.

## Implementing the Service

Following the concept of a Service Object, which is an object that encapsulates business logic, we will create a new file called `import_service.rb` within the `app/services` folder. Rails doesn't offer any commands to create this, so you need to do this manually.

A good practice for using services, according to [Amin Shah Gilani](https://www.toptal.com/ruby-on-rails/rails-service-objects-tutorial), is to structure the code so that all services inherit the basic functions of a generic service, avoiding code repetition.

In your terminal, run the following commands to create the directory and corresponding files.

```bash
mkdir app/services
touch app/services/application_service.rb
touch app/services/import_service.rb
```
{: .nolineno}

Now, in your editor, add the following code to the `app/services/application_service.rb` file:
```ruby
class ApplicationService
def self.call(*args)
new(*args).call
end
end
```
{: file='app/services/application_service.rb'}

This code allows any service to inherit the `call` function, which is responsible for instantiating the service and calling the `call` method itself.

Then edit the `app/services/import_service.rb` file by adding the following code:

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

> It is necessary to restart the server for the services to be loaded.
{: .prompt-info}

Slightly different from ActiveJob, the main method of a service is not `perform`, but rather `call`.

Let's understand this code a little better. In `application_service.rb` we define an **instance method** (preceded by `self.`) that creates a new service - the one that was invoked - and calls the `call` method on itself. In other words, it allows you to do something like: `ImportService.call(MyModel, params[:file])`. Note that `self.call` receives `*args`, however, these arguments are used to instantiate the service, and not to execute the `call` method.

Therefore, `import_service.rb` inherits from `application_service.rb`, when calling the `.call` method, the `initialize` method is invoked, and the arguments are passed to the constructor, so that the implemented logic is then executed.

If this were not done this way, it would be necessary to instantiate the service and call the `call` method manually, for example: `ImportService.new(MyModel, params[:file]).call`.

As simple as this may seem, this approach allows the code to be more readable, and the service to be used in a simpler way, as if it were a static method.

Now, the logic implemented for import is relatively simple, the file is read and for each line of the file, a new record is created and saved in the database.

> We are using new/save instead of create! so that in case of error, the behavior is conditioned appropriately.
{: .prompt-info}

Now, to make the form work correctly, let's implement the `import` method in `visitors_controller.rb` by adding the code snippet below:
 
```ruby
# GET /visitors/import
# POST /visitors/import
def import
ImportService.call(Visitor, params[:file]) if request.post?
end
```
{: file='app/controllers/visitors_controller.rb'}

If the request is of type `POST`, the ImportService will be instantiated and executed immediately.

If the request is of type `GET`, the `import` method will be called, but it will not execute the service, it will only render the view according to the convention.

This should be enough for the import to work, however, you may have noticed that we are doing a `broadcast` for the `import_visitors` channel, which does not yet exist. For the information to be replicated in the view, it is necessary to include the `turbo_stream_from` tag in the desired view, establishing the connection between the client and server.

Another point worth highlighting is that `broadscast` also follows the Rails convention, therefore, if a `target` is not provided, it will be taken as the name of the model in the plural, in this case, `visitors`. Therefore, it is also important to add a div with `id` '*visitors*' so that the turbo stream works correctly.


```erb
<div class="mx-auto md:w-2/3 w-full">
<h1 class="font-bold text-4xl">Import Visitors</h1>
<%= render "import_form" %>
<%= link_to 'Back to visitors', visitors_path, class: "rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>

<%= turbo_stream_from 'import_visitors' %>
<div id="visitors"></div>

</div>
```
{: file='app/views/visitors/import.html.erb'}

So you can test this in practice, create your .CSV file or download the example files:
- [**data_set_01.csv**](https://raw.githubusercontent.com/lucasgeron/rails-import-by-csv/main/data_set_01.csv){: .text-link-sm} : Contains 30 records valid
- [**data_set_02.csv**](https://raw.githubusercontent.com/lucasgeron/rails-import-by-csv/main/data_set_02.csv){: .text-link-sm} : Contains 7 records valid and 3 invalid.
- [**data_set_03.csv**](https://raw.githubusercontent.com/lucasgeron/rails-import-by-csv/main/data_set_03.csv){: .text-link-sm} : Contains 250 records valid

Now, try to import **data_set_01.csv** and you should see the following result.

![import-data-set-01](https://i.ibb.co/ZWfhNys/Tab-Post-02.gif)

When inspecting the browser console, you may see the following error message:

![redirect-fail](https://i.ibb.co/gS61nZc/Screenshot-1.jpg){: .w-50}

As we are doing this from a `POST` request, it is expected that the page will be redirected to any other page, however, as we are using Turbo and listing the records on the page itself, we do not want this to happen.

To deal with this, simply create the response file in `turbo_stream` format following the convention.

```erb
<%= turbo_stream.prepend 'visitors' do %>
Import Finished
<% end %>
```
{: file='app/views/visitors/import.turbo_stream.erb'}

![turbo_stream response](https://i.ibb.co/9wrsvnJ/Tab-Post-03.gif)

This way, Rails will interpret the request as Turbo, and respond in the appropriate format. This way, the error listed previously will no longer be displayed, and instead, the message "Import Finished" will be displayed before the list of imported records.

> <span class="fs-6">The file ***import.turbo_stream.erb*** simply needs to exist for the response to be interpreted as Turbo. <span>
{: .prompt-info}

From now on, we will start refining this feature, adding features such as data validation, progress bar, and conditional formatting of data and import metrics.

## Adding the Progress Bar

Imagine that the *data_set* to be imported has thousands of rows and that processing this could take a few minutes. In this case, it would be interesting if the user could track the import progress... To do this, let's add a progress bar.

> <span class='fs-6'>If there are millions of lines to be processed, it is interesting to modify the code for an ActiveJob that runs in the background as suggested in [Import large files](/tutorial/2023/10/10 /rails-import-by-csv.html#import-large-files).</span>

The idea is that when processing the file starts, the current form is replaced by the progress bar. With each imported record, we will update the progress percentage, and when the import is complete, we will replace the bar with the import metrics.

As we are implementing a Service and want it to be replicated to any environment in our application, create a partial in `layouts/shared/` with the contents of the progress bar, according to the following code:

```erb
<div class="flex justify-between mb-1 mt-4">
<span class="text-base font-medium ">Importing...</span>
<span class="text-sm font-medium "><%= index %> / <%= total %> (<%= percentage %>%)</span>
</div>
<div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
<div class="bg-blue-600 h-2.5 rounded-full" style="width: <%= percentage %>%"></div>
</div>
```
{: file='app/views/layouts/shared/_progress_bar.html.erb'}

To manipulate the import form, we will add an id to it.

```erb
<%= form_with(url: import_visitors_path, class: "contents", id: 'import_form') do |form| %>
<%# ... %>
```
{: file='app/views/visitors/_import_form.html.erb'}

Now, in `import_service.rb`, modify the code as follows:


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

Before we go any further, realize that ImportService is violating one of its principles by broadcasting directly to 'import_visitors'. Please note that if this service is used to import other models, the data will be sent to the wrong channel. So let's modify this so that the service is more generic.

In `initialize` add the directive: ``` @target = @model.to_s.downcase.pluralize ``` and replace the `strings` '*import_visitors*' with "*import_#{@target}*" in the `method call` and `update_progress_bar`.


```ruby
#...

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

#...

```
{: file='app/services/import_service.rb'}

This way, we make the service more generic and can use it to import other models.

## Adding the Metrics

Note that so far, the application is adding a line to the visitors table for each imported record. This occurs through the directive `@record.broadcast_append_to "import_#{@target}"` which adds the record to the end of the table.

To make this more interesting, let's modify this behavior a little. Instead of adding the record after its import, when starting processing, we will render all the files contained in the CSV file and add a status column, so, with each imported record, we will just update the status column, thus reducing the drastic change of HTML generated by the service, improving performance by returning less content, and making the interface more user-friendly.

In the same way that the progress bar is used by the service, the import table will also be generic and can be used to import any model.

Therefore, let's create a partial for the import table in `layouts/shared/` with the following content:

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
<td class="px-2 py-3" id='<%=target%>_<%=index%>'><span class='px-3 py-2 text-sm text-gray-800 rounded -lg bg-gray-100'>In Queue</span></td>
</tr>
<% end %>
</tbody>
</table>
</div>
```
{: file='app/views/layouts/shared/_import_table.html.erb'}

This partial renders the import table with data from the CSV file, regardless of how many columns the file has, and adds the `row` and `status` column to be used by the service.

To render the import metrics after processing the file, we will modify the `import.turbo_stream.rb` file according to the following code:

```erb
<%= turbo_stream.replace 'import_form' do %>

<div class="p-4 my-4 text-sm text-blue-800 rounded-lg bg-blue-50 " role="alert">
<strong class="block sm:inline"><b><%= @service.file.original_filename %> </b> with <b><%= @service.total %> <%= @service.model % </b> was processed successfully.</strong>
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

This way, instead of rendering "*Import Finished*", detailed information about the import will be rendered.

However, for this data to reach the view, we are using the variable `@service`, this variable in turn, must receive the service that is being executed, therefore, we will modify the `import` method of the `visitors_controller` controller according to the following code:

```ruby
# GET /visitors/import
# POST /visitors/import
def import
@service = ImportService.call(Visitor, params[:file]) if request.post?
end
```
{: file='app/controllers/visitors_controller.rb'}

And finally, make the necessary changes to the service so that it renders the complete table when started, updates the status column during data processing and finally, counts the import metrics so that they can be rendered afterwards.

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
content: "<span class='px-3 py-2 text-sm text-red-800 rounded-lg bg-red-50'>#{@record.errors.full_messages.join(", ")}</ span>"
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

Now, when you import a file, you should see something like the following image (slowed down image):

![import_table](https://i.ibb.co/82nQ7Jt/Tab-Post-10.gif)

## Adding Validations

So far, we are importing records without performing any type of validation, allowing us to create blank or duplicate records.

As a good practice to ensure data integrity, it is important that models are validated before being saved in the database.

To do this, add validations to the Visitor model.

```ruby
class Visitor < ApplicationRecord
validates :name, presence: true
validates :cpf, presence: true, uniqueness: true
end
```
{: file='app/models/visitor.rb'}

To test, we will use the file: ***data_set_02.csv***, which contains valid and invalid records.

![import-validations](https://i.ibb.co/9nVYw9C/Tab-Post-11.gif)

Okay, now we have an application that allows the import of CSV files, with real-time feedback and data validations.

## Exporting the Data

Finally, let's add the functionality to export the data to a CSV file.

Following the same idea of ​​using a generic Service to import models with varied attributes, we will do the same for export.

Generate the Service *ExportService* with the following command:

```bash
touch app/services/export_service.rb
```

Then add the following code to the Service:

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

Add the routes for export in the *routes.rb* file:

```ruby
rails.application.routes.draw
root "visitors#index"
resources :visitors do
get :import, on: :collection
post :import, on: :collection
post :export, on: :collection
end
end
```
{: file='config/routes.rb'}

Then implement the method in the controller:
 
```ruby
# POST /visitors/export
def export
send_data ExportService.call(Visitor, %i[name cpf]), filename: "visitors-#{Date.today}.csv"
end
```
{: file='app/controllers/visitors_controller.rb'}

Note that the ExportService now receives as parameters the model and attributes that must be exported.

> It is possible to implement a specific form for each model, where the user could select the attributes they want to export. However, for simplicity, we will use a generic form, which exports all assignable attributes of the model.
{: .prompt-info}

And finally, add the download button to *index.html.erb*:
 
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

Note that similar to the import button, a 'redirect' to another page is expected after the post request. To avoid this, simply add the *data: {turbo: false}* attribute to the button, forcing the request to be made in a traditional way.

When you click the button, the CSV file will be downloaded according to the specified attributes.

## Removing all Records

For testing and demonstration purposes, we will add a button to remove all records from the database.
This is intended to make it easier when testing file imports, as it will not be necessary to remove records manually.

In the routes, add the route for the *delete_all* method:

```ruby
rails.application.routes.draw
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

Then add the method in the controller:

```ruby
# POST /visitors/delete_all
def delete_all
Visitor.delete_all
redirect_to visitors_url, notice: "All visitors were successfully destroyed."
end
```
{: file='app/controllers/visitors_controller.rb'}

And finally, add the button to *index.html.erb*:

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

If you've made it this far, your application should look like this:

![end](https://i.ibb.co/jLC7YmQ/Post-10.gif)
## Conclusion

In this article we saw how to implement a Rails application that allows the import of CSV files, with real-time feedback and data validations.

We did this using a Service Object that allows you to import any application model with different attributes.

We have also implemented another service that allows you to export the desired information to a CSV file.

We use Turbo Streams resources to create a progress bar, modify view elements and make the application more practical and efficient.

I hope this article was useful to you, and that it can be applied to your projects.

### Next Project

As mentioned at the beginning of this article, the next project will address polymorphism. In it, we will create an authorization system, where Visitors or Workers will have (polymorphic) authorizations to access certain locations. Therefore, we will use this repository as a base, since it is possible to easily import records, and we will take advantage of its resources to import authorizations based on the visitor or worker's CPF.
