-- Script para criar as tabelas relacionadas a documentos no Supabase

-- Extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de categorias de documentos
CREATE TABLE IF NOT EXISTS public.document_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários da tabela
COMMENT ON TABLE public.document_categories IS 'Categorias principais para organização de documentos';

-- Tabela de subcategorias de documentos
CREATE TABLE IF NOT EXISTS public.document_subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES public.document_categories(id) ON DELETE CASCADE,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários da tabela
COMMENT ON TABLE public.document_subcategories IS 'Subcategorias para organização detalhada de documentos';

-- Tabela de documentos
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    file_url TEXT,
    file_type TEXT,
    file_size INTEGER,
    category_id UUID REFERENCES public.document_categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES public.document_subcategories(id) ON DELETE SET NULL,
    tags TEXT[],
    author TEXT,
    is_public BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários da tabela
COMMENT ON TABLE public.documents IS 'Documentos armazenados no sistema';

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS documents_title_idx ON public.documents (title);
CREATE INDEX IF NOT EXISTS documents_category_id_idx ON public.documents (category_id);
CREATE INDEX IF NOT EXISTS documents_subcategory_id_idx ON public.documents (subcategory_id);
CREATE INDEX IF NOT EXISTS document_subcategories_category_id_idx ON public.document_subcategories (category_id);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar o updated_at automaticamente
CREATE OR REPLACE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_document_categories_updated_at
BEFORE UPDATE ON public.document_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_document_subcategories_updated_at
BEFORE UPDATE ON public.document_subcategories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
