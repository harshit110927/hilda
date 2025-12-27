// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase/client";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. RETRIEVAL: Fetch recent PR history from Supabase
    const { data: history, error } = await supabase
      .from('pr_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10); // Fetch last 10 PRs for context

    if (error) {
      console.error("Database Error:", error);
      return NextResponse.json({ error: "Failed to fetch memory" }, { status: 500 });
    }

    // 2. AUGMENTATION: Prepare the prompt with context
    const context = history.map(pr => `
      [PR #${pr.pr_number} by ${pr.author}]
      Title: ${pr.title}
      Risk: ${pr.risk_score}
      Commit SHA: ${pr.commit_sha}
      Analysis: ${pr.analysis}
      Code Diff Snippet: ${pr.diff_content.substring(0, 500)}... (truncated)
    `).join('\n\n');

    const systemPrompt = `
      You are HILDA, a DevOps AI Assistant.
      You have access to the following Pull Request history (Memory):
      
      ${context}

      User Query: "${message}"

      Answer the user's question based strictly on the history above. 
      If they ask to revert a specific PR, provide the exact git commands using the 'Commit SHA' from history.
      Be concise and helpful.
    `;

    // 3. GENERATION: Ask Gemini
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}