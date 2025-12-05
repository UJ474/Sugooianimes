const completedService = require("../services/completedService");

exports.getCompleted = async (req, res) => {
  try {
    const list = await completedService.getCompleted(req.user._id);
    res.json(list);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.addToCompleted = async (req, res) => {
  try {
    const updated = await completedService.addToCompleted(req.user._id, req.body);
    res.json({ message: "Added to completed", completed: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.removeFromCompleted = async (req, res) => {
  try {
    const updated = await completedService.removeFromCompleted(
      req.user._id,
      req.params.mal_id
    );
    res.json({ message: "Removed", completed: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};