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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Folder, Plus, FileText, Map, FileCheck, Code, Settings, TreePine } from "lucide-react";
import { Badge } from "../ui/badge";

// Lista de sugestões de categorias de documentos
const documentCategorySuggestions = [
  { name: "Meio Ambiente", description: "Documentos relacionados a estudos ambientais, licenças e relatórios", icon: <TreePine className="h-3 w-3" /> },
  { name: "Topografia", description: "Levantamentos topográficos, mapas e medições de terreno", icon: <Map className="h-3 w-3" /> },
  { name: "Cartório", description: "Documentos cartoriais, escrituras, certidões e registros", icon: <FileCheck className="h-3 w-3" /> },
  { name: "Lisps", description: "Rotinas e programas em LISP para AutoCAD", icon: <Code className="h-3 w-3" /> },
  { name: "Softwares", description: "Documentação de softwares, manuais e tutoriais", icon: <Settings className="h-3 w-3" /> },
  { name: "Projetos", description: "Documentos relacionados a projetos específicos", icon: <Folder className="h-3 w-3" /> },
  { name: "Contratos", description: "Contratos, acordos e documentos legais", icon: <FileText className="h-3 w-3" /> },
  { name: "Relatórios", description: "Relatórios técnicos e análises", icon: <FileText className="h-3 w-3" /> },
  { name: "Plantas", description: "Plantas arquitetônicas e desenhos técnicos", icon: <Map className="h-3 w-3" /> },
  { name: "Memoriais", description: "Memoriais descritivos e documentação técnica", icon: <FileText className="h-3 w-3" /> },
  { name: "Licenças", description: "Licenças ambientais, alvarás e permissões", icon: <FileCheck className="h-3 w-3" /> },
  { name: "Orçamentos", description: "Orçamentos, cotações e planilhas financeiras", icon: <FileText className="h-3 w-3" /> },
];

interface AddCategoryDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: { name: string }) => void;
  isDarkMode?: boolean;
}

const AddCategoryDialog = ({
  open = false,
  onOpenChange = () => {},
  onSubmit = () => {},
  isDarkMode = true,
}: AddCategoryDialogProps) => {
  const [mounted, setMounted] = useState(false);
  
  // Verificar se estamos no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (data: { name: string }) => {
    onSubmit(data);
    form.reset();
  };

  // Função para selecionar uma sugestão
  const selectSuggestion = (suggestion: string) => {
    form.setValue("name", suggestion);
  };

  // Não renderizar nada no servidor
  if (!mounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[425px] ${
          isDarkMode ? "bg-black border-blue-700" : "bg-white border-[#B0BEC5]"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Folder className="h-5 w-5 text-blue-400" />
            Adicionar Nova Categoria
          </DialogTitle>
          <DialogDescription className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            Crie uma nova categoria para organizar seus documentos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Nome da categoria é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Categoria</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome da categoria"
                      {...field}
                      className={
                        isDarkMode
                          ? "bg-[#0F172A] border-blue-700"
                          : "bg-white border-[#B0BEC5]"
                      }
                    />
                  </FormControl>
                  <FormDescription
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    Escolha um nome descritivo para sua categoria.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sugestões de categorias */}
            <div className="space-y-2">
              <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Sugestões de Categorias
              </h3>
              <div className="flex flex-wrap gap-2">
                {documentCategorySuggestions.map((suggestion) => (
                  <Badge
                    key={suggestion.name}
                    variant="outline"
                    className={`cursor-pointer hover:bg-primary/10 transition-colors flex items-center gap-1 px-3 py-1 ${
                      form.watch("name") === suggestion.name
                        ? "bg-primary/20 border-primary"
                        : ""
                    }`}
                    onClick={() => selectSuggestion(suggestion.name)}
                    title={suggestion.description}
                  >
                    {suggestion.icon}
                    {suggestion.name}
                  </Badge>
                ))}
              </div>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Clique em uma sugestão para selecioná-la ou digite um nome personalizado.
              </p>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                className={isDarkMode ? "border-blue-700" : "border-[#B0BEC5]"}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#FF6B00] hover:bg-[#FF8C3F] text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Adicionar Categoria
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
