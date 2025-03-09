"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ToolsOverview from "@/components/dashboard/ToolsOverview";
import AddToolDialog from "@/components/dashboard/AddToolDialog";
import ToolDetailsDialog from "@/components/dashboard/ToolDetailsDialog";
import { useTools } from "@/hooks/useSupabase";
import { Database } from "@/lib/supabase/database.types";

// Define o tipo Tool conforme esperado pelo componente ToolsOverview
interface Tool {
  id: string;
  name: string;
  description: string;
  status: "active" | "maintenance";
  category: string;
  lastUpdated: string;
  imageUrl: string;
}

// Define o tipo ToolFormData conforme esperado pelo componente AddToolDialog
interface ToolFormData {
  name: string;
  description: string;
  category: string;
  status: "active" | "maintenance";
  imageUrl?: string;
  apiEndpoint?: string;
  isPublic: boolean;
}

// Função para adaptar os dados do Supabase para o formato esperado pelo componente
function adaptSupabaseTools(
  supabaseTools: Database["public"]["Tables"]["tools"]["Row"][]
): Tool[] {
  return supabaseTools.map((tool) => ({
    id: tool.id,
    name: tool.name,
    description: tool.description || "",
    status: tool.status,
    category: tool.category,
    lastUpdated: tool.last_updated,
    imageUrl: tool.image_url || "",
  }));
}

// Função para adaptar os dados do formato do formulário para o formato do Supabase
function adaptToolForSupabase(
  tool: ToolFormData
): Omit<Database["public"]["Tables"]["tools"]["Insert"], "id" | "created_by" | "created_at"> {
  // Converter o formato da categoria (de kebab-case para Title Case)
  const categoryMap: Record<string, string> = {
    "fast-processing": "Fast Processing",
    "creative-suite": "Creative Suite",
    "smart-coding": "Smart Coding"
  };

  return {
    name: tool.name,
    description: tool.description,
    status: tool.status,
    category: categoryMap[tool.category] || tool.category,
    last_updated: new Date().toISOString(),
    image_url: tool.imageUrl,
    api_endpoint: tool.apiEndpoint,
    is_public: tool.isPublic
  };
}

export default function AIToolsPage() {
  const router = useRouter();
  const [activePath, setActivePath] = useState("/ai-tools");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddToolDialogOpen, setIsAddToolDialogOpen] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { tools: supabaseTools, loading, error, addTool, updateTool, deleteTool } = useTools();

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("ai_tools_dashboard_theme");
    if (savedTheme !== null) {
      setIsDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  // Local state for tools (will be replaced by Supabase data)
  const [localTools, setLocalTools] = useState<Tool[]>([
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

  // Use Supabase tools when available, otherwise use local tools
  const tools = loading ? localTools : adaptSupabaseTools(supabaseTools || []);
  
  // Get the selected tool details
  const selectedTool = selectedToolId
    ? tools.find((tool) => tool.id === selectedToolId)
    : null;

  // Handlers
  const handleNavigate = (path: string) => {
    if (path === "/") {
      router.push("/");
    } else if (path === "/ai-tools") {
      // Já estamos na página de ferramentas de IA
      return;
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

  const handleAddTool = (formData: ToolFormData) => {
    // Add to Supabase
    addTool(adaptToolForSupabase(formData));
    setIsAddToolDialogOpen(false);
  };

  const handleEditTool = (id: string, updates: Partial<Tool>) => {
    // Update in Supabase
    updateTool(id, {
      name: updates.name,
      description: updates.description,
      status: updates.status,
      category: updates.category,
      last_updated: updates.lastUpdated,
      image_url: updates.imageUrl
    });
    setSelectedToolId(null);
  };

  const handleDeleteTool = (id: string) => {
    // Delete from Supabase
    deleteTool(id);
    setSelectedToolId(null);
  };

  const handleToolClick = (id: string) => {
    setSelectedToolId(id);
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
