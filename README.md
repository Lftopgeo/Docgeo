# Docgeo - Sistema de Gestão Documental

![Docgeo Logo](public/logo.png)

Docgeo é um sistema moderno de gestão documental e de tarefas, desenvolvido com Next.js, Tailwind CSS e Supabase. O sistema oferece uma interface intuitiva para gerenciar documentos, tarefas e ferramentas de IA em um único lugar.

## Características Principais

- **Gestão de Documentos**: Organize, categorize e pesquise documentos facilmente
- **Gerenciamento de Tarefas**: Acompanhe tarefas, defina prioridades e prazos
- **Ferramentas de IA**: Acesse ferramentas de IA para processamento de documentos
- **Interface Responsiva**: Design adaptável para desktop e dispositivos móveis
- **Tema Claro/Escuro**: Suporte a temas claro e escuro para melhor experiência visual
- **Autenticação Segura**: Sistema de autenticação robusto com Supabase

## Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Autenticação, Armazenamento)
- **Linguagem**: TypeScript
- **Implantação**: Vercel (frontend), Supabase (backend)

## Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn
- Conta no Supabase

## Configuração do Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/docgeo.git
cd docgeo
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 4. Configure o banco de dados Supabase

Siga as instruções em [docs/supabase-implementacao.md](docs/supabase-implementacao.md) para configurar o banco de dados Supabase.

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```
docgeo/
├── docs/                  # Documentação do projeto
├── migrations/            # Scripts SQL para o Supabase
├── public/                # Arquivos estáticos
├── src/
│   ├── app/               # Páginas da aplicação (Next.js)
│   ├── components/        # Componentes reutilizáveis
│   ├── contexts/          # Contextos React
│   ├── data/              # Dados estáticos
│   ├── hooks/             # Hooks personalizados
│   ├── lib/               # Bibliotecas e utilitários
│   ├── repositories/      # Camada de acesso a dados
│   ├── services/          # Serviços para APIs externas
│   ├── styles/            # Estilos globais
│   └── types/             # Definições de tipos TypeScript
├── .env.example           # Exemplo de variáveis de ambiente
├── .eslintrc.json         # Configuração do ESLint
├── .gitignore             # Arquivos ignorados pelo Git
├── next.config.js         # Configuração do Next.js
├── package.json           # Dependências e scripts
├── postcss.config.js      # Configuração do PostCSS
├── README.md              # Este arquivo
├── tailwind.config.js     # Configuração do Tailwind CSS
└── tsconfig.json          # Configuração do TypeScript
```

## Documentação

A documentação completa do projeto está disponível na pasta [docs/](docs/):

- [Implementação do Banco de Dados](docs/supabase-implementacao.md)
- [Diagrama ER do Banco de Dados](docs/diagrama-er.md)
- [Página de Configurações](docs/pagina-configuracoes.md)
- [Guia de Estilo](docs/guia-estilo-docgeo.md)

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter para verificar problemas de código
- `npm run clean-restart` - Limpa o cache e reinicia o servidor (Windows)

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Para questões ou sugestões, entre em contato através de [seu-email@exemplo.com](mailto:seu-email@exemplo.com).

## Configuração do Banco de Dados e Buckets

Para configurar o banco de dados e os buckets do Supabase, siga os passos abaixo:

1. Acesse o painel do Supabase em https://app.supabase.io/
2. Selecione o seu projeto
3. Vá para a seção "SQL Editor"
4. Execute os scripts de migração e seed:
   - `migrations/supabase-schema.sql`
   - `migrations/seed-data.sql`
5. Vá para a seção "Storage"
6. Crie os seguintes buckets:
   - `avatars` (público)
   - `documents` (privado)
   - `tool_images` (público)

## Variáveis de Ambiente

Certifique-se de configurar as variáveis de ambiente no arquivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

## Configuração do Banco de Dados

### Criação da Tabela 'documents' no Supabase

Para que o sistema funcione corretamente, você precisa criar a tabela 'documents' no Supabase. Siga estas instruções:

1. Acesse o painel de administração do Supabase (https://app.supabase.io)
2. Selecione seu projeto
3. Vá para "Table Editor" no menu lateral
4. Clique em "New Table"
5. Configure a tabela com os seguintes campos:

| Nome da Coluna | Tipo de Dado | Configuração |
|---------------|--------------|--------------|
| id            | uuid         | Primary Key, Default: `gen_random_uuid()` |
| title         | text         | Not Null |
| description   | text         | Nullable |
| category      | text         | Nullable |
| subcategory   | text         | Nullable |
| file_path     | text         | Nullable |
| file_url      | text         | Nullable |
| file_type     | text         | Nullable |
| file_size     | text         | Nullable |
| created_at    | timestamptz  | Default: `now()` |
| updated_at    | timestamptz  | Default: `now()` |

6. Clique em "Save" para criar a tabela

### Criação do Bucket 'Documents' no Supabase

Você também precisa criar um bucket de armazenamento para os arquivos:

1. No painel do Supabase, vá para "Storage" no menu lateral
2. Clique em "New Bucket"
3. Nome do bucket: `Documents` (com D maiúsculo)
4. Marque a opção "Public bucket" para permitir acesso público aos arquivos
5. Clique em "Create bucket"

### Configuração de Políticas de Acesso

Para permitir que a aplicação acesse o bucket e a tabela, você precisa configurar políticas de acesso:

#### Políticas para o Bucket 'Documents':

1. No painel do Supabase, vá para "Storage" > "Policies"
2. Adicione as seguintes políticas para o bucket 'Documents':

- **Política para INSERT**:
  - Nome: `Allow public uploads`
  - Permissão: `INSERT`
  - Definição: `true`

- **Política para SELECT**:
  - Nome: `Allow public downloads`
  - Permissão: `SELECT`
  - Definição: `true`

#### Políticas para a Tabela 'documents':

1. No painel do Supabase, vá para "Table Editor" > "documents" > "Policies"
2. Adicione as seguintes políticas:

- **Política para SELECT**:
  - Nome: `Allow public read`
  - Permissão: `SELECT`
  - Definição: `true`

- **Política para INSERT**:
  - Nome: `Allow public insert`
  - Permissão: `INSERT`
  - Definição: `true`

- **Política para UPDATE**:
  - Nome: `Allow public update`
  - Permissão: `UPDATE`
  - Definição: `true`

- **Política para DELETE**:
  - Nome: `Allow public delete`
  - Permissão: `DELETE`
  - Definição: `true`

## Executando o Projeto

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse o projeto em [http://localhost:3003](http://localhost:3003)
