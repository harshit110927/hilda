// app/page.tsx
import { octokit } from "@/lib/github/client";
import Dashboard from "@/components/Dashboard"; 

// Helper to find HILDA's comment
async function getHildaAnalysis(owner: string, repo: string, prNumber: number) {
  try {
    const { data: comments } = await octokit.issues.listComments({
      owner,
      repo,
      issue_number: prNumber,
    });

    const hildaComment = comments.find((c) => 
      c.body?.includes("## HILDA Analysis Report")
    );

    // FIX 1: Ensure we return string or null, never undefined
    return hildaComment?.body ?? null; 
  } catch (error) {
    console.error(`Failed to fetch comments for PR #${prNumber}`, error);
    return null;
  }
}

export default async function Page() {
  const owner = "harshit110927"; // Your Username
  const repo = "onboardflow";    // Your Repo

  // 1. Get all Open PRs (Server Side)
  const { data: pulls } = await octokit.pulls.list({
    owner,
    repo,
    state: "open",
  });

  // 2. Fetch Analysis
  const prsWithAnalysis = await Promise.all(
    pulls.map(async (pr) => {
      const analysis = await getHildaAnalysis(owner, repo, pr.number);
      return { 
        id: pr.id,
        number: pr.number,
        title: pr.title,
        html_url: pr.html_url,
        user: pr.user ? { login: pr.user.login } : null,
        head: { ref: pr.head.ref },
        // FIX 2: Explicitly fallback to null here too, just to be safe
        analysis: analysis ?? null 
      };
    })
  );

  return (
    <main className="min-h-screen bg-green-50 p-6 font-sans">
      <Dashboard initialPRs={prsWithAnalysis} owner={owner} repo={repo} />
    </main>
  );
}