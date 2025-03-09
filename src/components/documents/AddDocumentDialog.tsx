'use client';

import React, { useState, useEffect, useRef } from "react";
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
  FormDescription,
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
import { Upload, File as FileIcon, Save, X, Check, AlertCircle } from "lucide-react";
import { Progress } from "../ui/progress";
import dynamic from 'next/dynamic';

interface Category {
  id: string;
  name: string;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
}

interface AddDocumentDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: any) => void;
  categories?: Category[];
  selectedCategory?: string;
  isDarkMode?: boolean;
}

// Criando um componente para o conteúdo do diálogo que será renderizado apenas no cliente
const AddDocumentDialogContent = ({
  open = false,
  onOpenChange = () => {},
  onSubmit = () => {},
  categories = [],
  selectedCategory = "",
  isDarkMode = true,
}: AddDocumentDialogProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      category_id: "",
      subcategory_id: "",
      file_type: "",
      file_size: "",
    },
  });

  // Find the selected category object
  const selectedCategoryObj = categories.find(
    (cat) => cat.name === selectedCategory
  );

  // Set initial category if provided
  useEffect(() => {
    if (selectedCategoryObj) {
      setSelectedCategoryId(selectedCategoryObj.id);
      form.setValue("category_id", selectedCategoryObj.id);
    }
  }, [selectedCategory, categories, form]);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      
      // Atualizar os campos do formulário com informações do arquivo
      const fileType = file.name.split('.').pop()?.toUpperCase() || '';
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      
      form.setValue("file_type", fileType);
      form.setValue("file_size", `${fileSizeInMB} MB`);
      
      // Se o título estiver vazio, usar o nome do arquivo como título
      if (!form.getValues("title")) {
        const fileName = file.name.split('.').slice(0, -1).join('.');
        form.setValue("title", fileName);
      }
      
      setUploadStatus('idle');
      setUploadError(null);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const simulateFileUpload = () => {
    if (!selectedFile) return;
    
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    // Simular progresso de upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadError(null);
    
    // Limpar os campos relacionados ao arquivo
    form.setValue("file_type", "");
    form.setValue("file_size", "");
    
    // Limpar o input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (data: any) => {
    // Verificar se um arquivo foi selecionado
    if (!selectedFile) {
      setUploadError("Por favor, selecione um arquivo para upload.");
      return;
    }
    
    // Verificar tamanho do arquivo (máximo 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError("O arquivo é muito grande. O tamanho máximo é 10MB.");
      return;
    }
    
    // Verificar tipo do arquivo
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'jpg', 'jpeg', 'png'];
    
    if (!allowedExtensions.includes(fileExtension)) {
      setUploadError("Tipo de arquivo não suportado. Por favor, use um dos formatos permitidos.");
      return;
    }
    
    // Simular upload do arquivo antes de enviar o formulário
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    // Simular progresso de upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          
          // Transform data for the API
          const documentData = {
            ...data,
            category: categories.find((cat) => cat.id === data.category_id)?.name || "",
            subcategory: availableSubcategories.find((sub) => sub.id === data.subcategory_id)?.name || "",
            lastUpdated: new Date().toLocaleDateString(),
            fileType: data.file_type,
            fileSize: data.file_size,
            file: selectedFile,
          };
          
          console.log("AddDocumentDialog: Enviando documento para upload:", {
            title: documentData.title,
            category: documentData.category,
            subcategory: documentData.subcategory,
            fileType: documentData.fileType,
            fileSize: documentData.fileSize,
            fileName: selectedFile.name
          });
          
          // Enviar o documento
          setTimeout(() => {
            try {
              onSubmit(documentData);
            } catch (error) {
              console.error("Erro ao enviar documento:", error);
              setUploadStatus('error');
              setUploadError("Erro ao enviar documento. Tente novamente.");
            }
          }, 500);
          
          // Resetar o formulário
          form.reset();
          setSelectedCategoryId("");
          setSelectedSubcategoryId("");
          setSelectedFile(null);
          setUploadStatus('idle');
          setUploadProgress(0);
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  // Adicionar suporte para arrastar e soltar
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Verificar tamanho do arquivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("O arquivo é muito grande. O tamanho máximo é 10MB.");
        return;
      }
      
      // Verificar tipo do arquivo
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'jpg', 'jpeg', 'png'];
      
      if (!allowedExtensions.includes(fileExtension)) {
        setUploadError("Tipo de arquivo não suportado. Por favor, use um dos formatos permitidos.");
        return;
      }
      
      // Processar o arquivo
      setSelectedFile(file);
      
      // Atualizar os campos do formulário com informações do arquivo
      const fileType = fileExtension.toUpperCase();
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      
      form.setValue("file_type", fileType);
      form.setValue("file_size", `${fileSizeInMB} MB`);
      
      // Se o título estiver vazio, usar o nome do arquivo como título
      if (!form.getValues("title")) {
        const fileName = file.name.split('.').slice(0, -1).join('.');
        form.setValue("title", fileName);
      }
      
      setUploadStatus('idle');
      setUploadError(null);
    }
  };

  return (
    <DialogContent
      className={`sm:max-w-[600px] ${
        isDarkMode ? "bg-black border-blue-700" : "bg-white border-[#B0BEC5]"
      }`}
    >
      <DialogHeader>
        <DialogTitle className="text-xl font-bold flex items-center gap-2">
          <FileIcon className="h-5 w-5 text-blue-400" />
          Adicionar Novo Documento
        </DialogTitle>
        <DialogDescription
          className={isDarkMode ? "text-gray-300" : "text-gray-600"}
        >
          Preencha os detalhes do documento que deseja adicionar.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          {/* Área de upload de arquivo */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDarkMode 
                ? "border-blue-700 bg-[#0F172A]/50" 
                : "border-blue-200 bg-blue-50"
            } ${uploadStatus === 'error' ? 'border-red-500' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png"
              id="file-upload"
              aria-label="Upload de arquivo"
            />
            
            {!selectedFile ? (
              <>
                <Upload className={`mx-auto h-12 w-12 mb-4 ${
                  isDarkMode ? "text-blue-400" : "text-blue-500"
                }`} />
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}>
                  Arraste e solte seu arquivo aqui
                </h3>
                <p className={`mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  ou
                </p>
                <Button
                  type="button"
                  onClick={handleUploadClick}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Selecionar Arquivo
                </Button>
                <p className={`mt-2 text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  PDF, Word, Excel, PowerPoint, TXT, CSV, JPG, PNG (max. 10MB)
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-md ${
                      isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
                    }`}>
                      <FileIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="text-left">
                      <p className={`font-medium truncate max-w-[200px] ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}>
                        {selectedFile.name}
                      </p>
                      <p className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className={`rounded-full p-1 ${
                      isDarkMode 
                        ? "hover:bg-red-900/20 text-red-400" 
                        : "hover:bg-red-100 text-red-500"
                    }`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {uploadStatus === 'uploading' && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className={`h-2 ${
                      isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
                    }`} />
                    <p className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      Fazendo upload... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}
                
                {uploadStatus === 'success' && (
                  <div className="flex items-center space-x-2 text-green-500">
                    <Check className="h-4 w-4" />
                    <span className="text-sm">Upload concluído com sucesso!</span>
                  </div>
                )}
                
                {uploadStatus === 'error' && (
                  <div className="flex items-center space-x-2 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{uploadError || "Erro ao fazer upload do arquivo."}</span>
                  </div>
                )}
              </div>
            )}
            
            {uploadError && !selectedFile && (
              <div className="mt-2 text-red-500 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{uploadError}</span>
              </div>
            )}
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
              rules={{ required: "Categoria é obrigatória" }}
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
              disabled={uploadStatus === 'uploading'}
            >
              <Save className="mr-2 h-4 w-4" /> Adicionar Documento
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

// Componente principal que será exportado
// Este componente só vai renderizar o conteúdo no cliente, garantindo que as APIs do navegador não sejam acessadas durante SSR
const AddDocumentDialog = (props: AddDocumentDialogProps) => {
  // Estado para verificar se estamos no cliente
  const [mounted, setMounted] = useState(false);

  // Verificar se estamos no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Renderizar o Dialog apenas no cliente
  if (!mounted) {
    return null; // Retorna null durante SSR
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <AddDocumentDialogContent {...props} />
    </Dialog>
  );
};

export default AddDocumentDialog;