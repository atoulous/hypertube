const ThePirateBay = require('./ThePirateBay'),
  Crawler1337x = require('./1337x'),
  config = require('../config');

const crawl = async () => {
  try {
    Promise.resolve([
      ThePirateBay.crawl('/top/201',			'movie', 	-1, 'movie'),
      ThePirateBay.crawl('/top/205',			'show',		-1, 'tv'),
      Crawler1337x.crawl('/trending/w/tv/', 	'show', 	-1, 'tv'),
      Crawler1337x.crawl('/trending/w/movies/', 'movie', 	-1, 'movie')
    ]);
  } catch (e) {
    console.log(e);
  }
};

const search = async (searchTerm) => {
	const results = await Promise.all([
		ThePirateBay.crawl(`/search/${searchTerm}/1/99/201`, 			'movie', 	2, 'movie'),
		ThePirateBay.crawl(`/search/${searchTerm}/1/99/205`, 			'show', 	2, 'tv'),
		Crawler1337x.crawl(`/sort-category-search/${searchTerm}/Movies/seeders/desc/1/`, 	'movie', 	2, 'movie'),
		Crawler1337x.crawl(`/sort-category-search/${searchTerm}/TV/seeders/desc/1/`, 		'show', 	2, 'tv')
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
