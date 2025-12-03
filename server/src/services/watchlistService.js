const Weeb = require("../models/Weeb");

// GET WATCHLIST
exports.getWatchlist = async (userId) => {
  const weeb = await Weeb.findById(userId);
  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }
  return weeb.watchlist;
};

// ADD TO WATCHLIST
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

  // Remove duplicates
  weeb.watchlist = weeb.watchlist.filter(a => a.mal_id !== item.mal_id);

  // Add to top
  weeb.watchlist.unshift(item);

  await weeb.save();
  return weeb.watchlist;
};

// REMOVE FROM WATCHLIST
exports.removeFromWatchlist = async (userId, mal_id) => {
  const weeb = await Weeb.findById(userId);
  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  weeb.watchlist = weeb.watchlist.filter(a => a.mal_id != mal_id);

  await weeb.save();
  return weeb.watchlist;
};