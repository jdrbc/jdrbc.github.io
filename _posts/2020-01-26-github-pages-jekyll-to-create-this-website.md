---
layout: post
title: 'Using GitHub Pages And Jekyll To Create This Website'
tags: GitHub, blog, Jekyll
---

I won't go into too much detail in this post about the exact steps I took to get this site running. Instead, I will provide links to the resources that I found most useful in this project.

First, here's [the post](https://tkainrad.dev/posts/using-hugo-gitlab-pages-and-cloudflare-to-create-and-run-this-website/) that inspired me to create a personal website. The author opts to use Hugo as a static site generator & GitLab for CI/CD & hosting; he also uses CloudFlare to get a SSL cert and to redirect www subdomain traffic to the apex domain. 

GitLab's CI/CD tools sound more powerful than GitHub's. Hugo's theme mechanism uses sub-repositories. This seems more straightforward than Jekyll's approach to themes. However, if you're already signed up on GitHub & familiar with the GitHub Pages feature it may be quicker to use the well documented Jekyll integration to create & host a blog with a SSL cert. Here's a cool [post](https://www.troyhunt.com/heres-why-your-static-website-needs-https/) about why it's good for a static site to use SSL. Let's be honest though, when compared to HTTPS, HTTP just doesn't look as good on a developer's personal website. 

Second, here's [GitHub's documentation on the pages feature, using Jekyll with pages, and how to use a custom domain with your site](https://help.github.com/en/github/working-with-github-pages). In short:
- the pages feature turns a GitHub repository into a website, 
- Jekyll allows you to generate a themed static website from html & markdown files, 
- and you can direct traffic to your custom domain to the GitHub Pages site.

One mistake I made when creating my repository was naming it 'jdrbc', & not 'jdrbc.github.io'. GitHub uses the '[username].github.io' repository naming convention to distinguish between project sites and personal sites. The Jekyll themes supported by GitHub will adjust the content of your website slightly depending on if it is a project or personal site.

Third, here's the best [tutorial](https://jekyllrb.com/docs/step-by-step/01-setup/) I found on how to get running with Jekyll. GitHub mentions that Windows (my primary OS) is not officially supported by Jekyll, so I followed the tutorial in a [VirtualBox](https://www.virtualbox.org/) Ubuntu VM. My main takeaway from these tutorials is that if you find yourself doing something repetitive or copy-pasting code, then go back and read the docs. Likely there's a better way to use Jekyll to accomplish that task.

- two commands I used to test the site locally are `bundle exec jekyll build --watch` and `bundle exec jekyll serve`.
- neato theme I chose was [minimal](https://github.com/pages-themes/minimal)

Finally, to purchase my domain name & configure the DNS records I used [Rebel](https://www.rebel.com/). There are a ton of options out there, but Rebel has worked well in the past so why change things up?

Hopefully this information will stay relevant for 2 minutes & help you get your site working!
