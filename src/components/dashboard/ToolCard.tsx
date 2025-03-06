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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { MoreVertical, ExternalLink, Edit, Trash2 } from "lucide-react";

interface ToolCardProps {
  id?: string;
  name?: string;
  description?: string;
  status?: "active" | "maintenance";
  category?: string;
  lastUpdated?: string;
  imageUrl?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isDarkMode?: boolean;
}

const ToolCard = ({
  id = "tool-1",
  name = "AI Assistant",
  description = "Powerful AI assistant for answering questions and completing tasks with natural language processing capabilities.",
  status = "active",
  category = "Fast Processing",
  lastUpdated = "2 days ago",
  imageUrl = "https://images.unsplash.com/photo-1677442135968-6bd241f26c68?w=300&q=80",
  onClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
  isDarkMode = true,
}: ToolCardProps) => {
  return (
    <Card
      className={
        `w-[304px] h-[224px] overflow-hidden flex flex-col ${isDarkMode ? "bg-[#0F172A] border-blue-600" : "bg-white border-[#B0BEC5]"} hover:shadow-lg transition-shadow duration-300` +
        " p-4 container"
      }
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle
              className={`text-lg font-bold truncate ${isDarkMode ? "text-white" : "text-[#212121]"}`}
            >
              {name}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {category} • {lastUpdated}
            </CardDescription>
          </div>
          <Badge
            variant={status === "active" ? "default" : "secondary"}
            className={`ml-2 ${status === "active" ? (isDarkMode ? "bg-green-600" : "bg-[#4CAF50]") : isDarkMode ? "bg-orange-500" : "bg-[#FFC107]"}`}
          >
            {status === "active" ? "Ativo" : "Manutenção"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onClick}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Ferramenta
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-full flex">
          <div className="flex-1 overflow-hidden">
            <p
              className={`text-sm line-clamp-4 ${isDarkMode ? "text-white" : "text-[#212121]"}`}
            >
              {description}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onClick}
        >
          Abrir Ferramenta
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
