#!/bin/bash


# Get current date, year, and month
DATE=$(date +"%Y-%m-%d")
YEAR=$(date +"%Y")
MONTH=$(date +"%m")

# Get title from user input
echo "Post Title:"
read TITLE

echo "Post Slug:"
read SLUG

echo "Language:"
read LANGUAGE

echo "Short Description:"
read SHORT_DESCRIPTION

# Create year and month directories if they don't exist
mkdir -p _i18n/$LANGUAGE/_posts/$YEAR/$MONTH

# Create the file with YAML frontmatter
cat > _i18n/$LANGUAGE/_posts/$YEAR/$MONTH/$DATE-$SLUG.markdown << EOL
---

layout: post
title: "$TITLE"
date: $DATE
short_description: "$SHORT_DESCRIPTION"
cover: /assets/images/covers/$LANGUAGE/$SLUG.png

read_time: true
toc: true
github_repo:

categories:
# - Portifolio
# - Tutorial
# - Article

tags:
# Tech Tags
# - API
# - Design
# - Hotwire Turbo
# - Hotwire Stimulus
# - Python
# - P5.js
# - Ruby
# - Ruby On Rails
# - Spreadsheet
# - Useful Gems
---

# $TITLE
$SHORT_DESCRIPTION

   <!-- ALERT -->
  > An example showing the `tip` type prompt.
  {: .prompt-tip }

  > An example showing the `info` type prompt.
  {: .prompt-info }

  > An example showing the `warning` type prompt.
  {: .prompt-warning }

  > An example showing the `danger` type prompt.
  {: .prompt-danger }


  <!-- CODE -->
  ```ruby
  def foo
    puts 'foo'
  end
  ```
  {: file='file.rb' .nolineno}

  <!-- IMG -->
  ![](){: }

  <!-- VÍDEO -->
  {% include youtube.html id='' %}

  <!-- FOOTNOTE -->
  This is a Footnote[^1]

  [^1]: This is a Footnote.

  
  <!-- GITHUB REPO -->
  {%- include github.markdown -%}



EOL

