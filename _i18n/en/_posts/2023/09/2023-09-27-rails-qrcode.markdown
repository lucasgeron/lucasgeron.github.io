---

layout: post
title: "Rails QR Code"
date: 2023-09-27
short_description: "In this quick-read article we will implement the use of QR Code for a contact list."
cover: https://i.ibb.co/mCgW0Fx/Tab-Rails-Qrcode.gif
read_time: true
toc: true
github_repo: rails-qrcode
categories:
- Tutorial
tags:
- Ruby On Rails
- Useful Gems

---

# Rails QR Code
In this quick-read article we will implement the use of QR Code for a contact list.



Nowadays, QR Codes (Quick Response Code) make life easier for many people.

It's so common that we don't even realize how implicit they are in our daily lives, to name a few examples:
- Digital Menu
- Payments
- WiFi
- Check in
- Correspondence
- Augmented Reality
- And the list goes on...

When you come across an image of a QR Code, you may think: how is it possible that a bunch of random pixels can contain information?

Well, if you are technically curious, I suggest you research [ISO/IEC 18004:2015](https://www.iso.org/standard/62021.html).

But to make it easier, I can explain it to you in a summarized way, when creating a QR Code, the information is converted and stored in a two-dimensional matrix. This matrix is ​​then converted into an image, which can be read by a QR Code reader.

The main difference between a barcode and a QR Code is that the QR Code can store much more information, and can also be read in any direction, while the barcode can only be read horizontally.

Therefore, let's implement a simple Rails application to demonstrate the use of QR Code.

## Creating the application
In your terminal, run the command below to create a new Rails application:


```bash
rails new rails-qrcode --css=tailwind
```

Now, let's create a scaffold for our contact model:

```bash
rails g scaffold Contact name:string email:string phone:string
```

Next, let's define the application routes so that the home page is the contact list:

```ruby
# config/routes.rb
rails.application.routes.draw
root to: 'contacts#index'
resources :contacts
end
```

## Implementing the Functionality

To implement the QR Code functionality, we will use the gem [rqrcode](https://github.com/whomwah/rqrcode).

In `Gemfile`, add the lines:

```ruby
# rqrcode [https://github.com/whomwah/rqrcode].
gem "rqrcode", "~> 2.0"
```

Save the file, and run `bundle` to install the gem.

As the generated QR Code will be saved in PNG, we will use ActiveStorage resources to store the file.

In your terminal run:

```bash
rails active_storage:install
```
and then:

```bash
rails db:migrate
```

With this done, let's define that each Contact can have a QR Code.
In `app/models/contact.rb`, add the line:

```ruby
# app/models/contact.rb
class Contact < ApplicationRecord
has_one_attached :qrcode
end
```

Okay, things start to get interesting from now on.

This functionality will generate a QR Code for each contact, therefore, each image must be unique and be automatically generated when a new contact is created.

To make this happen, we will change the model according to the code below:

```ruby
class Contact < ApplicationRecord
include rails.application.routes.url_helpers

has_one_attached :qrcode, dependent: :destroy

before_commit :generate_qrcode, on: :create

private

def generate_qrcode
# Generate QR Code
# qrcode = RQRCode::QRCode.new("http://localhost:3000/contacts/#{self.id}")
qrcode = RQRCode::QRCode.new(contact_url(self))
# Convert QR Code to PNG file
png = qrcode.as_png(
size: 200
)
# Attach the PNG to the model
self.qrcode.attach(
io: StringIO.new(png.to_s),
filename: "qrcode.png",
content_type: "image/png"
)
end
end
```

Let's pause to understand what's going on here.

The `before_commit` statement is executed before a record is saved to the database.

The `generate_qrcode` method is responsible for making the magic happen.

`RQRCode::QRCode.new` receives the contact's URL as a parameter, and generates the matrix with the data, returning the data in `RQRCode::QRCode` format.

The parameter of this method could be written in a concatenated form (as per the commented line), but for good practice we will use `contact_url` which is provided by Rails' UrlHelper.
For this to be accessible in the model, it is necessary to include the `Rails.application.routes.url_helpers` module at the top of the file.

Okay, now with our qrcode generated, let's convert this to png.

To do this, we use the `.as_png` method which takes the image size as a parameter.

It is worth noting that the `.as_png` method returns a `ChunkyPNG::Image` object, and that it is possible to enter more arguments for this method. (See [documentation](https://github.com/whomwah/rqrcode))


### Important
The **ChunkyPNG::Image object is an in-memory representation of a PNG image**. When you call the `.as_png` method, it returns a `string` of bytes that represents the PNG image.

Lastly, the PNG is attached to the model via the `attach` method. In this case, `self` represents the contact being created, `qrcode` its attribute, and `attach` the method that attaches the file.

The `io`, `filename` and `content_type` parameters are necessary so that ActiveStorage can save the file.
But a question may arise:

> Why are we using `StringIO.new` and not `File.open` or `File.new`?


The answer to this is because `File.open` or `File.new` would be used if you had a physical file on the file system that you wanted to open and read.
However, in this case, the PNG image is already in memory as a string of bytes, so there is no need for a physical file.

Therefore, what is being passed to `StringIO.new` is the byte string that represents the PNG image.

This allows ActiveStorage to create the image directly from memory, rather than having to write them to a physical file first and then read from it.

Finally, this method will be executed for all contacts that are created, and a single QR Code will be generated for each of them.

## Displaying the QR Code

To display the QR Code, we will use the Rails `image_tag` method.

In `app/views/contacts/_contact.html.erb`, add the code right after *email*:

```erb
<p class="my-5">
<strong class="block font-medium mb-1">QR Code:</strong>
<%= image_tag(contact.qrcode) %>
</p>
```

To test if everything is working, let's start the server and create a new record.

```bash
./bin/dev
```

The result should be as shown in the gif below:
<img src="https://i.ibb.co/mCgW0Fx/Tab-Rails-Qrcode.gif">

## Conclusion
When scanning the QR Code, the link to the contact will open in the browser.

Therefore, adding QR Code functionality to your application is very simple, and can be done in just a few minutes.
In this article, we use the contact link as a QR Code, but you can use any information you wish.

I hope this article was useful to you.

It is worth remembering that this QR Code will be hosted on your server, and that you can use it for different purposes.
In this scenario, as the link is associated with the contact's `id', it is possible to make changes to the record, such as changing the contact's name, and the QR Code will continue to work.

# Extra

So far, the application is using the `id`-based link, that is: **http://127.0.0.1:3000/contacts/2**, but you can use the slug-based link, something like **http://127.0.0.1:3000/contacts/john-doe**.

## Generating Custom Link

To create the link based on the `name` attribute, it is necessary to make some changes to the code.

In the `config/routes.rb` file, modify the code to:

```ruby
rails.application.routes.draw
root to: 'contacts#index'
resources :contacts, except: %i[show]
get 'contacts/:slug', to: 'contacts#show'
end
```
Now, in `app/controllers/contacts_controller.rb`, modify the code to:

```ruby
class ContactsController < ApplicationController
before_action :set_contact, only: %i[ edit update destroy ]
before_action :set_contact_by_slug, only: %i[ show ]

# ... index, show, new, edit - nothing changes.

# POST /contacts or /contacts.json
def create
@contact = Contact.new(contact_params)

respond_to do |format|
if @contact.save
format.html { redirect_to contact_url(@contact.name.parameterize), notice: "Contact was successfully created." }
format.json { render :show, status: :created, location: @contact }
else
format.html { render :new, status: :unprocessable_entity }
format.json { render json: @contact.errors, status: :unprocessable_entity }
end
end
end

# PATCH/PUT /contacts/1 or /contacts/1.json
def update
respond_to do |format|
if @contact.update(contact_params)
format.html { redirect_to contact_url(@contact.name.parameterize), notice: "Contact was successfully updated." }
format.json { render :show, status: :ok, location: @contact }
else
format.html { render :edit, status: :unprocessable_entity }
format.json { render json: @contact.errors, status: :unprocessable_entity }
end
end
end

# ... destroy - nothing changes.

private
 
#... set_contact, contact_params - nothing changed.

def set_contact_by_slug
name = params[:slug].tr('-', ' ').downcase
@contact = Contact.find_by('lower(name) = ?', name)
end

end
```

Finally, in `app/views/contacts/_contact.html.erb`, change the `link_to` from 'Show this contact' to:

```erb
<%= link_to "Show this contact", contact_path(contact.name.parameterize), class: "rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
```

In `app/views/contacts/show.html.erb`, make the same change, replacing the `link_to` of 'Show this contact' to:


```erb
<%= link_to "Show this contact", contact_path(@contact.name.parameterize), class: "ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium" %>
```

And for the QR Code to be generated correctly, in `app/models/contact.rb`, change the code to:

```ruby
# Generate QR code
qrcode = RQRCode::QRCode.new(contact_url(self)) # http://localhost:3000/contacts/1
```

For:

```ruby
# Generate QR code
qrcode = RQRCode::QRCode.new(contact_url(self.name.parameterize)) # http://localhost:3000/contacts/john-doe
```

Also remember to add a security validation, so that it is not possible to create two contacts with the same name, and also modify `before_commit` with the `:update` action, so that the QR Code is updated whenever the name of the contact is changed.

```ruby
# app/models/contact.rb
before_commit :generate_qrcode, on: [:create, :update]
validates :name, presence: true, uniqueness: true
```

Ready! Now when creating or editing a record, a new QR Code will be generated based on the Slug, while other actions continue to function normally.


