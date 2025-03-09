# Docgeo

Docgeo é um sistema de gerenciamento de documentos, tarefas e ferramentas, desenvolvido com Next.js e Supabase.

## Visão Geral

O Docgeo permite:
- Gerenciar documentos organizados por categorias e subcategorias
- Criar e acompanhar tarefas com comentários, anexos e tags
- Catalogar ferramentas e acompanhar seu uso

## Tecnologias

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Banco de Dados**: PostgreSQL (via Supabase)
- **Autenticação**: Supabase Auth

## Estrutura do Projeto

```
Docgeo/
├── src/
│   ├── app/                  # Rotas da aplicação (Next.js App Router)
│   │   ├── api/              # APIs
│   │   ├── documents/        # Páginas de documentos
│   │   ├── tasks/            # Páginas de tarefas
│   │   └── ai-tools/         # Páginas de ferramentas
│   ├── components/           # Componentes React
│   ├── contexts/             # Contextos React
│   ├── hooks/                # Hooks personalizados
│   ├── lib/                  # Bibliotecas e utilitários
│   │   └── supabase/         # Configuração do Supabase
│   ├── repositories/         # Repositórios para acesso ao Supabase
│   ├── services/             # Serviços com lógica de negócio
│   ├── styles/               # Estilos globais
│   └── types/                # Tipos TypeScript
├── public/                   # Arquivos estáticos
├── supabase/                 # Configurações do Supabase
│   ├── migrations/           # Migrações do banco de dados
│   └── functions/            # Funções do Supabase
├── create_document_tables.sql # Script para criar tabelas de documentos
├── create_task_tables.sql    # Script para criar tabelas de tarefas
├── create_tools_table.sql    # Script para criar tabelas de ferramentas
├── BACKEND_DOCUMENTATION.md  # Documentação do backend
├── API_DOCUMENTATION.md      # Documentação das APIs
└── README.md                 # Este arquivo
```

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/docgeo.git
   cd docgeo
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
     ```
     NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
     ```

4. Execute o projeto:
   ```bash
   npm run dev
   ```

5. Acesse o projeto em [http://localhost:3000](http://localhost:3000)

## Configuração do Banco de Dados

Para configurar o banco de dados, execute os scripts SQL na interface do Supabase:

1. Acesse o [Console do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para a seção "SQL Editor"
4. Execute os scripts:
   - `create_document_tables.sql`
   - `create_task_tables.sql`
   - `create_tools_table.sql`

## Documentação

- [Documentação do Backend](./BACKEND_DOCUMENTATION.md): Detalhes sobre a implementação do backend
- [Documentação das APIs](./API_DOCUMENTATION.md): Detalhes sobre as APIs disponíveis

## Desenvolvimento

### Estrutura de Camadas

O projeto segue uma arquitetura em camadas:

1. **Repositórios**: Responsáveis pela comunicação direta com o Supabase
2. **Serviços**: Implementam a lógica de negócio e utilizam os repositórios
3. **APIs**: Expõem os serviços para o frontend através de endpoints HTTP
4. **Componentes**: Implementam a interface do usuário e consomem as APIs

### Fluxo de Dados

```
Frontend (Componentes) -> APIs -> Serviços -> Repositórios -> Supabase
```

### Convenções de Código

- Use TypeScript para tudo
- Siga as convenções de nomenclatura:
  - PascalCase para componentes e interfaces
  - camelCase para variáveis, funções e métodos
  - snake_case para colunas do banco de dados
- Documente todas as funções e métodos
- Escreva testes para todas as funcionalidades

## Contribuição

1. Crie um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
