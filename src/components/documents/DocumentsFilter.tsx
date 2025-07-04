import React from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

interface DocumentsFilterProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  isDarkMode?: boolean;
}

const DocumentsFilter = ({
  onSearch = () => {},
  searchQuery = "",
  isDarkMode = true,
}: DocumentsFilterProps) => {
  const [query, setQuery] = React.useState(searchQuery);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full p-4 flex items-center justify-between gap-4 border-b border-border bg-card animate-slide-down">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={query}
            onChange={handleSearch}
            className="pl-10 rounded-full bg-secondary/50 text-foreground placeholder:text-muted-foreground glass-effect"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentsFilter;
