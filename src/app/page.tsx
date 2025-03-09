"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ToolsOverview from "@/components/dashboard/ToolsOverview";
import DocumentsOverview from "@/components/documents/DocumentsOverview";
import TasksOverview from "@/components/tasks/TasksOverview";
import AddToolDialog from "@/components/dashboard/AddToolDialog";
import ToolDetailsDialog from "@/components/dashboard/ToolDetailsDialog";
import DashboardSummary from "@/components/dashboard/DashboardSummary";

export default function Home() {
  const router = useRouter();
  const [activePath, setActivePath] = useState("/");
  const [activeView, setActiveView] = useState<
    "home" | "tools" | "documents" | "tasks"
  >("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddToolDialogOpen, setIsAddToolDialogOpen] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    // Verificar se window está definido (client-side) antes de acessar localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("ai_tools_dashboard_theme");
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
      
      // Add a class to the body for page transitions
      document.body.classList.add('animate-fade-in');
      
      return () => {
        document.body.classList.remove('animate-fade-in');
      };
    }
  }, []);

  // Mock data for tools
  const [tools, setTools] = useState([
    {
      id: "tool-1",
      name: "AI Assistant",
      description:
        "Powerful AI assistant for answering questions and completing tasks with natural language processing capabilities.",
      status: "active" as const,
      category: "Fast Processing",
      lastUpdated: "2 days ago",
      imageUrl:
        "https://images.unsplash.com/photo-1677442135968-6bd241f26c68?w=300&q=80",
    },
    {
      id: "tool-2",
      name: "Image Generator",
      description:
        "Create stunning images from text descriptions using advanced AI models.",
      status: "active" as const,
      category: "Creative Suite",
      lastUpdated: "1 week ago",
      imageUrl:
        "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=300&q=80",
    },
    {
      id: "tool-3",
      name: "Code Analyzer",
      description:
        "Analyze and optimize your code with AI-powered suggestions and bug detection.",
      status: "maintenance" as const,
      category: "Smart Coding",
      lastUpdated: "3 days ago",
      imageUrl:
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300&q=80",
    },
    {
      id: "tool-4",
      name: "Data Visualizer",
      description:
        "Transform complex data into intuitive visualizations with AI assistance.",
      status: "active" as const,
      category: "Fast Processing",
      lastUpdated: "5 days ago",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=80",
    },
    {
      id: "tool-5",
      name: "Content Writer",
      description:
        "Generate high-quality content for blogs, articles, and marketing materials.",
      status: "active" as const,
      category: "Creative Suite",
      lastUpdated: "2 weeks ago",
      imageUrl:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&q=80",
    },
    {
      id: "tool-6",
      name: "Voice Transcriber",
      description:
        "Convert audio to text with high accuracy using advanced speech recognition.",
      status: "maintenance" as const,
      category: "Fast Processing",
      lastUpdated: "1 day ago",
      imageUrl:
        "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&q=80",
    },
  ]);

  // Get the selected tool details
  const selectedTool = selectedToolId
    ? tools.find((tool) => tool.id === selectedToolId)
    : null;

  // Handlers
  const handleNavigate = (path: string) => {
    if (path === "/") {
      setActivePath(path);
      setActiveView("home");
    } else if (path === "/ai-tools") {
      router.push("/ai-tools");
    } else if (path === "/documents") {
      router.push("/documents");
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

  // Interface para o tipo ToolFormData
  interface ToolFormData {
    name: string;
    description: string;
    category: string;
    status: "active" | "maintenance";
    imageUrl?: string;
    apiEndpoint?: string;
    isPublic: boolean;
  }

  const handleAddTool = (formData: ToolFormData) => {
    const id = `tool-${tools.length + 1}`;
    const newTool = {
      id,
      name: formData.name,
      description: formData.description,
      status: formData.status,
      category: formData.category,
      lastUpdated: new Date().toLocaleDateString(),
      imageUrl: formData.imageUrl || "https://via.placeholder.com/300",
    };
    
    setTools([...tools, newTool]);
    setIsAddToolDialogOpen(false);
  };

  const handleEditTool = (id: string, updates: Partial<(typeof tools)[0]>) => {
    setTools(
      tools.map((tool) => (tool.id === id ? { ...tool, ...updates } : tool)),
    );
    setSelectedToolId(null);
  };

  const handleDeleteTool = (id: string) => {
    setTools(tools.filter((tool) => tool.id !== id));
    setSelectedToolId(null);
  };

  const handleToolClick = (id: string) => {
    setSelectedToolId(id);
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("ai_tools_dashboard_theme", JSON.stringify(newTheme));
    
    // Adiciona classe ao body para controlar o tema
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <main
      className={`flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300`}
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
        <div className="flex-1 overflow-auto">
          {activeView === "home" ? (
            <DashboardSummary
              isDarkMode={isDarkMode}
              onNavigate={handleNavigate}
            />
          ) : activeView === "tools" ? (
            <ToolsOverview
              tools={tools}
              onToolAdd={(toolData) => {
                // Converter de Tool para ToolFormData
                const formData: ToolFormData = {
                  name: toolData.name,
                  description: toolData.description,
                  category: toolData.category,
                  status: toolData.status,
                  imageUrl: toolData.imageUrl,
                  isPublic: true
                };
                handleAddTool(formData);
              }}
              onToolEdit={handleEditTool}
              onToolDelete={handleDeleteTool}
              isDarkMode={isDarkMode}
            />
          ) : activeView === "documents" ? (
            <DocumentsOverview
              onCategoryAdd={(category) =>
                console.log("Add category", category)
              }
              onSubcategoryAdd={(categoryId, subcategory) =>
                console.log("Add subcategory", categoryId, subcategory)
              }
              onDocumentAdd={(document) =>
                console.log("Add document", document)
              }
              onDocumentEdit={(id, updates) =>
                console.log("Edit document", id, updates)
              }
              onDocumentDelete={(id) => console.log("Delete document", id)}
              isDarkMode={isDarkMode}
            />
          ) : activeView === "tasks" ? (
            <TasksOverview
              onTaskAdd={(task) => console.log("Add task", task)}
              onTaskEdit={(id, updates) =>
                console.log("Edit task", id, updates)
              }
              onTaskDelete={(id) => console.log("Delete task", id)}
              isDarkMode={isDarkMode}
            />
          ) : null}
        </div>
      </div>
      {/* Add Tool Dialog */}
      <AddToolDialog
        open={isAddToolDialogOpen}
        onOpenChange={setIsAddToolDialogOpen}
        onSubmit={handleAddTool}
        onCancel={() => setIsAddToolDialogOpen(false)}
      />
      {/* Tool Details Dialog */}
      {selectedTool && (
        <ToolDetailsDialog
          open={!!selectedToolId}
          onOpenChange={(open) => {
            if (!open) setSelectedToolId(null);
          }}
          tool={selectedTool}
          onEdit={() => console.log("Edit tool", selectedToolId)}
          onShare={() => console.log("Share tool", selectedToolId)}
        />
      )}
    </main>
  );
}
