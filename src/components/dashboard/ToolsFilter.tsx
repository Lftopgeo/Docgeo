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
    <div className="w-full p-4 flex items-center justify-between gap-4 border-b border-border bg-card animate-slide-down">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ferramentas IA..."
            value={query}
            onChange={handleSearch}
            className="pl-10 rounded-full bg-secondary/50 text-foreground placeholder:text-muted-foreground glass-effect"
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "cursor-pointer hover:bg-secondary px-3 py-1 transition-colors",
              selectedStatus === "all" && "bg-secondary text-foreground"
            )}
            onClick={() => handleStatusChange("all")}
          >
            Todos
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "cursor-pointer hover:bg-green-500/10 px-3 py-1 transition-colors",
              selectedStatus === "active" && "bg-green-500/10 text-green-500 border-green-500/20"
            )}
            onClick={() => handleStatusChange("active")}
          >
            Ativo
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "cursor-pointer hover:bg-amber-500/10 px-3 py-1 transition-colors",
              selectedStatus === "maintenance" && "bg-amber-500/10 text-amber-500 border-amber-500/20"
            )}
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
            <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="glass-effect">
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
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full hover-lift transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar Nova Ferramenta
        </Button>
      </div>
    </div>
  );
};

export default ToolsFilter;
