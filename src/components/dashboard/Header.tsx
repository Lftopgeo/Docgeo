import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onThemeToggle?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onLogoutClick?: () => void;
  isDarkMode?: boolean;
}

const Header = ({
  onSearch = () => {},
  onThemeToggle = () => {},
  onNotificationsClick = () => {},
  onSettingsClick = () => {},
  onHelpClick = () => {},
  onLogoutClick = () => {},
  isDarkMode = true,
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header
      className={`h-16 px-4 flex items-center justify-between border-b border-border animate-fade-in transition-all bg-card`}
    >
      {/* Mobile menu button - visible on small screens */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-foreground hover:text-primary transition-colors"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </Button>

      {/* Search bar */}
      <div className="relative flex-1 max-w-md animate-slide-down" style={{ animationDelay: "100ms" }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={`w-full pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all
              bg-secondary/50 text-foreground placeholder:text-muted-foreground glass-effect`}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-2 animate-slide-left" style={{ animationDelay: "150ms" }}>
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          className="text-foreground hover:text-primary hover:bg-secondary transition-colors hover-scale rounded-full"
          aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onNotificationsClick}
          className="text-foreground hover:text-primary hover:bg-secondary transition-colors hover-scale rounded-full relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </Button>

        {/* Settings dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-primary hover:bg-secondary transition-colors hover-scale rounded-full"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 animate-scale glass-effect"
          >
            <DropdownMenuLabel className="font-medium">Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer hover:bg-secondary transition-colors focus:bg-secondary focus:text-foreground"
              onClick={onSettingsClick}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-secondary transition-colors focus:bg-secondary focus:text-foreground"
              onClick={onHelpClick}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Ajuda & Suporte</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive hover:bg-destructive/10 transition-colors focus:bg-destructive/10"
              onClick={onLogoutClick}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
