import ThePirateBay from './ThePirateBay';
import Crawler1337x from './1337x';
import config from '../config';
import Media from '../models/Media';
import fs from 'fs';
import rimraf from 'rimraf';

const crawl = async () => {
  try {
    await Promise.resolve([
      ThePirateBay.crawl('/top/201', 'movie', -1, 'movie'),
      ThePirateBay.crawl('/top/205', 'show', -1, 'tv'),
      Crawler1337x.crawl('/trending/w/tv/', 'show', -1, 'tv'),
      Crawler1337x.crawl('/trending/w/movies/', 'movie', -1, 'movie'),
    ]);

	const medias = await Media.find({})
	medias.forEach(async (media) => {
		const mediaTimestamp = Date.parse(media.lastSeen) / 1000
		const mediaTimestampExpiry = mediaTimestamp + (60 * 60 * 24 * 30) // + 30 days
		const currentTimestamp = new Date() / 1000

		if (media.status !== 'listed' && mediaTimestampExpiry <= currentTimestamp) {
			console.log('media', media._id, 'is due for deletion.')
			const folderToRemove = __dirname + '/../controllers/streams/' + media._id
			media.status = 'listed'
			rimraf.sync(folderToRemove)
			await media.save()
		}
	})
  } catch (err) {
    throw err;
  }
};

const searchAll = async (searchTerm, limit) => {
  try {
    const [res1, res2, res3, res4] = await Promise.all([
      ThePirateBay.crawl(`/search/${searchTerm}/0/7/201`, 'movie', limit, 'movie'),
      ThePirateBay.crawl(`/search/${searchTerm}/0/7/205`, 'show', limit, 'tv'),
      Crawler1337x.crawl(`/category-search/${searchTerm}/Movies/1/`, 'movie', limit, 'movie'),
      Crawler1337x.crawl(`/category-search/${searchTerm}/TV/1/`, 'show', limit, 'tv'),
    ]);

    return [...res1, ...res2, ...res3, ...res4];
  } catch (err) {
    throw err;
  }
};

const searchMovie = async (searchTerm, limit) => {
  try {
    const [resPirateBay, res1337x] = await Promise.all([
      ThePirateBay.crawl(`/search/${searchTerm}/0/7/201`, 'movie', limit, 'movie'),
      Crawler1337x.crawl(`/category-search/${searchTerm}/Movies/1/`, 'movie', limit, 'movie'),
    ]);

    return [...resPirateBay, ...res1337x];
  } catch (err) {
    throw err;
  }
};

const searchShow = async (searchTerm, limit) => {
  try {
    const [resPirateBay, res1337x] = await Promise.all([
      ThePirateBay.crawl(`/search/${searchTerm}/0/7/205`, 'show', limit, 'tv'),
      Crawler1337x.crawl(`/category-search/${searchTerm}/TV/1/`, 'show', limit, 'tv'),
    ]);

    return [...resPirateBay, ...res1337x];
  } catch (err) {
    throw err;
  }
};

const startCrawling = () => {
  setInterval(crawl, config.crawlTimeout);
  crawl();
};

export default {
  startCrawling, searchAll, searchMovie, searchShow,
};
