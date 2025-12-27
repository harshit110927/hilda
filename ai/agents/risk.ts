// ai/agents/risk.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; // <--- CHANGED
import { z } from "zod";
import { AgentState } from "../state";

// 1. Initialize Gemini
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash", // Fast and Free
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY,
});

const riskSchema = z.object({
  level: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  score: z.number().min(0).max(100),
  summary: z.string().describe("A brief summary of the risk assessment."),
  flags: z.array(z.string()).describe("List of identified risk flags"),
  blast_radius: z.string().describe("Description of affected systems and users"),
});

export async function riskAnalysisNode(state: typeof AgentState.State) {
  const { diff_content } = state;

  const systemPrompt = `
    You are a Senior Staff Engineer reviewing code.
    RULES:
    - If Authentication or Billing is touched, Risk is at least HIGH.
    - If DB Schema changes are destructive, Risk is CRITICAL.
    - Look for hardcoded secrets, missing error handling, and logical race conditions.
  `;

  // Gemini supports structured output natively now
  const structuredModel = model.withStructuredOutput(riskSchema);

  const result = await structuredModel.invoke([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Analyze the following Git Diff:\n\n${diff_content}` },
  ]);

  return {
    risk_analysis: result,
  };
}