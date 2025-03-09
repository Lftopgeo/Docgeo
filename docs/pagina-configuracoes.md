# Documentação da Página de Configurações - Docgeo

## Visão Geral

A página de configurações do Docgeo oferece aos usuários uma interface centralizada para personalizar sua experiência no sistema. Ela é acessível através do ícone de configurações na barra lateral e permite ajustar diversos aspectos da plataforma.

## Estrutura da Página

A página de configurações é organizada em um sistema de abas que separa as diferentes categorias de configurações:

1. **Geral** - Configurações básicas do sistema
2. **Conta** - Informações do usuário e preferências de conta
3. **Aparência** - Personalização visual da interface
4. **Segurança** - Configurações relacionadas à segurança da conta

## Componentes Principais

### SettingsOverview

O componente principal `SettingsOverview` gerencia toda a interface da página de configurações. Ele recebe as seguintes props:

```typescript
interface SettingsOverviewProps {
  isDarkMode?: boolean;
  onSaveSettings?: (settings: any) => void;
}
```

### Sistema de Abas

Utiliza o componente `Tabs` da biblioteca de UI para organizar as diferentes seções de configurações:

```jsx
<Tabs defaultValue="general" className="w-full">
  <TabsList className="grid grid-cols-4 mb-4">
    <TabsTrigger value="general">Geral</TabsTrigger>
    <TabsTrigger value="account">Conta</TabsTrigger>
    <TabsTrigger value="appearance">Aparência</TabsTrigger>
    <TabsTrigger value="security">Segurança</TabsTrigger>
  </TabsList>
  
  {/* Conteúdo das abas */}
</Tabs>
```

## Funcionalidades Principais

### Gerenciamento de Avatar

A página permite que os usuários alterem sua imagem de perfil (avatar):

- **Upload de Imagem**: Os usuários podem fazer upload de uma nova imagem de perfil
- **Validação**: O sistema verifica se o arquivo é uma imagem válida e se não excede 5MB
- **Visualização Instantânea**: A imagem é atualizada imediatamente após o upload

Implementação:
```typescript
const fileInputRef = useRef<HTMLInputElement>(null);

const handleAvatarClick = () => {
  fileInputRef.current?.click();
};

const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  
  if (file) {
    // Validação do tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }
    
    // Validação do tamanho do arquivo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter menos de 5MB.');
      return;
    }
    
    // Criação da URL para a imagem
    const imageUrl = URL.createObjectURL(file);
    // Atualização do estado do avatar
    // ...
    
    // Limpar o input de arquivo
    event.target.value = '';
  }
};
```

### Configurações de Notificação

Os usuários podem personalizar suas preferências de notificação:

- Ativar/desativar notificações por email
- Ativar/desativar notificações do sistema
- Configurar frequência de notificações

### Configurações de Aparência

Permite personalizar a interface visual:

- Alternar entre modo claro e escuro
- Ajustar tamanho da fonte
- Selecionar esquema de cores

### Configurações de Segurança

Opções relacionadas à segurança da conta:

- Alterar senha
- Configurar autenticação de dois fatores
- Gerenciar sessões ativas

## Fluxo de Salvamento

Todas as configurações são salvas através da função `handleSaveAll`:

```typescript
const handleSaveAll = () => {
  // Coleta todas as configurações
  const allSettings = {
    general: {
      // ...
    },
    account: {
      // ...
    },
    appearance: {
      // ...
    },
    security: {
      // ...
    }
  };
  
  // Chama a função de callback para salvar
  onSaveSettings(allSettings);
};
```

## Integração com o Sistema

A página de configurações é acessível através do ícone na barra lateral. A navegação é gerenciada pelo roteador do Next.js, que direciona o usuário para `/settings` quando o ícone é clicado.

## Considerações de Acessibilidade

- Todos os inputs possuem labels apropriados
- Elementos interativos têm atributos ARIA quando necessário
- A navegação por teclado é totalmente suportada
- Contraste de cores adequado para leitura

## Futuras Melhorias

- Implementação de preview em tempo real para alterações de aparência
- Adição de mais opções de personalização
- Suporte para temas personalizados
- Histórico de alterações de configurações 