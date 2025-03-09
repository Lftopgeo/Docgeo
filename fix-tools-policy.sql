-- Remover políticas existentes para a tabela tools
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'tools'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.tools', pol.policyname);
    END LOOP;
END
$$;

-- Criar uma política que permite acesso total a todos (para desenvolvimento)
CREATE POLICY "Permitir acesso total à tabela tools" 
ON public.tools
USING (true) 
WITH CHECK (true);

-- Alternativa: desabilitar RLS completamente para a tabela
-- ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY; 