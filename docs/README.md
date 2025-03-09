# Documentação do Projeto Docgeo

Este diretório contém a documentação completa do projeto Docgeo, incluindo guias de implementação, referências técnicas e diagramas.

## Documentos Disponíveis

### Guias de Implementação

- [**Implementação do Banco de Dados Supabase**](supabase-implementacao.md) - Instruções detalhadas para configurar o banco de dados Supabase para o projeto Docgeo.

### Referências Técnicas

- [**Página de Configurações**](pagina-configuracoes.md) - Documentação da página de configurações do sistema, incluindo sua estrutura, funcionalidades e componentes.

### Diagramas e Modelos

- [**Diagrama ER do Banco de Dados**](diagrama-er.md) - Diagrama de Entidade-Relacionamento (ER) que representa a estrutura do banco de dados do sistema.

### Guias de Estilo

- [**Guia de Estilo Docgeo**](guia-estilo-docgeo.md) - Guia de estilo visual para o projeto, incluindo cores, tipografia e componentes.

## Estrutura do Projeto

O projeto Docgeo é organizado nas seguintes pastas principais:

- **src/** - Código-fonte da aplicação
  - **app/** - Páginas da aplicação (Next.js)
  - **components/** - Componentes reutilizáveis
  - **hooks/** - Hooks personalizados, incluindo integração com Supabase
  - **lib/** - Bibliotecas e utilitários
  - **types/** - Definições de tipos TypeScript
  - **contexts/** - Contextos React para gerenciamento de estado
  - **services/** - Serviços para interação com APIs externas
  - **repositories/** - Camada de acesso a dados

- **migrations/** - Scripts SQL para configuração e migração do banco de dados
  - [**README.md**](../migrations/README.md) - Instruções para usar os scripts de migração
  - **supabase-schema.sql** - Definição completa do esquema do banco de dados
  - **seed-data.sql** - Dados iniciais para desenvolvimento e testes

- **public/** - Arquivos estáticos acessíveis publicamente

## Como Usar Esta Documentação

1. Comece pela [Implementação do Banco de Dados Supabase](supabase-implementacao.md) para configurar a base de dados.
2. Consulte o [Diagrama ER](diagrama-er.md) para entender a estrutura do banco de dados.
3. Utilize o [Guia de Estilo](guia-estilo-docgeo.md) para manter a consistência visual ao desenvolver novos componentes.
4. Consulte a documentação específica de componentes conforme necessário.

## Contribuindo para a Documentação

Ao adicionar novos recursos ao projeto, por favor, atualize a documentação correspondente:

1. Para novos componentes, crie um arquivo markdown com a documentação do componente.
2. Para alterações no banco de dados, atualize o diagrama ER e a documentação de implementação.
3. Para novos fluxos de usuário, adicione documentação com diagramas de fluxo.

Mantenha este README atualizado com links para todos os novos documentos adicionados. 