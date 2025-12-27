// app/api/webhooks/github/route.ts
import { NextResponse } from "next/server";
import { getPullRequestDiff, postPRComment } from "@/lib/github/client";
import { graph } from "@/ai/graph";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // 1. Filter Events
    // Check for the correct event type header
    const eventType = req.headers.get("x-github-event");
    console.log(`[Webhook] Received event: ${eventType}`);

    if (eventType !== "pull_request") {
      return NextResponse.json({ message: "Ignored event type" }, { status: 200 });
    }

    const { action, pull_request, repository } = payload;
    
    // We only trigger on 'opened' or 'synchronize' (new commits)
    if (action !== "opened" && action !== "synchronize") {
       return NextResponse.json({ message: `Ignored action: ${action}` }, { status: 200 });
    }

    console.log(`[Webhook] Processing PR #${pull_request.number} in ${repository.full_name}`);

    // 2. Background Processing
    // We return a 202 Accepted immediately to prevent GitHub timeout, 
    // then continue processing asynchronously.
    (async () => {
        try {
            console.log("[Process] Fetching Diff...");
            const diff = await getPullRequestDiff(
                repository.owner.login,
                repository.name,
                pull_request.number
            );

            console.log("[Process] Running AI Analysis...");
            const result = await graph.invoke({
                repo_owner: repository.owner.login,
                repo_name: repository.name,
                pr_number: pull_request.number,
                commit_sha: pull_request.head.sha,
                diff_content: diff,
                human_decision: "PENDING"
            });

            console.log("[Process] Posting Comment to GitHub...");
            
            const commentBody = `
## HILDA Analysis Report

**Risk Level:** ${result.risk_analysis.level}

${result.risk_analysis.summary}

### Blast Radius
${result.risk_analysis.blast_radius}

### Recommended Rollback Plan
\`\`\`bash
${result.rollback_plan.commands.join('\n')}
\`\`\`

> Automated analysis by HILDA. Awaiting human approval.
            `;

            await postPRComment(
                repository.owner.login,
                repository.name,
                pull_request.number,
                commentBody
            );
            
            console.log("[Process] Analysis successfully posted.");

            // 3. Save to Memory (Supabase)
            // We store the analysis, diff, and commit info for future retrieval (RAG).
            console.log("[Memory] Saving to Supabase...");
            
            const { error } = await supabase.from('pr_history').insert({
                repo_owner: repository.owner.login,
                repo_name: repository.name,
                pr_number: pull_request.number,
                title: pull_request.title,
                author: pull_request.user.login,
                diff_content: diff,           // Storing the code diff context
                analysis: result.risk_analysis.summary,
                risk_score: result.risk_analysis.level,
                commit_sha: pull_request.head.sha // Essential for future reverts
            });

            if (error) {
                console.error("[Memory] Failed to save to database:", error);
            } else {
                console.log("[Memory] Successfully saved PR history.");
            }

        } catch (err) {
            console.error("[Process] Background processing failed:", err);
        }
    })();

    return NextResponse.json({ message: "Processing started" }, { status: 202 });

  } catch (error) {
    console.error("[Webhook] Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}