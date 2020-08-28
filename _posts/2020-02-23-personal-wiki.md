---
title: Personal Wiki
layout: post
---

This post details my note-taking and review system that uses plaintext & markdown format and is hosted for free on Github. This system aids [effective learning](http://nywkap.com/learning/effective-learning.html).

## Why?

Here are the problems I am trying to help solve with this system:
   - rusting of useful skills
   - forgetting useful information from books or talks
   - slow or ineffective learning

Some additional side benefits:
   - store notes for free
   - easy cross-platform access to notes
   - easy access to notes in python scripts (no need to muss about with APIs)
   - no dependency on Evernote, Notion, Google Keep, One Note or similar service reduces privacy & longevity concerns.

## Details

### Snapshot

Here's a snapshot of my top-level notes folder. Folders containing notes on books or courses start with `learn_`, and folders containing project notes start with `project_`. 

    - books/
        - epubs & pdfs for easy reference
    - goals/
        - various attempts of my inner visionary to direct the semi-random activities of my life
    - journal/
        - a collection of my daily one-sentence journal entries
    - keep/
        - export of all my Google Keep notes taken when I foolishly thought that a single tool could statisfy my note-taking needs
    - learn_book_automate_the_boring_stuff/
    - learn_book_Coding_Complete_2/
    - learn_book_mythical_man_month/
    - learn_book_theory_of_fun/
    - learn_js/
    - ... more learn_ folders
    - my_scripts/
        - various python scripts including note automation ones
    - proj_blog
    - proj_game/
    - proj_landscape_game/
    - proj_learning_and_productivity_system/
    - ... more proj_ folders
    - #a_review_schedule.md
        - a daily review schedule, more details below
    - all.py
        - runs all of my note automation scripts
    - journal_template.txt
        - renamed & copied into my journal folder every day
    - markdown_cheat_sheet.md
    - todo.txt

### Automated Syncing

I use [Syncthing](https://syncthing.net/) to sync my notes across my devices. After the finicky setup, it has worked perfectly. 

I also push my notes up to Github so that I can access them from my work computer. This happens on my phone via a cron job running in [Termux](https://termux.com/).

### Reading and Writing

My markdown notes contain images and are hyperlinked together and so I need a markdown reader on each device.

- Android / Chromebook
    - I use the excellent [Markor](https://github.com/gsantner/markor) app
    - [Quickedit](https://play.google.com/store/apps/details?id=com.rhmsoft.edit&hl=en_CA) doesn't have markdown support but is a half-decent mobile editing experience
- Windows
    - [VSCode](https://code.visualstudio.com/) has excellent markdown support
    - [Typora](https://typora.io/) is also a slick markdown reader & editor 
    - And on my work machine I use Github

### Automated Review

Reviewing information is an important step in learning because it prevents forgetting! Forgetting is good and natural. For example, forgetting whatever nonsense you saw on Reddit clears space for useful information. Typically, useful information is *repeated*. Information required for work is repeated and so is remembered. However, some useful information is not repeated. Information in books, presented at a conference, or learned on a side project tends to be a one-time affair. Dedicated review time is required to prevent forgetting.

An effective review strategy:
- repeats information as little as possible,
- summarizes & compresses information,
- primes the information for use.

To accomplish this I've built a python script that builds a [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition) review schedule from my notes (similar to <a href="https://en.wikipedia.org/wiki/Anki_(software)">Anki</a>). Every day it presents up to 5 notes for review. I read each note, re-summarize it, and create a question for myself to answer on the next review. Reading and summarizing the note compresses the information so it is easier to recall the important bits and forget the details. Creating a question primes the information for recall.

Here's my home screen with a shortcut to the review schedule.

![review shortcut](/assets/images/review_shortcut.jpg)

Here's the review schedule itself. Each link is clickable & will open up the related note.

![review shortcut](/assets/images/review_schedule.jpg)

Here's a linked note. When I'm done reviewing I add a 'd' after the review tag. This tells the review schedule script to increment the last reviewed date and increment the review number. Any note containing a review tag will be added to the review schedule. Adding 'rme' to the top of a note will queue it up for review. 

![a note](/assets/images/to_review.jpg)

My review schedule code is very rough and personalized. Here [it is](https://gist.github.com/jdrbc/08c43acb89b6dfa232e62ed19d5aa0dc) if you'd like to adapt it for your use. 

### Other Automation

I use Termux cronjobs to:

- generate the review schedule
- create a daily journal from a template (and clean up empty templates)
- sync my notes to Github

## Recap

![I swear it's not like this](https://imgs.xkcd.com/comics/workaround.png)

Using a simple folder structure and Markdown format to keep notes in combination with Syncthing and Github makes it easy to access notes from many different devices. Writing scripts that parse the notes is a powerful time-saving tool. 

A spaced repetition review schedule is a part of an effective learning system, and the reminders.py script can automatically create this review schedule.

Use Termux and a cron job to execute this script on your phone.