---
layout: post
title: 'Comic Book Scraper'
tags: python
---

I read some of [Automate The Boring Stuff With Python](https://automatetheboringstuff.com/) in January. The core ideas in this book resonate with me. During university I considered software mostly on the macro scale, i.e. viewed it as a grand tool to 'change the world'. I spent more cycles thinking about Microsoft, Bitcoin, and Linux than my school's course sign up system or mail system. Software's ability to solve problems at a large scale is interesting, but it is also interesting to consider how software can solve problems at a smaller scale. Solving small problems is the focus of Automate The Boring Stuff.

For example, in the introduction of the book the author relates an experience of his roommate. His roommate was working for a retail electronics store. The roommate encountered a price-comparison task that usually took 3 people 2 days to complete. He wrote a program in a couple of hours that completed the task instantly. Wow!

I was inspired by this, and I was particularly inspired by the chapter on web scraping. Unfortunately, I don't have a boring task that can be solved with web scraping. The closest thing I could come up with is that *sometimes* I like to go through old webcomic archives & when I do that the UI can be a little finicky.

And so the totally-unnessary [comic scraping](https://github.com/jdrbc/comic-scraper) project was born!

First I looked at a few existing comic scraping projects:

- There's the dubiously named [cum](https://github.com/Hamuko/cum)
    - python
    - stateful
    - 6 supported sites (all manga sites - surprise surprise)
- There's [comic scraper](https://github.com/AbstractGeek/comic-scraper)
    - python
    - pdf / cbz out
    - not stateful
    - 2 supported sites
- ...and about 140 more, half of which are in Python. This is a very popular project.

I had a few individual sites in mind that I wanted to scrape (most of the ones in xkcd's 'recommended' list). So I wanted my scraper to be agnostic about which site it would target.

I also wanted the scraper to be able to pick up where it left off.

## how the scraper works

The base scraper class contains the logic for:

- restoring comic data from storage
- crawling through comic pages & storing metadata about each page
- figuring out when to stop crawling
- downloading all of the images
- persisting comic data

The scraper is extended for each targeted comic. The extending class defines:

- The comic URL
- how to find the link to next page from a given comic page
- how to find the image URL from a comic page
- how to find the comic page name from the URL
- how to get the first page URL, or guess at a given page URL
- determining if a given page is the last page in the comic

Initially, I had this logging config in my base class so that I didn't have to copy it into each extending class.

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    os.makedirs('log', exist_ok=True)
    fh = logging.FileHandler(f'log/{self.get_base_url()}.log')
    fh.setFormatter(formatter)
    fh.setLevel(logging.DEBUG)
    logger.addHandler(fh)

    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(formatter)
    logger.addHandler(ch)

This isn't a good practice because it doesn't allow dependent modules to configuring logging for this module. The best practice is to create a logger under the module namespace with a null handler, and do to this AFTER the module has been imported. This allows the dependent module maximum flexiblity when configuring logging.

	def __init__(self):
		self.logger = logging.getLogger(__name__)
		self.logger.addHandler(logging.NullHandler())

Then the dependent modules can define logging as they like!

    if __name__ == '__main__':
        scraper = XkcdScraper()
        fileConfig('log_config.ini', defaults={'logfilename': 'log/xckd.log'})
        scraper.scrape(1,20)

Crawling was preformed using BeautifulSoup & requests. Not much to say here. Navigating the DOM with BeautifulSoup was easy, and requests is ideally suited to a project like this.

Determining the URL of the next page could be a bit of a challenge. Each site had it's little quirks. You can see here that [pbfcomics.com](pbfcomics.com) decided to link out to Exposm instead of the next comic in the site at one point.

	def guess_urls_from_page_number(self, page_number):
		""" return list of possible urls for the given page number, each will be tried e.g. ['xkcd.com/2249'] """
		if page_number == 1:
			return [self.get_base_url() + '/comics/stiff-breeze']
		elif page_number == 7:
			# number six links to exposm
			return ['https://pbfcomics.com/comics/instant-bacon-2/']
		else:
			return []

After the initial slow crawl of the site, the actual download can be quite speedy because all of the image URLs are known, and so the work can be split among many threads. I haven't experimented much with the number of threads. The basic flow here is to chunk up the image URLs roughly among the threads & kick them off. This isn't the most efficient way to divvy up the work. For example, if there are 20 pages to download then you get 20 threads. But if there are 21 pages to download you get 10 threads! I guess maybe a better approach would be to create 20 lists & add pages to them round-robin style.

    from itertools import zip_longest

    def grouper(n, iterable, padvalue=None):
        "grouper(3, 'abcdefg', 'x') --> ('a','b','c'), ('d','e','f'), ('g','x','x')"
        return zip_longest(*[iter(iterable)]*n, fillvalue=padvalue)

    threads = []
    max_elements_per_chunk = math.ceil(len(all_page_numbers) / self.num_threads)
    self.logger.info(f'max elements per threads {max_elements_per_chunk} pages')
    chunks = grouper(max_elements_per_chunk, all_page_numbers)
    for chunk in chunks:
        thread = threading.Thread(target=self._download_images, args=(chunk, comic))
        threads.append(thread)

Saving the state of the scraper is too easy. The Shelve module is a like a permanent python dictionary - very handy!.
    
    self.db = shelve.open(__name__)

    # ...

    if comic is None:
        self.logger.debug('attempting to recover comic info from shelve')
        comic = self.db.get(self.get_base_url())

    # ...

    self.db[self.get_base_url()] = comic
