// ai/state.ts
import { Annotation } from "@langchain/langgraph";

// 1. Shape of Risk assessment
export interface RiskAssessment {
    level: "LOW" | "MEDIUM" | "HIGH";
    score: number;
    summary:string;
    flags: string[];
    blast_radius: string;
}

// 2. Shape of Rollback plan
export interface RollbackPlan {
    strategy: "revert" | "reset";
    commands: string[];
    notes: string;
}

// 3. Main object shape
export const AgentState = Annotation.Root({
    // Inputs -- GITHUB
    repo_owner: Annotation<string>,
    repo_name: Annotation<string>,
    pr_number: Annotation<number>,
    commit_sha: Annotation<string>,
    diff_content: Annotation<string>,

    // Outputs -- AI
    risk_analysis: Annotation<RiskAssessment>,
    rollback_plan: Annotation<RollbackPlan>,

    // Human Interaction
    human_decision: Annotation<"APPROVE" | "REJECT" | "PENDING">,
});