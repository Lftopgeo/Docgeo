export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tools: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          status: "active" | "maintenance";
          category: string;
          last_updated: string;
          image_url: string | null;
          api_endpoint: string | null;
          documentation: string | null;
          created_at: string;
          created_by: string | null;
          is_public: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          status: "active" | "maintenance";
          category: string;
          last_updated?: string;
          image_url?: string | null;
          api_endpoint?: string | null;
          documentation?: string | null;
          created_at?: string;
          created_by?: string | null;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          status?: "active" | "maintenance";
          category?: string;
          last_updated?: string;
          image_url?: string | null;
          api_endpoint?: string | null;
          documentation?: string | null;
          created_at?: string;
          created_by?: string | null;
          is_public?: boolean;
        };
      };
      tool_usage_stats: {
        Row: {
          id: string;
          tool_id: string;
          requests: number;
          success_rate: number;
          average_response_time: number;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tool_id: string;
          requests?: number;
          success_rate?: number;
          average_response_time?: number;
          date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tool_id?: string;
          requests?: number;
          success_rate?: number;
          average_response_time?: number;
          date?: string;
          created_at?: string;
        };
      };
      tool_integrations: {
        Row: {
          id: string;
          tool_id: string;
          integration_name: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tool_id: string;
          integration_name: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tool_id?: string;
          integration_name?: string;
          status?: string;
          created_at?: string;
        };
      };
      document_categories: {
        Row: {
          id: string;
          name: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_by?: string | null;
          created_at?: string;
        };
      };
      document_subcategories: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category_id: string | null;
          subcategory_id: string | null;
          file_type: string | null;
          file_size: string | null;
          file_path: string | null;
          created_by: string | null;
          last_updated: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category_id?: string | null;
          subcategory_id?: string | null;
          file_type?: string | null;
          file_size?: string | null;
          file_path?: string | null;
          created_by?: string | null;
          last_updated?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category_id?: string | null;
          subcategory_id?: string | null;
          file_type?: string | null;
          file_size?: string | null;
          file_path?: string | null;
          created_by?: string | null;
          last_updated?: string;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: "todo" | "in-progress" | "completed" | "blocked";
          priority: "low" | "medium" | "high" | "urgent";
          due_date: string | null;
          assignee_id: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status: "todo" | "in-progress" | "completed" | "blocked";
          priority: "low" | "medium" | "high" | "urgent";
          due_date?: string | null;
          assignee_id?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: "todo" | "in-progress" | "completed" | "blocked";
          priority?: "low" | "medium" | "high" | "urgent";
          due_date?: string | null;
          assignee_id?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      task_tags: {
        Row: {
          id: string;
          task_id: string;
          tag: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          tag: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          tag?: string;
          created_at?: string;
        };
      };
      task_comments: {
        Row: {
          id: string;
          task_id: string;
          user_id: string | null;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          user_id?: string | null;
          comment: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          user_id?: string | null;
          comment?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
