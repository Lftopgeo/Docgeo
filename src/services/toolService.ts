import { 
  toolRepository, 
  Tool as RepoTool, 
  ToolCreate as RepoToolCreate, 
  ToolUpdate as RepoToolUpdate,
  ToolIntegration as RepoToolIntegration,
  ToolUsageStat as RepoToolUsageStat
} from '@/repositories';
import { storageService, STORAGE_BUCKETS } from './storageService';

// Reexportando os tipos do repositório
export type Tool = RepoTool;
export type ToolCreate = RepoToolCreate;
export type ToolUpdate = RepoToolUpdate;
export type ToolIntegration = RepoToolIntegration;
export type ToolUsageStat = RepoToolUsageStat;

// Interface para upload de imagem da ferramenta
export interface ToolWithImage extends Omit<ToolCreate, 'image_url'> {
  image?: File;
}

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
    if (!tool.name) {
      throw new Error('O nome da ferramenta é obrigatório');
    }

    return toolRepository.create(tool);
  },

  /**
   * Cria uma ferramenta com upload de imagem
   */
  async createToolWithImage(toolData: ToolWithImage): Promise<Tool> {
    try {
      let imageUrl = undefined;
      
      // Se houver uma imagem, fazer o upload
      if (toolData.image) {
        // 1. Fazer upload da imagem para o bucket de imagens de ferramentas
        const filePath = await storageService.uploadFile({
          bucket: STORAGE_BUCKETS.TOOL_IMAGES,
          file: toolData.image,
          path: `${Date.now()}-${toolData.image.name.replace(/\s+/g, '_')}`,
        });
        
        // 2. Obter a URL pública da imagem
        imageUrl = storageService.getPublicUrl(STORAGE_BUCKETS.TOOL_IMAGES, filePath);
      }
      
      // 3. Criar a ferramenta no banco de dados
      const tool: ToolCreate = {
        name: toolData.name,
        description: toolData.description,
        category: toolData.category,
        status: toolData.status,
        image_url: imageUrl,
        created_by: toolData.created_by
      };
      
      return this.createTool(tool);
    } catch (error) {
      console.error('Erro ao criar ferramenta com imagem:', error);
      throw error;
    }
  },

  async updateTool(id: string, tool: ToolUpdate): Promise<Tool> {
    return toolRepository.update(id, tool);
  },

  /**
   * Atualiza uma ferramenta com upload de imagem
   */
  async updateToolWithImage(id: string, toolData: Partial<ToolWithImage>): Promise<Tool> {
    try {
      let imageUrl = undefined;
      
      // Se houver uma imagem, fazer o upload
      if (toolData.image) {
        // 1. Fazer upload da imagem para o bucket de imagens de ferramentas
        const filePath = await storageService.uploadFile({
          bucket: STORAGE_BUCKETS.TOOL_IMAGES,
          file: toolData.image,
          path: `${Date.now()}-${toolData.image.name.replace(/\s+/g, '_')}`,
          upsert: true
        });
        
        // 2. Obter a URL pública da imagem
        imageUrl = storageService.getPublicUrl(STORAGE_BUCKETS.TOOL_IMAGES, filePath);
      }
      
      // 3. Atualizar a ferramenta no banco de dados
      const toolUpdate: ToolUpdate = {
        name: toolData.name,
        description: toolData.description,
        category: toolData.category,
        status: toolData.status
      };
      
      // Adicionar a URL da imagem apenas se uma nova imagem foi enviada
      if (imageUrl) {
        toolUpdate.image_url = imageUrl;
      }
      
      return this.updateTool(id, toolUpdate);
    } catch (error) {
      console.error(`Erro ao atualizar ferramenta ${id} com imagem:`, error);
      throw error;
    }
  },

  async deleteTool(id: string): Promise<void> {
    return toolRepository.delete(id);
  },

  /**
   * Exclui uma ferramenta e sua imagem
   */
  async deleteToolWithImage(id: string): Promise<void> {
    try {
      // 1. Obter a ferramenta para pegar o caminho da imagem
      const tool = await this.getToolById(id);
      
      if (!tool) {
        throw new Error(`Ferramenta com ID ${id} não encontrada`);
      }
      
      // 2. Excluir a ferramenta do banco de dados
      await this.deleteTool(id);
      
      // 3. Se houver uma imagem, excluí-la do storage
      if (tool.image_url) {
        // Extrair o caminho da imagem da URL
        const url = new URL(tool.image_url);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/tool_images\/(.+)$/);
        
        if (pathMatch && pathMatch[1]) {
          const imagePath = decodeURIComponent(pathMatch[1]);
          await storageService.deleteFile(STORAGE_BUCKETS.TOOL_IMAGES, imagePath);
        }
      }
    } catch (error) {
      console.error(`Erro ao excluir ferramenta ${id} com imagem:`, error);
      throw error;
    }
  },

  async getToolIntegrations(toolId: string): Promise<ToolIntegration[]> {
    return toolRepository.integration.getByToolId(toolId);
  },

  async createToolIntegration(integration: { tool_id: string; integration_name: string; status: string }): Promise<ToolIntegration> {
    // Adaptar o formato da integração para o formato esperado pelo repositório
    const repoIntegration: Omit<ToolIntegration, "id" | "created_at" | "updated_at"> = {
      tool_id: integration.tool_id,
      integration_type: integration.integration_name,
      status: integration.status
    };
    return toolRepository.integration.create(repoIntegration);
  },

  async updateToolIntegration(id: string, integration: { integration_name?: string; status?: string }): Promise<ToolIntegration> {
    // Adaptar o formato da integração para o formato esperado pelo repositório
    const repoIntegration: Partial<ToolIntegration> = {
      integration_type: integration.integration_name,
      status: integration.status
    };
    return toolRepository.integration.update(id, repoIntegration);
  },

  async deleteToolIntegration(id: string): Promise<void> {
    return toolRepository.integration.delete(id);
  },

  async getToolUsageStats(toolId: string): Promise<ToolUsageStat[]> {
    return toolRepository.usageStat.getByToolId(toolId);
  },

  async createToolUsageStat(stat: { tool_id: string; date: string; requests: number; success_rate: number; average_response_time: number }): Promise<ToolUsageStat> {
    // Adaptar o formato da estatística para o formato esperado pelo repositório
    const today = stat.date || new Date().toISOString().split("T")[0];
    
    // Registrar o uso da ferramenta
    await toolRepository.usageStat.recordUsage(stat.tool_id);
    
    // Como o método recordUsage não retorna a estatística criada,
    // vamos buscar as estatísticas mais recentes para esta ferramenta
    const stats = await this.getToolUsageStats(stat.tool_id);
    return stats[0]; // Retorna a estatística mais recente
  },

  async updateToolUsageStat(id: string, stat: { requests?: number; success_rate?: number; average_response_time?: number }): Promise<ToolUsageStat> {
    // Como não temos um método direto para atualizar estatísticas no repositório,
    // esta funcionalidade precisaria ser implementada no repositório primeiro
    throw new Error("Método não implementado: updateToolUsageStat");
  },

  async deleteToolUsageStat(id: string): Promise<void> {
    // Como não temos um método direto para excluir estatísticas no repositório,
    // esta funcionalidade precisaria ser implementada no repositório primeiro
    throw new Error("Método não implementado: deleteToolUsageStat");
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

  // Integrações
  integration: {
    async getByToolId(toolId: string): Promise<ToolIntegration[]> {
      return toolRepository.integration.getByToolId(toolId);
    },

    async create(integration: Omit<ToolIntegration, "id" | "created_at" | "updated_at">): Promise<ToolIntegration> {
      return toolRepository.integration.create(integration);
    },

    async update(id: string, integration: Partial<ToolIntegration>): Promise<ToolIntegration> {
      return toolRepository.integration.update(id, integration);
    },

    async delete(id: string): Promise<void> {
      return toolRepository.integration.delete(id);
    }
  },

  // Estatísticas de uso
  usageStat: {
    async getByToolId(toolId: string): Promise<ToolUsageStat[]> {
      return toolRepository.usageStat.getByToolId(toolId);
    },

    async recordUsage(toolId: string, userId?: string): Promise<void> {
      return toolRepository.usageStat.recordUsage(toolId, userId);
    }
  }
}; 