const routes = require("express").Router();
const {uploadResume, getPortfolio} = require("../controllers/resumeController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { deleteSingleSkill , addSkill , delelteExperience ,deleteEducation, deleteProject, addProject, addEducation, addCertification, deleteCertification, addArchivement, deleteArchivement} = require("../controllers/editResumeController");
const upload = require("../middleware/upload.middleware");


routes.post("/uploadResume", authMiddleware, upload.single("resume"), uploadResume);

routes.get("/getPortfolio/:userName",  getPortfolio);

//edit resume routes
routes.delete("/editResume/deleteskill/:skillId", authMiddleware, require("../controllers/editResumeController").deleteSingleSkill);
routes.post("/editResume/addskill", authMiddleware, require("../controllers/editResumeController").addSkill);

routes.delete("/editResume/deleteExperience/:experienceId", authMiddleware, require("../controllers/editResumeController").delelteExperience);

routes.delete("/editResume/deleteEducation/:educationId", authMiddleware, require("../controllers/editResumeController").deleteEducation);
routes.post("/editResume/addEducation",authMiddleware, addEducation);

routes.delete("/editResume/deleteProject/:projectId", authMiddleware, deleteProject);
routes.post("/editResume/addProject", authMiddleware, addProject);

routes.post("/editResume/addCertification", authMiddleware, addCertification);
routes.delete("/editResume/deleteCertification/:certificationId" , authMiddleware, deleteCertification);

routes.post("/editResume/addArchivement", authMiddleware, addArchivement);
routes.delete("/editResume/deleteArchivement/:archivementId", authMiddleware, deleteArchivement);

module.exports = routes;
