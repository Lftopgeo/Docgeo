-- Supabase Schema Migration
-- Este arquivo contém todas as definições de tabelas, relacionamentos, políticas e buckets
-- para o projeto Docgeo

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configuração de Schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;

-- =============================================
-- TABELAS DE AUTENTICAÇÃO E USUÁRIOS
-- =============================================

-- Tabela de usuários (complementar à tabela auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações de usuário
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    language TEXT DEFAULT 'pt-BR',
    theme TEXT DEFAULT 'dark',
    notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    auto_save BOOLEAN DEFAULT TRUE,
    default_view TEXT DEFAULT 'grid',
    primary_color TEXT DEFAULT '#FF6B00',
    font_size TEXT DEFAULT 'medium',
    animations_enabled BOOLEAN DEFAULT TRUE,
    two_factor_auth BOOLEAN DEFAULT FALSE,
    session_timeout INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELAS DE DOCUMENTOS
-- =============================================

-- Categorias de documentos
CREATE TABLE IF NOT EXISTS public.document_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subcategorias de documentos
CREATE TABLE IF NOT EXISTS public.document_subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category_id UUID REFERENCES public.document_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documentos
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT,
    file_type TEXT,
    file_size TEXT,
    category_id UUID REFERENCES public.document_categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES public.document_subcategories(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELAS DE TAREFAS
-- =============================================

-- Tarefas
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags de tarefas
CREATE TABLE IF NOT EXISTS public.task_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários de tarefas
CREATE TABLE IF NOT EXISTS public.task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELAS DE FERRAMENTAS DE IA
-- =============================================

-- Ferramentas
CREATE TABLE IF NOT EXISTS public.tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    api_endpoint TEXT,
    documentation TEXT,
    image_url TEXT,
    status TEXT NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrações de ferramentas
CREATE TABLE IF NOT EXISTS public.tool_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
    integration_name TEXT NOT NULL,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Estatísticas de uso de ferramentas
CREATE TABLE IF NOT EXISTS public.tool_usage_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
    date DATE,
    requests INTEGER DEFAULT 0,
    success_rate NUMERIC DEFAULT 0,
    average_response_time NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- FUNÇÕES E TRIGGERS
-- =============================================

-- Função para atualizar o timestamp de última atualização
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp em profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar o timestamp em user_settings
CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar o timestamp em documents
CREATE TRIGGER update_documents_last_updated
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar o timestamp em tools
CREATE TRIGGER update_tools_last_updated
BEFORE UPDATE ON public.tools
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil de usuário automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'user');
    
    INSERT INTO public.user_settings (id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil e configurações após registro de usuário
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_usage_stats ENABLE ROW LEVEL SECURITY;

-- Políticas para perfis
CREATE POLICY "Usuários podem ver seus próprios perfis" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Políticas para configurações de usuário
CREATE POLICY "Usuários podem ver suas próprias configurações" 
ON public.user_settings FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar suas próprias configurações" 
ON public.user_settings FOR UPDATE 
USING (auth.uid() = id);

-- Políticas para categorias de documentos
CREATE POLICY "Todos podem ver categorias de documentos" 
ON public.document_categories FOR SELECT 
USING (true);

CREATE POLICY "Apenas administradores podem criar categorias" 
ON public.document_categories FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Apenas administradores podem atualizar categorias" 
ON public.document_categories FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Apenas administradores podem excluir categorias" 
ON public.document_categories FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Políticas para subcategorias de documentos (similar às categorias)
CREATE POLICY "Todos podem ver subcategorias de documentos" 
ON public.document_subcategories FOR SELECT 
USING (true);

CREATE POLICY "Apenas administradores podem gerenciar subcategorias" 
ON public.document_subcategories FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Políticas para documentos
CREATE POLICY "Todos podem ver documentos" 
ON public.documents FOR SELECT 
USING (true);

CREATE POLICY "Usuários autenticados podem criar documentos" 
ON public.documents FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários podem atualizar seus próprios documentos" 
ON public.documents FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Administradores podem atualizar qualquer documento" 
ON public.documents FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Usuários podem excluir seus próprios documentos" 
ON public.documents FOR DELETE 
USING (auth.uid() = created_by);

CREATE POLICY "Administradores podem excluir qualquer documento" 
ON public.documents FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Políticas para tarefas
CREATE POLICY "Usuários podem ver todas as tarefas" 
ON public.tasks FOR SELECT 
USING (true);

CREATE POLICY "Usuários autenticados podem criar tarefas" 
ON public.tasks FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários podem atualizar suas próprias tarefas ou tarefas atribuídas a eles" 
ON public.tasks FOR UPDATE 
USING (auth.uid() = created_by OR auth.uid() = assignee_id);

CREATE POLICY "Administradores podem atualizar qualquer tarefa" 
ON public.tasks FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Usuários podem excluir suas próprias tarefas" 
ON public.tasks FOR DELETE 
USING (auth.uid() = created_by);

CREATE POLICY "Administradores podem excluir qualquer tarefa" 
ON public.tasks FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Políticas para tags de tarefas
CREATE POLICY "Todos podem ver tags de tarefas" 
ON public.task_tags FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem gerenciar tags de suas próprias tarefas" 
ON public.task_tags FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.tasks 
        WHERE id = task_id AND created_by = auth.uid()
    )
);

