import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Home,
  Cpu,
  FileText,
  CheckSquare,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  activePath?: string;
  onNavigate?: (path: string) => void;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  isDarkMode?: boolean;
}

const Sidebar = ({
  activePath = "/",
  onNavigate = () => {},
  userName = "Alex Johnson",
  userRole = "Admin",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  isDarkMode = true,
}: SidebarProps) => {
  const navigationItems = [
    {
      name: "Início",
      path: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Ferramentas IA",
      path: "/ai-tools",
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      name: "Documentos",
      path: "/documents",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Tarefas",
      path: "/tasks",
      icon: <CheckSquare className="w-5 h-5" />,
    },
  ];

  const utilityItems = [
    {
      name: "Configurações",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      name: "Ajuda & Suporte",
      path: "/help",
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className={`w-[250px] h-full flex flex-col transition-all duration-300 bg-card border-r border-border shadow-md`}
    >
      <div className="p-6">
        <h1
          className={`text-xl font-bold flex items-center animate-fade-in`}
        >
          <div className="p-2 rounded-full bg-primary/10 mr-2">
            <Cpu className="w-5 h-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Central de IA
          </span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <div className="mb-6 animate-slide-right" style={{ animationDelay: "100ms" }}>
          <p
            className={`text-xs font-medium uppercase tracking-wider px-3 mb-2 text-muted-foreground`}
          >
            Navegação Principal
          </p>
          <nav className="space-y-1">
            {navigationItems.map((item, index) => (
              <TooltipProvider key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activePath === item.path ? "default" : "ghost"}
                      className={cn(
                        `w-full justify-start transition-all hover-lift animate-slide-right group`,
                        activePath === item.path
                          ? `bg-primary text-primary-foreground font-medium`
                          : `text-foreground hover:text-foreground hover:bg-muted`
                      )}
                      onClick={() => onNavigate(item.path)}
                      style={{ animationDelay: `${150 + index * 50}ms` }}
                    >
                      <div className={cn(
                        "p-1 rounded-md mr-2 transition-colors",
                        activePath === item.path
                          ? "bg-primary-foreground/20"
                          : "bg-transparent group-hover:bg-muted-foreground/10"
                      )}>
                        {item.icon}
                      </div>
                      <span className="ml-1">{item.name}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="animate-fade-in">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>

        <div className="mb-6 animate-slide-right" style={{ animationDelay: "300ms" }}>
          <p
            className={`text-xs font-medium uppercase tracking-wider px-3 mb-2 text-muted-foreground`}
          >
            Utilitários
          </p>
          <nav className="space-y-1">
            {utilityItems.map((item, index) => (
              <TooltipProvider key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activePath === item.path ? "default" : "ghost"}
                      className={cn(
                        `w-full justify-start transition-all hover-lift animate-slide-right group`,
                        activePath === item.path
                          ? `bg-primary text-primary-foreground font-medium`
                          : `text-foreground hover:text-foreground hover:bg-muted`
                      )}
                      onClick={() => onNavigate(item.path)}
                      style={{ animationDelay: `${350 + index * 50}ms` }}
                    >
                      <div className={cn(
                        "p-1 rounded-md mr-2 transition-colors",
                        activePath === item.path
                          ? "bg-primary-foreground/20"
                          : "bg-transparent group-hover:bg-muted-foreground/10"
                      )}>
                        {item.icon}
                      </div>
                      <span className="ml-1">{item.name}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="animate-fade-in">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-border animate-slide-up">
        <div className="flex items-center p-2 rounded-lg transition-all hover:bg-muted cursor-pointer glass-effect">
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full border-2 border-primary/20 hover-scale"
              src={userAvatar}
              alt={userName}
            />
          </div>
          <div className="ml-3">
            <p
              className={`text-sm font-medium text-foreground`}
            >
              {userName}
            </p>
            <p
              className={`text-xs text-muted-foreground`}
            >
              {userRole}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => onNavigate("/logout")}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
