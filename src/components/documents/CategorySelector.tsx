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
        <Folder className="h-5 w-5 text-blue-400" />
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger
            className={`w-[180px] ${isDarkMode ? "border-blue-700 bg-black" : "border-[#B0BEC5] bg-white"}`}
          >
            <SelectValue placeholder="Selecionar Categoria" />
          </SelectTrigger>
          <SelectContent>
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
          <FolderOpen className="h-5 w-5 text-blue-400" />
          <Select
            value={selectedSubcategory}
            onValueChange={onSubcategoryChange}
          >
            <SelectTrigger
              className={`w-[180px] ${isDarkMode ? "border-blue-700 bg-black" : "border-[#B0BEC5] bg-white"}`}
            >
              <SelectValue placeholder="Selecionar Subcategoria" />
            </SelectTrigger>
            <SelectContent>
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
