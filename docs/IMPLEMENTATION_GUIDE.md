# Guia de Implementação - Docgeo

Este documento fornece orientações detalhadas para implementação e desenvolvimento do projeto Docgeo, complementando a documentação existente.

## Arquitetura Técnica

### Visão Geral da Arquitetura

O Docgeo segue uma arquitetura em camadas com separação clara de responsabilidades:

```
Frontend (React/Next.js) → API Routes → Serviços → Repositórios → Supabase
```

### Tecnologias Principais

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, TypeScript
- **Banco de Dados**: PostgreSQL via Supabase
- **Autenticação**: Supabase Auth
- **Armazenamento**: Supabase Storage

## Guia de Implementação por Funcionalidade

### 1. Autenticação e Autorização

#### Implementação do Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Redirecionar para login se não estiver autenticado
  if (!session && !req.nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
  
  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
    '/api/((?!auth).*)' 
  ],
}
```

#### Configuração de Row Level Security (RLS)

Para cada tabela no Supabase, configure políticas RLS:

```sql
-- Exemplo para tabela documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Política para SELECT
CREATE POLICY "Usuários podem ver documentos públicos ou próprios" 
ON documents FOR SELECT 
USING (is_public OR created_by = auth.uid());

-- Política para INSERT
CREATE POLICY "Usuários podem criar documentos" 
ON documents FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Política para UPDATE
CREATE POLICY "Usuários podem atualizar seus próprios documentos" 
ON documents FOR UPDATE 
USING (created_by = auth.uid());

-- Política para DELETE
CREATE POLICY "Usuários podem excluir seus próprios documentos" 
ON documents FOR DELETE 
USING (created_by = auth.uid());
```

### 2. Upload de Arquivos

#### Configuração do Bucket no Supabase

1. Acesse o Console do Supabase
2. Vá para "Storage" e crie buckets para:
   - `documents` - Para arquivos de documentos
   - `task-attachments` - Para anexos de tarefas
   - `tool-images` - Para imagens de ferramentas

3. Configure políticas RLS para cada bucket:

```sql
-- Exemplo para bucket documents
CREATE POLICY "Arquivos são acessíveis por todos os usuários autenticados"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários podem fazer upload de arquivos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários podem atualizar seus próprios arquivos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents' AND owner = auth.uid());

CREATE POLICY "Usuários podem excluir seus próprios arquivos"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents' AND owner = auth.uid());
```

#### Implementação do Upload de Arquivos

```typescript
// src/components/documents/DocumentUpload.tsx
import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

export function DocumentUpload({ onUploadComplete }: { onUploadComplete: (url: string, fileType: string, fileSize: number) => void }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const supabase = useSupabaseClient()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Selecione um arquivo para upload')
      }
      
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`
      
      // Upload do arquivo com progresso
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            setProgress(Math.round((progress.loaded / progress.total) * 100))
          },
        })
      
      if (error) throw error
      
      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)
      
      onUploadComplete(publicUrl, file.type, file.size)
    } catch (error: any) {
      console.error('Erro no upload:', error.message)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="file"
        disabled={uploading}
        onChange={handleUpload}
        className="cursor-pointer"
      />
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">{progress}% concluído</p>
        </div>
      )}
    </div>
  )
}
```

### 3. Validação de Dados

#### Implementação com Zod

Instale o Zod:

```bash
npm install zod
```

Crie esquemas de validação:

```typescript
// src/schemas/documentSchema.ts
import { z } from 'zod'

export const documentCreateSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório').max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z.string().optional(),
  content: z.string().optional(),
  file_url: z.string().url('URL inválida').optional(),
  file_type: z.string().optional(),
  file_size: z.number().positive().optional(),
  category_id: z.string().uuid('ID de categoria inválido').optional(),
  subcategory_id: z.string().uuid('ID de subcategoria inválido').optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  is_public: z.boolean().optional(),
})

export const documentUpdateSchema = documentCreateSchema.extend({
  id: z.string().uuid('ID de documento inválido'),
})

export type DocumentCreate = z.infer<typeof documentCreateSchema>
export type DocumentUpdate = z.infer<typeof documentUpdateSchema>
```

Utilize os esquemas nos serviços:

