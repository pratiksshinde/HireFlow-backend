const axios = require("axios");
const { Resume , Applications} = require("../models");

const getJobs = async (req, res) => {
  try {
    const userId = req.user?.id;
    const page = Number(req.params.page) || 1;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (page < 1) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    // OPTIONAL: fetch skills later
    // const resumeData = await Resume.findOne({ where: { userId } });
    // const skills = resumeData?.skills || [];

   const response = await axios.get(
  `https://api.adzuna.com/v1/api/jobs/in/search/${page}`,
  {
    params: {
      app_id: process.env.APP_ID,
      app_key: process.env.APP_KEY,
      what: "developer",
      results_per_page: 10
    },
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0"
     }
     }
    );


    const jobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || "Unknown",
      location: job.location?.display_name || "Unknown",
      description: job.description,
      applyLink: job.redirect_url,
      salaryMin: job.salary_min,
      salaryMax: job.salary_max
    }));


    return res.status(200).json({
      message: "Jobs fetched successfully",
      page,
      count: jobs.length,
      jobs
    });

  } catch (error) {
    console.error(error?.response?.data || error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const createApplication = async (req, res)=>{
  try {
    const userId = req?.user?.id;
    const {companyName , jobRole , jobDescription } = req.body;
    const response = await Applications.create({
      userId,
      companyName,
      jobRole,
      jobDescription,
    })
    if(!response){
      return res.status(400).json({message: "Failed to create application"});
    }
    return res.status(201).json({message: "Application Stored"});
  } catch (error) {
   console.error(error?.response?.data || error.message);
    return res.status(500).json({ message: "Server error" });
  }
}

const getApplications = async (req , res)=>{
  try {
    const userId = req.user.id;
    const applications = await Applications.findAll({where: {userId}});
    return res.status(200).json({applications ,message:"Got Applications."})
  } catch (error) {
    console.error(error?.response?.data || error.message);
    return res.status(500).json({ message: "Server error" });
  }
}

const deleteApplication = async (req , res)=>{
  try {
    const userId = req.user.id;
    const {applicationId} = req.params;
    const application = await Applications.findOne({where: {id: applicationId , userId}});
    if(!application){
      return res.status(404).json({message: "Application not found"});
    }
    await application.destroy();
    return res.status(200).json({message: "Application deleted successfully."});
  } catch (error) {
    console.error(error?.response?.data || error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getJobs , createApplication , getApplications , deleteApplication };
