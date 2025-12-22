/**
 * Database Schema Types
 * 
 * This file will contain Supabase-generated database types.
 * Generate these types using: npx supabase gen types typescript
 */

export interface Database {
  public: {
    Tables: {
      deployments: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          repository_url: string;
          branch: string;
          commit_sha: string;
          status: string;
          metadata: Record<string, unknown>;
        };
        Insert: Omit<Database['public']['Tables']['deployments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['deployments']['Insert']>;
      };
      approvals: {
        Row: {
          id: string;
          created_at: string;
          deployment_id: string;
          approver: string;
          status: 'pending' | 'approved' | 'rejected';
          message?: string;
        };
        Insert: Omit<Database['public']['Tables']['approvals']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['approvals']['Insert']>;
      };
    };
  };
}
