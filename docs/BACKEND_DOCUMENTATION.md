# Documentação do Backend - Docgeo

Este documento descreve a implementação do backend do projeto Docgeo, incluindo a estrutura de repositórios, serviços e APIs.

## Estrutura do Projeto

O backend do Docgeo segue uma arquitetura em camadas:

1. **Repositórios**: Responsáveis pela comunicação direta com o Supabase
2. **Serviços**: Implementam a lógica de negócio e utilizam os repositórios
3. **APIs**: Expõem os serviços para o frontend através de endpoints HTTP

## Banco de Dados

O projeto utiliza o Supabase como banco de dados, com as seguintes tabelas:

### Documentos
- `document_categories`: Categorias de documentos
- `document_subcategories`: Subcategorias de documentos
- `documents`: Documentos

### Tarefas
- `tasks`: Tarefas
- `task_tags`: Tags associadas às tarefas
- `task_comments`: Comentários nas tarefas
- `task_attachments`: Anexos das tarefas

### Ferramentas
- `tools`: Ferramentas
- `tool_integrations`: Integrações de ferramentas
- `tool_usage_stats`: Estatísticas de uso de ferramentas

## Repositórios

### DocumentRepository

Responsável por gerenciar documentos, categorias e subcategorias.

```typescript
// Interfaces
export interface Document { ... }
export interface DocumentCreate { ... }
export interface DocumentUpdate { ... }

// Métodos
async getAll(): Promise<Document[]>
async getById(id: string): Promise<Document | null>
async create(document: DocumentCreate): Promise<Document>
async update(id: string, document: DocumentUpdate): Promise<Document>
async delete(id: string): Promise<void>
async incrementViewCount(id: string): Promise<void>
```

Também inclui métodos para categorias e subcategorias.

### TaskRepository

Responsável por gerenciar tarefas, comentários, anexos e tags.

```typescript
// Interfaces
export interface Task { ... }
export interface TaskCreate { ... }
export interface TaskUpdate { ... }
export interface TaskComment { ... }
export interface TaskAttachment { ... }

// Métodos
async getAll(): Promise<Task[]>
async getById(id: string): Promise<Task | null>
async create(task: TaskCreate): Promise<Task>
async update(id: string, task: TaskUpdate): Promise<Task>
async delete(id: string): Promise<void>
async updateTags(taskId: string, tags: string[]): Promise<void>
```

Também inclui métodos para comentários e anexos.

### ToolRepository

Responsável por gerenciar ferramentas, integrações e estatísticas de uso.

```typescript
// Interfaces
export interface Tool { ... }
export interface ToolCreate { ... }
export interface ToolUpdate { ... }
export interface ToolIntegration { ... }
export interface ToolUsageStat { ... }

// Métodos
async getAll(): Promise<Tool[]>
async getById(id: string): Promise<Tool | null>
async getByCategory(category: string): Promise<Tool[]>
async create(tool: ToolCreate): Promise<Tool>
async update(id: string, tool: ToolUpdate): Promise<Tool>
async delete(id: string): Promise<void>
```

Também inclui métodos para integrações e estatísticas de uso.

## Serviços

### DocumentService

Implementa a lógica de negócio para documentos, categorias e subcategorias.

```typescript
// Métodos
async getAllDocuments(): Promise<Document[]>
async getDocumentById(id: string): Promise<Document | null>
async createDocument(document: DocumentCreate): Promise<Document>
async updateDocument(id: string, document: DocumentUpdate): Promise<Document>
async deleteDocument(id: string): Promise<void>
async incrementViewCount(id: string): Promise<void>
```

Também inclui métodos para categorias e subcategorias, com validações como:
- Verificar se o título do documento é obrigatório
- Verificar se a categoria existe antes de criar uma subcategoria

### TaskService

Implementa a lógica de negócio para tarefas, comentários, anexos e tags.

