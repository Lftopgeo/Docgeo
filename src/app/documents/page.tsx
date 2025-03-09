"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import DocumentsOverview from "@/components/documents/DocumentsOverview";
import { Loader2 } from "lucide-react";

// Define o tipo Document conforme esperado pelo componente DocumentsOverview
interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  lastUpdated: string;
  fileType: string;
  fileSize: string;
}

// Define o tipo DocumentFormData conforme esperado pelo componente AddDocumentDialog
interface DocumentFormData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  file?: File;
}

export default function DocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePath, setActivePath] = useState("/documents");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    try {
      // Usar a mesma chave de tema que a página ai-tools
      const savedTheme = localStorage.getItem("ai_tools_dashboard_theme");
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
      
      // Simular um pequeno atraso para garantir que tudo seja carregado
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Erro ao inicializar a página:", err);
      setIsLoading(false);
    }
  }, []);

  // Use searchParams em vez de router.query
  useEffect(() => {
    try {
      // Exemplo de como usar searchParams
      const category = searchParams?.get("category");
      if (category) {
        // Implementar lógica de filtragem por categoria
      }
    } catch (err) {
      console.error("Erro ao processar parâmetros de URL:", err);
    }
  }, [searchParams]);

  // Handlers
  const handleNavigate = (path: string) => {
    try {
      if (path === "/") {
        router.push("/");
      } else if (path === "/ai-tools") {
        router.push("/ai-tools");
      } else if (path === "/documents") {
        // Já estamos na página de documentos
        return;
      } else if (path === "/tasks") {
        router.push("/tasks");
      } else if (path === "/settings") {
        router.push("/settings");
      } else if (path === "/help") {
        // Implementar quando a página de ajuda estiver disponível
        alert("Página de ajuda em desenvolvimento");
      } else {
        router.push(path);
      }
    } catch (err) {
      console.error("Erro ao navegar:", err);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleThemeToggle = () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      // Usar a mesma chave de tema que a página ai-tools
      localStorage.setItem("ai_tools_dashboard_theme", JSON.stringify(newTheme));
    } catch (err) {
      console.error("Erro ao alternar tema:", err);
    }
  };

  // Função para lidar com a adição de documentos
  const handleDocumentAdd = async (document: DocumentFormData) => {
    try {
      console.log("Iniciando upload de documento:", document.title);
      
      // Preparar os dados para envio
      const formData = new FormData();
      formData.append('title', document.title);
      formData.append('description', document.description || '');
      formData.append('category', document.category || 'Sem categoria');
      formData.append('subcategory', document.subcategory || 'Geral');
      
      if (document.file) {
        console.log("Anexando arquivo:", document.file.name);
        formData.append('file', document.file);
      } else {
        console.log("Nenhum arquivo anexado");
      }
      
      // Enviar para a API
      console.log("Enviando requisição para a API...");
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      
      // Verificar se a resposta é OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }));
        console.error("Erro na resposta da API:", response.status, errorData);
        throw new Error(errorData.error || `Erro ${response.status}: Falha ao adicionar documento`);
      }
      
      // Processar a resposta
      const data = await response.json();
      console.log("Documento adicionado com sucesso:", data);
      
      // Recarregar a página para mostrar o novo documento
      window.location.reload();
      return true;
    } catch (error: any) {
      console.error('Erro ao adicionar documento:', error);
      alert(`Erro ao adicionar documento: ${error.message || "Falha desconhecida"}`);
      return false;
    }
  };
    
  // Renderizar um fallback enquanto carrega
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-lg text-white">Carregando Docgeo...</p>
        </div>
      </div>
    );
  }
  
  return (
    <main
      className={`flex h-screen overflow-hidden ${isDarkMode ? "dark-theme bg-[#0F172A] text-white" : "light-theme bg-[#FAFAFA] text-[#212121]"}`}
    >
      {/* Sidebar */}
      <Sidebar
        activePath={activePath}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
      />
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          onSearch={handleSearch}
          onThemeToggle={handleThemeToggle}
          isDarkMode={isDarkMode}
          onNotificationsClick={() => console.log("Notifications clicked")}
          onSettingsClick={() => console.log("Settings clicked")}
          onHelpClick={() => console.log("Help clicked")}
          onLogoutClick={() => console.log("Logout clicked")}
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <DocumentsOverview
            onCategoryAdd={(category) => console.log("Add category", category)}
            onSubcategoryAdd={(categoryId, subcategory) =>
              console.log("Add subcategory", categoryId, subcategory)
            }
            onDocumentAdd={handleDocumentAdd}
            onDocumentEdit={(id, updates) =>
              console.log("Edit document", id, updates)
            }
            onDocumentDelete={(id) => console.log("Delete document", id)}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </main>
  );
}
