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
import { 
  MoreVertical, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Cpu, 
  Image, 
  Code, 
  BarChart, 
  FileText, 
  Mic 
} from "lucide-react";
import { ConfirmDeleteDialog } from "../ui/confirm-delete-dialog";

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

// Função para obter o ícone com base no nome da ferramenta
const getToolIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('assistant')) return <Cpu className="h-5 w-5 text-primary" />;
  if (lowerName.includes('image') || lowerName.includes('generator')) return <Image className="h-5 w-5 text-blue-500" />;
  if (lowerName.includes('code') || lowerName.includes('analyzer')) return <Code className="h-5 w-5 text-amber-500" />;
  if (lowerName.includes('data') || lowerName.includes('visualizer')) return <BarChart className="h-5 w-5 text-green-500" />;
  if (lowerName.includes('content') || lowerName.includes('writer')) return <FileText className="h-5 w-5 text-purple-500" />;
  if (lowerName.includes('voice') || lowerName.includes('transcriber')) return <Mic className="h-5 w-5 text-red-500" />;
  return <Cpu className="h-5 w-5 text-primary" />;
};

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
  const handleDelete = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onDelete();
  };

  return (
    <Card
      className="w-[300px] overflow-hidden flex flex-col card-gradient hover-lift transition-all animate-fade-in"
      onClick={onClick}
    >
      <CardHeader className="pb-2 space-y-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              {getToolIcon(name)}
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-foreground">
                {name}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {category}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Opções</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-effect">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onClick(); }}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Ferramenta
              </DropdownMenuItem>
              <ConfirmDeleteDialog
                itemName={name}
                itemType="ferramenta"
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
      <CardContent className="flex-1 pt-0">
        <p className="text-sm text-foreground line-clamp-2 mb-4">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <Badge
            variant={status === "active" ? "default" : "secondary"}
            className={`${
              status === "active" 
                ? "bg-green-500/10 text-green-500 border-green-500/20" 
                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
            }`}
          >
            {status === "active" ? "Ativo" : "Manutenção"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Atualizado {lastUpdated}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t border-border">
        <div className="w-full h-1 flex space-x-1">
          <div className="h-1 flex-1 bg-primary rounded-full"></div>
          <div className="h-1 flex-1 bg-blue-500 rounded-full"></div>
          <div className="h-1 flex-1 bg-amber-500 rounded-full"></div>
          <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
