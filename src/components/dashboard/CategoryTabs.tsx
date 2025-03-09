import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Zap, Paintbrush, Code, LayoutGrid } from "lucide-react";

interface CategoryTabsProps {
  categories?: Array<{
    id: string;
    name: string;
    icon: "fast" | "creative" | "coding" | "all";
    count?: number;
  }>;
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  isDarkMode?: boolean;
}

const CategoryTabs = ({
  categories = [
    { id: "all", name: "Todas Ferramentas", icon: "all", count: 24 },
    { id: "fast", name: "Processamento Rápido", icon: "fast", count: 8 },
    { id: "creative", name: "Suite Criativa", icon: "creative", count: 10 },
    { id: "coding", name: "Codificação Inteligente", icon: "coding", count: 6 },
  ],
  activeCategory = "all",
  onCategoryChange = () => {},
  isDarkMode = true,
}: CategoryTabsProps) => {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "fast":
        return <Zap className="mr-2 h-4 w-4 text-amber-500" />;
      case "creative":
        return <Paintbrush className="mr-2 h-4 w-4 text-blue-500" />;
      case "coding":
        return <Code className="mr-2 h-4 w-4 text-green-500" />;
      case "all":
      default:
        return <LayoutGrid className="mr-2 h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="w-full py-2 border-b border-border bg-card animate-slide-down" style={{ animationDelay: "100ms" }}>
      <Tabs
        defaultValue={activeCategory}
        value={activeCategory}
        onValueChange={onCategoryChange}
        className="w-full max-w-4xl mx-auto"
      >
        <TabsList className="w-full bg-secondary/30 border border-border rounded-lg">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex-1 flex items-center justify-center transition-all
                data-[state=active]:bg-primary/10 data-[state=active]:text-primary 
                text-foreground hover:text-primary hover:bg-secondary/50"
            >
              {getIcon(category.icon)}
              <span>{category.name}</span>
              {category.count !== undefined && (
                <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground">
                  {category.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CategoryTabs;
