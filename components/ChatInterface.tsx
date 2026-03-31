"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatInterface() {
  const [messages, setMessages] = useState<
    { role: "user" | "hilda"; content: string }[]
  >([
    {
      role: "hilda",
      content:
        "Hello! I'm HILDA. I remember your recent PRs. Ask me anything — e.g., *Help me revert PR #3*.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "hilda", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "hilda", content: "Sorry, my brain disconnected." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-3.5 border-b border-[var(--border)] flex items-center gap-2">
        <div className="h-6 w-6 rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] text-[10px] text-[var(--accent)] font-mono font-semibold flex items-center justify-center">
          H
        </div>
        <div>
          <div className="text-[13px] font-medium text-[var(--text-primary)]">Chat with HILDA</div>
          <div className="text-[10px] font-mono text-[var(--text-muted)]">{"// Accessing Long-Term Memory"}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[88%] rounded-lg px-3 py-2 text-xs leading-6 border ${
              msg.role === "user"
                ? "ml-auto bg-[var(--bg-3)] border-[var(--border-light)] text-[var(--text-primary)] rounded-br-sm"
                : "bg-[var(--bg-2)] border-[var(--border)] text-[var(--text-secondary)] rounded-bl-sm"
            }`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div className="max-w-[88%] rounded-lg rounded-bl-sm px-3 py-2 text-xs border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text-muted)] animate-pulse">
            ···
          </div>
        )}
      </div>

      <div className="border-t border-[var(--border)] p-2.5 space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          placeholder="Enter your query..."
          rows={2}
          className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--bg-0)] px-2.5 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--border-light)]"
        />
        <div className="flex justify-end">
          <button
            onClick={sendMessage}
            disabled={loading}
            className="font-mono text-[11px] font-semibold tracking-wide px-3.5 py-1.5 rounded border border-[var(--border)] bg-[var(--bg-3)] text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] disabled:opacity-50"
          >
            SEND →
          </button>
        </div>
      </div>
    </>
  );
}
