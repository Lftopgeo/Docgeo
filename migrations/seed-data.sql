-- No início do script - Desativa verificação de chaves estrangeiras
SET session_replication_role = 'replica';

-- Dados iniciais para o banco de dados Docgeo
-- Este arquivo contém inserções de dados para popular o banco de dados com informações iniciais

-- =============================================
-- DADOS DE USUÁRIOS E CONFIGURAÇÕES
-- =============================================

-- Nota: Os usuários reais serão criados através do sistema de autenticação do Supabase.
-- Estes são apenas exemplos para desenvolvimento e testes.

-- Adicionar restrição de unicidade ao email (execute isso antes da inserção)
ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);

-- Inserir usuário administrador com UUID gerado automaticamente
INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
VALUES 
    (uuid_generate_v4(), 'admin@docgeo.com', 'Administrador', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', 'admin')
ON CONFLICT DO NOTHING;

-- Inserir configurações para o administrador
-- INSERT INTO public.user_settings (id, theme, primary_color)
-- VALUES 
--     ('00000000-0000-0000-0000-000000000001', 'dark', '#FF6B00')
-- ON CONFLICT (id) DO NOTHING;

-- Inserir mais usuários
-- INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
-- VALUES 
--     ('00000000-0000-0000-0000-000000000002', 'user1@docgeo.com', 'User One', 'https://api.dicebear.com/7.x/avataaars/svg?seed=User1', 'user'),
--     ('00000000-0000-0000-0000-000000000003', 'user2@docgeo.com', 'User Two', 'https://api.dicebear.com/7.x/avataaars/svg?seed=User2', 'user')
-- ON CONFLICT (id) DO NOTHING;

-- Inserir mais configurações de usuários
-- INSERT INTO public.user_settings (id, theme, primary_color)
-- VALUES 
--     ('00000000-0000-0000-0000-000000000002', 'light', '#00FF00'),
--     ('00000000-0000-0000-0000-000000000003', 'dark', '#0000FF')
-- ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DADOS DE CATEGORIAS DE DOCUMENTOS
-- =============================================

-- Inserir categorias de documentos
INSERT INTO public.document_categories (name)
VALUES 
    ('Contratos'),
    ('Relatórios'),
    ('Manuais'),
    ('Formulários'),
    ('Guias'),
    ('Políticas')
ON CONFLICT DO NOTHING;

-- Inserir subcategorias de documentos
WITH categories AS (
    SELECT id, name FROM public.document_categories
)
INSERT INTO public.document_subcategories (name, category_id)
SELECT 'Contratos de Serviço', id FROM categories WHERE name = 'Contratos'
ON CONFLICT DO NOTHING;

-- =============================================
-- DADOS DE DOCUMENTOS
-- =============================================

-- Inserir documentos de exemplo
INSERT INTO public.documents (id, title, description, file_type, category_id, subcategory_id, created_by)
VALUES 
    ('30000000-0000-0000-0000-000000000001', 'Contrato de Prestação de Serviços', 'Modelo padrão de contrato para prestação de serviços', 'pdf', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
    ('30000000-0000-0000-0000-000000000002', 'Relatório Financeiro Q1 2023', 'Relatório financeiro do primeiro trimestre de 2023', 'xlsx', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001'),
    ('30000000-0000-0000-0000-000000000003', 'Manual do Sistema Docgeo', 'Guia completo de utilização do sistema Docgeo', 'pdf', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001'),
    ('30000000-0000-0000-0000-000000000004', 'Formulário de Cadastro de Clientes', 'Formulário para cadastro de novos clientes', 'docx', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001'),
    ('30000000-0000-0000-0000-000000000005', 'Guia de Instalação do Sistema', 'Instruções detalhadas para instalação do sistema', 'pdf', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001'),
    ('30000000-0000-0000-0000-000000000006', 'Política de Segurança de Dados', 'Diretrizes para segurança de dados', 'docx', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DADOS DE TAREFAS
-- =============================================

-- Inserir tarefas de exemplo
INSERT INTO public.tasks (id, title, description, status, priority, due_date, created_by)
VALUES 
    ('40000000-0000-0000-0000-000000000001', 'Revisar contrato de serviços', 'Revisar e atualizar o modelo de contrato de prestação de serviços', 'pendente', 'alta', NOW() + INTERVAL '7 days', '00000000-0000-0000-0000-000000000001'),
    ('40000000-0000-0000-0000-000000000002', 'Preparar relatório mensal', 'Compilar dados e preparar o relatório mensal de atividades', 'em_andamento', 'média', NOW() + INTERVAL '3 days', '00000000-0000-0000-0000-000000000001'),
    ('40000000-0000-0000-0000-000000000003', 'Atualizar manual do usuário', 'Atualizar o manual do usuário com as novas funcionalidades', 'concluída', 'baixa', NOW() - INTERVAL '2 days', '00000000-0000-0000-0000-000000000001'),
    ('40000000-0000-0000-0000-000000000004', 'Implementar nova funcionalidade', 'Desenvolver e testar a nova funcionalidade de exportação de documentos', 'em_andamento', 'alta', NOW() + INTERVAL '10 days', '00000000-0000-0000-0000-000000000001'),
    ('40000000-0000-0000-0000-000000000005', 'Revisar política de segurança', 'Revisar e atualizar a política de segurança de dados', 'pendente', 'alta', NOW() + INTERVAL '5 days', '00000000-0000-0000-0000-000000000001'),
    ('40000000-0000-0000-0000-000000000006', 'Criar guia de instalação', 'Desenvolver guia de instalação para novos usuários', 'em_andamento', 'média', NOW() + INTERVAL '8 days', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Inserir tags para as tarefas
INSERT INTO public.task_tags (id, task_id, tag)
VALUES 
    ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'contrato'),
    ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'jurídico'),
    ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000002', 'relatório'),
    ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000002', 'mensal'),
    ('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000003', 'documentação'),
    ('50000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000003', 'manual'),
    ('50000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000004', 'desenvolvimento'),
    ('50000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000004', 'feature'),
    ('50000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000005', 'segurança'),
    ('50000000-0000-0000-0000-000000000010', '40000000-0000-0000-0000-000000000006', 'instalação')
ON CONFLICT (id) DO NOTHING;

-- Inserir comentários para as tarefas
INSERT INTO public.task_comments (id, task_id, user_id, comment)
VALUES 
    ('60000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Precisamos revisar a cláusula de rescisão do contrato.'),
    ('60000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Já comecei a compilar os dados para o relatório.'),
    ('60000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Manual atualizado com as novas funcionalidades da versão 2.0.'),
    ('60000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Iniciando o desenvolvimento da funcionalidade de exportação.'),
    ('60000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'A política de segurança precisa ser revisada urgentemente.'),
    ('60000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'O guia de instalação está quase pronto.')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DADOS DE FERRAMENTAS DE IA
-- =============================================

-- Inserir ferramentas de IA
INSERT INTO public.tools (id, name, description, category, status, is_public, created_by)
VALUES 
    ('70000000-0000-0000-0000-000000000001', 'Extrator de Texto', 'Ferramenta para extrair texto de documentos PDF e imagens', 'Processamento de Documentos', 'ativo', TRUE, '00000000-0000-0000-0000-000000000001'),
    ('70000000-0000-0000-0000-000000000002', 'Classificador de Documentos', 'Classifica automaticamente documentos em categorias', 'Categorização', 'ativo', TRUE, '00000000-0000-0000-0000-000000000001'),
    ('70000000-0000-0000-0000-000000000003', 'Resumidor de Textos', 'Cria resumos automáticos de documentos longos', 'Processamento de Texto', 'ativo', TRUE, '00000000-0000-0000-0000-000000000001'),
    ('70000000-0000-0000-0000-000000000004', 'Tradutor de Documentos', 'Traduz documentos para diferentes idiomas', 'Tradução', 'em_desenvolvimento', FALSE, '00000000-0000-0000-0000-000000000001'),
    ('70000000-0000-0000-0000-000000000005', 'Analisador de Sentimentos', 'Analisa sentimentos em textos', 'Análise de Texto', 'ativo', TRUE, '00000000-0000-0000-0000-000000000001'),
    ('70000000-0000-0000-0000-000000000006', 'Gerador de Resumos', 'Gera resumos automáticos de textos', 'Processamento de Texto', 'ativo', TRUE, '00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Inserir integrações de ferramentas
INSERT INTO public.tool_integrations (id, tool_id, integration_name, status)
VALUES 
    ('80000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 'Google OCR', 'ativo'),
    ('80000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000002', 'OpenAI Classifier', 'ativo'),
    ('80000000-0000-0000-0000-000000000003', '70000000-0000-0000-0000-000000000003', 'GPT-4', 'ativo'),
    ('80000000-0000-0000-0000-000000000004', '70000000-0000-0000-0000-000000000004', 'DeepL API', 'em_teste'),
    ('80000000-0000-0000-0000-000000000005', '70000000-0000-0000-0000-000000000005', 'IBM Watson', 'ativo'),
    ('80000000-0000-0000-0000-000000000006', '70000000-0000-0000-0000-000000000006', 'Microsoft Text Analytics', 'ativo')
ON CONFLICT (id) DO NOTHING;

-- Inserir estatísticas de uso de ferramentas
INSERT INTO public.tool_usage_stats (id, tool_id, date, requests, success_rate, average_response_time)
VALUES 
    ('90000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '7 days', 120, 95.5, 0.8),
    ('90000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '6 days', 135, 96.2, 0.75),
    ('90000000-0000-0000-0000-000000000003', '70000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '7 days', 85, 92.1, 1.2),
    ('90000000-0000-0000-0000-000000000004', '70000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '6 days', 92, 93.5, 1.1),
    ('90000000-0000-0000-0000-000000000005', '70000000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '7 days', 65, 89.7, 2.3),
    ('90000000-0000-0000-0000-000000000006', '70000000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '6 days', 78, 91.2, 2.1),
    ('90000000-0000-0000-0000-000000000007', '70000000-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '5 days', 150, 97.0, 0.9),
    ('90000000-0000-0000-0000-000000000008', '70000000-0000-0000-0000-000000000006', CURRENT_DATE - INTERVAL '4 days', 200, 98.5, 0.7)
ON CONFLICT (id) DO NOTHING;

-- No final do script - Reativa verificação de chaves estrangeiras
SET session_replication_role = 'origin';

-- Desativar temporariamente as políticas existentes
BEGIN;

-- Listar e remover políticas existentes para cada tabela
DO $$
DECLARE
    pol RECORD;
BEGIN
    -- Para cada tabela, remover todas as políticas existentes
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END
$$;

-- Criar novas políticas que permitem acesso total a usuários autenticados

-- Políticas para perfis
CREATE POLICY "Usuários autenticados podem ver todos os perfis" 
ON public.profiles FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar perfis" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar perfis" 
ON public.profiles FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir perfis" 
ON public.profiles FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Políticas para configurações de usuário
CREATE POLICY "Usuários autenticados podem ver todas as configurações" 
ON public.user_settings FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar configurações" 
ON public.user_settings FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar configurações" 
ON public.user_settings FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir configurações" 
ON public.user_settings FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Políticas para categorias de documentos
CREATE POLICY "Usuários autenticados podem ver categorias" 
ON public.document_categories FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar categorias" 
ON public.document_categories FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar categorias" 
ON public.document_categories FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir categorias" 
ON public.document_categories FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Políticas para subcategorias de documentos
CREATE POLICY "Usuários autenticados podem ver subcategorias" 
ON public.document_subcategories FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar subcategorias" 
ON public.document_subcategories FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar subcategorias" 
ON public.document_subcategories FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir subcategorias" 
ON public.document_subcategories FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Políticas para documentos
CREATE POLICY "Usuários autenticados podem ver documentos" 
ON public.documents FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar documentos" 
ON public.documents FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar documentos" 
ON public.documents FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir documentos" 
ON public.documents FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Políticas para tarefas
CREATE POLICY "Usuários autenticados podem ver tarefas" 
ON public.tasks FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar tarefas" 
ON public.tasks FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar tarefas" 
ON public.tasks FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir tarefas" 
ON public.tasks FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Políticas para tags de tarefas
CREATE POLICY "Usuários autenticados podem ver tags de tarefas" 
ON public.task_tags FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar tags de tarefas" 
ON public.task_tags FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar tags de tarefas" 
ON public.task_tags FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir tags de tarefas" 
ON public.task_tags FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Políticas para comentários de tarefas
CREATE POLICY "Usuários autenticados podem ver comentários de tarefas" 
ON public.task_comments FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar comentários de tarefas" 
ON public.task_comments FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar comentários de tarefas" 
ON public.task_comments FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir comentários de tarefas" 
ON public.task_comments FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Políticas para ferramentas
CREATE POLICY "Usuários autenticados podem ver ferramentas" 
ON public.tools FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar ferramentas" 
ON public.tools FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar ferramentas" 
ON public.tools FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir ferramentas" 
ON public.tools FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Políticas para integrações de ferramentas
CREATE POLICY "Usuários autenticados podem ver integrações de ferramentas" 
ON public.tool_integrations FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar integrações de ferramentas" 
ON public.tool_integrations FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar integrações de ferramentas" 
ON public.tool_integrations FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir integrações de ferramentas" 
ON public.tool_integrations FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Políticas para estatísticas de uso de ferramentas
CREATE POLICY "Usuários autenticados podem ver estatísticas de uso" 
ON public.tool_usage_stats FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar estatísticas de uso" 
ON public.tool_usage_stats FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar estatísticas de uso" 
ON public.tool_usage_stats FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir estatísticas de uso" 
ON public.tool_usage_stats FOR DELETE 
USING (auth.uid() IS NOT NULL);

COMMIT; 