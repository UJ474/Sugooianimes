const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");

const watchlistCtrl = require("../controllers/watchlistController");
const historyCtrl = require("../controllers/historyController");
const completedCtrl = require("../controllers/completedController");

// WATCHLIST
router.get("/watchlist", verifyToken, watchlistCtrl.getWatchlist);
router.post("/watchlist", verifyToken, watchlistCtrl.addToWatchlist);
router.delete("/watchlist/:mal_id", verifyToken, watchlistCtrl.removeFromWatchlist);

// HISTORY
router.get("/history", verifyToken, historyCtrl.getHistory);
router.post("/history", verifyToken, historyCtrl.addToHistory);
router.delete("/history/:mal_id", verifyToken, historyCtrl.removeFromHistory);
router.delete("/history", verifyToken, historyCtrl.clearHistory);

// COMPLETED
router.get("/completed", verifyToken, completedCtrl.getCompleted);
router.post("/completed", verifyToken, completedCtrl.addToCompleted);
router.delete("/completed/:mal_id", verifyToken, completedCtrl.removeFromCompleted);

module.exports = router;