```typescript
// src/services/documentService.ts
import { documentCreateSchema, documentUpdateSchema } from '@/schemas/documentSchema'
import { documentRepository } from '@/repositories'

export const documentService = {
  async createDocument(document: unknown) {
    // Validar dados
    const validatedData = documentCreateSchema.parse(document)
    
    // Criar documento
    return documentRepository.create(validatedData)
  },
  
  async updateDocument(id: string, document: unknown) {
    // Validar dados
    const validatedData = documentUpdateSchema.parse({ id, ...document })
    
    // Verificar se o documento existe
    const existingDocument = await documentRepository.getById(id)
    if (!existingDocument) {
      throw new Error('Documento não encontrado')
    }
    
    // Atualizar documento
    return documentRepository.update(id, validatedData)
  },
  
  // Outros métodos...
}
```

### 4. Testes Automatizados

#### Configuração de Jest

Instale as dependências:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom ts-jest
```

Configure o Jest:

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom'
```

#### Exemplo de Teste de Componente

```typescript
// src/components/documents/DocumentCard.test.tsx
import { render, screen } from '@testing-library/react'
import { DocumentCard } from './DocumentCard'

describe('DocumentCard', () => {
  it('renderiza o título do documento', () => {
    render(
      <DocumentCard
        document={{
          id: '1',
          title: 'Documento de Teste',
          description: 'Descrição do documento',
          file_type: 'PDF',
          created_at: new Date().toISOString(),
        }}
      />
    )
    
    expect(screen.getByText('Documento de Teste')).toBeInTheDocument()
  })
  
  it('exibe o ícone correto para o tipo de arquivo', () => {
    render(
      <DocumentCard
        document={{
          id: '1',
          title: 'Documento de Teste',
          description: 'Descrição do documento',
          file_type: 'PDF',
          created_at: new Date().toISOString(),
        }}
      />
    )
    
    // Verificar se o ícone de PDF está presente
    expect(screen.getByTestId('file-pdf-icon')).toBeInTheDocument()
  })
})
```

#### Exemplo de Teste de Serviço

```typescript
// src/services/__tests__/documentService.test.ts
import { documentService } from '@/services'
import { documentRepository } from '@/repositories'

// Mock do repositório
jest.mock('@/repositories', () => ({
  documentRepository: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))

describe('documentService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  describe('createDocument', () => {
    it('deve validar e criar um documento', async () => {
      const mockDocument = {
        title: 'Documento de Teste',
        description: 'Descrição do documento',
        is_public: true,
      }
      
      documentRepository.create.mockResolvedValue({
        id: '1',
        ...mockDocument,
        created_at: new Date().toISOString(),
      })
      
      const result = await documentService.createDocument(mockDocument)
      
      expect(documentRepository.create).toHaveBeenCalledWith(mockDocument)
      expect(result).toHaveProperty('id', '1')
      expect(result).toHaveProperty('title', 'Documento de Teste')
    })
    
    it('deve lançar erro se o título não for fornecido', async () => {
      const mockDocument = {
        description: 'Descrição do documento',
        is_public: true,
      }
      
      await expect(documentService.createDocument(mockDocument)).rejects.toThrow()
      expect(documentRepository.create).not.toHaveBeenCalled()
    })
  })
})
```

### 5. Otimização de Desempenho

#### Implementação com SWR

Instale o SWR:

```bash
npm install swr
```

Configure o SWR:

```typescript
// src/lib/swr.ts
import { SWRConfig } from 'swr'

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          const res = await fetch(url)
          
          if (!res.ok) {
            const error = new Error('Erro na requisição')
            const data = await res.json().catch(() => ({}))
            ;(error as any).status = res.status
            ;(error as any).info = data
            throw error
          }
          
          return res.json()
        },
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}
```

Utilize o SWR nos componentes:

```typescript
// src/hooks/useDocuments.ts
import useSWR from 'swr'
import { Document } from '@/repositories'

export function useDocuments() {
  const { data, error, isLoading, mutate } = useSWR<Document[]>('/api/documents')
  
  const createDocument = async (document: Omit<Document, 'id'>) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(document),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar documento')
      }
      
      const newDocument = await response.json()
      
      // Atualizar cache
      mutate([...(data || []), newDocument], false)
      
      return newDocument
    } catch (err) {
      throw err
    }
  }
  
  return {
    documents: data || [],
    isLoading,
    error,
    createDocument,
  }
}
```

### 6. Implementação de Notificações em Tempo Real

#### Configuração do Supabase Realtime

1. Ative o Realtime no Console do Supabase para as tabelas relevantes
2. Implemente um hook para inscrição em mudanças:

