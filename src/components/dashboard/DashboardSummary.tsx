import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Cpu, FileText, CheckSquare, Clock, ArrowRight } from "lucide-react";

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
        return isDarkMode ? "bg-green-600" : "bg-[#4CAF50]";
      case "maintenance":
        return isDarkMode ? "bg-orange-500" : "bg-[#FFC107]";
      case "todo":
        return isDarkMode ? "bg-blue-600" : "bg-[#64B5F6]";
      case "in-progress":
        return isDarkMode ? "bg-yellow-600" : "bg-[#FFC107]";
      case "completed":
        return isDarkMode ? "bg-green-600" : "bg-[#4CAF50]";
      case "blocked":
        return isDarkMode ? "bg-red-600" : "bg-[#E57373]";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col ${isDarkMode ? "bg-black" : "bg-[#FAFAFA]"}`}
    >
      <div className="p-6">
        <h1
          className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-[#212121]"}`}
        >
          Dashboard Overview
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card
            className={
              isDarkMode
                ? "bg-[#0F172A] border-blue-600"
                : "bg-white border-[#B0BEC5] shadow-sm"
            }
          >
            <CardHeader className="pb-2">
              <CardTitle
                className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-[#757575]"}`}
              >
                Total AI Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Cpu className="mr-2 h-4 w-4 text-[#FF6B00]" />
                <span
                  className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#212121]"}`}
                >
                  {stats.totalTools}
                </span>
              </div>
              <p className="text-xs text-green-500 mt-1">
                {stats.activeTools} active tools
              </p>
            </CardContent>
          </Card>

          <Card
            className={
              isDarkMode
                ? "bg-[#0F172A] border-blue-600"
                : "bg-white border-[#B0BEC5] shadow-sm"
            }
          >
            <CardHeader className="pb-2">
              <CardTitle
                className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-[#757575]"}`}
              >
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-[#FF6B00]" />
                <span
                  className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#212121]"}`}
                >
                  {stats.totalDocuments}
                </span>
              </div>
              <p className="text-xs text-blue-500 mt-1">4 categories</p>
            </CardContent>
          </Card>

          <Card
            className={
              isDarkMode
                ? "bg-[#0F172A] border-blue-600"
                : "bg-white border-[#B0BEC5] shadow-sm"
            }
          >
            <CardHeader className="pb-2">
              <CardTitle
                className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-[#757575]"}`}
              >
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckSquare className="mr-2 h-4 w-4 text-[#FF6B00]" />
                <span
                  className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#212121]"}`}
                >
                  {stats.totalTasks}
                </span>
              </div>
              <p className="text-xs text-green-500 mt-1">
                {stats.completedTasks} completed
              </p>
            </CardContent>
          </Card>

          <Card
            className={
              isDarkMode
                ? "bg-[#0F172A] border-blue-600"
                : "bg-white border-[#B0BEC5] shadow-sm"
            }
          >
            <CardHeader className="pb-2">
              <CardTitle
                className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-[#757575]"}`}
              >
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span
                  className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#212121]"}`}
                >
                  {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-[#FF6B00] h-2 rounded-full"
                  style={{
                    width: `${Math.round(
                      (stats.completedTasks / stats.totalTasks) * 100,
                    )}%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={
              isDarkMode
                ? "bg-[#0F172A] border-blue-600"
                : "bg-white border-[#B0BEC5] shadow-sm"
            }
          >
            <CardHeader className="pb-2">
              <CardTitle
                className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-[#757575]"}`}
              >
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span
                  className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#212121]"}`}
                >
                  6
                </span>
              </div>
              <div className="flex -space-x-2 mt-2">
                <Avatar className="h-6 w-6 border-2 border-background">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <Avatar className="h-6 w-6 border-2 border-background">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <Avatar className="h-6 w-6 border-2 border-background">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <Avatar className="h-6 w-6 border-2 border-background">
                  <AvatarFallback>+3</AvatarFallback>
                </Avatar>
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
                      {tool.status === "active" ? "Active" : "Maintenance"}
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
                      {doc.fileType}
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
                      {task.status === "in-progress"
                        ? "In Progress"
                        : task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
