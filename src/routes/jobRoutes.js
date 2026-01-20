const { authMiddleware } = require("../middleware/authMiddleware");
const { getJobs, createApplication, getApplications, deleteApplication } = require("../controllers/jobsController");
const { JobMail } = require("../controllers/getEmailController");
const { route } = require("./authRoutes");
const router = require("express").Router();


router.get("/suggestedJobs/list/:page", authMiddleware,getJobs);
router.post("/coldMail", authMiddleware, JobMail);

router.post("/createApplication", authMiddleware, createApplication);
router.get("/getApplications", authMiddleware, getApplications);
router.delete("/deleteApplication/:applicationId", authMiddleware, deleteApplication);
module.exports = router;