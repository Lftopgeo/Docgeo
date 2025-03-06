import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, Filter, Search, Tag } from "lucide-react";

interface TasksFilterProps {
  onSearch?: (query: string) => void;
  onPriorityChange?: (priority: string) => void;
  onTagChange?: (tag: string) => void;
  onAddNewTask?: () => void;
  searchQuery?: string;
  selectedPriority?: string;
  selectedTag?: string;
  availableTags?: string[];
  isDarkMode?: boolean;
}

const TasksFilter = ({
  onSearch = () => {},
  onPriorityChange = () => {},
  onTagChange = () => {},
  onAddNewTask = () => {},
  searchQuery = "",
  selectedPriority = "all",
  selectedTag = "all",
  availableTags = [],
  isDarkMode = true,
}: TasksFilterProps) => {
  const [query, setQuery] = React.useState(searchQuery);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handlePriorityChange = (value: string) => {
    onPriorityChange(value);
  };

  const handleTagChange = (value: string) => {
    onTagChange(value);
  };

  return (
    <div
      className={`w-full h-[70px] p-4 flex items-center justify-between gap-4 ${isDarkMode ? "bg-black border-b border-blue-700" : "bg-[#FAFAFA] border-b border-[#B0BEC5]"}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas..."
            value={query}
            onChange={handleSearch}
            className={`pl-10 rounded-full ${isDarkMode ? "bg-black border-gray-700" : "bg-white border-[#B0BEC5]"}`}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedPriority} onValueChange={handlePriorityChange}>
            <SelectTrigger
              className={`w-[150px] ${isDarkMode ? "border-gray-700 bg-black" : "border-[#B0BEC5] bg-white"}`}
            >
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Prioridades</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedTag} onValueChange={handleTagChange}>
            <SelectTrigger
              className={`w-[150px] ${isDarkMode ? "border-gray-700 bg-black" : "border-[#B0BEC5] bg-white"}`}
            >
              <SelectValue placeholder="Etiqueta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Etiquetas</SelectItem>
              {availableTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onAddNewTask}
          className="bg-[#FF6B00] hover:bg-[#FF8C3F] text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar Nova Tarefa
        </Button>
      </div>
    </div>
  );
};

export default TasksFilter;
