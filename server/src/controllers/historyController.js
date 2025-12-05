const historyService = require("../services/historyService");

exports.getHistory = async (req, res) => {
  try {
    const data = await historyService.getHistory(req.user._id);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.addToHistory = async (req, res) => {
  try {
    const updated = await historyService.addToHistory(req.user._id, req.body);
    res.json({ message: "Added to history", history: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.removeFromHistory = async (req, res) => {
  try {
    const updated = await historyService.removeFromHistory(
      req.user._id,
      req.params.mal_id
    );
    res.json({ message: "Removed", history: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    const updated = await historyService.clearHistory(req.user._id);
    res.json({ message: "History cleared", history: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};