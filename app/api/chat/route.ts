// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { getModel } from "@/lib/ai/model"; // <--- The new Factory
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. RETRIEVAL: Fetch recent PR history from Supabase
    const { data: history, error } = await supabase
      .from('pr_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10); 

    if (error) {
      console.error("Database Error:", error);
      return NextResponse.json({ error: "Failed to fetch memory" }, { status: 500 });
    }

    // 2. AUGMENTATION: Prepare context
    const context = history.map(pr => `
      [PR #${pr.pr_number} by ${pr.author}]
      Title: ${pr.title}
      Risk: ${pr.risk_score}
      Commit SHA: ${pr.commit_sha}
      Analysis: ${pr.analysis}
      Code Diff Snippet: ${pr.diff_content ? pr.diff_content.substring(0, 500) : "No diff"}...
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

    // 3. GENERATION: Use the Factory Model
    const model = getModel();
    
    // Invoke with LangChain standard messages
    const response = await model.invoke([
      new SystemMessage("You are a helpful DevOps Assistant."),
      new HumanMessage(systemPrompt)
    ]);

    // LangChain returns an object with .content
    const text = response.content as string;

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}