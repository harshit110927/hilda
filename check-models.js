// check-models.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' }); // Load your .env keys

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function main() {
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" }); 
    // We aren't generating, just listing. The SDK has a helper for this:
    // Note: The specific listModels call depends on the exact SDK version, 
    // but this raw fetch is often the most reliable way to see everything.

    console.log("Fetching available models...");
    // This is a direct hack to the internal list function usually exposed on the client
    // But for simplicity, let's just use the standard way if your SDK supports it:

    // RE-WRITE FOR SIMPLICITY:
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`);
    const data = await response.json();

    if (data.models) {
        console.log("\n✅ YOUR AVAILABLE MODELS:");
        data.models.forEach(m => {
            if (m.name.includes('gemini')) {
                console.log(`- ${m.name.replace('models/', '')}`);
            }
        });
    } else {
        console.log("Error:", data);
    }

  } catch (error) {
    console.error("Failed:", error);
  }
}

main();