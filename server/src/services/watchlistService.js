const Weeb = require("../models/Weeb");
const cache = require("../utils/cache");

exports.getWatchlist = async (userId) => {
  const cacheKey = `${userId}:watchlist`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const weeb = await Weeb.findById(userId).select("watchlist").lean();
  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  const list = weeb.watchlist || [];
  cache.set(cacheKey, list);
  return list;
};

exports.addToWatchlist = async (userId, anime) => {
  const weeb = await Weeb.findById(userId);
  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  const item = {
    mal_id: anime.mal_id,
    title: anime.title,
    imageUrl: anime.imageUrl,
    addedAt: new Date()
  };

  weeb.watchlist = weeb.watchlist.filter(a => a.mal_id !== item.mal_id);
  weeb.watchlist.unshift(item);

  await weeb.save();
  cache.set(`${userId}:watchlist`, weeb.watchlist);
  return weeb.watchlist;
};

exports.removeFromWatchlist = async (userId, mal_id) => {
  const weeb = await Weeb.findById(userId);
  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  weeb.watchlist = weeb.watchlist.filter(a => a.mal_id != mal_id);

  await weeb.save();
  cache.set(`${userId}:watchlist`, weeb.watchlist);
  return weeb.watchlist;
};
