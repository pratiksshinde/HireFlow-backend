const { extractTextFromResume } = require("../utils/extractPdfText");
const { extractStructuredResume } = require("../services/geminiResume");
const Resume = require("../models/resume/resumes");
const { ResumeSkill } = require("../models/resume/resume_skills");
const {
    ResumeExperience,
    ResumeEducation,
    ResumeProject,
    ResumeCertification,
    ResumeAchivement,
    User
} = require("../models");
const normalizeArray = require("../utils/normalizeArray");


const uploadResume = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const username = req.user.username;
    try {
        const { text, links } = await extractTextFromResume(req.file.buffer);
        console.log("extracted Links: ", links);
        const data = await extractStructuredResume(text);
        console.log("Extracted Resume Data: ", data);
       
       // Save to database
        const resume = await Resume.create({
            userId: req.user.id,
            fullname: data.basics.fullName,
            email: data.basics.email,
            phone: data.basics.phone,
            address: data.basics.location,
            summary: data.summary,
        });
        const resume_id = resume.id;
                
        const skillsToInsert = [];

        for (const skillGroup of data.skills || []) {
        const category = skillGroup.category;
        const skills = normalizeArray(skillGroup.items);

        for (const skill of skills) {
            skillsToInsert.push({
            resumeId: resume_id,
            category,
            skill,
            });
        }
        }

        if (skillsToInsert.length > 0) {
        await ResumeSkill.bulkCreate(skillsToInsert);
        }

        for (const exp of normalizeArray(data.experience)) {
            await ResumeExperience.create({
                resumeId: resume_id,
                jobTitle: exp.jobTitle,
                company: exp.company,
                location: exp.location,
                startDate: safeDate(exp.startDate),
                endDate: safeDate(exp.endDate),
                isCurrentlyWorking: exp.isCurrent,
                description: exp.description,
            })
        }
        for (const edu of normalizeArray(data.education)) {
            await ResumeEducation.create({
                resumeId: resume_id,
                institution: edu.institution,
                degree: edu.degree,
                fieldOfStudy: edu.fieldOfStudy,
                startDate: safeDate(edu.startDate),
                endDate: safeDate(edu.endDate),
                score: edu.score,
            })
        }
        for (const proj of normalizeArray(data.projects)) {
            await ResumeProject.create({
                resumeId: resume_id,
                projectName: proj.projectName,
                description: proj.description,
                link: proj.link,
            })
        }
        for (const cert of normalizeArray(data.certifications)) {
            await ResumeCertification.create({
                resumeId: resume_id,
                certificationName: cert.certificationName,
                issuingOrganization: cert.issuingOrganization,
                issueDate: cert.issueDate,
                link: cert.link,
            })
        }
        for (const arch of normalizeArray(data.achievements)) {
            await ResumeAchivement.create({
                resumeId: resume_id,
                achievement: arch.achievement,
                description: arch.description,
            })
        }

        return res.status(200).json({ message: "File uploaded successfully", username });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error processing file", error: error.message });
    }
}


 const safeDate = (value) => {
  if (!value) return null;

  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};


const getPortfolio = async (req, res) => {
    const {userName} = req.params; 
    if(!userName){
        console.log(userName);
        return res.status(404).json({ message: "UserName not found" } , userName);
    }
    const user = await User.findOne({ where: { username: userName } });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const userId = user.id;
    const isResume = await Resume.findOne({ where: { userId: userId } });

    if (!isResume) {
        return res.status(404).json({ message: "Resume not found" });
    }
    const resumeId = isResume.id;

    // Fetch related data
    const skills = await ResumeSkill.findAll({ where: { resumeId } });
    const experiences = await ResumeExperience.findAll({ where: { resumeId } });
    const educations = await ResumeEducation.findAll({ where: { resumeId } });
    const projects = await ResumeProject.findAll({ where: { resumeId } });
    const certifications = await ResumeCertification.findAll({ where: { resumeId } });
    const achievements = await ResumeAchivement.findAll({ where: { resumeId } });

    return res.status(200).json({
        userId,
        resume: isResume,
        skills,
        experiences,
        educations,
        projects,
        certifications,
        achievements
    });
}

module.exports = { uploadResume , getPortfolio};
