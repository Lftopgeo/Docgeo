import React, { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Bell, Camera, CheckCircle, Globe, Lock, Mail, Palette, Shield, Upload, User, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SettingsOverviewProps {
  isDarkMode?: boolean;
  onSaveSettings?: (settings: any) => void;
}

const SettingsOverview = ({
  isDarkMode = true,
  onSaveSettings = () => {},
}: SettingsOverviewProps) => {
  // Referência para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hook para exibir toasts
  const { toast } = useToast();
  
  // Estado para controlar o carregamento durante o salvamento
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para as diferentes configurações
  const [generalSettings, setGeneralSettings] = useState({
    language: "pt-BR",
    notifications: true,
    emailNotifications: true,
    autoSave: true,
    defaultView: "grid",
  });

  const [accountSettings, setAccountSettings] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: isDarkMode ? "dark" : "light",
    primaryColor: "#FF6B00",
    fontSize: "medium",
    animationsEnabled: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordLastChanged: "2023-12-15",
  });

  // Função para abrir o seletor de arquivo
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Função para processar o upload de avatar
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar se o arquivo é uma imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    // Verificar o tamanho do arquivo (limite de 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo é muito grande. Por favor, selecione uma imagem com menos de 5MB.');
      return;
    }

    // Criar uma URL para a imagem
    const imageUrl = URL.createObjectURL(file);
    
    // Atualizar o estado com a nova imagem
    setAccountSettings({...accountSettings, avatar: imageUrl});
    
    // Limpar o input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Função para salvar todas as configurações
  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      
      const allSettings = {
        general: generalSettings,
        account: accountSettings,
        appearance: appearanceSettings,
        security: securitySettings,
      };
      
      // Chamar a API para salvar as configurações
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allSettings),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao salvar configurações');
      }
      
      // Chamar o callback onSaveSettings
      onSaveSettings(allSettings);
      
      // Exibir toast de sucesso
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram salvas com sucesso.",
        variant: "default",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      
      // Exibir toast de erro
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`w-full h-full p-6 ${isDarkMode ? "bg-[#0F172A]" : "bg-[#FAFAFA]"}`}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Configurações
          </h1>
          <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Gerencie suas preferências e configurações da conta
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6 w-full justify-start border-b pb-0">
            <TabsTrigger value="general" className="data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B00] rounded-none">
              <Globe className="mr-2 h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B00] rounded-none">
              <User className="mr-2 h-4 w-4" />
              Conta
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B00] rounded-none">
              <Palette className="mr-2 h-4 w-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B00] rounded-none">
              <Shield className="mr-2 h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Configurações Gerais */}
          <TabsContent value="general" className="space-y-6">
            <Card className={isDarkMode ? "bg-[#1E293B] border-blue-700/50" : "bg-white border-gray-200"}>
              <CardHeader>
                <CardTitle className={isDarkMode ? "text-white" : "text-gray-800"}>Configurações Gerais</CardTitle>
                <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Configure as preferências gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language" className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Idioma</Label>
                  <Select 
                    value={generalSettings.language}
                    onValueChange={(value) => setGeneralSettings({...generalSettings, language: value})}
                  >
                    <SelectTrigger id="language" className={isDarkMode ? "bg-[#0F172A] border-blue-700/50" : "bg-white border-gray-300"}>
                      <SelectValue placeholder="Selecione um idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultView" className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Visualização Padrão</Label>
                  <Select 
                    value={generalSettings.defaultView}
                    onValueChange={(value) => setGeneralSettings({...generalSettings, defaultView: value})}
                  >
                    <SelectTrigger id="defaultView" className={isDarkMode ? "bg-[#0F172A] border-blue-700/50" : "bg-white border-gray-300"}>
                      <SelectValue placeholder="Selecione uma visualização" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grade</SelectItem>
                      <SelectItem value="list">Lista</SelectItem>
                      <SelectItem value="kanban">Kanban</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className={isDarkMode ? "bg-blue-700/30" : "bg-gray-200"} />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Notificações</Label>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Receber notificações no sistema
                    </p>
                  </div>
                  <Switch 
                    checked={generalSettings.notifications}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, notifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Notificações por Email</Label>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Receber notificações por email
                    </p>
                  </div>
                  <Switch 
                    checked={generalSettings.emailNotifications}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, emailNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Salvamento Automático</Label>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Salvar alterações automaticamente
                    </p>
                  </div>
                  <Switch 
                    checked={generalSettings.autoSave}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, autoSave: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações de Conta */}
          <TabsContent value="account" className="space-y-6">
            <Card className={isDarkMode ? "bg-[#1E293B] border-blue-700/50" : "bg-white border-gray-200"}>
              <CardHeader>
                <CardTitle className={isDarkMode ? "text-white" : "text-gray-800"}>Perfil do Usuário</CardTitle>
                <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Gerencie suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-2 border-primary/20 cursor-pointer group-hover:opacity-80 transition-opacity">
                      <AvatarImage src={accountSettings.avatar} alt={accountSettings.name} />
                      <AvatarFallback>{accountSettings.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <div className="bg-black/50 rounded-full p-2">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                      aria-label="Upload de avatar"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{accountSettings.name}</h3>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{accountSettings.email}</p>
                    <Badge className="mt-1 bg-primary/20 text-primary border-primary/10">
                      {accountSettings.role}
                    </Badge>
                    <div className="mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8"
                        onClick={handleAvatarClick}
                      >
                        <Upload className="h-3 w-3 mr-1" /> Alterar Avatar
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Nome</Label>
                  <Input 
                    id="name" 
                    value={accountSettings.name}
                    onChange={(e) => setAccountSettings({...accountSettings, name: e.target.value})}
                    className={isDarkMode ? "bg-[#0F172A] border-blue-700/50" : "bg-white border-gray-300"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={accountSettings.email}
                    onChange={(e) => setAccountSettings({...accountSettings, email: e.target.value})}
                    className={isDarkMode ? "bg-[#0F172A] border-blue-700/50" : "bg-white border-gray-300"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Função</Label>
                  <Select 
                    value={accountSettings.role}
                    onValueChange={(value) => setAccountSettings({...accountSettings, role: value})}
                  >
                    <SelectTrigger id="role" className={isDarkMode ? "bg-[#0F172A] border-blue-700/50" : "bg-white border-gray-300"}>
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Administrador</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="Viewer">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações de Aparência */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className={isDarkMode ? "bg-[#1E293B] border-blue-700/50" : "bg-white border-gray-200"}>
              <CardHeader>
                <CardTitle className={isDarkMode ? "text-white" : "text-gray-800"}>Aparência</CardTitle>
                <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Personalize a aparência da interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Tema</Label>
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      className={`flex items-center justify-center gap-2 h-20 ${
                        appearanceSettings.theme === "light" 
                          ? "border-2 border-primary" 
                          : isDarkMode ? "border-blue-700/50" : "border-gray-300"
                      }`}
                      onClick={() => setAppearanceSettings({...appearanceSettings, theme: "light"})}
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-300"></div>
                      <div className="text-left">
                        <p className={isDarkMode ? "text-white" : "text-gray-800"}>Claro</p>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Tema claro</p>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={`flex items-center justify-center gap-2 h-20 ${
                        appearanceSettings.theme === "dark" 
                          ? "border-2 border-primary" 
                          : isDarkMode ? "border-blue-700/50" : "border-gray-300"
                      }`}
                      onClick={() => setAppearanceSettings({...appearanceSettings, theme: "dark"})}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#0F172A] border border-blue-700/50"></div>
                      <div className="text-left">
                        <p className={isDarkMode ? "text-white" : "text-gray-800"}>Escuro</p>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Tema escuro</p>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor" className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Cor Primária</Label>
                  <div className="flex items-center gap-3">
                    <Input 
                      id="primaryColor" 
                      type="color"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                      className="w-12 h-12 p-1 cursor-pointer"
                    />
                    <Input 
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                      className={isDarkMode ? "bg-[#0F172A] border-blue-700/50" : "bg-white border-gray-300"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontSize" className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Tamanho da Fonte</Label>
                  <Select 
                    value={appearanceSettings.fontSize}
                    onValueChange={(value) => setAppearanceSettings({...appearanceSettings, fontSize: value})}
                  >
                    <SelectTrigger id="fontSize" className={isDarkMode ? "bg-[#0F172A] border-blue-700/50" : "bg-white border-gray-300"}>
                      <SelectValue placeholder="Selecione um tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeno</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Animações</Label>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Habilitar animações na interface
                    </p>
                  </div>
                  <Switch 
                    checked={appearanceSettings.animationsEnabled}
                    onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, animationsEnabled: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações de Segurança */}
          <TabsContent value="security" className="space-y-6">
            <Card className={isDarkMode ? "bg-[#1E293B] border-blue-700/50" : "bg-white border-gray-200"}>
              <CardHeader>
                <CardTitle className={isDarkMode ? "text-white" : "text-gray-800"}>Segurança</CardTitle>
                <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Gerencie suas configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Autenticação de Dois Fatores</Label>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Adiciona uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <Switch 
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Tempo Limite da Sessão (minutos)</Label>
                  <Select 
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}
                  >
                    <SelectTrigger id="sessionTimeout" className={isDarkMode ? "bg-[#0F172A] border-blue-700/50" : "bg-white border-gray-300"}>
                      <SelectValue placeholder="Selecione um tempo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className={`text-sm font-medium ${isDarkMode ? "text-yellow-400" : "text-yellow-700"}`}>
                      Última alteração de senha
                    </h4>
                    <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Sua senha foi alterada pela última vez em {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}. 
                      Recomendamos alterar sua senha a cada 90 dias.
                    </p>
                    <Button variant="outline" className="mt-2 h-8 text-xs">
                      Alterar Senha
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" className={isDarkMode ? "border-blue-700/50" : "border-gray-300"}>
            Cancelar
          </Button>
          <Button 
            className="bg-[#FF6B00] hover:bg-[#FF8C3F] flex items-center gap-2" 
            onClick={handleSaveAll}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverview; 