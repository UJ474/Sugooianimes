const Weeb = require("../models/Weeb");

function ensureHistoryStructure(weeb) {
  if (!weeb.history || Array.isArray(weeb.history)) {
    weeb.history = {
      all: [],
      watching: [],
      completed: []
    };
  }
}

exports.getHistory = async (userId) => {
  const weeb = await Weeb.findById(userId);

  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  ensureHistoryStructure(weeb);

  return weeb.history.all;
};


exports.addToHistory = async (userId, anime) => {
  const weeb = await Weeb.findById(userId);

  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  ensureHistoryStructure(weeb);

  const item = {
    mal_id: anime.mal_id,
    title: anime.title,
    imageUrl: anime.imageUrl || anime.images?.jpg?.image_url || "",
    addedAt: new Date(),
  };

  weeb.history.all = weeb.history.all.filter(a => a.mal_id !== item.mal_id);

  weeb.history.all.unshift(item);

  if (weeb.history.all.length > 30) {
    weeb.history.all = weeb.history.all.slice(0, 30);
  }

  await weeb.save();

  return weeb.history.all;
};


exports.removeFromHistory = async (userId, mal_id) => {
  const weeb = await Weeb.findById(userId);

  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  ensureHistoryStructure(weeb);

  weeb.history.all = weeb.history.all.filter(a => a.mal_id != mal_id);

  await weeb.save();

  return weeb.history.all;
};



exports.clearHistory = async (userId) => {
  const weeb = await Weeb.findById(userId);

  if (!weeb) {
    const error = new Error("Please sign in to continue");
    error.status = 401;
    throw error;
  }

  ensureHistoryStructure(weeb);

  weeb.history.all = [];

  await weeb.save();

  return weeb.history.all;
};