CREATE POLICY "Administradores podem gerenciar qualquer tag" 
ON public.task_tags FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Políticas para comentários de tarefas
CREATE POLICY "Todos podem ver comentários de tarefas" 
ON public.task_comments FOR SELECT 
USING (true);

CREATE POLICY "Usuários autenticados podem adicionar comentários" 
ON public.task_comments FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários podem atualizar seus próprios comentários" 
ON public.task_comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios comentários" 
ON public.task_comments FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Administradores podem gerenciar qualquer comentário" 
ON public.task_comments FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Políticas para ferramentas
CREATE POLICY "Todos podem ver ferramentas públicas" 
ON public.tools FOR SELECT 
USING (is_public = true);

CREATE POLICY "Administradores podem ver todas as ferramentas" 
ON public.tools FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Apenas administradores podem gerenciar ferramentas" 
ON public.tools FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Políticas para integrações de ferramentas
CREATE POLICY "Todos podem ver integrações de ferramentas" 
ON public.tool_integrations FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.tools 
        WHERE id = tool_id AND is_public = true
    )
);

CREATE POLICY "Apenas administradores podem gerenciar integrações" 
ON public.tool_integrations FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Políticas para estatísticas de uso de ferramentas
CREATE POLICY "Todos podem ver estatísticas de ferramentas públicas" 
ON public.tool_usage_stats FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.tools 
        WHERE id = tool_id AND is_public = true
    )
);

CREATE POLICY "Apenas administradores podem gerenciar estatísticas" 
ON public.tool_usage_stats FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- =============================================
-- CONFIGURAÇÃO DE BUCKETS DE ARMAZENAMENTO
-- =============================================

-- Criar buckets para diferentes tipos de arquivos
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'Avatares de usuários', true),
('documents', 'Documentos do sistema', false),
('tool_images', 'Imagens de ferramentas', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para bucket de avatares
CREATE POLICY "Avatares são publicamente acessíveis"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Usuários autenticados podem fazer upload de avatares"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Usuários podem atualizar seus próprios avatares"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Usuários podem excluir seus próprios avatares"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Políticas para bucket de documentos
CREATE POLICY "Usuários autenticados podem acessar documentos"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'documents' AND
    auth.uid() IS NOT NULL
);

CREATE POLICY "Usuários autenticados podem fazer upload de documentos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid() IS NOT NULL
);

CREATE POLICY "Usuários podem atualizar seus próprios documentos"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Usuários podem excluir seus próprios documentos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Administradores podem gerenciar todos os documentos"
ON storage.objects FOR ALL
USING (
    bucket_id = 'documents' AND
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Políticas para bucket de imagens de ferramentas
CREATE POLICY "Imagens de ferramentas são publicamente acessíveis"
ON storage.objects FOR SELECT
USING (bucket_id = 'tool_images');

CREATE POLICY "Apenas administradores podem gerenciar imagens de ferramentas"
ON storage.objects FOR ALL
USING (
    bucket_id = 'tool_images' AND
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
); 