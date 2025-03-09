import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export interface Tool {
  id: string;
  name: string;
  description?: string;
  status?: string;
  category?: string;
  last_updated?: string;
  image_url?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
}

export interface ToolCreate {
  name: string;
  description?: string;
  status?: string;
  category?: string;
  image_url?: string;
  created_by?: string;
}

export interface ToolUpdate {
  name?: string;
  description?: string;
  status?: string;
  category?: string;
  last_updated?: string;
  image_url?: string;
}

export interface ToolIntegration {
  id: string;
  tool_id: string;
  integration_type: string;
  integration_url?: string;
  api_key?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ToolUsageStat {
  id: string;
  tool_id: string;
  user_id?: string;
  usage_date: string;
  usage_count: number;
  created_at?: string;
}

export const toolRepository = {
  // Cliente
  async getAll(): Promise<Tool[]> {
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching tools:", error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<Tool | null> {
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching tool with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async getByCategory(category: string): Promise<Tool[]> {
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("category", category)
      .order("name");

    if (error) {
      console.error(`Error fetching tools with category ${category}:`, error);
      throw error;
    }

    return data || [];
  },

  async create(tool: ToolCreate): Promise<Tool> {
    const { data, error } = await supabase
      .from("tools")
      .insert(tool)
      .select()
      .single();

    if (error) {
      console.error("Error creating tool:", error);
      throw error;
    }

    return data;
  },

  async update(id: string, tool: ToolUpdate): Promise<Tool> {
    const { data, error } = await supabase
      .from("tools")
      .update({
        ...tool,
        last_updated: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating tool with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("tools")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting tool with id ${id}:`, error);
      throw error;
    }
  },

  // Integrações
  integration: {
    async getByToolId(toolId: string): Promise<ToolIntegration[]> {
      const { data, error } = await supabase
        .from("tool_integrations")
        .select("*")
        .eq("tool_id", toolId);

      if (error) {
        console.error(`Error fetching integrations for tool ${toolId}:`, error);
        throw error;
      }

      return data || [];
    },

    async create(integration: Omit<ToolIntegration, "id" | "created_at" | "updated_at">): Promise<ToolIntegration> {
      const { data, error } = await supabase
        .from("tool_integrations")
        .insert(integration)
        .select()
        .single();

      if (error) {
        console.error("Error creating tool integration:", error);
        throw error;
      }

      return data;
    },

    async update(id: string, integration: Partial<ToolIntegration>): Promise<ToolIntegration> {
      const { data, error } = await supabase
        .from("tool_integrations")
        .update(integration)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating tool integration with id ${id}:`, error);
        throw error;
      }

      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from("tool_integrations")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(`Error deleting tool integration with id ${id}:`, error);
        throw error;
      }
    },
  },

  // Estatísticas de uso
  usageStat: {
    async getByToolId(toolId: string): Promise<ToolUsageStat[]> {
      const { data, error } = await supabase
        .from("tool_usage_stats")
        .select("*")
        .eq("tool_id", toolId)
        .order("usage_date", { ascending: false });

      if (error) {
        console.error(`Error fetching usage stats for tool ${toolId}:`, error);
        throw error;
      }

      return data || [];
    },

    async recordUsage(toolId: string, userId?: string): Promise<void> {
      const today = new Date().toISOString().split("T")[0];

      // Verificar se já existe um registro para hoje
      const { data: existingData, error: fetchError } = await supabase
        .from("tool_usage_stats")
        .select("*")
        .eq("tool_id", toolId)
        .eq("usage_date", today)
        .eq("user_id", userId || "anonymous")
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 é o código para "não encontrado", que é esperado se não houver registro
        console.error(`Error checking existing usage stats:`, fetchError);
        throw fetchError;
      }

      if (existingData) {
        // Atualizar o registro existente
        const { error: updateError } = await supabase
          .from("tool_usage_stats")
          .update({
            usage_count: existingData.usage_count + 1,
          })
          .eq("id", existingData.id);

        if (updateError) {
          console.error(`Error updating usage stats:`, updateError);
          throw updateError;
        }
      } else {
        // Criar um novo registro
        const { error: insertError } = await supabase
          .from("tool_usage_stats")
          .insert({
            tool_id: toolId,
            user_id: userId || "anonymous",
            usage_date: today,
            usage_count: 1,
          });

        if (insertError) {
          console.error(`Error inserting usage stats:`, insertError);
          throw insertError;
        }
      }
    },
  },

  // Servidor
  server: {
    async getAll() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching tools:", error);
        throw error;
      }

      return data || [];
    },

    async getById(id: string) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching tool with id ${id}:`, error);
        throw error;
      }

      return data;
    },

    async getByCategory(category: string) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("category", category)
        .order("name");

      if (error) {
        console.error(`Error fetching tools with category ${category}:`, error);
        throw error;
      }

      return data || [];
    },

    async create(tool: ToolCreate) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tools")
        .insert(tool)
        .select()
        .single();

      if (error) {
        console.error("Error creating tool:", error);
        throw error;
      }

      return data;
    },

    async update(id: string, tool: ToolUpdate) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tools")
        .update({
          ...tool,
          last_updated: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating tool with id ${id}:`, error);
        throw error;
      }

      return data;
    },

    async delete(id: string) {
      const supabase = createClient();
      const { error } = await supabase
        .from("tools")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(`Error deleting tool with id ${id}:`, error);
        throw error;
      }
    },
  },
}; 