```typescript
// Métodos
async getAllTasks(): Promise<Task[]>
async getTaskById(id: string): Promise<Task | null>
async createTask(task: TaskCreate): Promise<Task>
async updateTask(id: string, task: TaskUpdate): Promise<Task>
async deleteTask(id: string): Promise<void>
async updateTaskTags(taskId: string, tags: string[]): Promise<void>
async completeTask(id: string): Promise<Task>
async startTask(id: string): Promise<Task>
async cancelTask(id: string): Promise<Task>
async updateTaskProgress(id: string, progress: number): Promise<Task>
```

Também inclui métodos para comentários e anexos, com validações como:
- Verificar se o título da tarefa é obrigatório
- Verificar se o progresso está entre 0 e 100

### ToolService

Implementa a lógica de negócio para ferramentas, integrações e estatísticas de uso.

```typescript
// Métodos
async getAllTools(): Promise<Tool[]>
async getToolById(id: string): Promise<Tool | null>
async getToolsByCategory(category: string): Promise<Tool[]>
async createTool(tool: ToolCreate): Promise<Tool>
async updateTool(id: string, tool: ToolUpdate): Promise<Tool>
async deleteTool(id: string): Promise<void>
```

Também inclui métodos para integrações e estatísticas de uso, com validações como:
- Verificar se o nome da ferramenta é obrigatório
- Verificar se o tipo de integração é obrigatório

## APIs

### Documentos

#### `/api/documents`
- `GET`: Retorna todos os documentos
- `POST`: Cria um novo documento
- `PUT`: Atualiza um documento existente
- `DELETE`: Exclui um documento

#### `/api/categories`
- `GET`: Retorna todas as categorias
- `POST`: Cria uma nova categoria
- `PUT`: Atualiza uma categoria existente
- `DELETE`: Exclui uma categoria

#### `/api/subcategories`
- `GET`: Retorna todas as subcategorias ou subcategorias de uma categoria específica
- `POST`: Cria uma nova subcategoria
- `PUT`: Atualiza uma subcategoria existente
- `DELETE`: Exclui uma subcategoria

### Tarefas

#### `/api/tasks`
- `GET`: Retorna todas as tarefas
- `POST`: Cria uma nova tarefa
- `PUT`: Atualiza uma tarefa existente
- `DELETE`: Exclui uma tarefa

#### `/api/tasks/comments`
- `POST`: Cria um novo comentário
- `PUT`: Atualiza um comentário existente
- `DELETE`: Exclui um comentário

#### `/api/tasks/attachments`
- `POST`: Cria um novo anexo
- `DELETE`: Exclui um anexo

#### `/api/tasks/tags`
- `PUT`: Atualiza as tags de uma tarefa

### Ferramentas

#### `/api/tools`
- `GET`: Retorna todas as ferramentas ou ferramentas de uma categoria específica
- `POST`: Cria uma nova ferramenta
- `PUT`: Atualiza uma ferramenta existente
- `DELETE`: Exclui uma ferramenta

#### `/api/tools/integrations`
- `GET`: Retorna todas as integrações de uma ferramenta
- `POST`: Cria uma nova integração
- `PUT`: Atualiza uma integração existente
- `DELETE`: Exclui uma integração

#### `/api/tools/usage-stats`
- `GET`: Retorna as estatísticas de uso de uma ferramenta
- `POST`: Registra o uso de uma ferramenta

## Autenticação

As APIs estão preparadas para utilizar a autenticação do Supabase. Os serviços e repositórios incluem métodos para o servidor que utilizam o cliente do Supabase com cookies para autenticação.

## Tratamento de Erros

Todas as APIs incluem tratamento de erros, retornando mensagens de erro apropriadas e códigos de status HTTP.

## Próximos Passos

1. **Implementar Autenticação**: Adicionar middleware para verificar a autenticação em todas as APIs
2. **Melhorar Validações**: Adicionar mais validações nos serviços
3. **Implementar Testes**: Adicionar testes automatizados para os repositórios, serviços e APIs
4. **Documentar API**: Adicionar documentação mais detalhada para as APIs, incluindo exemplos de requisições e respostas
5. **Implementar Upload de Arquivos**: Adicionar suporte para upload de arquivos para documentos e anexos de tarefas 