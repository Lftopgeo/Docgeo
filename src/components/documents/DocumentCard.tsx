import React, { useState } from "react";
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
  DropdownMenuSeparator,
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
  ExternalLink,
  Info,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { ConfirmDeleteDialog } from "../ui/confirm-delete-dialog";

interface DocumentCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  lastUpdated: string;
  fileType: string;
  fileSize: string;
  fileUrl?: string;
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
  fileUrl,
  onEdit = () => {},
  onDelete = () => {},
  isDarkMode = true,
}: DocumentCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      case "JPEG":
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
      case "JPEG":
      case "PNG":
      case "GIF":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const handleViewDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      console.log("Visualizando documento:", id);
      // Fallback para quando não temos a URL
      window.open(`/api/documents/view?id=${id}`, "_blank");
    }
  };

  const handleDownloadDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = title + '.' + fileType.toLowerCase();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log("Baixando documento:", id);
      // Fallback para quando não temos a URL
      window.open(`/api/documents/download?id=${id}`, "_blank");
    }
  };

  const handleEditDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Editando documento:", id);
    onEdit();
  };

  const handleDeleteDocument = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    console.log("Excluindo documento:", id);
    onDelete();
  };

  const handleShowDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(true);
  };

  return (
    <>
      <Card
        className={`w-[300px] overflow-hidden flex flex-col card-gradient transition-all animate-fade-in ${
          isHovered ? "shadow-lg scale-[1.02]" : "hover:shadow-md hover:scale-[1.01]"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleViewDocument}
      >
        <CardHeader className="pb-2 space-y-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${isDarkMode ? "bg-secondary/80" : "bg-secondary/30"}`}>
                {getFileTypeIcon(fileType)}
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-foreground line-clamp-1">
                  {title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {category} / {subcategory}
                </CardDescription>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-full ${isHovered ? "opacity-100" : "opacity-70 hover:opacity-100"}`} 
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Opções</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={isDarkMode ? "glass-effect" : "bg-white"}>
                      <DropdownMenuItem onClick={handleViewDocument}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDownloadDocument}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleEditDocument}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <ConfirmDeleteDialog
                        itemName={title}
                        itemType="documento"
                        onConfirm={handleDeleteDocument}
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleShowDetails}>
                        <Info className="mr-2 h-4 w-4" />
                        Detalhes
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Opções</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          <p className="text-sm text-foreground line-clamp-2 mb-4">
            {description || "Sem descrição disponível"}
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                    onClick={handleViewDocument}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Abrir documento</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>

      {/* Dialog de detalhes do documento */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className={isDarkMode ? "bg-black border-blue-700" : "bg-white border-[#B0BEC5]"}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {getFileTypeIcon(fileType)}
              Detalhes do Documento
            </DialogTitle>
            <DialogDescription className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              Informações completas sobre o documento
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Título</h4>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{title}</p>
            </div>
            
            <div className="space-y-1">
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Descrição</h4>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{description || "Sem descrição disponível"}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Categoria</h4>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{category}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Subcategoria</h4>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{subcategory}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Tipo de Arquivo</h4>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{fileType.toUpperCase()}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Tamanho</h4>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{fileSize}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Última Atualização</h4>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{lastUpdated}</p>
            </div>
            
            <div className="space-y-1">
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>ID do Documento</h4>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{id}</p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowDetails(false)}
              className={isDarkMode ? "border-blue-700 text-white" : "border-[#B0BEC5] text-gray-700"}
            >
              Fechar
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleEditDocument}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadDocument}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentCard;
