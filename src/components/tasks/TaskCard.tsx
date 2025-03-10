import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import {
  MoreVertical,
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { ConfirmDeleteDialog } from "../ui/confirm-delete-dialog";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
  };
  tags: string[];
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isDarkMode?: boolean;
}

const TaskCard = ({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  assignee,
  tags,
  onClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
  isDarkMode = true,
}: TaskCardProps) => {
  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "todo":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: isDarkMode ? "bg-blue-600/80" : "bg-blue-500/70",
          textColor: isDarkMode ? "text-blue-300" : "text-blue-700",
        };
      case "in-progress":
        return {
          icon: <Clock className="h-4 w-4" />,
          color: isDarkMode ? "bg-yellow-600/80" : "bg-yellow-500/70",
          textColor: isDarkMode ? "text-yellow-300" : "text-yellow-700",
        };
      case "completed":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: isDarkMode ? "bg-green-600/80" : "bg-green-500/70",
          textColor: isDarkMode ? "text-green-300" : "text-green-700",
        };
      case "blocked":
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: isDarkMode ? "bg-red-600/80" : "bg-red-500/70",
          textColor: isDarkMode ? "text-red-300" : "text-red-700",
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "bg-gray-600/80",
          textColor: "text-gray-300",
        };
    }
  };

  // Function to get priority color
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case "low":
        return {
          color: isDarkMode ? "bg-green-600/80" : "bg-green-500/70",
          textColor: isDarkMode ? "text-green-300" : "text-green-700",
        };
      case "medium":
        return {
          color: isDarkMode ? "bg-blue-600/80" : "bg-blue-500/70",
          textColor: isDarkMode ? "text-blue-300" : "text-blue-700",
        };
      case "high":
        return {
          color: isDarkMode ? "bg-orange-600/80" : "bg-orange-500/70",
          textColor: isDarkMode ? "text-orange-300" : "text-orange-700",
        };
      case "urgent":
        return {
          color: isDarkMode ? "bg-red-600/80" : "bg-red-500/70",
          textColor: isDarkMode ? "text-red-300" : "text-red-700",
        };
      default:
        return {
          color: "bg-gray-600/80",
          textColor: "text-gray-300",
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const priorityInfo = getPriorityInfo(priority);

  const handleDelete = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onDelete();
  };

  return (
    <Card
      className={`overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 w-full max-w-[300px] h-auto ${
        isDarkMode ? "bg-[#0F172A] border-blue-700/50" : "bg-white border-[#B0BEC5]/50"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle
              className={`text-lg font-bold truncate ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
            >
              {title}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Badge className={`${statusInfo.color} ${statusInfo.textColor} px-2 py-0.5 text-xs`}>
                <span className="flex items-center gap-1">
                  {statusInfo.icon}
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("-", " ")}
                </span>
              </Badge>
              <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>•</span>
              <Badge className={`${priorityInfo.color} ${priorityInfo.textColor} px-2 py-0.5 text-xs`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Badge>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onClick}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Tarefa
              </DropdownMenuItem>
              <ConfirmDeleteDialog
                itemName={title}
                itemType="tarefa"
                onConfirm={handleDelete}
                isDarkMode={isDarkMode}
                trigger={
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <p
              className={`text-sm line-clamp-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {description}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`${
                  isDarkMode
                    ? "bg-blue-900/30 text-blue-300 border-blue-700/50"
                    : "bg-blue-100 text-blue-700 border-blue-300"
                } text-xs`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={assignee.avatar} alt={assignee.name} />
            <AvatarFallback>
              {assignee.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span
            className={`text-xs truncate max-w-[100px] ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {assignee.name}
          </span>
        </div>
        <div
          className={`flex items-center text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(dueDate)}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
