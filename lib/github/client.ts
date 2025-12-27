// lib/github/client.ts
import { Octokit } from "@octokit/rest";

// 1. Initialize the Client
export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Fetches the raw text Diff of a Pull Request.
 * This is the input for the AI Brain.
 */
export async function getPullRequestDiff(
  owner: string,
  repo: string,
  prNumber: number
): Promise<string> {
  try {
    const response = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
      mediaType: {
        format: "diff", // Asks GitHub for text/x-diff, not JSON
      },
    });

    // TypeScript thinks this is an object, but mediaType: 'diff' returns a string
    return response.data as unknown as string;
    
  } catch (error) {
    console.error(`Failed to fetch PR Diff for ${owner}/${repo}#${prNumber}`, error);
    throw new Error("Could not fetch PR Diff");
  }
}

/**
 * Posts a comment on the PR with the Risk Analysis.
 */
export async function postPRComment(
  owner: string,
  repo: string,
  prNumber: number,
  body: string
) {
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body,
  });
}