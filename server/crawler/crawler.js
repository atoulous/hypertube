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

const search = async (searchTerm, limit) => {
	const [res1, res2, res3, res4] = await Promise.all([
		ThePirateBay.crawl(`/search/${searchTerm}/0/99/201`, 'movie', limit),
		ThePirateBay.crawl(`/search/${searchTerm}/0/99/205`, 'show', limit),
		Crawler1337x.crawl(`/category-search/${searchTerm}/Movies/1/`, 'movie', limit),
		Crawler1337x.crawl(`/category-search/${searchTerm}/TV/1/`, 'show', limit),
	])

	return [...res1, ...res2, ...res3, ...res4];
}

const startCrawling = () => {
  setInterval(crawl, config.default.crawlTimeout);
  crawl();
};


module.exports = {
  startCrawling, search
};
