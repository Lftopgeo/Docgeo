import { 
  documentRepository, 
  Document, 
  DocumentCreate, 
  DocumentUpdate,
  categoryRepository,
  Category,
  Subcategory
} from '@/repositories';
import { storageService, STORAGE_BUCKETS } from './storageService';

// Interface para upload de documento com arquivo
export interface DocumentUpload extends Omit<DocumentCreate, 'file_url' | 'file_type' | 'file_size'> {
  file: File;
}

export const documentService = {
  async getAllDocuments(): Promise<Document[]> {
    return documentRepository.getAll();
  },

  async getDocumentById(id: string): Promise<Document | null> {
    return documentRepository.getById(id);
  },

  async createDocument(document: DocumentCreate): Promise<Document> {
    // Validar documento
    if (!document.title) {
      throw new Error('O título do documento é obrigatório');
    }

    return documentRepository.create(document);
  },

  async updateDocument(id: string, document: DocumentUpdate): Promise<Document> {
    // Validar documento
    if (document.title === '') {
      throw new Error('O título do documento não pode ser vazio');
    }

    return documentRepository.update(id, document);
  },

  async deleteDocument(id: string): Promise<void> {
    return documentRepository.delete(id);
  },

  async incrementViewCount(id: string): Promise<void> {
    return documentRepository.incrementViewCount(id);
  },

  async getAllCategories(): Promise<Category[]> {
    return categoryRepository.getAll();
  },

  async getCategoryById(id: string): Promise<Category | null> {
    return categoryRepository.getById(id);
  },

  async createCategory(category: { name: string; description?: string; icon?: string; color?: string }): Promise<Category> {
    // Validar categoria
    if (!category.name) {
      throw new Error('O nome da categoria é obrigatório');
    }

    return categoryRepository.create(category);
  },

  async updateCategory(id: string, category: { name?: string; description?: string; icon?: string; color?: string }): Promise<Category> {
    // Validar categoria
    if (category.name === '') {
      throw new Error('O nome da categoria não pode ser vazio');
    }

    return categoryRepository.update(id, category);
  },

  async deleteCategory(id: string): Promise<void> {
    return categoryRepository.delete(id);
  },

  async getAllSubcategories(): Promise<Subcategory[]> {
    return categoryRepository.subcategory.getAll();
  },

  async getSubcategoriesByCategoryId(categoryId: string): Promise<Subcategory[]> {
    return categoryRepository.subcategory.getByCategoryId(categoryId);
  },

  async getSubcategoryById(id: string): Promise<Subcategory | null> {
    return categoryRepository.subcategory.getById(id);
  },

  async createSubcategory(subcategory: { name: string; description?: string; category_id: string; icon?: string; color?: string }): Promise<Subcategory> {
    // Validar subcategoria
    if (!subcategory.name) {
      throw new Error('O nome da subcategoria é obrigatório');
    }

    if (!subcategory.category_id) {
      throw new Error('A categoria da subcategoria é obrigatória');
    }

    // Verificar se a categoria existe
    const category = await categoryRepository.getById(subcategory.category_id);
    if (!category) {
      throw new Error('A categoria informada não existe');
    }

    return categoryRepository.subcategory.create(subcategory);
  },

  async updateSubcategory(id: string, subcategory: { name?: string; description?: string; category_id?: string; icon?: string; color?: string }): Promise<Subcategory> {
    // Validar subcategoria
    if (subcategory.name === '') {
      throw new Error('O nome da subcategoria não pode ser vazio');
    }

    if (subcategory.category_id) {
      // Verificar se a categoria existe
      const category = await categoryRepository.getById(subcategory.category_id);
      if (!category) {
        throw new Error('A categoria informada não existe');
      }
    }

    return categoryRepository.subcategory.update(id, subcategory);
  },

  async deleteSubcategory(id: string): Promise<void> {
    return categoryRepository.subcategory.delete(id);
  },

  // Métodos para o servidor
  server: {
    async getAllDocuments() {
      return documentRepository.server.getAll();
    },

    async getDocumentById(id: string) {
      return documentRepository.server.getById(id);
    },

    async createDocument(document: DocumentCreate) {
      // Validar documento
      if (!document.title) {
        throw new Error('O título do documento é obrigatório');
      }

      return documentRepository.server.create(document);
    },

    async updateDocument(id: string, document: DocumentUpdate) {
      // Validar documento
      if (document.title === '') {
        throw new Error('O título do documento não pode ser vazio');
      }

      return documentRepository.server.update(id, document);
    },

    async deleteDocument(id: string) {
      return documentRepository.server.delete(id);
    },

    async getAllCategories() {
      return categoryRepository.server.getAll();
    },

    async getCategoryById(id: string) {
      return categoryRepository.server.getById(id);
    },

    async createCategory(category: { name: string; description?: string; icon?: string; color?: string }) {
      // Validar categoria
      if (!category.name) {
        throw new Error('O nome da categoria é obrigatório');
      }

      return categoryRepository.server.create(category);
    },

    async updateCategory(id: string, category: { name?: string; description?: string; icon?: string; color?: string }) {
      // Validar categoria
      if (category.name === '') {
        throw new Error('O nome da categoria não pode ser vazio');
      }

      return categoryRepository.server.update(id, category);
    },

    async deleteCategory(id: string) {
      return categoryRepository.server.delete(id);
    },

    async getAllSubcategories() {
      return categoryRepository.server.subcategory.getAll();
    },

    async getSubcategoriesByCategoryId(categoryId: string) {
      return categoryRepository.server.subcategory.getByCategoryId(categoryId);
    },

    async getSubcategoryById(id: string) {
      return categoryRepository.server.subcategory.getById(id);
    },

    async createSubcategory(subcategory: { name: string; description?: string; category_id: string; icon?: string; color?: string }) {
      // Validar subcategoria
      if (!subcategory.name) {
        throw new Error('O nome da subcategoria é obrigatório');
      }

      if (!subcategory.category_id) {
        throw new Error('A categoria da subcategoria é obrigatória');
      }

      // Verificar se a categoria existe
      const category = await categoryRepository.server.getById(subcategory.category_id);
      if (!category) {
        throw new Error('A categoria informada não existe');
      }

      return categoryRepository.server.subcategory.create(subcategory);
    },

    async updateSubcategory(id: string, subcategory: { name?: string; description?: string; category_id?: string; icon?: string; color?: string }) {
      // Validar subcategoria
      if (subcategory.name === '') {
        throw new Error('O nome da subcategoria não pode ser vazio');
      }

      if (subcategory.category_id) {
        // Verificar se a categoria existe
        const category = await categoryRepository.server.getById(subcategory.category_id);
        if (!category) {
          throw new Error('A categoria informada não existe');
        }
      }

      return categoryRepository.server.subcategory.update(id, subcategory);
    },

    async deleteSubcategory(id: string) {
      return categoryRepository.server.subcategory.delete(id);
    },
  },

  /**
   * Faz upload de um documento com arquivo
   */
  async uploadDocument(documentData: DocumentUpload): Promise<Document> {
    try {
      // 1. Fazer upload do arquivo para o bucket de documentos
      const filePath = await storageService.uploadFile({
        bucket: STORAGE_BUCKETS.DOCUMENTS,
        file: documentData.file
      });

      // 2. Obter a URL pública do arquivo
      const fileUrl = storageService.getPublicUrl(STORAGE_BUCKETS.DOCUMENTS, filePath);

      // 3. Criar o documento no banco de dados
      const document: DocumentCreate = {
        title: documentData.title,
        description: documentData.description,
        file_url: fileUrl,
        file_type: documentData.file.type,
        file_size: documentData.file.size,
        category_id: documentData.category_id,
        subcategory_id: documentData.subcategory_id,
        created_by: documentData.created_by
      };

      return this.createDocument(document);
    } catch (error) {
      console.error('Erro ao fazer upload do documento:', error);
      throw error;
    }
  },

  /**
   * Exclui um documento e seu arquivo
   */
  async deleteDocumentWithFile(id: string): Promise<void> {
    try {
      // 1. Obter o documento para pegar o caminho do arquivo
      const document = await this.getDocumentById(id);
      
      if (!document) {
        throw new Error(`Documento com ID ${id} não encontrado`);
      }

      // 2. Excluir o documento do banco de dados
      await this.deleteDocument(id);

      // 3. Se houver um arquivo, excluí-lo do storage
      if (document.file_url) {
        // Extrair o caminho do arquivo da URL
        const url = new URL(document.file_url);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/documents\/(.+)$/);
        
        if (pathMatch && pathMatch[1]) {
          const filePath = decodeURIComponent(pathMatch[1]);
          await storageService.deleteFile(STORAGE_BUCKETS.DOCUMENTS, filePath);
        }
      }
    } catch (error) {
      console.error(`Erro ao excluir documento com ID ${id}:`, error);
      throw error;
    }
  },
}; 