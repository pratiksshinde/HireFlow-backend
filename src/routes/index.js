const router = require("express").Router();

router.use("/auth", require("./authRoutes"));
router.use("/resume", require("./resumeRoutes"));
router.use("/jobs", require('./jobRoutes'));

module.exports = router;
