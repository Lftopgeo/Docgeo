-- Script para criar as tabelas relacionadas a tarefas no Supabase

-- Extensão para gerar UUIDs (caso ainda não exista)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'canceled')) DEFAULT 'pending',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    assigned_to UUID,
    project_id UUID,
    parent_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern TEXT,
    estimated_hours NUMERIC(5,2),
    actual_hours NUMERIC(5,2),
    progress INTEGER CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Comentários da tabela
COMMENT ON TABLE public.tasks IS 'Tarefas e atividades a serem realizadas';

-- Tabela de tags para tarefas
CREATE TABLE IF NOT EXISTS public.task_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários da tabela
COMMENT ON TABLE public.task_tags IS 'Tags associadas às tarefas para categorização';

-- Tabela de comentários de tarefas
CREATE TABLE IF NOT EXISTS public.task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários da tabela
COMMENT ON TABLE public.task_comments IS 'Comentários associados às tarefas';

-- Tabela de anexos de tarefas
CREATE TABLE IF NOT EXISTS public.task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários da tabela
COMMENT ON TABLE public.task_attachments IS 'Arquivos anexados às tarefas';

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks (status);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON public.tasks (priority);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks (due_date);
CREATE INDEX IF NOT EXISTS tasks_assigned_to_idx ON public.tasks (assigned_to);
CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON public.tasks (project_id);
CREATE INDEX IF NOT EXISTS task_tags_task_id_idx ON public.task_tags (task_id);
CREATE INDEX IF NOT EXISTS task_tags_tag_idx ON public.task_tags (tag);
CREATE INDEX IF NOT EXISTS task_comments_task_id_idx ON public.task_comments (task_id);
CREATE INDEX IF NOT EXISTS task_attachments_task_id_idx ON public.task_attachments (task_id);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar o updated_at automaticamente
CREATE OR REPLACE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_task_comments_updated_at
BEFORE UPDATE ON public.task_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
