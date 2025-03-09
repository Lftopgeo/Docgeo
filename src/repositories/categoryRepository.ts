import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  icon?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface SubcategoryCreate {
  name: string;
  description?: string;
  category_id: string;
  icon?: string;
  color?: string;
}

export interface SubcategoryUpdate {
  name?: string;
  description?: string;
  category_id?: string;
  icon?: string;
  color?: string;
}

export const categoryRepository = {
  // Cliente
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("document_categories")
      .select(`
        *,
        document_subcategories(*)
      `)
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from("document_categories")
      .select(`
        *,
        document_subcategories(*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async create(category: CategoryCreate): Promise<Category> {
    const { data, error } = await supabase
      .from("document_categories")
      .insert(category)
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      throw error;
    }

    return data;
  },

  async update(id: string, category: CategoryUpdate): Promise<Category> {
    const { data, error } = await supabase
      .from("document_categories")
      .update(category)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("document_categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  },

  // Subcategorias
  subcategory: {
    async getAll(): Promise<Subcategory[]> {
      const { data, error } = await supabase
        .from("document_subcategories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching subcategories:", error);
        throw error;
      }

      return data || [];
    },

    async getByCategoryId(categoryId: string): Promise<Subcategory[]> {
      const { data, error } = await supabase
        .from("document_subcategories")
        .select("*")
        .eq("category_id", categoryId)
        .order("name");

      if (error) {
        console.error(`Error fetching subcategories for category ${categoryId}:`, error);
        throw error;
      }

      return data || [];
    },

    async getById(id: string): Promise<Subcategory | null> {
      const { data, error } = await supabase
        .from("document_subcategories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching subcategory with id ${id}:`, error);
        throw error;
      }

      return data;
    },

    async create(subcategory: SubcategoryCreate): Promise<Subcategory> {
      const { data, error } = await supabase
        .from("document_subcategories")
        .insert(subcategory)
        .select()
        .single();

      if (error) {
        console.error("Error creating subcategory:", error);
        throw error;
      }

      return data;
    },

    async update(id: string, subcategory: SubcategoryUpdate): Promise<Subcategory> {
      const { data, error } = await supabase
        .from("document_subcategories")
        .update(subcategory)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating subcategory with id ${id}:`, error);
        throw error;
      }

      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from("document_subcategories")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(`Error deleting subcategory with id ${id}:`, error);
        throw error;
      }
    },
  },

  // Servidor
  server: {
    async getAll() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("document_categories")
        .select(`
          *,
          document_subcategories(*)
        `)
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      return data || [];
    },

    async getById(id: string) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("document_categories")
        .select(`
          *,
          document_subcategories(*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching category with id ${id}:`, error);
        throw error;
      }

      return data;
    },

    async create(category: CategoryCreate) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("document_categories")
        .insert(category)
        .select()
        .single();

      if (error) {
        console.error("Error creating category:", error);
        throw error;
      }

      return data;
    },

    async update(id: string, category: CategoryUpdate) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("document_categories")
        .update(category)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating category with id ${id}:`, error);
        throw error;
      }

      return data;
    },

    async delete(id: string) {
      const supabase = createClient();
      const { error } = await supabase
        .from("document_categories")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(`Error deleting category with id ${id}:`, error);
        throw error;
      }
    },

    // Subcategorias
    subcategory: {
      async getAll() {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("document_subcategories")
          .select("*")
          .order("name");

        if (error) {
          console.error("Error fetching subcategories:", error);
          throw error;
        }

        return data || [];
      },

      async getByCategoryId(categoryId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("document_subcategories")
          .select("*")
          .eq("category_id", categoryId)
          .order("name");

        if (error) {
          console.error(`Error fetching subcategories for category ${categoryId}:`, error);
          throw error;
        }

        return data || [];
      },

      async getById(id: string) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("document_subcategories")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error(`Error fetching subcategory with id ${id}:`, error);
          throw error;
        }

        return data;
      },

      async create(subcategory: SubcategoryCreate) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("document_subcategories")
          .insert(subcategory)
          .select()
          .single();

        if (error) {
          console.error("Error creating subcategory:", error);
          throw error;
        }

        return data;
      },

      async update(id: string, subcategory: SubcategoryUpdate) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("document_subcategories")
          .update(subcategory)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error(`Error updating subcategory with id ${id}:`, error);
          throw error;
        }

        return data;
      },

      async delete(id: string) {
        const supabase = createClient();
        const { error } = await supabase
          .from("document_subcategories")
          .delete()
          .eq("id", id);

        if (error) {
          console.error(`Error deleting subcategory with id ${id}:`, error);
          throw error;
        }
      },
    },
  },
}; 