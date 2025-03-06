"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ToolsOverview from "@/components/dashboard/ToolsOverview";
import AddToolDialog from "@/components/dashboard/AddToolDialog";
import ToolDetailsDialog from "@/components/dashboard/ToolDetailsDialog";

export default function AIToolsPage() {
  const [activePath, setActivePath] = useState("/ai-tools");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddToolDialogOpen, setIsAddToolDialogOpen] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("ai_tools_dashboard_theme");
    if (savedTheme !== null) {
      setIsDarkMode(JSON.parse(savedTheme));
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
    window.location.href = path;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddTool = (newTool: Omit<(typeof tools)[0], "id">) => {
    const id = `tool-${tools.length + 1}`;
    setTools([...tools, { ...newTool, id }]);
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
            onToolAdd={handleAddTool}
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
