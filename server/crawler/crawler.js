'use strict'

const ThePirateBay = require('./ThePirateBay'),
	config = require('../config')

const crawl = async () => {
	try {
		Promise.resolve([
			ThePirateBay.crawl(201, 'movie'),
			ThePirateBay.crawl(205, 'show')
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
