import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializar o cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    console.log("API: Iniciando visualização de documento");
    
    // Obter o ID do documento da URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      console.error("API: ID do documento não fornecido");
      return NextResponse.json({ error: "ID do documento é obrigatório" }, { status: 400 });
    }
    
    console.log(`API: Buscando documento com ID: ${id}`);
    
    // Buscar o documento no banco de dados
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("API: Erro ao buscar documento:", error);
      
      // Verificar se o erro é de documento não encontrado
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!document) {
      console.error("API: Documento não encontrado");
      return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
    }
    
    console.log("API: Documento encontrado:", document.title);
    
    // Verificar se o documento tem uma URL de arquivo
    if (!document.file_url) {
      console.error("API: Documento não tem URL de arquivo");
      return NextResponse.json({ error: "Documento não tem arquivo associado" }, { status: 404 });
    }
    
    // Buscar o arquivo do bucket
    const { data: fileData, error: fileError } = await supabase.storage
      .from('Documents')
      .download(document.file_path);
    
    if (fileError) {
      console.error("API: Erro ao buscar arquivo:", fileError);
      return NextResponse.json({ error: "Erro ao buscar arquivo" }, { status: 500 });
    }
    
    // Redirecionar para a URL do arquivo
    console.log("API: Redirecionando para:", document.file_url);
    return NextResponse.redirect(document.file_url);
  } catch (error) {
    console.error("API: Erro ao visualizar documento:", error);
    return NextResponse.json({ error: "Erro ao visualizar documento" }, { status: 500 });
  }
} 