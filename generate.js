const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateCoverLetter(htmlStructure) {
  try {
    // Ensure the HTML structure is passed properly
    if (!htmlStructure) {
      throw new Error("No HTML content provided.");
    }

    // Replace YOUR_API_KEY with your actual API key
    const genAI = new GoogleGenerativeAI("AIzaSyCLz7IeZR-Kjr9djpZ9coYgMbF5Xu_t-n8");

    // Specify the model you want to use
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Define the prompt
    const prompt = `
      Here is the full HTML structure of a job listing page:

      ${htmlStructure}

      Please extract the job title and company name from the HTML code snippet above and provide a Cover Letter for this position in text format.
    `;

    // Generate content
    const result = await model.generateContent(prompt);

    if (!result || !result.response || !result.response.text()) {
      throw new Error("AI response is missing or invalid.");
    }

    // Return the generated cover letter
    return result.response.text();
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw error;
  }
}

// Export the function
module.exports = generateCoverLett
