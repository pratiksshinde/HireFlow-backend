const model = require("../config/gemini");
const extractJSON = require("../utils/extractJSON");

const extractStructuredResume = async (resumeText) => {
 const schema = {
  basics: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    links: [
      { label: "LinkedIn", url: "" },
      { label: "GitHub", url: "" },
      { label: "Portfolio", url: "" }
    ]
  },

  summary: "",

  skills: [
    { category: "technical", items: [] },
    { category: "frameworks", items: [] },
    { category: "databases", items: [] },
    { category: "tools", items: [] },
    { category: "soft", items: [] }
  ],

  experience: [
    {
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrentlyWorking: false,
      description: "",
    }
  ],

  projects: [
    {
      projectName: "",
      description: "",
      techStack: [],
      link: ""
    }
  ],

  education: [
    {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      score: ""
    }
  ],

  certifications: [
    {
      certificationName: "",
      issuingOrganization: "",
      issueDate: "",
      link: ""
    }
  ],

  achievements: []
};



  const prompt = `
    You are an ATS resume parser.

    CRITICAL RULES (BREAKING ANY = FAILURE):
    1. Output ONLY valid JSON
    2. No markdown
    3. No explanations
    4. No trailing commas
    5. No comments
    6. Follow schema EXACTLY
    7. Use empty string or empty array if data missing
    8. Dates MUST be plain text like "Jan 2023"
    9. Extract ONLY hyperlinks present in resume
    10. Do NOT invent data
    11. For skills, categorize into technical, frameworks, databases, tools, soft skills
    12. For projects, include tech stack as array of strings
    13. please do not add any additional fields other than mentioned in the schema
    14. please do not add any example links or any example data other than mentioned in the schema


    Extract the resume data into the following JSON schema.
    Here is the schema:
    ${JSON.stringify(schema, null, 2)}

    Resume text:
    """
    ${resumeText}
    """
    `;


  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // HARD SAFETY
  try {
    return extractJSON(text);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }
};

module.exports = { extractStructuredResume };
