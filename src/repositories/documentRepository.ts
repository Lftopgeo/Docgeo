import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export interface Document {
  id: string;
  title: string;
  description: string;
  content?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  category_id?: string;
  subcategory_id?: string;
  tags?: string[];
  author?: string;
  is_public?: boolean;
  view_count?: number;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentCreate {
  title: string;
  description?: string;
  content?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  category_id?: string;
  subcategory_id?: string;
  tags?: string[];
  author?: string;
  is_public?: boolean;
  created_by?: string;
}

export interface DocumentUpdate {
  title?: string;
  description?: string;
  content?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  category_id?: string;
  subcategory_id?: string;
  tags?: string[];
  author?: string;
  is_public?: boolean;
  view_count?: number;
}

export const documentRepository = {
  // Cliente
  async getAll(): Promise<Document[]> {
    const { data, error } = await supabase
      .from("documents")
      .select(`
        *,
        document_categories(*),
        document_subcategories(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<Document | null> {
    const { data, error } = await supabase
      .from("documents")
      .select(`
        *,
        document_categories(*),
        document_subcategories(*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching document with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async create(document: DocumentCreate): Promise<Document> {
    const { data, error } = await supabase
      .from("documents")
      .insert(document)
      .select()
      .single();

    if (error) {
      console.error("Error creating document:", error);
      throw error;
    }

    return data;
  },

  async update(id: string, document: DocumentUpdate): Promise<Document> {
    const { data, error } = await supabase
      .from("documents")
      .update(document)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating document with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting document with id ${id}:`, error);
      throw error;
    }
  },

  async incrementViewCount(id: string): Promise<void> {
    const { error } = await supabase.rpc("increment_document_view_count", {
      document_id: id,
    });

    if (error) {
      console.error(`Error incrementing view count for document with id ${id}:`, error);
      throw error;
    }
  },

  // Servidor
  server: {
    async getAll() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("documents")
        .select(`
          *,
          document_categories(*),
          document_subcategories(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching documents:", error);
        throw error;
      }

      return data || [];
    },

    async getById(id: string) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("documents")
        .select(`
          *,
          document_categories(*),
          document_subcategories(*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching document with id ${id}:`, error);
        throw error;
      }

      return data;
    },

    async create(document: DocumentCreate) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("documents")
        .insert(document)
        .select()
        .single();

      if (error) {
        console.error("Error creating document:", error);
        throw error;
      }

      return data;
    },

    async update(id: string, document: DocumentUpdate) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("documents")
        .update(document)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating document with id ${id}:`, error);
        throw error;
      }

      return data;
    },

    async delete(id: string) {
      const supabase = createClient();
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(`Error deleting document with id ${id}:`, error);
        throw error;
      }
    },
  },
}; 