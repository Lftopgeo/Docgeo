# AI Tools Dashboard

## Visão Geral

Um dashboard moderno para gerenciar ferramentas de IA, documentos e tarefas em uma única plataforma centralizada. O projeto apresenta uma interface elegante com tema escuro, navegação intuitiva e monitoramento de status.

## Funcionalidades Principais

### Gerenciamento de Ferramentas de IA

- Interface baseada em cards exibindo ferramentas de IA com indicadores de status (Ativo, Manutenção)
- Funcionalidade de filtro e barra de pesquisa para encontrar rapidamente ferramentas específicas
- Botão "Adicionar Nova Ferramenta" para expandir a coleção com integrações personalizadas
- Categorias de ferramentas com ícones visuais e recursos de acesso rápido (Processamento Rápido, Suite Criativa, Codificação Inteligente)

### Gerenciamento de Documentos

- Organização de documentos por categorias e subcategorias
- Visualização em grade com informações detalhadas sobre cada documento
- Funcionalidade para adicionar novas categorias e subcategorias
- Filtros e pesquisa para localizar documentos rapidamente

### Sistema de Tarefas

- Gerenciamento completo de tarefas com status (A Fazer, Em Andamento, Concluído, Bloqueado)
- Priorização de tarefas (Baixa, Média, Alta, Urgente)
- Sistema de tags para categorização
- Atribuição de tarefas a usuários específicos
- Comentários e histórico de atividades para cada tarefa

## Tecnologias Utilizadas

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Autenticação, Armazenamento)
- **Estilo**: Tema escuro com acentos em laranja (#FF6B00)

## Estrutura do Banco de Dados

### Ferramentas de IA
- `tools`: Informações principais sobre as ferramentas de IA
- `tool_usage_stats`: Estatísticas de uso para cada ferramenta
- `tool_integrations`: Integrações disponíveis para cada ferramenta

### Documentos
- `document_categories`: Categorias principais de documentos
- `document_subcategories`: Subcategorias para organização detalhada
- `documents`: Informações sobre documentos individuais

### Tarefas
- `tasks`: Informações principais sobre tarefas
- `task_tags`: Tags associadas a cada tarefa
- `task_comments`: Comentários em tarefas

## Funcionalidades da API

- Endpoints RESTful para todas as entidades principais
- Políticas de segurança baseadas em Row Level Security (RLS)
- Edge Function para processamento de IA simulado

## Hooks React Personalizados

- `useTools()`: Para gerenciar ferramentas de IA
- `useDocuments()`: Para gerenciar documentos e categorias
- `useTasks()`: Para gerenciar tarefas, tags e comentários

## Interface do Usuário

- Design responsivo para todos os tamanhos de tela
- Navegação intuitiva com barra lateral
- Componentes interativos como diálogos, menus suspensos e filtros
- Tema escuro com acentos em laranja (#FF6B00) para melhor legibilidade e estética moderna
