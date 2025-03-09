-- Script para criar a tabela tools no Supabase
CREATE TABLE IF NOT EXISTS public.tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('active', 'maintenance', 'deprecated')),
    category TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários da tabela
COMMENT ON TABLE public.tools IS 'Tabela que armazena as ferramentas de IA disponíveis';

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS tools_name_idx ON public.tools (name);
CREATE INDEX IF NOT EXISTS tools_category_idx ON public.tools (category);
CREATE INDEX IF NOT EXISTS tools_status_idx ON public.tools (status);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o updated_at automaticamente
CREATE OR REPLACE TRIGGER update_tools_updated_at
BEFORE UPDATE ON public.tools
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
