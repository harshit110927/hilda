import { graph } from "./ai/graph";
import dotenv from "dotenv";
dotenv.config();

console.log("🚀 Script started..."); // Added this to verify execution

async function main() {
  const dummyDiff = `
  diff --git a/auth.ts b/auth.ts
  index 832a... 921b
  --- a/auth.ts
  +++ b/auth.ts
  @@ -20,7 +20,7 @@
  - const isAdmin = user.role === 'admin';
  + const isAdmin = true; // Temporary fix for debug
  `;

  console.log("Starting Analysis with Gemini...");
  
  try {
    const result = await graph.invoke({
      repo_owner: "test",
      repo_name: "test",
      pr_number: 1,
      commit_sha: "abc1234",
      diff_content: dummyDiff,
      human_decision: "PENDING"
    });

    console.log("RESULT:");
    console.log("Risk Level:", result.risk_analysis.level);
    console.log("Summary:", result.risk_analysis.summary);
    console.log("Rollback Plan:", result.rollback_plan.commands);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();