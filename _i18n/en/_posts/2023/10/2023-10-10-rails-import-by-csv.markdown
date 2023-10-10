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

![demo](https://i.ibb.co/qFd2VfN/Tab-Post-08.gif)

To do this we will use Rails (csv) and Hotwire Turbo (streams) resources.

The idea is simple, we will have a record import form, where the user can select a .CSV file and send it to the server.
When sending, a Job will be used to process the file and save the records in the database.

The user will also be able to see the file processing progress in real time, monitoring the situation and possible error messages during the processing of each line through a page update stream.

To conclude, we will also implement record export, where the user will be able to save all database records in a .CSV file.


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

Rails allows us to define routes with the same name for different request methods, so let's define the `import` route for the `GET` and `POST` methods. Despite having the same name, the controller will interpret and respond based on the type of request, where the `GET` method will render the import form and the `POST` method will process the file sent by the user.

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
<%= render "import_form", visitor: @visitor %>
<%= link_to 'Back to visitors', visitors_path, class: "rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
</div>
```
{: file='app/views/visitors/import.html.erb'}

Note that the import form is different from the record creation form, so we need to create the `_import_form.html.erb` file inside the `app/views/visitors/` folder and add the following code:

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

In order for the sent file to be processed correctly, and to make things more interesting, we will include Turbo Streams resources to list the processing, while we process the file through a Job.

## Implementing the Job
As previously mentioned, this project will be used to talk about polymorphism next, therefore, we will implement a job that can be reused in different models, importing records with different attributes.

To begin, let's create a new job called `ImportJob` using the following command:

```bash
rails g job Import
```
{: .nolineno}

Next, let's add the following code to the `app/jobs/import_job.rb` file:

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

Note that the job receives two arguments, the first is the model that will be used to import the records, and the second is the file that will be processed.

The file is then read through `CSV.read`, and each line is converted to a hash through the `to_hash` method, which is used to create a new record of the informed model.

For this job to be instanced correctly, we will need to define the `import` method in the controller.
 
```ruby
# GET /visitors/import
# POST /visitors/import
def import
return ImportJob.perform_now(Visitor, params[:file]) if request.post?
end
```
{: file='app/controllers/visitors_controller.rb'}

In simple terms, if the request is of type `POST`, the job will be instantiated and executed immediately.
If the request is of type `GET`, the `import` method will be called, but it will not execute the job, it will only render the view as expected.

This should be enough for the import to work, however, you may have noticed that we are making a `broadcast` for the `importVisitors` channel, which does not yet exist. For the information to be replicated in the view, it is necessary to include the `turbo_stream_from` tag in the desired view, establishing the connection between the channel and the job.

Another point worth highlighting is that `broadscast` also follows the Rails convention, therefore, if a target is not provided, the target used will be the name of the model in the plural, in this case, `visitors`. Therefore, it is also important to add a div with id 'visitors' so that the turbo stream works correctly.


```erb
<div class="mx-auto md:w-2/3 w-full">
<h1 class="font-bold text-4xl">Import Visitors</h1>
<%= render "import_form" %>
<%= link_to 'Back to visitors', visitors_path, class: "rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>

<%= turbo_stream_from 'importVisitors' %>
<div id="visitors"></div>

</div>
```
{: file='app/views/visitors/import.html.erb'}

So you can test this in practice, create your .CSV file or download the example files:
- [**data_set_01.csv**](https://raw.githubusercontent.com/lucasgeron/rails-import-by-csv/main/data_set_01.csv){: .text-link-sm} : Contains 30 valid records
- [**data_set_02.csv**](https://raw.githubusercontent.com/lucasgeron/rails-import-by-csv/main/data_set_02.csv){: .text-link-sm} : Contains 7 valid and 3 invalid records.

Now, try to import **data_set_01.csv** and you should see the following result.

![import-data-set-01](https://i.ibb.co/ZWfhNys/Tab-Post-02.gif)


Okay, that was relatively simple, but we're not done here.

As we are doing this from a POST request, it is expected that the page will be redirected to the visitor listing page, however, as we are using Turbo and listing the records on the page itself, we do not want this to happen.

However, when inspecting the browser console, you may see the following error message:

![redirect-fail](https://i.ibb.co/gS61nZc/Screenshot-1.jpg){: .w-50}

To deal with this, simply create the response file in `turbo_stream` format following the convention.

```erb
<%= turbo_stream.prepend 'visitors' do %>
Import Finished
<% end %>
```
{: file='app/views/visitors/import.turbo_stream.erb'}

![turbo_stream response](https://i.ibb.co/9wrsvnJ/Tab-Post-03.gif)

This way, Rails will interpret the request as Turbo, and respond in the appropriate format. This way, the error listed previously will no longer be displayed, and instead, the message "Import Finished" will be displayed before the list of imported records.

> <span class="fs-6">The file ***import.turbo_stream.erb*** existing is enough for the error to stop occurring. <span>
{: .prompt-info}

From now on, we will start refining this feature, adding features such as data validation, progress bar, and conditional formatting of data and import metrics.

## Adding the Progress Bar

Imagine that the *data_set* to be imported has thousands of rows and that processing this could take a few minutes. In this case, it would be interesting if the user could track the import progress... To do this, let's add a progress bar.

> <span class='fs-6'>If there are millions of lines to be processed, it is interesting to modify the code so that the job runs in the background, however, to maintain simplicity, we will keep the job running synchronously .</span>

When starting to process the file, we will replace the current form with the progress bar. With each imported record, we will update the progress percentage, and when the import is complete, we will replace the bar with the import metrics.


Therefore, create a partial with the contents of the progress bar, according to the following code:

```erb
<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-4">
<div class="bg-blue-600 h-2.5 rounded-full" style="width: <%= percent %>%"></div>
</div>
```
{: file='app/views/visitors/_progress_bar.html.erb'}

To manipulate the import form, we will add an id to it.

```erb
<%= form_with(url: import_visitors_path, class: "contents", id: 'import_form') do |form| %>
<%# ... %>
```
{: file='app/views/visitors/_import_form.html.erb'}

Now, in ImportJob, modify the code as follows:


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

## Adding the Metrics

To replace the progress bar with import metrics, let's modify the ImportJob according to the following code:

```ruby
require 'csv'

class ImportJob < ApplicationJob
queue_as :default

def perform(model, file)
 
imported_successfully = 0
imported_unsuccessfully = 0
 
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

As we are returning a hash of values, we will associate this return in a variable.

```ruby
# GET /visitors/import
# POST /visitors/import
def import
return @result = ImportJob.perform_later(Visitor, params[:file]) if request.post?
end
```
{: file='app/controllers/visitors_controller.rb'}

Therefore, these values ​​are accessible through `@result`. For this to be rendered at the end of processing, simply change the *import.turbo_stream.erb* file to list the values.

```erb
<%= turbo_stream.replace 'import_form' do %>

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

## Adding Validations

Until now, we can import several records without performing any type of validation, even creating blank records.

As a good practice to ensure data integrity, it is important that models are validated before being saved in the database.

To do this, add validations to the Visitor model.

```ruby
class Visitor < ApplicationRecord
validates :name, presence: true
validates :cpf, presence: true, uniqueness: true
end
```
{: file='app/models/visitor.rb'}

If you try to resubmit the *data_set_01.csv* file now that an `ActionController::UrlGenerationError in Visitors#import` error has occurred.

This happens because we are trying to render the partial 'visitors/_visitor', which contains the url for editing Visitor. However, as the record was not created due to validations, it is not possible to obtain a valid ID, causing the error.

In this case, it would also be interesting to inform the user why the record was not imported successfully.

Well, to do this, we will create a table, and list the imported records in the table rows.

Create the partial *_import_table.html.erb* with the following content:

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

Then, create the *_import_visitor.html.erb* partial that will be used to render the lines of the CSV file.

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

To complete the modifications, simply update the Job so that it uses the correct partials.

```ruby
require 'csv'

class ImportJob < ApplicationJob
queue_as :default

def perform(model, file)
 
Turbo::StreamsChannel.broadcast_replace_to 'importVisitors', target:'visitors', partial: 'visitors/import_table'
 
imported_successfully = 0
imported_unsuccessfully = 0
 
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

And now, to test, we will use the file: ***data_set_02.csv***, which contains valid and invalid records.

![import-validations](https://i.ibb.co/hsFjNRp/Tab-Post-06.gif)

Okay, now we have an application that allows the import of CSV files, with real-time feedback and data validations.

## Exporting the Data

Finally, let's add the functionality to export the data to a CSV file.

Following the same idea of ​​using a generic Job to import models with varied attributes, we will do the same for export.

Generate the Job *ExportJob* with the following command:

```bash
rails g job Export
```

Then add the following code to the Job:

```ruby
require 'csv'

class ExportJob < ApplicationJob
queue_as :default

def perform(model, attributes)
csv = CSV.generate(headers: true) do |csv|
csv << attributes.map(&:to_s)
model.all.each from |visitor|
csv << attributes.map{ |attr| visitor.send(attr) }
end
end
end

end
```
{: file='app/jobs/export_job.rb'}

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
send_data ExportJob.perform_now(Visitor, %i[name cpf]), filename: "visitors-#{Date.today}.csv"
end
```
{: file='app/controllers/visitors_controller.rb'}

Note that the Job receives as parameters the model and attributes that must be exported.

> <span class="fs-6"> It is possible to implement a specific form for each model, where the user could select the attributes they want to export. However, for simplicity, we will use a generic form, which exports all assignable attributes of the model.</span>
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

![end](https://i.ibb.co/NL419BK/Tab-Post-07.gif)

## Conclusion

In this article we saw how to implement a Rails application that allows the import of CSV files, with real-time feedback and data validations.

We created a job that allows you to import any models with different attributes, as well as export the necessary information to a CSV file.

We also use Turbo Streams resources to create a progress bar and modify application elements in a practical and efficient way.

I hope this article was useful to you, and that it can be applied to your projects.

### Next Project

As mentioned at the beginning of this article, the next project will address polymorphism. In it, we will create an authorization system, where Visitors or Workers will have (polymorphic) authorizations to access certain locations. Therefore, we will use this repository as a base, since it is possible to easily import records, and we will take advantage of its resources to import authorizations based on the visitor or worker's CPF.