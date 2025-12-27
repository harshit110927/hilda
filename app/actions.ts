// app/actions.ts
"use server";

import { octokit } from "@/lib/github/client";
import { revalidatePath } from "next/cache";

export async function rejectPR(owner: string, repo: string, prNumber: number) {
  try {
    // 1. Post a comment
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: "⛔ **Deployment Blocked.** A human operator has rejected this Pull Request via HILDA Mission Control.",
    });

    // 2. Close the PR
    await octokit.pulls.update({
      owner,
      repo,
      pull_number: prNumber,
      state: "closed",
    });

    console.log(`❌ PR #${prNumber} rejected and closed.`);
    revalidatePath("/");
    
  } catch (error) {
    console.error("Failed to reject PR:", error);
    throw new Error("Failed to reject PR");
  }
}

export async function approvePR(owner: string, repo: string, prNumber: number) {
  try {
    // 1. Post "Approved" comment
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: "✅ **Deployment Approved.** Human operator has overriden risk flags.",
    });

    // 2. Merge the PR
    await octokit.pulls.merge({
      owner,
      repo,
      pull_number: prNumber,
      merge_method: "squash", 
    });

    console.log(`✅ PR #${prNumber} approved and merged.`);
    revalidatePath("/");
    
  } catch (error) {
    console.error("Failed to merge PR:", error);
    throw new Error("Failed to merge PR");
  }
}