'use strict'

const ThePirateBay = require('./ThePirateBay'),
	config = require('../config')

const crawl = () => {
	console.log('Started the crawling process')
	ThePirateBay.crawl().catch((err) => {
		console.log(err)
	})
}

const startCrawling = () => {
	setInterval(crawl, config.default.crawlTimeout)
	crawl()
}

module.exports = {
	startCrawling
}
