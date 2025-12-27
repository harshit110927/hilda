// ai/graph.ts
import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState } from "./state";
import { riskAnalysisNode } from "./agents/risk";
import { rollbackNode } from "./agents/rollback";

// 1. Initialize the Graph
const workflow = new StateGraph(AgentState);

// 2. Add Nodes 
workflow.addNode("risk_node", riskAnalysisNode);
workflow.addNode("rollback_node", rollbackNode);

// 3. Add Edges 
// We cast to 'any' to silence strict type checks during the transition
workflow.addEdge(START, "risk_node" as any);
workflow.addEdge("risk_node" as any, "rollback_node" as any);
workflow.addEdge("rollback_node" as any, END);

// 4. Compile
export const graph = workflow.compile();