const watchlistService = require("../services/watchlistService");

// GET WATCHLIST
exports.getWatchlist = async (req, res) => {
  try {
    const data = await watchlistService.getWatchlist(req.user._id);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// ADD TO WATCHLIST
exports.addToWatchlist = async (req, res) => {
  try {
    const list = await watchlistService.addToWatchlist(req.user._id, req.body);
    res.json({ message: "Added to watchlist", watchlist: list });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// REMOVE FROM WATCHLIST
exports.removeFromWatchlist = async (req, res) => {
  try {
    const list = await watchlistService.removeFromWatchlist(
      req.user._id,
      req.params.mal_id
    );
    res.json({ message: "Removed", watchlist: list });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};