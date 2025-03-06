import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, Filter, Search } from "lucide-react";
import { cn } from "../../lib/utils";

interface ToolsFilterProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (category: string) => void;
  onStatusChange?: (status: string) => void;
  onAddNewTool?: () => void;
  searchQuery?: string;
  selectedCategory?: string;
  selectedStatus?: string;
  isDarkMode?: boolean;
}

const ToolsFilter = ({
  onSearch = () => {},
  onFilterChange = () => {},
  onStatusChange = () => {},
  onAddNewTool = () => {},
  searchQuery = "",
  selectedCategory = "all",
  selectedStatus = "all",
  isDarkMode = true,
}: ToolsFilterProps) => {
  const [query, setQuery] = React.useState(searchQuery);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange(value);
  };

  const handleStatusChange = (value: string) => {
    onStatusChange(value);
  };

  return (
    <div
      className={`w-full h-[70px] p-4 flex items-center justify-between gap-4 ${isDarkMode ? "bg-[#0F172A] border-b border-blue-700" : "bg-[#FAFAFA] border-b border-[#B0BEC5]"}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ferramentas IA..."
            value={query}
            onChange={handleSearch}
            className={`pl-10 rounded-full ${isDarkMode ? "bg-[#0F172A] border-gray-700" : "bg-white border-[#B0BEC5]"}`}
          />
        </div>

        <div className="flex items-center gap-2 text-[#cdc6c6]">
          <Badge
            variant="outline"
            className={
              cn(
                "cursor-pointer hover:bg-accent px-3 py-1",
                selectedStatus === "all" && "bg-accent text-accent-foreground",
              ) + " bg-[#625c5c]"
            }
            onClick={() => handleStatusChange("all")}
          >
            Todos
          </Badge>
          <Badge
            variant="outline"
            className={
              cn(
                "cursor-pointer hover:bg-green-900/30 px-3 py-1",
                selectedStatus === "active" && "bg-green-900/30 text-green-400",
              ) + " text-green-400"
            }
            onClick={() => handleStatusChange("active")}
          >
            Ativo
          </Badge>
          <Badge
            variant="outline"
            className={
              cn(
                "cursor-pointer hover:bg-amber-900/30 px-3 py-1",
                selectedStatus === "maintenance" &&
                  "bg-amber-900/30 text-amber-400",
              ) + " text-amber-400"
            }
            onClick={() => handleStatusChange("maintenance")}
          >
            Manutenção
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger
              className={`w-[180px] ${isDarkMode ? "border-gray-700 bg-[#0F172A]" : "border-[#B0BEC5] bg-white"}`}
            >
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              <SelectItem value="fast-processing">
                Processamento Rápido
              </SelectItem>
              <SelectItem value="creative-suite">Suite Criativa</SelectItem>
              <SelectItem value="smart-coding">
                Codificação Inteligente
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onAddNewTool}
          className="bg-[#FF6B00] hover:bg-[#FF8C3F] text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar Nova Ferramenta
        </Button>
      </div>
    </div>
  );
};

export default ToolsFilter;
