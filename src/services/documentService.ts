import { 
  documentRepository, 
  Document, 
  DocumentCreate, 
  DocumentUpdate,
  categoryRepository,
  Category,
  Subcategory
} from '@/repositories';

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
}; 