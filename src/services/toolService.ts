import { 
  toolRepository, 
  Tool, 
  ToolCreate, 
  ToolUpdate,
  ToolIntegration,
  ToolUsageStat
} from '@/repositories';

export const toolService = {
  async getAllTools(): Promise<Tool[]> {
    return toolRepository.getAll();
  },

  async getToolById(id: string): Promise<Tool | null> {
    return toolRepository.getById(id);
  },

  async getToolsByCategory(category: string): Promise<Tool[]> {
    return toolRepository.getByCategory(category);
  },

  async createTool(tool: ToolCreate): Promise<Tool> {
    // Validar ferramenta
    if (!tool.name) {
      throw new Error('O nome da ferramenta é obrigatório');
    }

    return toolRepository.create(tool);
  },

  async updateTool(id: string, tool: ToolUpdate): Promise<Tool> {
    // Validar ferramenta
    if (tool.name === '') {
      throw new Error('O nome da ferramenta não pode ser vazio');
    }

    return toolRepository.update(id, tool);
  },

  async deleteTool(id: string): Promise<void> {
    return toolRepository.delete(id);
  },

  // Integrações
  integration: {
    async getByToolId(toolId: string): Promise<ToolIntegration[]> {
      return toolRepository.integration.getByToolId(toolId);
    },

    async create(integration: Omit<ToolIntegration, "id" | "created_at" | "updated_at">): Promise<ToolIntegration> {
      // Validar integração
      if (!integration.tool_id) {
        throw new Error('O ID da ferramenta é obrigatório');
      }

      if (!integration.integration_type) {
        throw new Error('O tipo de integração é obrigatório');
      }

      return toolRepository.integration.create(integration);
    },

    async update(id: string, integration: Partial<ToolIntegration>): Promise<ToolIntegration> {
      return toolRepository.integration.update(id, integration);
    },

    async delete(id: string): Promise<void> {
      return toolRepository.integration.delete(id);
    },
  },

  // Estatísticas de uso
  usageStat: {
    async getByToolId(toolId: string): Promise<ToolUsageStat[]> {
      return toolRepository.usageStat.getByToolId(toolId);
    },

    async recordUsage(toolId: string, userId?: string): Promise<void> {
      return toolRepository.usageStat.recordUsage(toolId, userId);
    },
  },

  // Métodos para o servidor
  server: {
    async getAllTools() {
      return toolRepository.server.getAll();
    },

    async getToolById(id: string) {
      return toolRepository.server.getById(id);
    },

    async getToolsByCategory(category: string) {
      return toolRepository.server.getByCategory(category);
    },

    async createTool(tool: ToolCreate) {
      // Validar ferramenta
      if (!tool.name) {
        throw new Error('O nome da ferramenta é obrigatório');
      }

      return toolRepository.server.create(tool);
    },

    async updateTool(id: string, tool: ToolUpdate) {
      // Validar ferramenta
      if (tool.name === '') {
        throw new Error('O nome da ferramenta não pode ser vazio');
      }

      return toolRepository.server.update(id, tool);
    },

    async deleteTool(id: string) {
      return toolRepository.server.delete(id);
    },
  },
}; 