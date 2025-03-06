import React from "react";
import DocumentCard from "./DocumentCard";

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  lastUpdated: string;
  fileType: string;
  fileSize: string;
}

interface DocumentsGridProps {
  documents: Document[];
  onDocumentEdit?: (id: string) => void;
  onDocumentDelete?: (id: string) => void;
  isDarkMode?: boolean;
}

const DocumentsGrid = ({
  documents,
  onDocumentEdit = () => {},
  onDocumentDelete = () => {},
  isDarkMode = true,
}: DocumentsGridProps) => {
  return (
    <div
      className={`p-8 rounded-lg w-full ${isDarkMode ? "bg-black" : "bg-[#FAFAFA]"}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-16 gap-y-14 justify-items-center w-[1200]">
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
            onEdit={() => onDocumentEdit(document.id)}
            onDelete={() => onDocumentDelete(document.id)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
      {documents.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p
            className={`text-xl mb-4 ${isDarkMode ? "text-white" : "text-[#212121]"}`}
          >
            No documents found
          </p>
          <p className={isDarkMode ? "text-white" : "text-[#212121]"}>
            Try adjusting your filters or add a new document to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentsGrid;
