import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ListTodo,
} from "lucide-react";

interface TaskStatusTabsProps {
  activeStatus?: string;
  onStatusChange?: (status: string) => void;
  taskCounts?: {
    all: number;
    todo: number;
    "in-progress": number;
    completed: number;
    blocked: number;
  };
  isDarkMode?: boolean;
}

const TaskStatusTabs = ({
  activeStatus = "all",
  onStatusChange = () => {},
  taskCounts = {
    all: 0,
    todo: 0,
    "in-progress": 0,
    completed: 0,
    blocked: 0,
  },
  isDarkMode = true,
}: TaskStatusTabsProps) => {
  const getIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <ListTodo className="mr-2 h-4 w-4" />;
      case "in-progress":
        return <Clock className="mr-2 h-4 w-4" />;
      case "completed":
        return <CheckCircle className="mr-2 h-4 w-4" />;
      case "blocked":
        return <XCircle className="mr-2 h-4 w-4" />;
      case "all":
      default:
        return <AlertCircle className="mr-2 h-4 w-4" />;
    }
  };

  // Função para obter a cor do texto com base no modo escuro/claro
  const getTextColor = () => {
    return isDarkMode ? "text-gray-300" : "text-gray-700";
  };

  // Função para obter a cor do texto ativo com base no modo escuro/claro
  const getActiveTextColor = () => {
    return isDarkMode ? "text-white" : "text-[#FF6B00]";
  };

  // Função para obter a cor de fundo do badge com base no modo escuro/claro
  const getBadgeColor = () => {
    return isDarkMode ? "bg-[#FF6B00]/20" : "bg-[#FF6B00]/10";
  };

  // Função para obter a cor do texto do badge com base no modo escuro/claro
  const getBadgeTextColor = () => {
    return isDarkMode ? "text-[#FF6B00]" : "text-[#FF6B00]";
  };

  return (
    <div
      className={`w-full py-2 border-b ${isDarkMode ? "bg-[#0F172A] border-blue-700" : "bg-[#FAFAFA] border-[#B0BEC5]"}`}
    >
      <Tabs
        defaultValue={activeStatus}
        value={activeStatus}
        onValueChange={onStatusChange}
        className="w-full max-w-4xl mx-auto"
      >
        <TabsList
          className={`w-full ${isDarkMode ? "bg-[#0F172A] border border-blue-700" : "bg-[#FAFAFA] border border-[#B0BEC5]"}`}
        >
          <TabsTrigger
            value="all"
            className={`flex-1 flex items-center justify-center data-[state=active]:bg-[#FF6B00]/20 data-[state=active]:${getActiveTextColor()} ${getTextColor()}`}
          >
            {getIcon("all")}
            <span>Todas Tarefas</span>
            <span className={`ml-2 rounded-full ${getBadgeColor()} px-2 py-0.5 text-xs ${getBadgeTextColor()}`}>
              {taskCounts.all}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="todo"
            className={`flex-1 flex items-center justify-center data-[state=active]:bg-[#FF6B00]/20 data-[state=active]:${getActiveTextColor()} ${getTextColor()}`}
          >
            {getIcon("todo")}
            <span>A Fazer</span>
            <span className={`ml-2 rounded-full ${getBadgeColor()} px-2 py-0.5 text-xs ${getBadgeTextColor()}`}>
              {taskCounts.todo}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="in-progress"
            className={`flex-1 flex items-center justify-center data-[state=active]:bg-[#FF6B00]/20 data-[state=active]:${getActiveTextColor()} ${getTextColor()}`}
          >
            {getIcon("in-progress")}
            <span>Em Andamento</span>
            <span className={`ml-2 rounded-full ${getBadgeColor()} px-2 py-0.5 text-xs ${getBadgeTextColor()}`}>
              {taskCounts["in-progress"]}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className={`flex-1 flex items-center justify-center data-[state=active]:bg-[#FF6B00]/20 data-[state=active]:${getActiveTextColor()} ${getTextColor()}`}
          >
            {getIcon("completed")}
            <span>Concluído</span>
            <span className={`ml-2 rounded-full ${getBadgeColor()} px-2 py-0.5 text-xs ${getBadgeTextColor()}`}>
              {taskCounts.completed}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="blocked"
            className={`flex-1 flex items-center justify-center data-[state=active]:bg-[#FF6B00]/20 data-[state=active]:${getActiveTextColor()} ${getTextColor()}`}
          >
            {getIcon("blocked")}
            <span>Bloqueado</span>
            <span className={`ml-2 rounded-full ${getBadgeColor()} px-2 py-0.5 text-xs ${getBadgeTextColor()}`}>
              {taskCounts.blocked}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TaskStatusTabs;
