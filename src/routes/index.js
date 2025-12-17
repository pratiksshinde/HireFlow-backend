const router = require("express").Router();

router.use("/auth", require("./authRoutes"));
router.use("/resume", require("./resumeRoutes"));

module.exports = router;
