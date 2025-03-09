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
  FileText,
  Edit,
  Trash2,
  Download,
  Eye,
  File,
  FileImage,
  FileSpreadsheet,
  Presentation,
  FileCode,
} from "lucide-react";

interface DocumentCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  lastUpdated: string;
  fileType: string;
  fileSize: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isDarkMode?: boolean;
}

const DocumentCard = ({
  id,
  title,
  description,
  category,
  subcategory,
  lastUpdated,
  fileType,
  fileSize,
  onEdit = () => {},
  onDelete = () => {},
  isDarkMode = true,
}: DocumentCardProps) => {
  // Function to determine icon and color based on file type
  const getFileTypeIcon = (type: string) => {
    const fileTypeUpper = type.toUpperCase();
    switch (fileTypeUpper) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "DOCX":
      case "DOC":
        return <File className="h-5 w-5 text-blue-500" />;
      case "XLSX":
      case "XLS":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case "PPTX":
      case "PPT":
        return <Presentation className="h-5 w-5 text-amber-500" />;
      case "HTML":
      case "CSS":
      case "JS":
        return <FileCode className="h-5 w-5 text-purple-500" />;
      case "JPG":
      case "PNG":
      case "GIF":
        return <FileImage className="h-5 w-5 text-pink-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get color class based on file type
  const getFileTypeColor = (type: string) => {
    const fileTypeUpper = type.toUpperCase();
    switch (fileTypeUpper) {
      case "PDF":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "DOCX":
      case "DOC":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "XLSX":
      case "XLS":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "PPTX":
      case "PPT":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "HTML":
      case "CSS":
      case "JS":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "JPG":
      case "PNG":
      case "GIF":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Card
      className="w-[300px] overflow-hidden flex flex-col card-gradient hover-lift transition-all animate-fade-in"
      onClick={() => window.open("#", "_blank")}
    >
      <CardHeader className="pb-2 space-y-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-secondary/80">
              {getFileTypeIcon(fileType)}
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-foreground">
                {title}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {category} / {subcategory}
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
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open("#", "_blank"); }}>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
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
            variant="outline"
            className={getFileTypeColor(fileType)}
          >
            {fileType.toUpperCase()}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {fileSize}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t border-border">
        <div className="w-full flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Atualizado {lastUpdated}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 p-0 h-auto"
            onClick={(e) => { e.stopPropagation(); window.open("#", "_blank"); }}
          >
            Abrir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
