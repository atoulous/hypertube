'use strict'

const ThePirateBay = require('./ThePirateBay'),
	Crawler1337x = require('./1337x'),
	config = require('../config')

const crawl = async () => {
	try {
		Promise.resolve([
			ThePirateBay.crawl(201, 'movie'),
			ThePirateBay.crawl(205, 'show'),
			Crawler1337x.crawl('/trending/w/tv/', 'show'),
			Crawler1337x.crawl('/trending/w/movies/', 'movie')
		])
	} catch(e) {
		console.log(e)
	}
}

const startCrawling = () => {
	setInterval(crawl, config.default.crawlTimeout)
	crawl()
}

module.exports = {
	startCrawling
}
