const axios = require("axios");
const { Resume, ResumeSkill, ResumeExperience, ResumeEducation, ResumeProject, User } = require("../models");
const { genrateMailBody } = require("../services/geminiMailBody");

function extractDomain(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

const getDomain = async (companyName) => {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: `${companyName} official website`,
        engine: "google",
        api_key: process.env.SERP_API_KEY,
      },
    });
    const firstResult = response.data.organic_results?.[0];
    if (!firstResult) return null;
    return extractDomain(firstResult.link);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const generateEmails = (companyDomain) => {
  if (!companyDomain) return [];
  return [
    `careers@${companyDomain}`,
    `jobs@${companyDomain}`,
    `info@${companyDomain}`,
    `recruitment@${companyDomain}`,
    `hr@${companyDomain}`,
    `talent@${companyDomain}`,
    `hiring@${companyDomain}`,
    `people@${companyDomain}`,
    `peopleops@${companyDomain}`,
  ];
};

const verifyEmail = async (email) => {
  try {
    const response = await axios.get(`https://api.hunter.io/v2/email-verifier`, {
      params: {
        email,
        api_key: process.env.HUNTER_API_KEY
      }
    });
    return { email, status: response.data.data.result }; 
  } catch (err) {
    console.error(err);
    return { email, status: "unknown" };
  }
};

const verifyAllEmails = async (emails) => {
  const promises = emails.map(email => verifyEmail(email));
  const results = await Promise.all(promises);
  return results.filter(r => r.status === "deliverable");
};

const JobMail = async (req, res) => {
  try {
    // FIX 1: Destructure from req.body, not req.body.job
    const { title, companyName, location } = req.body;
    const userId = req?.user?.id;
    const freelimit = 3;

    console.log("1. Job data:", title, companyName, location);
    console.log("2. UserId:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findOne({ where: { id: userId } });

    const now = new Date();
    if(!user.coldEmailResetAt){
      await user.update({
        coldEmailResetAt:now,
        coldEmailCount:0
      });
      await user.reload();
    }

    const dayspassed = 
      (now - new Date(user.coldEmailResetAt))/(1000*60*60*24);

    if (dayspassed >= 30){
      await user.update({
        coldEmailResetAt:now,
        coldEmailCount:0
      })
      await user.reload(); 
    }

    if (user.subscriptionStatus === "free" && user.coldEmailCount >= freelimit) {
      return res.status(403).json({ 
        message: `Free plan limit reached. You can send up to ${freelimit} cold emails. Please upgrade your subscription to send more.` 
      });
    }

    if (!companyName) {
      return res.status(400).json({ message: "Company Name NOT FOUND!!!" });
    }

    const companyDomain = await getDomain(companyName);
    if (!companyDomain) {
      return res.status(404).json({ message: "Company domain not found" });
    }

    const emails = generateEmails(companyDomain);
    console.log("3. Generated Emails:", emails);
    
    const validEmails = await verifyAllEmails(emails);
    
    if (validEmails.length === 0) {
      return res.status(200).json({ 
        message: "No Valid Email Found!!!", 
        companyDomain, 
        validEmails 
      });        
    }   
    console.log("4. Valid Emails:", validEmails);

    // FIX 2: Fetch resume data with ALL associations in ONE query
    const resumeData = await Resume.findOne({
      where: { userId },
      include: [
       
        { 
          association: 'skills', 
          attributes: ['skill', 'category', 'proficiency'] 
        },
        { 
          association: 'experiences', 
          attributes: ['jobTitle', 'company', 'description', 'startDate', 'endDate', 'isCurrentlyWorking'] 
        },
        { 
          association: 'projects', 
          attributes: ['projectName', 'description', 'link'] 
        },
        { 
          association: 'educations', 
          attributes: ['institution', 'degree', 'fieldOfStudy'] 
        }
      ]
    });

    if (!resumeData) {
      return res.status(404).json({ 
        message: "Resume not found. Please create a resume first." 
      });
    }

    const jobData = {
      jobtitle: title,
      companyname: companyName,
      location: location
    };

    // Prepare user data with proper structure
    const userData = {
      name: resumeData.fullname,
      email: resumeData.email,
      phone: resumeData.phone,
      summary: resumeData.summary,
      skills: resumeData.skills || [],
      experience: (resumeData.experiences || []).map(exp => ({
        role: exp.jobTitle,
        company: exp.company,
        description: exp.description,
        duration: `${exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - ${
          exp.isCurrentlyWorking 
            ? 'Present' 
            : exp.endDate 
              ? new Date(exp.endDate).getFullYear() 
              : ''
        }`
      })),
      projects: resumeData.projects,
      
      education: (resumeData.educations || []).map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        field: edu.fieldOfStudy
      }))
    };

    console.log("5. User data being sent to Gemini:", JSON.stringify(userData, null, 2));

    // FIX 4: Pass correct structure to genrateMailBody
    const emailBody = await genrateMailBody({
      job: jobData,
      user: userData
    });

    if (!emailBody) {
      return res.status(500).json({ 
        message: "Email Body Failed to generate", 
        validEmails 
      });
    }

    console.log("6. Generated email body:", emailBody);

    // Update coldEmailCount for free users
    if (user.subscriptionStatus === "free") {
      user.coldEmailCount += 1;
      await user.save();
    }

    return res.status(200).json({ 
      success: true,
      data: {
        companyDomain, 
        validEmails, 
        genrateMail: emailBody
      }
    });        
  } catch (error) {
    console.error("Error in JobMail:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

module.exports = { JobMail };