'use strict'

const ThePirateBay = require('./ThePirateBay'),
	config = require('../config')

const crawl = () => {
	try {
		console.log('Started the crawling process')
		ThePirateBay.crawl(201, 'movie')
			.then(ThePirateBay.crawl(205, 'show'))
			.catch((err) => {
				console.log(err)
			})
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
