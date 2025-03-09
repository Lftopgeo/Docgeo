# Migrações do Banco de Dados Docgeo

Este diretório contém os scripts SQL necessários para configurar e popular o banco de dados Supabase para o projeto Docgeo.

## Arquivos

- **supabase-schema.sql**: Contém a definição completa do esquema do banco de dados, incluindo tabelas, relacionamentos, funções, triggers, políticas de segurança (RLS) e configuração de buckets de armazenamento.

- **seed-data.sql**: Contém dados iniciais para popular o banco de dados com informações de exemplo para desenvolvimento e testes.

## Como Usar

### 1. Configuração Inicial do Banco de Dados

Para configurar o banco de dados pela primeira vez:

1. Acesse o painel de controle do seu projeto Supabase
2. Navegue até o Editor SQL
3. Cole o conteúdo do arquivo `supabase-schema.sql`
4. Execute o script completo

Este script criará todas as tabelas, relacionamentos, funções, triggers, políticas de segurança e buckets de armazenamento necessários para o funcionamento do sistema.

### 2. Populando o Banco de Dados com Dados Iniciais

Para popular o banco de dados com dados de exemplo:

1. Acesse o painel de controle do seu projeto Supabase
2. Navegue até o Editor SQL
3. Cole o conteúdo do arquivo `seed-data.sql`
4. Execute o script completo

**Importante**: O script de dados iniciais assume que você já criou um usuário administrador no Supabase. Você precisará substituir o ID de usuário de exemplo (`00000000-0000-0000-0000-000000000001`) pelo ID real do usuário administrador.

### 3. Atualizações do Esquema

Para futuras atualizações do esquema:

1. Crie um novo arquivo SQL com as alterações necessárias (ex: `update-schema-v2.sql`)
2. Execute o script no Editor SQL do Supabase
3. Atualize a documentação conforme necessário

## Considerações Importantes

- **Backup**: Sempre faça um backup do banco de dados antes de executar scripts de migração em ambientes de produção.

- **Idempotência**: Os scripts são projetados para serem idempotentes (podem ser executados várias vezes sem efeitos colaterais), usando cláusulas como `IF NOT EXISTS` e `ON CONFLICT DO NOTHING`.

- **Políticas de Segurança**: As políticas de segurança (RLS) são essenciais para proteger os dados. Certifique-se de que todas as políticas estão ativas após a execução dos scripts.

- **Tipos TypeScript**: Após modificar o esquema, atualize os tipos TypeScript usando a CLI do Supabase:

  ```bash
  supabase gen types typescript --project-id seu_id_do_projeto --schema public > src/types/supabase.ts
  ```

## Estrutura do Banco de Dados

Para uma visão geral da estrutura do banco de dados, consulte o arquivo `docs/diagrama-er.md` que contém um diagrama ER completo do sistema.

Para instruções detalhadas sobre a implementação do banco de dados, consulte o arquivo `docs/supabase-implementacao.md`. 