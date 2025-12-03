const Weeb = require("../models/Weeb");

// Ensure history object exists
function ensureHistory(weeb) {
  if (!weeb.history || Array.isArray(weeb.history)) {
    weeb.history = { all: [], watching: [], completed: [] };
  }
}

// GET WATCHING
exports.getWatching = async (userId) => {
  const weeb = await Weeb.findById(userId);
  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }
  ensureHistory(weeb);
  return weeb.history.watching;
};

// ADD TO WATCHING
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

  // Remove from history.completed
  weeb.history.completed = weeb.history.completed.filter(a => a.mal_id !== item.mal_id);

  // Remove from watchlist
  weeb.watchlist = weeb.watchlist.filter(a => a.mal_id !== item.mal_id);

  // Remove duplicates in watching
  weeb.history.watching = weeb.history.watching.filter(a => a.mal_id !== item.mal_id);

  // Add to watching
  weeb.history.watching.unshift(item);

  await weeb.save();
  return weeb.history.watching;
};

// REMOVE FROM WATCHING
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
  return weeb.history.watching;
};