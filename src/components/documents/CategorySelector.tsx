import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Folder, FolderOpen } from "lucide-react";

interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  selectedSubcategory: string;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  availableSubcategories: { id: string; name: string }[];
  isDarkMode?: boolean;
}

const CategorySelector = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  availableSubcategories,
  isDarkMode = true,
}: CategorySelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-full bg-blue-500/10">
          <Folder className="h-4 w-4 text-blue-500" />
        </div>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
            <SelectValue placeholder="Selecionar Categoria" />
          </SelectTrigger>
          <SelectContent className="glass-effect">
            <SelectItem value="all">Todas Categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategory !== "all" && (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-amber-500/10">
            <FolderOpen className="h-4 w-4 text-amber-500" />
          </div>
          <Select
            value={selectedSubcategory}
            onValueChange={onSubcategoryChange}
          >
            <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
              <SelectValue placeholder="Selecionar Subcategoria" />
            </SelectTrigger>
            <SelectContent className="glass-effect">
              <SelectItem value="all">Todas Subcategorias</SelectItem>
              {availableSubcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.name}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
