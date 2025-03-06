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
          color: isDarkMode ? "bg-blue-600" : "bg-[#64B5F6]",
        };
      case "in-progress":
        return {
          icon: <Clock className="h-4 w-4" />,
          color: isDarkMode ? "bg-yellow-600" : "bg-[#FFC107]",
        };
      case "completed":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: isDarkMode ? "bg-green-600" : "bg-[#4CAF50]",
        };
      case "blocked":
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: isDarkMode ? "bg-red-600" : "bg-[#E57373]",
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "bg-gray-600",
        };
    }
  };

  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return isDarkMode ? "bg-green-600" : "bg-[#66BB6A]";
      case "medium":
        return isDarkMode ? "bg-blue-600" : "bg-[#64B5F6]";
      case "high":
        return isDarkMode ? "bg-orange-600" : "bg-[#FF8C00]";
      case "urgent":
        return isDarkMode ? "bg-red-600" : "bg-[#F44336]";
      default:
        return "bg-gray-600";
    }
  };

  const statusInfo = getStatusInfo(status);
  const priorityColor = getPriorityColor(priority);

  return (
    <Card
      className={
        ` overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 ${isDarkMode ? "bg-[#0F172A] border-blue-600" : "bg-white border-[#B0BEC5]"} ` +
        " gap-y-0 mx-px px-1 py-0 w-[30] w-[304] h-56 container w-[120] w-[120] w-[200PX] w-[100PX] container w-[120] w-[170] w-9/12 container max-w-[150] w-[150] container"
      }
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle
              className={`text-lg font-bold truncate ${isDarkMode ? "text-white" : "text-[#212121]"}`}
            >
              {title}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-1">
              <Badge className={`${statusInfo.color} px-2 py-0.5 text-xs`}>
                <span className="flex items-center gap-1">
                  {statusInfo.icon}
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("-", " ")}
                </span>
              </Badge>
              <span>•</span>
              <Badge className={`${priorityColor} px-2 py-0.5 text-xs`}>
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
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <p
              className={`text-sm line-clamp-3 ${isDarkMode ? "text-white" : "text-[#212121]"}`}
            >
              {description}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-blue-900/30 text-blue-400 border-blue-700 text-xs"
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
            className={`text-xs truncate max-w-[100px] ${isDarkMode ? "text-white" : "text-[#212121]"}`}
          >
            {assignee.name}
          </span>
        </div>
        <div
          className={`flex items-center text-xs ${isDarkMode ? "text-white" : "text-[#212121]"}`}
        >
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(dueDate)}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
