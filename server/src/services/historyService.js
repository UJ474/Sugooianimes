const Weeb = require("../models/Weeb");

// --- Utility: Ensures history object exists ---
function ensureHistoryStructure(weeb) {
  if (!weeb.history || Array.isArray(weeb.history)) {
    weeb.history = {
      all: [],
      watching: [],
      completed: []
    };
  }
}

// --- GET ALL HISTORY ---
exports.getHistory = async (userId) => {
  const weeb = await Weeb.findById(userId);

  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  ensureHistoryStructure(weeb);

  return weeb.history.all; // return only ALL for now
};


// --- ADD TO HISTORY.ALL ---
exports.addToHistory = async (userId, anime) => {
  const weeb = await Weeb.findById(userId);

  if (!weeb) {
    const err = new Error("Please sign in to continue");
    err.status = 401;
    throw err;
  }

  // Make sure structure exists
  ensureHistoryStructure(weeb);

  // Normalize anime data for safety
  const item = {
    mal_id: anime.mal_id,
    title: anime.title,
    imageUrl: anime.imageUrl || anime.images?.jpg?.image_url || "",
    addedAt: new Date(),
  };

  // Remove duplicates
  weeb.history.all = weeb.history.all.filter(a => a.mal_id !== item.mal_id);

  // Add to TOP
  weeb.history.all.unshift(item);

  // Limit to 30
  if (weeb.history.all.length > 30) {
    weeb.history.all = weeb.history.all.slice(0, 30);
  }

  await weeb.save();

  return weeb.history.all;
};


// --- REMOVE FROM HISTORY ---
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