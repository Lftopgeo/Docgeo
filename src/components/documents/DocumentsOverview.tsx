import React, { useState } from "react";
import DocumentsFilter from "./DocumentsFilter";
import DocumentsGrid from "./DocumentsGrid";
import CategorySelector from "./CategorySelector";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import AddCategoryDialog from "./AddCategoryDialog";
import AddSubcategoryDialog from "./AddSubcategoryDialog";

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

interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

interface DocumentsOverviewProps {
  documents?: Document[];
  categories?: Category[];
  onDocumentAdd?: (document: Omit<Document, "id">) => void;
  onDocumentEdit?: (id: string, updates: Partial<Document>) => void;
  onDocumentDelete?: (id: string) => void;
  onCategoryAdd?: (category: Omit<Category, "id">) => void;
  onSubcategoryAdd?: (
    categoryId: string,
    subcategory: { name: string },
  ) => void;
  isDarkMode?: boolean;
}

const DocumentsOverview = ({
  documents = [
    {
      id: "doc-1",
      title: "Project Requirements",
      description: "Detailed requirements for the AI assistant project",
      category: "Projects",
      subcategory: "Requirements",
      lastUpdated: "2 days ago",
      fileType: "PDF",
      fileSize: "2.4 MB",
    },
    {
      id: "doc-2",
      title: "User Research",
      description: "User research findings for the new dashboard",
      category: "Research",
      subcategory: "User Studies",
      lastUpdated: "1 week ago",
      fileType: "DOCX",
      fileSize: "1.8 MB",
    },
    {
      id: "doc-3",
      title: "API Documentation",
      description: "Complete API documentation for the platform",
      category: "Technical",
      subcategory: "API",
      lastUpdated: "3 days ago",
      fileType: "HTML",
      fileSize: "5.2 MB",
    },
    {
      id: "doc-4",
      title: "Marketing Plan",
      description: "Q3 marketing strategy and execution plan",
      category: "Marketing",
      subcategory: "Strategy",
      lastUpdated: "5 days ago",
      fileType: "PPTX",
      fileSize: "4.7 MB",
    },
  ],
  categories = [
    {
      id: "cat-1",
      name: "Projects",
      subcategories: [
        { id: "subcat-1", name: "Requirements" },
        { id: "subcat-2", name: "Proposals" },
        { id: "subcat-3", name: "Timelines" },
      ],
    },
    {
      id: "cat-2",
      name: "Research",
      subcategories: [
        { id: "subcat-4", name: "User Studies" },
        { id: "subcat-5", name: "Market Analysis" },
        { id: "subcat-6", name: "Competitive Research" },
      ],
    },
    {
      id: "cat-3",
      name: "Technical",
      subcategories: [
        { id: "subcat-7", name: "API" },
        { id: "subcat-8", name: "Architecture" },
        { id: "subcat-9", name: "Security" },
      ],
    },
    {
      id: "cat-4",
      name: "Marketing",
      subcategories: [
        { id: "subcat-10", name: "Strategy" },
        { id: "subcat-11", name: "Content" },
        { id: "subcat-12", name: "Analytics" },
      ],
    },
  ],
  onDocumentAdd = () => {},
  onDocumentEdit = () => {},
  onDocumentDelete = () => {},
  onCategoryAdd = () => {},
  onSubcategoryAdd = () => {},
  isDarkMode = true,
}: DocumentsOverviewProps) => {
  // State for filtering and viewing documents
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isAddSubcategoryDialogOpen, setIsAddSubcategoryDialogOpen] =
    useState(false);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] =
    useState("");

  // Filter documents based on search query, category, and subcategory
  const filteredDocuments = documents.filter((document) => {
    const matchesSearch =
      document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || document.category === selectedCategory;

    const matchesSubcategory =
      selectedSubcategory === "all" ||
      document.subcategory === selectedSubcategory;

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory("all"); // Reset subcategory when category changes
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const handleAddCategory = () => {
    setIsAddCategoryDialogOpen(true);
  };

  const handleAddSubcategory = (categoryId: string) => {
    setSelectedCategoryForSubcategory(categoryId);
    setIsAddSubcategoryDialogOpen(true);
  };

  const handleCategorySubmit = (category: { name: string }) => {
    onCategoryAdd({ name: category.name, subcategories: [] });
    setIsAddCategoryDialogOpen(false);
  };

  const handleSubcategorySubmit = (subcategory: { name: string }) => {
    onSubcategoryAdd(selectedCategoryForSubcategory, subcategory);
    setIsAddSubcategoryDialogOpen(false);
  };

  // Get available subcategories for the selected category
  const availableSubcategories =
    selectedCategory !== "all"
      ? categories.find((cat) => cat.name === selectedCategory)
          ?.subcategories || []
      : [];

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Filter bar */}
      <DocumentsFilter
        onSearch={handleSearch}
        searchQuery={searchQuery}
        isDarkMode={isDarkMode}
      />
      {/* Category selector */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card animate-slide-down" style={{ animationDelay: "100ms" }}>
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          availableSubcategories={availableSubcategories}
          isDarkMode={isDarkMode}
        />

        <div className="flex gap-2">
          {selectedCategory !== "all" && (
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-secondary transition-colors"
              onClick={() =>
                handleAddSubcategory(
                  categories.find((cat) => cat.name === selectedCategory)?.id ||
                    "",
                )
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Subcategoria
            </Button>
          )}
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full hover-lift transition-all"
            onClick={() => setIsAddCategoryDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar Categoria
          </Button>
        </div>
      </div>
      {/* Documents grid */}
      <div className="flex-1 overflow-auto p-4">
        <DocumentsGrid
          documents={filteredDocuments}
          onDocumentEdit={(id) => onDocumentEdit(id, {})}
          onDocumentDelete={onDocumentDelete}
          isDarkMode={isDarkMode}
        />
      </div>
      {/* Add Category Dialog */}
      <AddCategoryDialog
        open={isAddCategoryDialogOpen}
        onOpenChange={setIsAddCategoryDialogOpen}
        onSubmit={handleCategorySubmit}
        isDarkMode={isDarkMode}
      />
      {/* Add Subcategory Dialog */}
      <AddSubcategoryDialog
        open={isAddSubcategoryDialogOpen}
        onOpenChange={setIsAddSubcategoryDialogOpen}
        onSubmit={handleSubcategorySubmit}
        categoryName={
          categories.find((cat) => cat.id === selectedCategoryForSubcategory)
            ?.name || ""
        }
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default DocumentsOverview;
