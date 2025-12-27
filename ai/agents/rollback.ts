// ai/agents/rollback.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; // <--- CHANGED
import { z } from "zod";
import { AgentState } from "../state"; // Ensure this import is present

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY,
});

const rollbackSchema = z.object({
  strategy: z.enum(["revert", "reset"]),
  commands: z.array(z.string()).describe("Shell commands to execute the rollback"),
  notes: z.string().describe("Safety warnings for the operator"),
});

export async function rollbackNode(state: typeof AgentState.State) {
  const { risk_analysis, commit_sha } = state;

  const prompt = `
    You are a DevOps Engineer. 
    The risk level is ${risk_analysis.level}.
    The commit to undo is ${commit_sha}.
    
    Generate a deterministic rollback plan. 
    Prefer 'git revert' for shared branches.
  `;

  const structuredModel = model.withStructuredOutput(rollbackSchema);

  const result = await structuredModel.invoke([
     { role: "system", content: prompt },
     { role: "user", content: "Generate rollback commands." }
  ]);

  return {
    rollback_plan: result
  };
}