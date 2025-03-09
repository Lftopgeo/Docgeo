'use client';

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import DocumentsFilter from "./DocumentsFilter";
import DocumentsGrid from "./DocumentsGrid";
import CategorySelector from "./CategorySelector";
import { Button } from "../ui/button";
import { Plus, Loader2 } from "lucide-react";
import AddCategoryDialog from "./AddCategoryDialog";
import AddSubcategoryDialog from "./AddSubcategoryDialog";
// Importar os diálogos dinamicamente para evitar renderização no servidor
const AddDocumentDialog = dynamic(() => import('./AddDocumentDialog'), { ssr: false });
const EditDocumentDialog = dynamic(() => import('./EditDocumentDialog'), { ssr: false });

// Definir interfaces com valores padrão para evitar erros de undefined
interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  lastUpdated: string;
  fileType: string;
  fileSize: string;
  fileUrl?: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

interface DocumentsOverviewProps {
  documents?: Document[];
  categories?: Category[];
  onDocumentAdd?: (document: Omit<Document, "id">) => Promise<boolean> | void;
  onDocumentEdit?: (id: string, updates: Partial<Document>) => void;
  onDocumentDelete?: (id: string) => void;
  onCategoryAdd?: (category: Omit<Category, "id">) => void;
  onSubcategoryAdd?: (
    categoryId: string,
    subcategory: { name: string },
  ) => void;
  isDarkMode?: boolean;
}

