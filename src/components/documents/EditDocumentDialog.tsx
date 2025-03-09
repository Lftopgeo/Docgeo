'use client';

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Save, FileText } from "lucide-react";

interface Category {
  id: string;
  name: string;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
}

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

interface EditDocumentDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (id: string, data: Partial<Document>) => void;
  document?: Document;
  categories?: Category[];
  isDarkMode?: boolean;
}

const EditDocumentDialog = ({
  open = false,
  onOpenChange = () => {},
  onSubmit = () => {},
  document,
  categories = [],
  isDarkMode = true,
}: EditDocumentDialogProps) => {
  const [mounted, setMounted] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("");
  
  const form = useForm({
    defaultValues: {
      title: document?.title || "",
      description: document?.description || "",
      category_id: "",
      subcategory_id: "",
    },
  });

  // Verificar se estamos no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Inicializar o formulário com os dados do documento
  useEffect(() => {
    if (document) {
      form.setValue("title", document.title);
      form.setValue("description", document.description);
      
      // Encontrar o ID da categoria pelo nome
      const categoryObj = categories.find(cat => cat.name === document.category);
      if (categoryObj) {
        setSelectedCategoryId(categoryObj.id);
        form.setValue("category_id", categoryObj.id);
        
        // Encontrar o ID da subcategoria pelo nome
        const subcategoryObj = categoryObj.subcategories.find(sub => sub.name === document.subcategory);
        if (subcategoryObj) {
          setSelectedSubcategoryId(subcategoryObj.id);
          form.setValue("subcategory_id", subcategoryObj.id);
        }
      }
    }
  }, [document, categories, form]);

  // Get available subcategories for the selected category
  const availableSubcategories = React.useMemo(() => {
    const category = categories.find((cat) => cat.id === selectedCategoryId);
    return category ? category.subcategories : [];
  }, [categories, selectedCategoryId]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    form.setValue("category_id", value);
    // Reset subcategory when category changes
    setSelectedSubcategoryId("");
    form.setValue("subcategory_id", "");
  };

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategoryId(value);
    form.setValue("subcategory_id", value);
  };

  const handleSubmit = (data: any) => {
    if (!document) return;
    
    // Transform data for the API
    const documentData: Partial<Document> = {
      title: data.title,
      description: data.description,
    };
    
    // Adicionar categoria e subcategoria se foram alteradas
    if (data.category_id) {
      const categoryObj = categories.find(cat => cat.id === data.category_id);
      if (categoryObj) {
        documentData.category = categoryObj.name;
      }
    }
    
    if (data.subcategory_id) {
      const categoryObj = categories.find(cat => cat.id === data.category_id);
      if (categoryObj) {
        const subcategoryObj = categoryObj.subcategories.find(sub => sub.id === data.subcategory_id);
        if (subcategoryObj) {
          documentData.subcategory = subcategoryObj.name;
        }
      }
    }
    
    console.log("EditDocumentDialog: Enviando atualizações:", documentData);
    
    onSubmit(document.id, documentData);
    onOpenChange(false);
  };

  // Não renderizar nada no servidor
  if (!mounted || !document) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[600px] ${
          isDarkMode ? "bg-black border-blue-700" : "bg-white border-[#B0BEC5]"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Editar Documento
          </DialogTitle>
          <DialogDescription
            className={isDarkMode ? "text-gray-300" : "text-gray-600"}
          >
            Atualize as informações do documento.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Informações do arquivo atual */}
            <div className={`p-4 rounded-lg ${
              isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-md ${
                  isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
                }`}>
                  <FileText className={`h-5 w-5 ${
                    document.fileType.toUpperCase() === 'PDF' ? 'text-red-500' : 'text-blue-500'
                  }`} />
                </div>
                <div>
                  <h3 className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}>
                    Arquivo Atual
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {document.fileType.toUpperCase()} • {document.fileSize}
                  </p>
                </div>
              </div>
              <p className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Nota: Esta edição não altera o arquivo. Para substituir o arquivo, exclua este documento e faça upload de um novo.
              </p>
            </div>

            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Título é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o título do documento"
                      {...field}
                      className={
                        isDarkMode
                          ? "bg-[#0F172A] border-blue-700"
                          : "bg-white border-[#B0BEC5]"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite uma descrição para o documento"
                      {...field}
                      className={
                        isDarkMode
                          ? "bg-[#0F172A] border-blue-700"
                          : "bg-white border-[#B0BEC5]"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      value={selectedCategoryId}
                      onValueChange={handleCategoryChange}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={
                            isDarkMode
                              ? "bg-[#0F172A] border-blue-700"
                              : "bg-white border-[#B0BEC5]"
                          }
                        >
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategory_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategoria</FormLabel>
                    <Select
                      value={selectedSubcategoryId}
                      onValueChange={handleSubcategoryChange}
                      disabled={!selectedCategoryId || availableSubcategories.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={
                            isDarkMode
                              ? "bg-[#0F172A] border-blue-700"
                              : "bg-white border-[#B0BEC5]"
                          }
                        >
                          <SelectValue placeholder="Selecione uma subcategoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSubcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className={
                  isDarkMode
                    ? "border-blue-700 text-white hover:bg-blue-900/20"
                    : "border-[#B0BEC5] text-gray-700 hover:bg-gray-100"
                }
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#FF6B00] hover:bg-[#FF8C3F] text-white"
              >
                <Save className="mr-2 h-4 w-4" /> Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDocumentDialog; 