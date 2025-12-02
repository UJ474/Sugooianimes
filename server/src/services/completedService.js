const Weeb = require("../models/Weeb");

// GET COMPLETED LIST
exports.getCompleted = async (userId) => {
  const weeb = await Weeb.findById(userId);

  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  return weeb.completed;
};

// ADD TO COMPLETED
exports.addToCompleted = async (userId, anime) => {
  const weeb = await Weeb.findById(userId);

  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  // Check if already in completed
  const alreadyExists = weeb.completed.some(a => a.mal_id === anime.mal_id);
  if (alreadyExists) {
    const err = new Error("Already in completed list");
    err.status = 400;
    throw err;
  }

  // Add to completed
  weeb.completed.push({
    mal_id: anime.mal_id,
    title: anime.title,
    imageUrl: anime.imageUrl
  });

  // Remove from watchlist if it exists there
  weeb.watchlist = weeb.watchlist.filter(a => a.mal_id !== anime.mal_id);

  await weeb.save();
  return weeb.completed;
};

// REMOVE FROM COMPLETED
exports.removeFromCompleted = async (userId, mal_id) => {
  const weeb = await Weeb.findById(userId);

  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  weeb.completed = weeb.completed.filter(a => a.mal_id != mal_id);

  await weeb.save();
  return weeb.completed;
};