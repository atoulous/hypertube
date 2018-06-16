const ThePirateBay = require('./ThePirateBay'),
  Crawler1337x = require('./1337x'),
  config = require('../config');

const crawl = async () => {
  try {
    Promise.resolve([
      ThePirateBay.crawl(201, '/top/201'),
      ThePirateBay.crawl(205, '/top/205'),
      Crawler1337x.crawl('/trending/w/tv/', 'show'),
      Crawler1337x.crawl('/trending/w/movies/', 'movie'),
    ]);
  } catch (e) {
    console.log(e);
  }
};

const search = async (searchTerm) => {
	const results = await Promise.all([
		ThePirateBay.crawl(`/search/${searchTerm}/0/99/201`, 'movie', 2),
		ThePirateBay.crawl(`/search/${searchTerm}/0/99/205`, 'show', 2),
		Crawler1337x.crawl(`/category-search/${searchTerm}/Movies/1/`, 'movie', 2),
		Crawler1337x.crawl(`/category-search/${searchTerm}/TV/1/`, 'movie', 2)
	])

	return results
}

const startCrawling = () => {
  setInterval(crawl, config.default.crawlTimeout);
  crawl();
};


module.exports = {
  startCrawling, search
};
