const watchlistService = require("../services/watchlistService");

exports.getWatchlist = async (req, res) => {
  try {
    const list = await watchlistService.getWatchlist(req.user._id);
    res.json(list);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const updated = await watchlistService.addToWatchlist(req.user._id, req.body);
    res.json({ message: "Added to watchlist", watchlist: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const updated = await watchlistService.removeFromWatchlist(
      req.user._id,
      req.params.mal_id
    );
    res.json({ message: "Removed", watchlist: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};