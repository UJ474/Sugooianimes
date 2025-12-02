const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema({
  mal_id: { type: Number, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

const weebSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  watchlist:  [animeSchema],

  history: {
    all: [animeSchema],
    watching: [animeSchema],
    completed: [animeSchema],
  },

}, { timestamps: true });

module.exports = mongoose.model("Weeb", weebSchema);