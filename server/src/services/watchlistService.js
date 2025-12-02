const Weeb = require("../models/Weeb");

// GET WATCHLIST
exports.getWatchlist = async (userId) => {
  const weeb = await Weeb.findById(userId);

  if (!weeb) {
    const err = new Error("Please sign in to get your watchlist");
    err.status = 401;
    throw err;
  }

  return weeb.watchlist;
};

// ADD TO WATCHLIST
exports.addToWatchlist = async (userId, anime) => {
  const weeb = await Weeb.findById(userId);

  if (!weeb) {
    const err = new Error("Please sign in to add anime to your watchlist");
    err.status = 401;
    throw err;
  }

  const exists = weeb.watchlist.some((a) => a.mal_id === anime.mal_id);
  if (exists) {
    const err = new Error("Already in watchlist");
    err.status = 400;
    throw err;
  }

  weeb.watchlist.push(anime);
  await weeb.save();

  return weeb.watchlist;
};

// REMOVE
exports.removeFromWatchlist = async (userId, mal_id) => {
  const weeb = await Weeb.findById(userId);

  if (!weeb) {
    const err = new Error("Please sign in to before you remove an anime");
    err.status = 401;
    throw err;
  }

  weeb.watchlist = weeb.watchlist.filter((a) => a.mal_id != mal_id);

  await weeb.save();
  return weeb.watchlist;
};