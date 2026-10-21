const Weeb = require("../models/Weeb");
const cache = require("../utils/cache");

function ensureHistory(weeb) {
  if (!weeb.history || Array.isArray(weeb.history)) {
    weeb.history = { all: [], watching: [], completed: [] };
  }
}

exports.getCompleted = async (userId) => {
  const cacheKey = `${userId}:completed`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const weeb = await Weeb.findById(userId).select("history.completed").lean();
  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }
  const list = weeb.history?.completed || [];
  cache.set(cacheKey, list);
  return list;
};

exports.addToCompleted = async (userId, anime) => {
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

  weeb.history.watching = weeb.history.watching.filter(a => a.mal_id !== item.mal_id);
  weeb.watchlist = weeb.watchlist.filter(a => a.mal_id !== item.mal_id);
  weeb.history.completed = weeb.history.completed.filter(a => a.mal_id !== item.mal_id);
  weeb.history.completed.unshift(item);

  await weeb.save();

  // Invalidate affected caches
  cache.del(`${userId}:completed`);
  cache.del(`${userId}:watching`);
  cache.del(`${userId}:watchlist`);

  return weeb.history.completed;
};

exports.removeFromCompleted = async (userId, mal_id) => {
  const weeb = await Weeb.findById(userId);
  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  ensureHistory(weeb);

  weeb.history.completed = weeb.history.completed.filter(a => a.mal_id != mal_id);
  await weeb.save();

  cache.del(`${userId}:completed`);
  return weeb.history.completed;
};
