import { octokit } from "@/lib/github/client";
import Dashboard from "@/components/Dashboard";

// 1. Define the Shape of Data
interface PRData {
  id: number;
  number: number;
  title: string;
  html_url: string;
  user: { login: string } | null;
  head: { ref: string };
  analysis: string | null;
}

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

    return hildaComment?.body ?? null;
  } catch (error) {
    console.error(`Failed to fetch comments for PR #${prNumber}`, error);
    return null;
  }
}

export default async function Page() {
  const owner = "harshit110927"; // Ideally from env or config
  const repo = "onboardflow";

  let prsWithAnalysis: PRData[] = [];

  try {
    const { data: pulls } = await octokit.pulls.list({
      owner,
      repo,
      state: "open",
    });

    prsWithAnalysis = await Promise.all(
      pulls.map(async (pr) => {
        const analysis = await getHildaAnalysis(owner, repo, pr.number);
        return { 
          id: pr.id,
          number: pr.number,
          title: pr.title,
          html_url: pr.html_url,
          user: pr.user ? { login: pr.user.login } : null,
          head: { ref: pr.head.ref },
          analysis: analysis ?? null 
        };
      })
    );
  } catch (e) {
    console.log("⚠️ GitHub connection skipped during build/setup.");
  }

  // 2. READ ENV VARS AT RUNTIME
  // These will be empty strings during 'npm install' (fixing the build),
  // but filled with real keys during 'hilda start'.
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return (
    <main className="min-h-screen bg-green-100 p-6 font-sans">
      {/* 3. Pass the keys to the Dashboard */}
      <Dashboard 
        initialPRs={prsWithAnalysis} 
        owner={owner} 
        repo={repo}
        supabaseUrl={sbUrl}  // <--- The missing props
        supabaseKey={sbKey}  // <--- The missing props
      />
    </main>
  );
}