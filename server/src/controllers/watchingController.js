const watchingService = require("../services/watchingService");

// GET WATCHING
exports.getWatching = async (req, res) => {
  try {
    const list = await watchingService.getWatching(req.user._id);
    res.json(list);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// ADD TO WATCHING
exports.addToWatching = async (req, res) => {
  try {
    const updated = await watchingService.addToWatching(req.user._id, req.body);
    res.json({ message: "Added to watching", watching: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// REMOVE FROM WATCHING
exports.removeFromWatching = async (req, res) => {
  try {
    const updated = await watchingService.removeFromWatching(
      req.user._id,
      req.params.mal_id
    );
    res.json({ message: "Removed", watching: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};