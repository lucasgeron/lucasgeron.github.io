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
categories:
# - Portifolio
# - Tutorial
# - Article
tags:
# Tech Tags
# - API
# - P5.js
# - Python
# - Ruby
# - Ruby On Rails
# - Hotwire Turbo
# - Hotwire Stimulus
# Other Tags
# - Design
# - Spreadsheet
# - Useful Gems
---

# $TITLE
$SHORT_DESCRIPTION

<div>
  <img src="" alt="" class="">
</div>


--- 

> ### Link do Repositório:
> ## [*lucasgeron/$SLUG*](https://github.com/lucasgeron/$SLUG)

--- 
#### **Gostou deste projeto?** *Deixe seu feedback!* 


EOL

