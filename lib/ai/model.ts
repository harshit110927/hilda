// lib/ai/model.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";

export function getModel() {
  const provider = process.env.AI_PROVIDER || 'gemini';
  const modelName = process.env.AI_MODEL_NAME || 'gemini-2.5-flash';
  
  // ROBUST KEY LOADING: Check generic name first, then provider-specific defaults
  let apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    if (provider === 'gemini') apiKey = process.env.GOOGLE_API_KEY;
    if (provider === 'openai') apiKey = process.env.OPENAI_API_KEY;
    if (provider === 'anthropic') apiKey = process.env.ANTHROPIC_API_KEY;
  }

  if (!apiKey) {
    throw new Error(`❌ API Key is missing! Please set AI_API_KEY or ${provider.toUpperCase()}_API_KEY in your .env file.`);
  }

  console.log(`🤖 HILDA Factory: Using ${provider.toUpperCase()} -> ${modelName}`);

  switch (provider.toLowerCase()) {
    case 'openai':
      return new ChatOpenAI({
        modelName: modelName,
        openAIApiKey: apiKey,
        temperature: 0,
      });
    
    case 'anthropic':
      return new ChatAnthropic({
        modelName: modelName,
        anthropicApiKey: apiKey,
        temperature: 0,
      });

    case 'gemini':
    default:
      return new ChatGoogleGenerativeAI({
        model: modelName, 
        apiKey: apiKey,
        temperature: 0,
      });
  }
}