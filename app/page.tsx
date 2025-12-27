// app/page.tsx
import { octokit } from "@/lib/github/client";
import { rejectPR, approvePR } from "./actions";
import ReactMarkdown from "react-markdown";
import ChatInterface from "@/components/ChatInterface"; // Import the Chat Component

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

    return hildaComment ? hildaComment.body : null;
  } catch (error) {
    console.error(`Failed to fetch comments for PR #${prNumber}`, error);
    return null;
  }
}

export default async function Dashboard() {
  const owner = "harshit110927"; // Your Username
  const repo = "onboardflow";    // Your Repo

  // 1. Get all Open PRs
  const { data: pulls } = await octokit.pulls.list({
    owner,
    repo,
    state: "open",
  });

  // 2. Fetch Analysis for each PR in parallel
  const prsWithAnalysis = await Promise.all(
    pulls.map(async (pr) => {
      const analysis = await getHildaAnalysis(owner, repo, pr.number);
      return { ...pr, analysis };
    })
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Mission Control (The PR List) */}
        <div className="lg:col-span-2 space-y-6">
          <header className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">🛡️ HILDA Mission Control</h1>
            <div className="flex items-center gap-2 text-gray-500 mt-2">
               <span>Active Repo:</span>
               <span className="font-mono font-bold bg-white px-2 py-1 rounded border text-sm">{owner}/{repo}</span>
            </div>
          </header>

          <div className="space-y-6">
            {prsWithAnalysis.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-xl text-green-600 font-semibold">✅ All Clear</p>
                <p className="text-gray-500 mt-2">No pending Pull Requests found.</p>
              </div>
            ) : (
              prsWithAnalysis.map((pr) => (
                <div key={pr.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  
                  {/* Header Section */}
                  <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        <a href={pr.html_url} target="_blank" className="hover:text-blue-600 hover:underline">
                          #{pr.number}: {pr.title}
                        </a>
                      </h2>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          👤 <b>{pr.user?.login}</b>
                        </span>
                        <span>•</span>
                        <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">
                          {pr.head.ref}
                        </span>
                      </div>
                    </div>
                    
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200 uppercase tracking-wide">
                      ⚠️ Review Required
                    </span>
                  </div>

                  {/* Analysis Body */}
                  <div className="p-6 bg-white">
                    {pr.analysis ? (
                      <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-gray-800">
                        <ReactMarkdown 
                          components={{
                            h1: ({...props}) => <h1 className="text-2xl font-bold mb-4 text-red-800" {...props} />,
                            h2: ({...props}) => <h2 className="text-xl font-bold mb-3 mt-6 text-gray-900 border-b pb-1 border-red-200" {...props} />,
                            h3: ({...props}) => <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800" {...props} />,
                            p: ({...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                            ul: ({...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                            li: ({...props}) => <li className="text-gray-700" {...props} />,
                            code: ({...props}) => <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded font-mono text-sm" {...props} />,
                            pre: ({...props}) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono" {...props} />,
                            blockquote: ({...props}) => <blockquote className="border-l-4 border-red-300 pl-4 italic text-gray-600 my-4" {...props} />,
                          }}
                        >
                          {pr.analysis}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="text-gray-400 italic p-4 text-center bg-gray-50 rounded-lg">
                        ⏳ Analysis in progress...
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-4 justify-end">
                    <form action={async () => {
                      "use server";
                      await rejectPR(owner, repo, pr.number);
                    }}>
                      <button className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-5 py-2.5 rounded-lg hover:bg-red-50 hover:border-red-300 font-bold text-sm transition-colors">
                        ⛔ REJECT & CLOSE
                      </button>
                    </form>

                    <form action={async () => {
                      "use server";
                      await approvePR(owner, repo, pr.number);
                    }}>
                      <button className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 font-bold text-sm shadow-sm hover:shadow transition-all">
                        ✅ APPROVE & DEPLOY
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Chat Interface (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ChatInterface />
          </div>
        </div>

      </div>
    </main>
  );
}