# Implementação do Banco de Dados Supabase - Docgeo

Este documento descreve a estrutura do banco de dados Supabase para o projeto Docgeo e fornece instruções para sua implementação.

## Visão Geral

O banco de dados do Docgeo é composto por várias tabelas organizadas em três domínios principais:

1. **Usuários e Configurações** - Gerenciamento de perfis de usuários e suas preferências
2. **Documentos** - Armazenamento e categorização de documentos
3. **Tarefas** - Sistema de gerenciamento de tarefas
4. **Ferramentas de IA** - Ferramentas e suas estatísticas de uso

Além disso, o sistema utiliza buckets de armazenamento para diferentes tipos de arquivos e implementa políticas de segurança (Row Level Security) para proteger os dados.

## Estrutura do Banco de Dados

### Tabelas de Usuários e Configurações

- **profiles** - Informações de perfil dos usuários
  - Complementa a tabela `auth.users` nativa do Supabase
  - Armazena nome, email, avatar e função do usuário

- **user_settings** - Configurações personalizadas dos usuários
  - Preferências de idioma, tema, notificações
  - Configurações de aparência (cor primária, tamanho da fonte)
  - Configurações de segurança (autenticação de dois fatores, tempo limite de sessão)

### Tabelas de Documentos

- **document_categories** - Categorias principais de documentos
- **document_subcategories** - Subcategorias de documentos (relacionadas às categorias)
- **documents** - Documentos com metadados e referências para arquivos

### Tabelas de Tarefas

- **tasks** - Tarefas com título, descrição, status, prioridade e data de vencimento
- **task_tags** - Tags associadas às tarefas
- **task_comments** - Comentários em tarefas

### Tabelas de Ferramentas de IA

- **tools** - Ferramentas de IA disponíveis no sistema
- **tool_integrations** - Integrações com ferramentas externas
- **tool_usage_stats** - Estatísticas de uso das ferramentas

## Relacionamentos

O banco de dados implementa os seguintes relacionamentos principais:

- Usuários (auth.users) → Perfis (profiles) → Configurações (user_settings)
- Categorias (document_categories) → Subcategorias (document_subcategories)
- Documentos (documents) → Categorias e Subcategorias
- Tarefas (tasks) → Tags (task_tags) e Comentários (task_comments)
- Ferramentas (tools) → Integrações (tool_integrations) e Estatísticas (tool_usage_stats)

## Buckets de Armazenamento

O sistema utiliza três buckets de armazenamento:

1. **avatars** - Para armazenar imagens de perfil dos usuários
2. **documents** - Para armazenar arquivos de documentos
3. **tool_images** - Para armazenar imagens associadas às ferramentas de IA

## Políticas de Segurança (RLS)

As políticas de segurança implementam as seguintes regras:

- Usuários só podem ver e editar seus próprios perfis e configurações
- Todos podem ver documentos, mas apenas os criadores podem editá-los
- Administradores têm acesso completo a todas as entidades
- Usuários podem gerenciar suas próprias tarefas e tarefas atribuídas a eles
- Ferramentas públicas são visíveis para todos, mas apenas administradores podem gerenciá-las

## Implementação no Supabase

Para implementar este banco de dados no Supabase, siga os passos abaixo:

### 1. Criar Projeto no Supabase

1. Acesse [https://app.supabase.io](https://app.supabase.io)
2. Crie um novo projeto
3. Anote a URL e a chave anônima do projeto para uso na aplicação

### 2. Executar Script de Migração

1. Acesse o Editor SQL do seu projeto Supabase
2. Cole o conteúdo do arquivo `migrations/supabase-schema.sql`
3. Execute o script completo

### 3. Verificar Tabelas e Políticas

Após a execução do script, verifique se:

1. Todas as tabelas foram criadas corretamente
2. As políticas de segurança estão ativas
3. Os buckets de armazenamento foram criados

### 4. Configurar Autenticação

1. Na seção "Authentication" do Supabase, configure os provedores de autenticação desejados
2. Ajuste as configurações de email para convites e redefinição de senha
3. Configure os redirecionamentos para sua aplicação

### 5. Configurar Variáveis de Ambiente

No arquivo `.env.local` da aplicação, adicione:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## Manutenção e Atualizações

Para futuras alterações no esquema do banco de dados:

1. Crie um novo arquivo de migração com as alterações
2. Execute o script no Editor SQL do Supabase
3. Atualize os tipos no arquivo `src/types/supabase.ts`

## Considerações de Segurança

- As políticas RLS são essenciais para a segurança dos dados
- Nunca exponha a chave de serviço do Supabase no frontend
- Use a chave anônima apenas para operações permitidas por RLS
- Para operações administrativas, use funções serverless com a chave de serviço

## Geração de Tipos TypeScript

Para manter os tipos TypeScript atualizados com o esquema do banco de dados:

1. Instale a CLI do Supabase: `npm install -g supabase`
2. Execute o comando para gerar tipos:

```bash
supabase gen types typescript --project-id seu_id_do_projeto --schema public > src/types/supabase.ts
```

Isso garantirá que sua aplicação tenha tipagem forte e consistente com o esquema do banco de dados. 