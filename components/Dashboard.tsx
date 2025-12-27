"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ReactMarkdown from "react-markdown";
import { rejectPR, approvePR } from "@/app/actions";
import ChatInterface from "./ChatInterface";
import { 
  ShieldAlert, 
  GitPullRequest, 
  CheckCircle, 
  XCircle, 
  Terminal, 
  ExternalLink,
  Lightbulb
} from "lucide-react";

interface PRData {
  id: number;
  number: number;
  title: string;
  html_url: string;
  user: { login: string } | null;
  head: { ref: string };
  analysis: string | null;
}

const FACTS = [
  { title: "Git Tip", text: "Did you know `git reflog` can save you even after a hard reset? It tracks every HEAD movement.", link: "https://git-scm.com/docs/git-reflog" },
  { title: "RAG Fact", text: "Retrieval Augmented Generation reduces LLM hallucinations by 60% compared to zero-shot prompting.", link: "https://arxiv.org/abs/2005.11401" },
  { title: "Security", text: "Hardcoded secrets are the #2 cause of data breaches in 2024. HILDA catches these instantly.", link: "https://owasp.org/Top10/" },
  { title: "GitHub", text: "You can press '.' on any GitHub repo to open it instantly in a web-based VS Code editor.", link: "https://github.dev" }
];

// PROPS: Now accepting keys from the Server
export default function Dashboard({ 
  initialPRs, 
  owner, 
  repo,
  supabaseUrl,
  supabaseKey
}: { 
  initialPRs: PRData[], 
  owner: string, 
  repo: string,
  supabaseUrl: string,
  supabaseKey: string
}) {
  const router = useRouter();
  const [fact, setFact] = useState(FACTS[0]);

  // 1. Initialize Supabase safely inside the component
  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseKey) return null;
    return createClient(supabaseUrl, supabaseKey);
  }, [supabaseUrl, supabaseKey]);

  useEffect(() => {
    setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);
  }, []);

  // 2. Realtime Listener (Only runs if supabase is ready)
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('realtime-pr-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pr_history' }, () => {
        router.refresh(); 
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, router]);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20 pt-8">
      
      {/* LEFT COLUMN: PR List */}
      <div className="lg:col-span-2 space-y-6">
        <header className="mb-8 border-b border-gray-500 pb-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-blue-400" size={32} />
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              HILDA Mission Control
            </h1>
          </div>
          <div className="flex items-center gap-2 text-gray-400 mt-2 font-mono text-sm">
             {/* Status Indicator logic */}
             {supabase ? (
               <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded text-xs font-bold animate-pulse">● ONLINE</span>
             ) : (
               <span className="bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded text-xs font-bold">● OFFLINE (NO KEYS)</span>
             )}
             <span>{owner}/{repo}</span>
          </div>
        </header>

        <div className="space-y-6">
          {initialPRs.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-gray-600 shadow-lg">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
              <p className="text-xl text-foreground font-semibold">All Clear</p>
              <p className="text-gray-400 mt-2">No pending Pull Requests found.</p>
            </div>
          ) : (
            initialPRs.map((pr) => (
              <div key={pr.id} className="bg-card border border-gray-600 rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-600 bg-[#4a4a4a] flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <GitPullRequest size={20} className="text-gray-400" />
                      <a href={pr.html_url} target="_blank" className="hover:text-blue-400 hover:underline">
                        #{pr.number}: {pr.title}
                      </a>
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-400 font-mono">
                      <span>{pr.user?.login}</span>
                      <span>•</span>
                      <span>{pr.head.ref}</span>
                    </div>
                  </div>
                  <div className="bg-yellow-900/50 text-yellow-500 px-3 py-1 rounded-full border border-yellow-700/50 text-xs font-bold">
                    ⚠️ REVIEW
                  </div>
                </div>

                {/* Analysis */}
                <div className="p-6 bg-card">
                  {pr.analysis ? (
                    <div className="bg-[#444444] p-5 rounded-lg border border-gray-500 text-gray-200 prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{pr.analysis}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-gray-400 italic p-4 text-center bg-[#444444] rounded-lg animate-pulse">
                      Running Scan...
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-[#4a4a4a] border-t border-gray-600 flex gap-4 justify-end">
                  <form action={async () => { await rejectPR(owner, repo, pr.number); }}>
                    <button className="flex items-center gap-2 text-red-400 border border-red-400/30 px-4 py-2 rounded hover:bg-red-400/10 transition-colors font-bold text-sm">
                      <XCircle size={16} /> REJECT
                    </button>
                  </form>
                  <form action={async () => { await approvePR(owner, repo, pr.number); }}>
                    <button className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 font-bold text-sm shadow-lg">
                      <CheckCircle size={16} /> DEPLOY
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-1 space-y-6">
        <div className="sticky top-6 space-y-6">
          <ChatInterface />

          {/* Fact Card */}
          <div className="bg-input-bg border border-gray-600 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Lightbulb size={64} className="text-yellow-400" />
            </div>
            <h3 className="text-yellow-400 font-bold text-sm tracking-wider uppercase mb-2 flex items-center gap-2">
              <Terminal size={14} /> System Knowledge
            </h3>
            <p className="text-foreground font-bold text-lg mb-2">{fact.title}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {fact.text}
            </p>
            <a 
              href={fact.link} 
              target="_blank" 
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-wide transition-colors"
            >
              Learn More <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="lg:col-span-3 mt-12 pt-8 border-t border-gray-700 text-center">
        <a 
          href="https://harshitshukla.codes" 
          target="_blank" 
          className="text-gray-500 hover:text-foreground transition-colors text-sm font-mono flex items-center justify-center gap-2"
        >
          <span>CREATED BY</span>
          <span className="font-bold text-blue-400">HARSHITSHUKLA.CODES</span>
        </a>
      </div>
    </div>
  );
}