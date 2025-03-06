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
  // Function to determine icon color based on file type
  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "text-red-500";
      case "docx":
        return "text-blue-500";
      case "xlsx":
        return "text-green-500";
      case "pptx":
        return "text-orange-500";
      case "html":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card
      className={`h-[224px] overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 p-4 ${isDarkMode ? "bg-[#0F172A] border-blue-600" : "bg-white border-[#B0BEC5] shadow-sm"}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1 flex items-start">
            <FileText
              className={`h-5 w-5 mr-2 mt-0.5 ${getFileTypeColor(fileType)}`}
            />
            <div>
              <CardTitle
                className={`text-lg font-bold truncate ${isDarkMode ? "text-white" : "text-[#212121]"}`}
              >
                {title}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {category} / {subcategory} • {lastUpdated}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Document
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
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
      <CardFooter className="pt-2 flex justify-between items-center">
        <span
          className={`text-xs ${isDarkMode ? "text-white" : "text-[#212121]"}`}
        >
          {fileType} • {fileSize}
        </span>
        <Button
          variant="outline"
          size="sm"
          className={
            isDarkMode
              ? "border-blue-700 hover:bg-blue-900/20"
              : "border-[#B0BEC5] hover:bg-gray-100"
          }
        >
          Open
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