```typescript
// src/hooks/useRealtimeSubscription.ts
import { useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export function useRealtimeSubscription(
  table: string,
  onInsert?: (payload: any) => void,
  onUpdate?: (payload: any) => void,
  onDelete?: (payload: any) => void
) {
  const supabase = useSupabaseClient()
  
  useEffect(() => {
    // Inscrever-se em mudanças na tabela
    const subscription = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table },
        (payload) => onInsert && onInsert(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table },
        (payload) => onUpdate && onUpdate(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table },
        (payload) => onDelete && onDelete(payload.old)
      )
      .subscribe()
    
    // Limpar inscrição ao desmontar
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [supabase, table, onInsert, onUpdate, onDelete])
}
```

Utilize o hook em componentes:

```typescript
// src/components/tasks/TaskList.tsx
import { useEffect } from 'react'
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription'
import { useTasks } from '@/hooks/useTasks'

export function TaskList() {
  const { tasks, isLoading, error, mutate } = useTasks()
  
  // Inscrever-se em mudanças na tabela tasks
  useRealtimeSubscription(
    'tasks',
    (newTask) => {
      // Adicionar nova tarefa à lista
      mutate([...tasks, newTask], false)
    },
    (updatedTask) => {
      // Atualizar tarefa na lista
      mutate(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
        false
      )
    },
    (deletedTask) => {
      // Remover tarefa da lista
      mutate(
        tasks.filter((task) => task.id !== deletedTask.id),
        false
      )
    }
  )
  
  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar tarefas</div>
  
  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  )
}
```

## Boas Práticas de Desenvolvimento

### Convenções de Código

- **Nomenclatura**:
  - PascalCase para componentes, interfaces e tipos
  - camelCase para variáveis, funções e métodos
  - snake_case para colunas do banco de dados
  - kebab-case para nomes de arquivos CSS e URLs

- **Estrutura de Arquivos**:
  - Um componente por arquivo
  - Agrupar componentes relacionados em diretórios
  - Manter arquivos pequenos e focados em uma única responsabilidade

### Padrões de Commit

Utilize commits semânticos:

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Alterações que não afetam o código (espaço em branco, formatação, etc.)
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Alterações no processo de build ou ferramentas auxiliares

Exemplo:
```
feat(documents): adiciona suporte para upload de múltiplos arquivos
```

### Revisão de Código

- Utilize Pull Requests para revisão de código
- Verifique se o código segue as convenções do projeto
- Verifique se os testes foram adicionados ou atualizados
- Verifique se a documentação foi atualizada

## Solução de Problemas Comuns

### Erro de Importação de Ícones

Se você encontrar erros como:

```
Attempted import error: 'FilePresentation' is not exported from 'lucide-react'
```

Verifique se o nome do ícone está correto e se a versão da biblioteca está atualizada. Alguns ícones podem ter sido renomeados ou removidos em versões mais recentes.

Solução:
1. Verifique a documentação da biblioteca para encontrar o nome correto do ícone
2. Atualize a importação no código
3. Se o ícone não existir mais, encontre uma alternativa

### Problemas com Portas em Uso

Se você encontrar mensagens como:

```
Port 3000 is in use, trying 3001 instead.
```

Isso indica que a porta já está sendo usada por outro processo. O Next.js tentará automaticamente usar a próxima porta disponível.

Se você precisar usar uma porta específica, encerre os processos que estão usando essa porta:

No Windows:
```
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

No Linux/Mac:
```
lsof -i :3000
kill -9 <PID>
```

### Problemas com Cache do Webpack

Se você encontrar erros como:

```
Caching failed for pack: Error: ENOENT: no such file or directory
```

Isso geralmente é causado por problemas de permissão ou corrupção do cache.

Solução:
1. Limpe o cache do Next.js:
   ```
   rm -rf .next/cache
   ```
2. Reinicie o servidor de desenvolvimento

## Próximos Passos

Após implementar as funcionalidades básicas, considere:

1. **Implementar PWA (Progressive Web App)**: Adicione suporte para instalação e funcionamento offline
2. **Adicionar Análise de Dados**: Implemente dashboards para visualização de estatísticas de uso
3. **Integrar com Serviços Externos**: Adicione integrações com serviços como Google Drive, Dropbox, etc.
4. **Implementar Funcionalidades Colaborativas**: Adicione suporte para edição colaborativa de documentos
5. **Otimizar para SEO**: Melhore a indexação e visibilidade do conteúdo público

## Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Supabase](https://supabase.io/docs)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do shadcn/ui](https://ui.shadcn.com)
- [Documentação do TypeScript](https://www.typescriptlang.org/docs)
- [Documentação do Zod](https://zod.dev)
- [Documentação do SWR](https://swr.vercel.app) 