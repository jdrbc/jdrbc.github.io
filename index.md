---
title: jdrbc
layout: default
---
# about me

I've worked at [Traction On Demand](https://tractionondemand.com/) since 2015 as a software developer & more recently as a development team lead on [Traction Rec](https://www.tractionrec.com/). What's cool from a development point of view about Salesforce?

- work with cutting edge technology 
  - [declarative development tools such as Salesforce Flows](https://trailhead.salesforce.com/en/content/learn/modules/business_process_automation/flow), 
  - [web components](https://developer.salesforce.com/docs/component-library/documentation/lwc), 
  - [development landscape that changes every 4-8 months](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_dev2gp.htm)
  - and [high volume services](https://developer.salesforce.com/blogs/engineering/2013/10/under-the-hood-how-the-salesforce-platform-handles-1-3-billion-transactions-per-day.html)
- a small but fun development community
  - [have fun reading humorous abridged release notes](https://www.reddit.com/r/salesforce/comments/d1qc3r/winter_20_release_notes_abridged_edition/)
  - [work with really bright people to solve tough problems on stack exchange](https://salesforce.stackexchange.com/)
  - [excellent learning resources](https://trailhead.salesforce.com/en/home)
- because the technology is cutting edge & the community is small, that means
  - some really strange & fun problems: [what happens if the system inserts padding characters into your image?](http://www.fishofprey.com/2017/04/steps-required-to-support-posting.html)
  - ample opportunity to make a big difference in the community by [blogging](https://andyinthecloud.com/about/), [working on open source projects](https://github.com/apex-enterprise-patterns/fflib-apex-common), or giving talks at the Salesforce conferences

Finally, there's something to be said about gaining a niche skill. I've really enjoyed working at Traction, partly because it is a fun company, and partly because all of the above is magnified within the context of a small company. There are a ton of unsolved problems up for grabs.

So Salesforce development is my bread & butter. My other professional interests are:

- learning & education systems
- [computer generated art](https://github.com/jdrbc/SimpleBackgrounds)
- [gaming & game development](https://github.com/jdrbc/gameoflife)
- [scripting boring tasks](https://github.com/jdrbc/comic-scraper)

<!-- ## posts -->
# posts
{% for post in site.posts %}
- [{{ post.title }}]({{ post.url }})
{% endfor %}
