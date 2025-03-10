"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import SettingsOverview from "@/components/settings/SettingsOverview";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePath, setActivePath] = useState("/settings");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  // Use searchParams em vez de router.query
  useEffect(() => {
    // Exemplo de como usar searchParams
    const section = searchParams?.get("section");
    if (section) {
      // Implementar lógica de navegação para seção específica
    }
  }, [searchParams]);

  // Handlers
  const handleNavigate = (path: string) => {
    if (path === "/") {
      router.push("/");
    } else if (path === "/ai-tools") {
      router.push("/ai-tools");
    } else if (path === "/documents") {
      router.push("/documents");
    } else if (path === "/tasks") {
      router.push("/tasks");
    } else if (path === "/settings") {
      // Já estamos na página de configurações
      return;
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
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Função para salvar configurações
  const handleSaveSettings = (settings: any) => {
    console.log("Salvando configurações:", settings);
    // Aqui você implementaria a lógica para salvar as configurações no backend
    // Por exemplo, usando uma chamada API ou Supabase
    
    // O toast de sucesso agora é exibido pelo componente SettingsOverview
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
          <SettingsOverview 
            isDarkMode={isDarkMode}
            onSaveSettings={handleSaveSettings}
          />
        </div>
      </div>
    </main>
  );
} 