import ThePirateBay from './ThePirateBay';
import Crawler1337x from './1337x';
import config from '../config';

const crawl = async () => {
  try {
    Promise.resolve([
      ThePirateBay.crawl('/top/201', 'movie', -1, 'movie'),
      ThePirateBay.crawl('/top/205', 'show', -1, 'tv'),
      Crawler1337x.crawl('/trending/w/tv/', 'show', -1, 'tv'),
      Crawler1337x.crawl('/trending/w/movies/', 'movie', -1, 'movie'),
    ]);
  } catch (err) {
    throw err;
  }
};

const searchAll = async (searchTerm, limit) => {
  try {
    const [res1, res2, res3, res4] = await Promise.all([
      ThePirateBay.crawl(`/search/${searchTerm}/0/99/201`, 'movie', limit, 'movie'),
      ThePirateBay.crawl(`/search/${searchTerm}/0/99/205`, 'show', limit, 'tv'),
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
      ThePirateBay.crawl(`/search/${searchTerm}/0/99/201`, 'movie', limit, 'movie'),
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
      ThePirateBay.crawl(`/search/${searchTerm}/0/99/205`, 'show', limit, 'tv'),
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
