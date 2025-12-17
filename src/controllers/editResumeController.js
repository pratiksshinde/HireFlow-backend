const { ResumeSkill, User, Resume, ResumeExperience, ResumeProject, ResumeEducation, ResumeCertification, ResumeAchivement } = require("../models");

const deleteSingleSkill = async (req, res) => {
    try {
        const { skillId } = req.params;
        const userId = req.user.id;
        const userdata = await Resume.findOne({where : {userId}});
        if (!userdata) {
            return res.status(404).json({ message: "Resume not found" });
        }
        const resumeId = userdata.id;
        const skill = await ResumeSkill.findOne({ where: { id: skillId, resumeId } });
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        await skill.destroy();
        return res.status(200).json({ message: "Skill deleted successfully" }); 
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const addSkill = async (req, res) => {
    try {
        const { skills, category, proficiency } = req.body;
        const userId = req.user.id;
        const userdata = await Resume.findOne({where : {userId}});
        if (!userdata) {
            return res.status(404).json({ message: "Resume not found" });
        }
        if (skills.length !== proficiency.length){
            return res.status(400).json({message: "Length of Category & Proficiency not aligned"});
        }
        const resumeId = userdata.id;
        const createdSkills = [];
        for (let i=0; i<skills.length; i++){
            const newSkill = await ResumeSkill.create({
            resumeId,
            category,
            skill: skills[i],
            proficiency: proficiency[i]
        })
        createdSkills.push(newSkill);
        }
        
        return res.status(201).json({ message: "Skill added successfully", skill: createdSkills });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const delelteExperience = async (req, res) => {
    try {
        const { experienceId } = req.params;
        const userId = req.user.id;
        const userdata = await Resume.findOne({where : {userId}});
        if (!userdata) {
            return res.status(404).json({ message: "Resume not found" });
        }
        const resumeId = userdata.id;
        const experience = await ResumeExperience.findOne({ where: { id: experienceId, resumeId } });
        if (!experience) {
            return res.status(404).json({ message: "Experience not found" });
        }

        await experience.destroy();
        return res.status(200).json({ message: "Experience deleted successfully" });    
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}   

const addExperience = async (req, res) => {
    try {
        const { jobTitle, company, location, startDate,endDate, isCurrentlyWorking, description } = req.body;
        const userId = req.user.id;
        const userdata = await Resume.findOne({where : {userId}});
        if (!userdata) {
            return res.status(404).json({ message: "Resume not found" });
        }
        const resumeId = userdata.id;

        const newExperience = await ResumeExperience.create({
            resumeId,
            jobTitle,
            company,
            location,
            startDate,
            endDate,
            isCurrentlyWorking,
            description
        })
        return res.status(201).json({ message: "Experience added successfully", experience: newExperience });   
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }   
}

const deleteProject = async (req, res) => {
    try{
        const { projectId } = req.params;
        const userId = req.user.id;
        const userdata = await Resume.findOne({where : {userId}});
        if (!userdata) {
            return res.status(404).json({ message: "Resume not found" });
        }
        const resumeId = userdata.id;
        const project = await ResumeProject.findOne({ where: { id: projectId, resumeId } });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await project.destroy();
        return res.status(200).json({ message: "Project deleted successfully" });    
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }   
}

const addProject = async (req, res) => {
    try {
        const { projectName, description , link } = req.body;
        const userId = req.user.id;
        const resumeData = await Resume.findOne({where : {userId}});
        if (!resumeData) {
            return res.status(404).json({ message: "Resume not found" });
        }
        const resumeId = resumeData.id;

        const newProject = await ResumeProject.create({
            resumeId,
            projectName,
            description,
            link
        })
        return res.status(201).json({ message: "Project added successfully", project: newProject });   
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });     
        }
    }

const deleteEducation = async (req, res) => {
    try {
        const { educationId } = req.params;
        const userId = req.user.id;
        const resumeData = await Resume.findOne({where : {userId}});
        if (!resumeData) {
            return res.status(404).json({ message: "Resume not found" });
        }
        const resumeId = resumeData.id;
        const education = await ResumeEducation.findOne({ where: { id: educationId, resumeId } });
        if (!education) {
            return res.status(404).json({ message: "Education not found" });
        }

        await education.destroy();
        return res.status(200).json({ message: "Education deleted successfully" });     
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const addEducation = async (req, res) =>{
    try {
        const {institutionName,degree,course,score,startDate,endDate,description } = req.body;
        if (!(institutionName,degree,course,score,startDate,endDate,description)){
            return res.status(400).json({message : "Missing input data!!!"});
        }
        const userId = req.user.body;
        const resumeData = await Resume.findOne({where: userId});
        if(!resumeData){
            return res.status(404).json({message: "Resume Not Found!!!"});
        }
        const resumeId = resumeData.id;
        const newEducation = await ResumeEducation.create({
            resumeId,
            institution : institutionName,
            degree,
            fieldOfStudy:course,
            startDate,
            endDate,
            score,
            description
        })
        return res.status(200).json({message: "Education Added Successfully."});

    } catch (error) {
        return res.status(500).json({error});
    }
}

const addCertification = async (req,res) =>{
    try {
        const userId = req.user.id;
        const {certificationName,issuingOrganization,issueDate} = req.body; 
        console.log("data : ", certificationName,issuingOrganization,issueDate);
        const resumeData = await Resume.findOne({where:userId});
        if(!resumeData){
            return res.status(404).json({message: "Resume NOT found"});
        }
        const resumeId = resumeData.id;
        await ResumeCertification.create({
            resumeId,
            certificationName,
            issuingOrganization,
            issueDate
        })
        return res.status(200).json({message:"Certification Added."});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
const deleteCertification = async (req, res) => {
  try {
    const { certificationId } = req.params;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const resumeData = await Resume.findOne({
      where: { userId } 
    });

    if (!resumeData) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resumeId = resumeData.id;

    const certification = await ResumeCertification.findOne({
      where: { id: certificationId, resumeId } 
    });

    if (!certification) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    await ResumeCertification.destroy({
      where: { id: certificationId, resumeId }
    });

    return res.status(200).json({
      success: true,
      message: "Certification deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const addArchivement = async (req,res) => {
    try {
        const {achivement,description} = req.body;
        const userId = req.user.id;
        if(!userId){
            return req.status(401).json({message:"Not Athenticated!!!"});
        }
        const resumeData = await Resume.findOne({where : {userId}});
        if(!resumeData){
            return req.status(404).json({message:"Resume Not Found!!!"});
        }
        const resumeId = resumeData.id;
        const newArchivement = await ResumeAchivement.create({
            resumeId,
            achivement,
            description
        })
        return res.status(200).json({message:"Archivement Added"});
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

const deleteArchivement = async (req,res) => {
    try {
        const {archivementId} = req.params;
        const userId = req.user.id;
         if(!userId){
            return req.status(401).json({message:"Not Athenticated!!!"});
        }
        const resumeData = await Resume.findOne({where : {userId}});
        if(!resumeData){
            return req.status(404).json({message:"Resume Not Found!!!"});
        }
        const resumeId = resumeData.id;
        await ResumeAchivement.destroy({where:{id:archivementId, resumeId}});
        return res.status(200).json({message:"Archivement Deleted"});
    } catch (error) {
          return res.status(500).json({ message: "Server error" });
    }
}


module.exports = { deleteSingleSkill, addSkill , delelteExperience , addExperience , deleteProject , addProject, deleteEducation, addEducation , addCertification, deleteCertification , addArchivement, deleteArchivement};