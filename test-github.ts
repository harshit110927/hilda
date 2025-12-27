// test-github.ts
import { getPullRequestDiff } from "./lib/github/client";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("📡 Fetching Diff from GitHub...");
  
  // Using a random closed PR from Next.js as a test
  // You can change this to your own repo: owner, repo, pr_number
  const owner = "facebook";
  const repo = "react";
  const prNumber = 28000; 

  try {
    const diff = await getPullRequestDiff(owner, repo, prNumber);
    console.log("✅ Success! Fetched Diff:");
    console.log("---------------------------------------------------");
    console.log(diff.slice(0, 500) + "\n... (truncated)"); // Show first 500 chars
    console.log("---------------------------------------------------");
  } catch (e) {
    console.error(e);
  }
}

main();