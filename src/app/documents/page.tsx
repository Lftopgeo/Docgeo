"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import DocumentsOverview from "@/components/documents/DocumentsOverview";

export default function DocumentsPage() {
  const router = useRouter();
  const [activePath, setActivePath] = useState("/documents");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    // Verificar se window está definido (client-side) antes de acessar localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("ai_tools_dashboard_theme");
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    }
  }, []);

  // Handlers
  const handleNavigate = (path: string) => {
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
      // Implementar quando a página de configurações estiver disponível
      alert("Página de configurações em desenvolvimento");
    } else if (path === "/help") {
      // Implementar quando a página de ajuda estiver disponível
      alert("Página de ajuda em desenvolvimento");
    } else {
      router.push(path);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("ai_tools_dashboard_theme", JSON.stringify(newTheme));
  };
    
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
            onDocumentAdd={(document) => console.log("Add document", document)}
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
