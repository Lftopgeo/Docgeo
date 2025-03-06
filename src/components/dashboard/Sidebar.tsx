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
      className={`w-[250px] h-full flex flex-col ${isDarkMode ? "bg-[#0F172A] border-r border-blue-700" : "bg-white border-r border-[#B0BEC5]"}`}
    >
      <div className="p-6">
        <h1
          className={`text-xl font-bold flex items-center ${isDarkMode ? "text-white" : "text-[#212121]"}`}
        >
          <Cpu className="w-6 h-6 mr-2 text-[#FF6B00]" />
          Central de IA
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <div className="mb-6">
          <p
            className={`text-xs font-medium uppercase tracking-wider px-3 mb-2 ${isDarkMode ? "text-white" : "text-[#757575]"}`}
          >
            Navegação Principal
          </p>
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <TooltipProvider key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        `w-full justify-start ${isDarkMode ? "text-white hover:text-white hover:bg-gray-800" : "text-[#212121] hover:text-[#212121] hover:bg-gray-100"}`,
                        activePath === item.path &&
                          `${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-[#212121]"} font-medium`,
                      )}
                      onClick={() => onNavigate(item.path)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>

        <div className="mb-6">
          <p
            className={`text-xs font-medium uppercase tracking-wider px-3 mb-2 ${isDarkMode ? "text-white" : "text-[#757575]"}`}
          >
            Utilitários
          </p>
          <nav className="space-y-1">
            {utilityItems.map((item) => (
              <TooltipProvider key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        `w-full justify-start ${isDarkMode ? "text-white hover:text-white hover:bg-gray-800" : "text-[#212121] hover:text-[#212121] hover:bg-gray-100"}`,
                        activePath === item.path &&
                          `${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-[#212121]"} font-medium`,
                      )}
                      onClick={() => onNavigate(item.path)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full"
              src={userAvatar}
              alt={userName}
            />
          </div>
          <div className="ml-3">
            <p
              className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-[#212121]"}`}
            >
              {userName}
            </p>
            <p
              className={`text-xs ${isDarkMode ? "text-white" : "text-[#757575]"}`}
            >
              {userRole}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-gray-400 hover:text-white"
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
