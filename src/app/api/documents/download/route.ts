import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializar o cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    console.log("API: Iniciando download de documento");
    
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
    
    // Extrair o nome do arquivo da URL
    const fileUrl = document.file_url;
    const fileName = document.title + '.' + document.file_type.toLowerCase();
    
    // Buscar o arquivo do bucket
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('Documents')
      .download(document.file_path);
    
    if (fileError) {
      console.error("API: Erro ao baixar arquivo:", fileError);
      
      // Fallback para redirecionamento se não conseguir baixar diretamente
      console.log("API: Redirecionando para:", fileUrl);
      return NextResponse.redirect(fileUrl);
    }
    
    // Criar uma resposta com o arquivo
    const response = new NextResponse(fileData);
    
    // Adicionar headers para download
    response.headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    response.headers.set('Content-Type', getContentType(document.file_type));
    
    console.log("API: Download iniciado para:", fileName);
    return response;
  } catch (error) {
    console.error("API: Erro ao baixar documento:", error);
    return NextResponse.json({ error: "Erro ao baixar documento" }, { status: 500 });
  }
}

// Função para determinar o Content-Type com base no tipo de arquivo
function getContentType(fileType: string): string {
  const type = fileType.toLowerCase();
  switch (type) {
    case 'pdf':
      return 'application/pdf';
    case 'doc':
    case 'docx':
      return 'application/msword';
    case 'xls':
    case 'xlsx':
      return 'application/vnd.ms-excel';
    case 'ppt':
    case 'pptx':
      return 'application/vnd.ms-powerpoint';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'txt':
      return 'text/plain';
    case 'csv':
      return 'text/csv';
    default:
      return 'application/octet-stream';
  }
} 