const DocumentsOverview = ({
  documents: initialDocuments = [
    {
      id: "doc-1",
      title: "Project Requirements",
      description: "Detailed requirements for the AI assistant project",
      category: "Projects",
      subcategory: "Requirements",
      lastUpdated: "2 days ago",
      fileType: "PDF",
      fileSize: "2.4 MB",
    },
    // ... outros documentos iniciais
  ],
  categories: initialCategories = [
    {
      id: "cat-1",
      name: "Projects",
      subcategories: [
        { id: "subcat-1", name: "Requirements" },
        { id: "subcat-2", name: "Proposals" },
        { id: "subcat-3", name: "Timelines" },
      ],
    },
    // ... outras categorias iniciais
  ],
  onDocumentAdd = () => {},
  onDocumentEdit = () => {},
  onDocumentDelete = () => {},
  onCategoryAdd = () => {},
  onSubcategoryAdd = () => {},
  isDarkMode = true,
}: DocumentsOverviewProps) => {
  // Estado para verificar se estamos no cliente
  const [isClient, setIsClient] = useState(false);
  
  // Estado para controlar diálogos
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isAddSubcategoryDialogOpen, setIsAddSubcategoryDialogOpen] = useState(false);
  const [isAddDocumentDialogOpen, setIsAddDocumentDialogOpen] = useState(false);
  const [isEditDocumentDialogOpen, setIsEditDocumentDialogOpen] = useState(false);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState("");
  const [selectedDocumentForEdit, setSelectedDocumentForEdit] = useState<Document | null>(null);
  
  // Estado para filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  
  // Estado para dados
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se estamos no cliente antes de acessar APIs de navegador
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Buscar documentos do banco de dados - apenas quando estamos no cliente
  useEffect(() => {
    // Não executar se não estivermos no cliente
    if (!isClient) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Evitar chamadas à API durante a fase de hidratação
        // Atrasar ligeiramente para garantir hidratação completa
        setTimeout(async () => {
          try {
            // Buscar documentos
            const docsResponse = await fetch('/api/documents');
            if (docsResponse.ok) {
              const docsData = await docsResponse.json();
              
              // Mapear os dados para o formato esperado pelo componente
              if (Array.isArray(docsData) && docsData.length > 0) {
                const formattedDocuments = docsData.map((doc: any) => ({
                  id: doc.id || '',
                  title: doc.title || 'Sem título',
                  description: doc.description || '',
                  category: doc.category || 'Sem categoria',
                  subcategory: doc.subcategory || 'Geral',
                  lastUpdated: new Date(doc.updated_at || doc.created_at || Date.now()).toLocaleDateString(),
                  fileType: doc.file_type || 'PDF',
                  fileSize: doc.file_size || '0 KB',
                  fileUrl: doc.file_url || null,
                }));
                
                setDocuments(formattedDocuments);
              }
            }
            
            // Buscar categorias
            const catsResponse = await fetch('/api/categories');
            if (catsResponse.ok) {
              const catsData = await catsResponse.json();
              if (Array.isArray(catsData) && catsData.length > 0) {
                setCategories(catsData);
              }
            }
            
            setIsLoading(false);
          } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setIsLoading(false);
          }
        }, 100);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isClient]); // Depende de isClient para só executar quando estiver no cliente

  // Função para lidar com a adição de documentos
  const handleDocumentSubmit = async (document: Omit<Document, "id"> & { file?: File }) => {
    // Verificar se estamos no cliente - proteção crítica
    if (!isClient) {
      console.error("Tentativa de enviar documento durante renderização do servidor");
      return false;
    }
    
    try {
      console.log("DocumentsOverview: Iniciando submissão de documento");
      
      // Verificar se há um arquivo
      if (!document.file) {
        console.log("DocumentsOverview: Nenhum arquivo incluído no upload");
        if (typeof window !== 'undefined') {
          window.alert("Por favor, selecione um arquivo para upload.");
        }
        return false;
      }
      
      console.log("DocumentsOverview: Arquivo incluído no upload:", document.file.name);
      
      // Mostrar loading
      setIsLoading(true);
      
      // Criar um FormData para enviar o arquivo - só funciona no cliente
      const formData = new FormData();
      formData.append('title', document.title);
      formData.append('description', document.description || '');
      formData.append('category', document.category || '');
      formData.append('subcategory', document.subcategory || '');
      formData.append('file', document.file);
      
      console.log("DocumentsOverview: FormData criado com sucesso");
      
      // Chamar a API para adicionar o documento
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("DocumentsOverview: Erro ao adicionar documento:", responseData.error);
        throw new Error(responseData.error || `Erro ${response.status}: Falha ao adicionar documento`);
      }
      
      console.log("DocumentsOverview: Documento adicionado com sucesso:", responseData);
      
      // Fechar o diálogo
      setIsAddDocumentDialogOpen(false);
      
      // Recarregar os documentos
      try {
        console.log("DocumentsOverview: Recarregando documentos após adição bem-sucedida");
        
        // Recarregar os documentos
        const response = await fetch('/api/documents');
        if (!response.ok) {
          console.error("DocumentsOverview: Erro ao buscar documentos atualizados", response.status);
          setIsLoading(false);
          return false;
        }
        
        const data = await response.json();
        console.log("DocumentsOverview: Documentos recarregados com sucesso", data.length);
        
        // Mapear os dados para o formato esperado pelo componente
        if (Array.isArray(data)) {
          const formattedDocuments = data.map((doc: any) => ({
            id: doc.id || '',
            title: doc.title || 'Sem título',
            description: doc.description || '',
            category: doc.category || 'Sem categoria',
            subcategory: doc.subcategory || 'Geral',
            lastUpdated: new Date(doc.updated_at || doc.created_at || Date.now()).toLocaleDateString(),
            fileType: doc.file_type || 'PDF',
            fileSize: doc.file_size || '0 KB',
            fileUrl: doc.file_url || null,
          }));
          
          setDocuments(formattedDocuments);
        }
        
        // Mostrar mensagem de sucesso
        if (typeof window !== 'undefined') {
          window.alert("Documento adicionado com sucesso!");
        }
      } catch (fetchError) {
        console.error("DocumentsOverview: Erro ao recarregar documentos:", fetchError);
      }
      
      // Esconder loading
      setIsLoading(false);
      
      // Chamar a função de callback fornecida pelo componente pai
      if (onDocumentAdd) {
        onDocumentAdd(document);
      }
      
      return true;
    } catch (err) {
      console.error('DocumentsOverview: Erro ao adicionar documento:', err);
      if (typeof window !== 'undefined') {
        window.alert(`Erro ao adicionar documento: ${err}`);
      }
      setIsLoading(false);
      // Não fechar o diálogo em caso de erro para permitir que o usuário tente novamente
      return false;
    }
  };

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory("all"); // Reset subcategory when category changes
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const handleAddCategory = () => {
    setIsAddCategoryDialogOpen(true);
  };

  const handleAddSubcategory = (categoryId: string) => {
    setSelectedCategoryForSubcategory(categoryId);
    setIsAddSubcategoryDialogOpen(true);
  };

  const handleCategorySubmit = (category: { name: string }) => {
    onCategoryAdd({ name: category.name, subcategories: [] });
    setIsAddCategoryDialogOpen(false);
  };

  const handleSubcategorySubmit = (subcategory: { name: string }) => {
    onSubcategoryAdd(selectedCategoryForSubcategory, subcategory);
    setIsAddSubcategoryDialogOpen(false);
  };

  // Handlers para documentos
  const handleDocumentEdit = async (id: string, updates: Partial<Document> = {}) => {
    // Implementação existente ou chamar a função de callback
    onDocumentEdit(id, updates);
  };

  const handleDocumentDelete = async (id: string) => {
    // Implementação existente ou chamar a função de callback
    onDocumentDelete(id);
  };

  // Filter documents based on search query, category, and subcategory
  const filteredDocuments = filterDocuments(documents, searchQuery, selectedCategory, selectedSubcategory);

  // Renderizar um fallback enquanto não estamos no cliente
  if (!isClient) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center">
          <p className={`mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Carregando interface de documentos...
          </p>
        </div>
      </div>
    );
  }

  // Renderizar um fallback enquanto carrega
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className={`mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Carregando documentos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4">
        <h1
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Documentos
        </h1>
        <Button
          onClick={() => setIsAddDocumentDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Documento
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Resto do seu componente permanece o mesmo... */}
        <div className="w-full md:w-1/4">
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
            availableSubcategories={
              categories.find((cat) => cat.name === selectedCategory)
                ?.subcategories || []
            }
            isDarkMode={isDarkMode}
          />
          {/* Botões de adicionar categoria e subcategoria */}
        </div>

        <div className="w-full md:w-3/4">
          <DocumentsFilter
            onSearch={handleSearch}
            searchQuery={searchQuery}
            isDarkMode={isDarkMode}
          />
          <div className="mt-4">
            {/* Grid de documentos */}
            <DocumentsGrid
              documents={filteredDocuments}
              onDocumentEdit={handleDocumentEdit}
              onDocumentDelete={handleDocumentDelete}
              isDarkMode={isDarkMode}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {isAddCategoryDialogOpen && (
        <AddCategoryDialog
          open={isAddCategoryDialogOpen}
          onOpenChange={setIsAddCategoryDialogOpen}
          onSubmit={handleCategorySubmit}
          isDarkMode={isDarkMode}
        />
      )}

      {isAddSubcategoryDialogOpen && (
        <AddSubcategoryDialog
          open={isAddSubcategoryDialogOpen}
          onOpenChange={setIsAddSubcategoryDialogOpen}
          onSubmit={handleSubcategorySubmit}
          categoryName={
            categories.find((cat) => cat.id === selectedCategoryForSubcategory)
              ?.name || ""
          }
          isDarkMode={isDarkMode}
        />
      )}

      {/* Use the dynamically loaded dialogs only when necessary */}
      {isClient && isAddDocumentDialogOpen && (
        <AddDocumentDialog
          open={isAddDocumentDialogOpen}
          onOpenChange={setIsAddDocumentDialogOpen}
          onSubmit={handleDocumentSubmit}
          categories={categories}
          selectedCategory={selectedCategory !== "all" ? selectedCategory : ""}
          isDarkMode={isDarkMode}
        />
      )}

      {isClient && isEditDocumentDialogOpen && selectedDocumentForEdit && (
        <EditDocumentDialog
          open={isEditDocumentDialogOpen}
          onOpenChange={setIsEditDocumentDialogOpen}
          onSubmit={handleDocumentEdit}
          document={selectedDocumentForEdit}
          categories={categories}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default DocumentsOverview;

// Função auxiliar para filtrar documentos
function filterDocuments(
  documents: Document[], 
  searchQuery: string, 
  selectedCategory: string, 
  selectedSubcategory: string
): Document[] {
  return documents.filter((document) => {
    const matchesSearch =
      searchQuery === "" ||
      document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || document.category === selectedCategory;

    const matchesSubcategory =
      selectedSubcategory === "all" ||
      document.subcategory === selectedSubcategory;

    return matchesSearch && matchesCategory && matchesSubcategory;
  });
}