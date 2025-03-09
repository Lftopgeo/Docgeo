import React from "react";
import DocumentCard from "./DocumentCard";
import { Loader2 } from "lucide-react";

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  lastUpdated: string;
  fileType: string;
  fileSize: string;
  fileUrl?: string;
}

interface DocumentsGridProps {
  documents: Document[];
  onDocumentEdit?: (id: string, updates?: Partial<Document>) => void;
  onDocumentDelete?: (id: string) => void;
  isDarkMode?: boolean;
  isLoading?: boolean;
}

const DocumentsGrid = ({
  documents,
  onDocumentEdit = () => {},
  onDocumentDelete = () => {},
  isDarkMode = true,
  isLoading = false,
}: DocumentsGridProps) => {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className={`mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Carregando documentos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg w-full bg-background p-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            id={document.id}
            title={document.title}
            description={document.description}
            category={document.category}
            subcategory={document.subcategory}
            lastUpdated={document.lastUpdated}
            fileType={document.fileType}
            fileSize={document.fileSize}
            fileUrl={document.fileUrl}
            onEdit={() => onDocumentEdit(document.id, {})}
            onDelete={() => onDocumentDelete(document.id)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
      {documents.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-xl mb-4 text-foreground">
            Nenhum documento encontrado
          </p>
          <p className="text-muted-foreground">
            Tente ajustar seus filtros ou adicione um novo documento para começar
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentsGrid;
