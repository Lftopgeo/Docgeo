import React, { useState } from "react";
import ToolCard from "./ToolCard";

interface Tool {
  id: string;
  name: string;
  description: string;
  status: "active" | "maintenance";
  category: string;
  lastUpdated: string;
  imageUrl: string;
}

interface ToolsGridProps {
  tools?: Tool[];
  onToolClick?: (id: string) => void;
  onToolEdit?: (id: string) => void;
  onToolDelete?: (id: string) => void;
  isDarkMode?: boolean;
}

const ToolsGrid = ({
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
  onToolClick = () => {},
  onToolEdit = () => {},
  onToolDelete = () => {},
  isDarkMode = true,
}: ToolsGridProps) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <div
      className={
        ` rounded-lg w-full ${isDarkMode ? "" : ""}` +
        " px-4 opacity-100  bg-[#eaeaec]"
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-16 gap-y-14 justify-items-center">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            id={tool.id}
            name={tool.name}
            description={tool.description}
            status={tool.status}
            category={tool.category}
            lastUpdated={tool.lastUpdated}
            imageUrl={tool.imageUrl}
            isDarkMode={isDarkMode}
            onClick={() => {
              setSelectedTool(tool.id);
              onToolClick(tool.id);
            }}
            onEdit={() => onToolEdit(tool.id)}
            onDelete={() => onToolDelete(tool.id)}
          />
        ))}
      </div>
      {tools.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p
            className={`text-xl mb-4 ${isDarkMode ? "text-white" : "text-[#212121]"}`}
          >
            No AI tools found
          </p>
          <p className={isDarkMode ? "text-white" : "text-[#212121]"}>
            Try adjusting your filters or add a new tool to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolsGrid;
