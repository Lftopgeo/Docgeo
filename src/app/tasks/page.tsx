"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import TasksOverview from "@/components/tasks/TasksOverview";
import { useTasks } from "@/hooks/useSupabase";

export default function TasksPage() {
  const router = useRouter();
  const [activePath, setActivePath] = useState("/tasks");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks();

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
      router.push("/documents");
    } else if (path === "/tasks") {
      // Já estamos na página de tarefas
      return;
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
          <TasksOverview
            tasks={loading ? [] : tasks}
            onTaskAdd={(task) => {
              console.log("Add task", task);
              addTask(task);
            }}
            onTaskEdit={(id, updates) => {
              console.log("Edit task", id, updates);
              updateTask(id, updates);
            }}
            onTaskDelete={(id) => {
              console.log("Delete task", id);
              deleteTask(id);
            }}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </main>
  );
}
