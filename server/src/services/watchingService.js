const Weeb = require("../models/Weeb");
const cache = require("../utils/cache");

function ensureHistory(weeb) {
  if (!weeb.history || Array.isArray(weeb.history)) {
    weeb.history = { all: [], watching: [], completed: [] };
  }
}

exports.getWatching = async (userId) => {
  const cacheKey = `${userId}:watching`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const weeb = await Weeb.findById(userId).select("history.watching").lean();
  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }
  const list = weeb.history?.watching || [];
  cache.set(cacheKey, list);
  return list;
};

exports.addToWatching = async (userId, anime) => {
  const weeb = await Weeb.findById(userId);
  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  ensureHistory(weeb);

  const item = {
    mal_id: anime.mal_id,
    title: anime.title,
    imageUrl: anime.imageUrl,
    addedAt: new Date(),
  };

  weeb.history.completed = weeb.history.completed.filter(a => a.mal_id !== item.mal_id);
  weeb.watchlist = weeb.watchlist.filter(a => a.mal_id !== item.mal_id);
  weeb.history.watching = weeb.history.watching.filter(a => a.mal_id !== item.mal_id);
  weeb.history.watching.unshift(item);

  await weeb.save();

  // Invalidate affected caches
  cache.del(`${userId}:watching`);
  cache.del(`${userId}:completed`);
  cache.del(`${userId}:watchlist`);

  return weeb.history.watching;
};

exports.removeFromWatching = async (userId, mal_id) => {
  const weeb = await Weeb.findById(userId);
  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  ensureHistory(weeb);

  weeb.history.watching = weeb.history.watching.filter(a => a.mal_id != mal_id);
  await weeb.save();

  cache.del(`${userId}:watching`);
  return weeb.history.watching;
};
