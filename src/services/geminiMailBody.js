const model = require("../config/gemini");

const genrateMailBody = async (data) => {
  const { job, user } = data;

  // Extract skills with better formatting
  const skillsList = user.skills
    .map(s => s.skill)
    .filter(Boolean)
    .join(", ");

  // Extract experiences with more details
  const experienceText = user.experience
    .map(e => `${e.role} at ${e.company} (${e.duration})${e.description ? ': ' + e.description.substring(0, 100) : ''}`)
    .join("\n");

  // Extract projects
  const projectsText = user.projects
    .map(p => `${p.name}: ${p.description.substring(0, 80)}`)
    .join("\n");

  // Extract education
  const educationText = user.education
    .map(e => `${e.degree} in ${e.field} from ${e.institution}`)
    .join("\n");

  console.log("Skills being sent:", skillsList);
  console.log("Experience being sent:", experienceText);
  console.log("Projects being sent:", projectsText);

  const prompt = `
    Write a professional job application email body as plain text.

    CRITICAL RULES:
    - Write like a real human, not AI
    - Use natural, conversational language
    - NO formal phrases like "I am writing to express my strong interest"
    - NO phrases like "I am deeply impressed" or "I am confident that"
    - Start directly with why you're reaching out
    - Be genuine and straightforward
    - Keep paragraphs SHORT (2-3 sentences max)
    - Add blank lines between paragraphs for readability
    - Sound enthusiastic but natural
    - Do NOT use quotation marks or curly braces
    - Do NOT include subject, "To:", "From:", or email headers
    - Mention 1-2 specific skills or projects that relate to the job

    Job Details:
    Title: ${job.jobtitle}
    Company: ${job.companyname}
    Location: ${job.location}

    Candidate Info:
    Name: ${user.name}
    Summary: ${user.summary || 'Passionate developer'}
    Phone: ${user.phone}

    Skills: ${skillsList}

    Experience:
    ${experienceText || 'Recent graduate eager to start career'}

    Projects:
    ${projectsText || 'Various personal projects demonstrating skills'}

    Education:
    ${educationText || 'Currently pursuing education in technology'}

    Write a natural-sounding email that:
    1. Opens with a direct, friendly introduction about the specific role
    2. Mentions 1-2 relevant skills or experiences that match the job
    3. Briefly references a specific project or achievement
    4. Shows genuine interest in the company/role
    5. Ends with a simple call to action
    6. Signs off with just the candidate's name and phone number

    Format with blank lines between each paragraph. Keep it under 150 words total.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean up the text
    const cleanedText = text
      .replace(/\\n/g, "\n")           // Fix escaped newlines
      .replace(/\*\*/g, "")             // Remove markdown bold
      .replace(/\*/g, "")               // Remove markdown italic
      .replace(/^["']|["']$/g, "")      // Remove surrounding quotes
      .replace(/\n{3,}/g, "\n\n")       // Replace 3+ newlines with 2
      .trim();

    // Ensure proper spacing between paragraphs
    const paragraphs = cleanedText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const formattedText = paragraphs.join("\n\n");

    return formattedText;
  } catch (error) {
    console.error("Error generating email body:", error);
    throw new Error("Failed to generate email body");
  }
};

module.exports = { genrateMailBody };