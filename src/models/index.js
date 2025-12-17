const { ResumeAchivement } = require("./resume/resume_acivements");
const { ResumeCertification } = require("./resume/resume_certifications");
const { ResumeEducation } = require("./resume/resume_education");
const { ResumeExperience } = require("./resume/resume_experience");
const { ResumeLink } = require("./resume/resume_links");
const { ResumeProject } = require("./resume/resume_project");
const { ResumeSkill } = require("./resume/resume_skills");
const  Resume  = require("./resume/resumes");
const { User } = require("./user");


const Models ={
    User,
    Resume,
    ResumeAchivement,
    ResumeCertification,
    ResumeEducation,
    ResumeExperience,
    ResumeLink,
    ResumeProject,
    ResumeSkill,
};

Object.values(Models).forEach(model => {
  if (model.associate) {
    model.associate(Models);
  }
});

module.exports = Models;