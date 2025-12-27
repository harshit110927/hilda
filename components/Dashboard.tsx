// components/Dashboard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ReactMarkdown from "react-markdown";
import { rejectPR, approvePR } from "@/app/actions";
import ChatInterface from "./ChatInterface";

// Initialize Supabase Client (Client-Side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PRData {
  id: number;
  number: number;
  title: string;
  html_url: string;
  user: { login: string } | null;
  head: { ref: string };
  analysis: string | null;
}

export default function Dashboard({ 
  initialPRs, 
  owner, 
  repo 
}: { 
  initialPRs: PRData[], 
  owner: string, 
  repo: string 
}) {
  const router = useRouter();

  useEffect(() => {
    // 🎧 REAL-TIME LISTENER
    const channel = supabase
      .channel('realtime-pr-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pr_history' },
        (payload) => {
          console.log("⚡ New PR Event received!", payload);
          // This triggers a Next.js Server Refresh (re-fetches data without full reload)
          router.refresh(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN: Mission Control */}
      <div className="lg:col-span-2 space-y-6">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">🛡️ HILDA Mission Control</h1>
          <div className="flex items-center gap-2 text-gray-500 mt-2">
             <span className="text-xs uppercase tracking-wider font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
               ● Live Connection
             </span>
             <span className="font-mono font-bold bg-red-50 px-2 py-1 rounded border text-sm">{owner}/{repo}</span>
          </div>
        </header>

        <div className="space-y-6">
          {initialPRs.length === 0 ? (
            <div className="text-center py-20 bg-gray-800 rounded-xl shadow-sm border border-pink-200">
              <p className="text-xl text-gray-200 font-semibold">✅ All Clear</p>
              <p className="text-green-200 mt-2">No pending Pull Requests found.</p>
            </div>
          ) : (
            initialPRs.map((pr) => (
              <div key={pr.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      <a href={pr.html_url} target="_blank" className="hover:text-blue-600 hover:underline">
                        #{pr.number}: {pr.title}
                      </a>
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">👤 <b>{pr.user?.login}</b></span>
                      <span>•</span>
                      <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">{pr.head.ref}</span>
                    </div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200 uppercase tracking-wide">
                    ⚠️ Review Required
                  </span>
                </div>

                {/* Analysis Body */}
                <div className="p-6 bg-white">
                  {pr.analysis ? (
                    <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-gray-800 prose prose-sm max-w-none">
                      <ReactMarkdown>{pr.analysis}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-gray-400 italic p-4 text-center bg-gray-50 rounded-lg animate-pulse">
                      ⏳ HILDA is analyzing this PR...
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-4 justify-end">
                  <form action={async () => { await rejectPR(owner, repo, pr.number); }}>
                    <button className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-5 py-2.5 rounded-lg hover:bg-red-50 hover:border-red-300 font-bold text-sm transition-colors">
                      ⛔ REJECT & CLOSE
                    </button>
                  </form>
                  <form action={async () => { await approvePR(owner, repo, pr.number); }}>
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

      {/* RIGHT COLUMN: Chat */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}