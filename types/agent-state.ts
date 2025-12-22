/**
 * Agent State Types for LangGraph Workflows
 * 
 * This file defines the state structure used throughout the HILDA agent workflows.
 */

export interface AgentState {
  // Deployment information
  deploymentId?: string;
  repositoryUrl?: string;
  branch?: string;
  commitSha?: string;
  
  // Workflow state
  status: 'pending' | 'in_progress' | 'awaiting_approval' | 'approved' | 'rejected' | 'completed' | 'failed';
  currentStep?: string;
  
  // Human-in-the-loop data
  requiresApproval: boolean;
  approvalMessage?: string;
  approver?: string;
  
  // Execution metadata
  startedAt?: string;
  completedAt?: string;
  error?: string;
  
  // Context and messages
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  
  // Additional data
  metadata?: Record<string, unknown>;
}

export type AgentStateUpdate = Partial<AgentState>;
