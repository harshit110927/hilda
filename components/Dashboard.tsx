"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ReactMarkdown from "react-markdown";
import { rejectPR, approvePR } from "@/app/actions";
import ChatInterface from "./ChatInterface";

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
  {
    title: "Security",
    text: "Hardcoded secrets are the #2 cause of data breaches in 2024. HILDA catches these instantly.",
    link: "https://owasp.org/Top10/",
  },
  {
    title: "Auth Bypasses",
    text: "isAdmin() checks must always verify server-side session data, never user-supplied input.",
    link: "https://owasp.org/www-community/Broken_Access_Control",
  },
  {
    title: "Blast Radius",
    text: "HILDA calculates impact scope by tracing what data/users each function can access.",
    link: "https://martinfowler.com/bliki/RiskBasedSecurityTesting.html",
  },
  {
    title: "Rollback Plans",
    text: "git revert creates a safe undo commit. Prefer it over git reset on shared branches.",
    link: "https://git-scm.com/docs/git-revert",
  },
];

export default function Dashboard({
  initialPRs,
  owner,
  repo,
  supabaseUrl,
  supabaseKey,
}: {
  initialPRs: PRData[];
  owner: string;
  repo: string;
  supabaseUrl: string;
  supabaseKey: string;
}) {
  const router = useRouter();
  const [fact, setFact] = useState(FACTS[0]);
  const [view, setView] = useState<"auto" | "allclear" | "scanning" | "report">("auto");

  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseKey) return null;
    return createClient(supabaseUrl, supabaseKey);
  }, [supabaseUrl, supabaseKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFact((prev) => FACTS[(FACTS.findIndex((f) => f.title === prev.title) + 1) % FACTS.length]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("realtime-pr-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "pr_history" }, () => {
        router.refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const activePR = initialPRs[0];
  const autoState = !activePR ? "allclear" : activePR.analysis ? "report" : "scanning";
  const displayState = view === "auto" ? autoState : view;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-[52px] shrink-0 bg-[var(--bg-1)] border-b border-[var(--border)] px-6 flex items-center gap-3.5">
        <div className="size-7 rounded-[7px] bg-[var(--accent)] text-white font-mono text-[13px] font-semibold flex items-center justify-center">H</div>
        <span className="font-mono text-sm tracking-[0.2em] font-semibold">HILDA</span>
        <span className="text-[var(--border-light)] text-lg">/</span>
        <span className="text-[13px] text-[var(--text-secondary)]">{owner} · {repo}</span>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex gap-1">
            <button className="font-mono text-xs rounded px-3 py-1 border border-[var(--border)] bg-[var(--bg-3)] text-[var(--text-primary)]">Mission Control</button>
            <button className="font-mono text-xs rounded px-3 py-1 text-[var(--text-muted)] hover:bg-[var(--bg-2)]">History</button>
            <button className="font-mono text-xs rounded px-3 py-1 text-[var(--text-muted)] hover:bg-[var(--bg-2)]">Settings</button>
          </div>
          <span className={`font-mono text-[11px] tracking-widest rounded-full px-2.5 py-1 border ${supabase ? "bg-[var(--green-bg)] text-[var(--green)] border-[var(--green-border)]" : "bg-[var(--amber-bg)] text-[var(--amber)] border-[var(--amber-border)]"}`}>
            {supabase ? "● ONLINE" : "● OFFLINE"}
          </span>
        </div>
      </div>

      <div className="flex h-[calc(100vh-52px)] overflow-hidden">
        <section className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)]">THREAT QUEUE</span>
            {displayState !== "allclear" && (
              <span className="font-mono text-[11px] text-[var(--accent)] bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded px-2 py-0.5">1 PENDING</span>
            )}
          </div>

          {displayState === "allclear" && (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
              <div className="size-12 rounded-full bg-[var(--green-bg)] border border-[var(--green-border)] flex items-center justify-center text-2xl">✓</div>
              <h2 className="text-base font-medium">All Clear</h2>
              <p className="text-[13px] text-[var(--text-muted)]">No pending Pull Requests found.</p>
            </div>
          )}

          {activePR && displayState !== "allclear" && (
            <article className="bg-[var(--bg-1)] border border-[var(--border)] border-l-[3px] border-l-[var(--accent)] rounded-lg overflow-hidden">
              <div className="px-4 py-3.5 border-b border-[var(--border)] flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-[var(--text-muted)] mb-1">PR #{activePR.number}</div>
                  <a href={activePR.html_url} target="_blank" className="text-sm font-semibold truncate block hover:text-[var(--blue)]">
                    #{activePR.number}: {activePR.title}
                  </a>
                  <div className="mt-1 text-[11px] text-[var(--text-muted)] flex items-center gap-2">
                    <span>{activePR.user?.login}</span><span>•</span><span>{activePR.head.ref}</span>
                  </div>
                </div>
                <span className={`font-mono text-[10px] tracking-widest font-semibold px-2.5 py-1 rounded border ${displayState === "scanning" ? "bg-[var(--amber-bg)] text-[var(--amber)] border-[var(--amber-border)]" : "bg-[var(--accent-bg)] text-[var(--accent)] border-[var(--accent-border)]"}`}>
                  ⚠ REVIEW
                </span>
              </div>

              {displayState === "scanning" ? (
                <div className="p-4 space-y-3">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)]">RUNNING SCAN</div>
                  <div className="h-1 rounded bg-[var(--bg-3)] overflow-hidden"><div className="h-full w-[75%] bg-[var(--accent)] animate-pulse" /></div>
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <p className="text-[var(--green)]">✓ Fetching diff from GitHub</p>
                    <p className="text-[var(--green)]">✓ Parsing changed files</p>
                    <p className="text-[var(--text-secondary)]">◌ Running LLM security analysis</p>
                    <p className="text-[var(--text-muted)]">· Calculating blast radius</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[var(--bg-0)]">
                  <div className="border border-[var(--border)] rounded-md bg-[var(--bg-1)] p-4 text-[12px] text-[var(--text-secondary)] prose prose-invert max-w-none prose-p:text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)]">
                    <ReactMarkdown>{activePR.analysis ?? "No report generated yet."}</ReactMarkdown>
                  </div>
                </div>
              )}

              <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-0)] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  {displayState === "scanning"
                    ? "Automated analysis in progress..."
                    : "Automated analysis by HILDA · Awaiting human approval"}
                </span>
                <div className="flex gap-2">
                  <form action={async () => { await rejectPR(owner, repo, activePR.number); }}>
                    <button disabled={displayState === "scanning"} className="font-mono text-[11px] font-semibold rounded px-4 py-1.5 border border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--accent)] disabled:opacity-40">✕ Reject</button>
                  </form>
                  <form action={async () => { await approvePR(owner, repo, activePR.number); }}>
                    <button disabled={displayState === "scanning"} className="font-mono text-[11px] font-semibold rounded px-4 py-1.5 bg-[var(--green)] text-[var(--bg-0)] disabled:opacity-40">✓ Deploy</button>
                  </form>
                </div>
              </div>
            </article>
          )}
        </section>

        <aside className="w-[280px] shrink-0 bg-[var(--bg-1)] border-l border-[var(--border)] flex flex-col">
          <ChatInterface />
          <div className="border-t border-[var(--border)] p-3 bg-[var(--bg-0)]">
            <div className="font-mono text-[9px] tracking-[0.2em] text-[var(--amber)] mb-1.5">&gt;_ SYSTEM KNOWLEDGE</div>
            <p className="text-xs font-semibold mb-1">{fact.title}</p>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{fact.text}</p>
            <a href={fact.link} target="_blank" className="inline-block mt-1.5 text-[11px] text-[var(--blue)]">LEARN MORE ↗</a>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[var(--bg-2)] border border-[var(--border-light)] rounded-lg p-1.5 flex gap-1 shadow-2xl">
        {[
          { key: "auto", label: "Auto" },
          { key: "allclear", label: "All Clear" },
          { key: "scanning", label: "Scanning" },
          { key: "report", label: "Report" },
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setView(option.key as typeof view)}
            className={`font-mono text-[10px] rounded px-3 py-1.5 border ${view === option.key ? "bg-[var(--bg-3)] text-[var(--text-primary)] border-[var(--border-light)]" : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
