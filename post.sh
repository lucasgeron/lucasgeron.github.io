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

echo "Labels:"
read LABEL

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
labels: "$LABEL"

---

# $TITLE
$SHORT_DESCRIPTION

<div>
  <img src="" alt="" class="">
</div>


--- 

> ### Link do Repositório:
> ## [*lucasgeron/rails-chat-room*](https://github.com/lucasgeron/rails-chat-room)

--- 
#### **Gostou deste projeto?** *Deixe seu feedback!* 


EOL

