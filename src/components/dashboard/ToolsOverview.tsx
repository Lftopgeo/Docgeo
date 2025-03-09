import React, { useState } from "react";
import ToolsFilter from "./ToolsFilter";
import CategoryTabs from "./CategoryTabs";
import ToolsGrid from "./ToolsGrid";

interface Tool {
  id: string;
  name: string;
  description: string;
  status: "active" | "maintenance";
  category: string;
  lastUpdated: string;
  imageUrl: string;
}

interface ToolsOverviewProps {
  tools?: Tool[];
  onToolAdd?: (tool: Omit<Tool, "id">) => void;
  onToolEdit?: (id: string, updates: Partial<Tool>) => void;
  onToolDelete?: (id: string) => void;
  isDarkMode?: boolean;
  onAddNewTool?: () => void;
}

const ToolsOverview = ({
  tools = [
    {
      id: "tool-1",
      name: "AI Assistant",
      description:
        "Powerful AI assistant for answering questions and completing tasks with natural language processing capabilities.",
      status: "active",
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
      status: "active",
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
      status: "maintenance",
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
      status: "active",
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
      status: "active",
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
      status: "maintenance",
      category: "Fast Processing",
      lastUpdated: "1 day ago",
      imageUrl:
        "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&q=80",
    },
  ],
  onToolAdd = () => {},
  onToolEdit = () => {},
  onToolDelete = () => {},
  isDarkMode = true,
  onAddNewTool = () => {},
}: ToolsOverviewProps) => {
  // State for filtering and viewing tools
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  // Filter tools based on search query, category, and status
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      tool.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || tool.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get the selected tool details
  const selectedTool = selectedToolId
    ? tools.find((tool) => tool.id === selectedToolId)
    : null;

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilterChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleAddNewTool = () => {
    onAddNewTool();
  };

  const handleToolClick = (id: string) => {
    setSelectedToolId(id);
  };

  const handleCloseToolDetails = () => {
    setSelectedToolId(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Filter bar */}
      <ToolsFilter
        onSearch={handleSearch}
        onFilterChange={handleCategoryFilterChange}
        onStatusChange={handleStatusChange}
        onAddNewTool={handleAddNewTool}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        isDarkMode={isDarkMode}
      />

      {/* Category tabs */}
      <CategoryTabs
        activeCategory={selectedCategory}
        onCategoryChange={handleCategoryFilterChange}
        isDarkMode={isDarkMode}
      />

      {/* Tools grid */}
      <div className="flex-1 overflow-auto p-4 animate-fade-in">
        <ToolsGrid
          tools={filteredTools}
          onToolClick={handleToolClick}
          onToolEdit={(id) => {
            setSelectedToolId(id);
          }}
          onToolDelete={onToolDelete}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Note: AddToolDialog and ToolDetailsDialog components are commented out
         as they are not yet implemented or need to be created separately */}
      {/* 
      <AddToolDialog
        open={isAddToolDialogOpen}
        onClose={handleCloseAddToolDialog}
        onSubmit={handleToolSubmit}
      />

      <ToolDetailsDialog
        open={!!selectedToolId}
        tool={selectedTool}
        onClose={handleCloseToolDetails}
        onEdit={onToolEdit}
        onDelete={(id) => {
          onToolDelete(id);
          setSelectedToolId(null);
        }}
      />
      */}
    </div>
  );
};

export default ToolsOverview;
