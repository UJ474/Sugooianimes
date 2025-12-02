const completedService = require("../services/completedService");

// GET COMPLETED LIST
exports.getCompleted = async (req, res) => {
  try {
    const data = await completedService.getCompleted(req.user._id);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// ADD TO COMPLETED
exports.addToCompleted = async (req, res) => {
  try {
    const completed = await completedService.addToCompleted(req.user._id, req.body);
    res.json({ message: "Added to completed", completed });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// REMOVE FROM COMPLETED
exports.removeFromCompleted = async (req, res) => {
  try {
    const completed = await completedService.removeFromCompleted(
      req.user._id,
      req.params.mal_id
    );
    res.json({ message: "Removed from completed", completed });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};