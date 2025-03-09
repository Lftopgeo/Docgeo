import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Cpu, FileText, CheckSquare, Clock, ArrowRight, BarChart3, Users, TrendingUp } from "lucide-react";

interface DashboardSummaryProps {
  recentTools?: Array<{
    id: string;
    name: string;
    status: "active" | "maintenance";
    lastUpdated: string;
  }>;
  recentDocuments?: Array<{
    id: string;
    title: string;
    fileType: string;
    lastUpdated: string;
  }>;
  recentTasks?: Array<{
    id: string;
    title: string;
    status: "todo" | "in-progress" | "completed" | "blocked";
    assignee: {
      name: string;
      avatar: string;
    };
  }>;
  stats?: {
    totalTools: number;
    activeTools: number;
    totalDocuments: number;
    totalTasks: number;
    completedTasks: number;
  };
  isDarkMode?: boolean;
  onNavigate?: (path: string) => void;
}

const DashboardSummary = ({
  recentTools = [
    {
      id: "tool-1",
      name: "AI Assistant",
      status: "active",
      lastUpdated: "2 days ago",
    },
    {
      id: "tool-2",
      name: "Image Generator",
      status: "active",
      lastUpdated: "1 week ago",
    },
    {
      id: "tool-3",
      name: "Code Analyzer",
      status: "maintenance",
      lastUpdated: "3 days ago",
    },
  ],
  recentDocuments = [
    {
      id: "doc-1",
      title: "Project Requirements",
      fileType: "PDF",
      lastUpdated: "2 days ago",
    },
    {
      id: "doc-2",
      title: "User Research",
      fileType: "DOCX",
      lastUpdated: "1 week ago",
    },
    {
      id: "doc-3",
      title: "API Documentation",
      fileType: "HTML",
      lastUpdated: "3 days ago",
    },
  ],
  recentTasks = [
    {
      id: "task-1",
      title: "Implement AI Assistant Integration",
      status: "in-progress",
      assignee: {
        name: "Alex Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      },
    },
    {
      id: "task-2",
      title: "Design User Onboarding Flow",
      status: "todo",
      assignee: {
        name: "Sarah Miller",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
    },
    {
      id: "task-3",
      title: "Fix Authentication Bug",
      status: "completed",
      assignee: {
        name: "Michael Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
    },
  ],
  stats = {
    totalTools: 6,
    activeTools: 4,
    totalDocuments: 12,
    totalTasks: 8,
    completedTasks: 3,
  },
  isDarkMode = true,
  onNavigate = () => {},
}: DashboardSummaryProps) => {
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white";
      case "maintenance":
        return "bg-amber-500 text-white";
      case "todo":
        return "bg-blue-500 text-white";
      case "in-progress":
        return "bg-amber-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      case "blocked":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col overflow-auto p-6 transition-all`}
    >
      <h1
        className={`text-2xl font-bold mb-6 animate-fade-in`}
      >
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover-lift transition-all animate-slide-up card-gradient" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ferramentas IA
            </CardTitle>
            <div className="p-2 rounded-full bg-primary/10">
              <Cpu className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{stats.totalTools}</span>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <span className="text-xs">{stats.activeTools} ativas</span>
                </Badge>
              </div>
              <div className="h-1 w-full bg-secondary mt-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${(stats.activeTools / stats.totalTools) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-all animate-slide-up card-gradient" style={{ animationDelay: "150ms" }}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Documentos
            </CardTitle>
            <div className="p-2 rounded-full bg-blue-500/10">
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{stats.totalDocuments}</span>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  <span className="text-xs">4 categorias</span>
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                <span>PDF</span>
                <span>DOCX</span>
                <span>HTML</span>
              </div>
              <div className="flex space-x-1 mt-1">
                <div className="h-1 flex-1 bg-blue-500 rounded-full"></div>
                <div className="h-1 flex-1 bg-amber-500 rounded-full"></div>
                <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-all animate-slide-up card-gradient" style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tarefas
            </CardTitle>
            <div className="p-2 rounded-full bg-green-500/10">
              <CheckSquare className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{stats.totalTasks}</span>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <span className="text-xs">{stats.completedTasks} concluídas</span>
                </Badge>
              </div>
              <div className="grid grid-cols-4 gap-1 mt-3">
                <div className="h-1 bg-blue-500 rounded-full"></div>
                <div className="h-1 bg-amber-500 rounded-full"></div>
                <div className="h-1 bg-green-500 rounded-full"></div>
                <div className="h-1 bg-red-500 rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Pendente</span>
                <span>Concluído</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-all animate-slide-up card-gradient" style={{ animationDelay: "250ms" }}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conclusão
            </CardTitle>
            <div className="p-2 rounded-full bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-2xl font-bold">
                  {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
                </span>
                <span className="ml-2 text-xs text-green-500">+12%</span>
              </div>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <span className="text-xs">Últimos 30 dias</span>
                </Badge>
              </div>
              <div className="h-1 w-full bg-secondary mt-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent AI Tools */}
        <Card
          className={
            isDarkMode
              ? "bg-[#0F172A] border-blue-600"
              : "bg-white border-[#B0BEC5] shadow-sm"
          }
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle
                className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#212121]"}`}
              >
                Recent AI Tools
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("/ai-tools")}
                className={isDarkMode ? "text-blue-400" : "text-[#FF6B00]"}
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTools.map((tool) => (
                <div
                  key={tool.id}
                  className={`p-3 rounded-lg flex justify-between items-center ${isDarkMode ? "bg-gray-800/50" : "bg-gray-50"}`}
                >
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${isDarkMode ? "text-white" : "text-[#212121]"}`}
                    >
                      {tool.name}
                    </h3>
                    <p
                      className={`text-xs ${isDarkMode ? "text-gray-400" : "text-[#757575]"}`}
                    >
                      {tool.lastUpdated}
                    </p>
                  </div>
                  <Badge className={getStatusColor(tool.status)}>
                    <span>
                      {tool.status === "active" ? "Active" : "Maintenance"}
                    </span>
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card
          className={
            isDarkMode
              ? "bg-[#0F172A] border-blue-600"
              : "bg-white border-[#B0BEC5] shadow-sm"
          }
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle
                className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#212121]"}`}
              >
                Recent Documents
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("/documents")}
                className={isDarkMode ? "text-blue-400" : "text-[#FF6B00]"}
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 rounded-lg flex justify-between items-center ${isDarkMode ? "bg-gray-800/50" : "bg-gray-50"}`}
                >
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${isDarkMode ? "text-white" : "text-[#212121]"}`}
                    >
                      {doc.title}
                    </h3>
                    <p
                      className={`text-xs ${isDarkMode ? "text-gray-400" : "text-[#757575]"}`}
                    >
                      {doc.lastUpdated}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${doc.fileType === "PDF" ? "text-red-500" : doc.fileType === "DOCX" ? "text-blue-500" : "text-purple-500"} ${isDarkMode ? "border-gray-700" : "border-[#B0BEC5]"}`}
                  >
                    <span>{doc.fileType}</span>
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card
          className={
            isDarkMode
              ? "bg-[#0F172A] border-blue-600"
              : "bg-white border-[#B0BEC5] shadow-sm"
          }
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle
                className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#212121]"}`}
              >
                Recent Tasks
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("/tasks")}
                className={isDarkMode ? "text-blue-400" : "text-[#FF6B00]"}
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg flex justify-between items-center ${isDarkMode ? "bg-gray-800/50" : "bg-gray-50"}`}
                >
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${isDarkMode ? "text-white" : "text-[#212121]"}`}
                    >
                      {task.title}
                    </h3>
                    <div className="flex items-center mt-1">
                      <Avatar className="h-4 w-4 mr-1">
                        <AvatarImage
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                        />
                        <AvatarFallback>
                          {task.assignee.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p
                        className={`text-xs ${isDarkMode ? "text-gray-400" : "text-[#757575]"}`}
                      >
                        {task.assignee.name}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(task.status)}>
                    <span>
                      {task.status === "in-progress"
                        ? "In Progress"
                        : task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)}
                    </span>
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSummary;
