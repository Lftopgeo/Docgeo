import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicializar o cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Nome do bucket para armazenamento de documentos
const DOCUMENTS_BUCKET = "Documents";

// Função para gerar um ID único
function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
}

// Função para verificar se a tabela documents existe e tem a estrutura correta
async function verifyDocumentsTable(): Promise<boolean> {
  try {
    console.log("API: Verificando se a tabela 'documents' existe e tem a estrutura correta");
    
    // Verificar se a tabela existe
    const { error: tableError } = await supabase.from('documents').select('id').limit(1);
    
    if (tableError) {
      console.log("API: Tabela 'documents' não existe ou erro ao acessar:", tableError);
      return false;
    }
    
    // Verificar se a coluna 'category' existe
    try {
      const { error: categoryError } = await supabase.from('documents').select('category').limit(1);
      
      if (categoryError) {
        console.log("API: Coluna 'category' não existe na tabela 'documents':", categoryError);
        return false;
      }
      
      console.log("API: Tabela 'documents' existe e tem a coluna 'category'");
      return true;
    } catch (columnError) {
      console.error("API: Erro ao verificar coluna 'category':", columnError);
      return false;
    }
  } catch (error) {
    console.error("API: Erro ao verificar tabela 'documents':", error);
    return false;
  }
}

// Função para criar a tabela documents diretamente com SQL simples
async function createDocumentsTableSimple(): Promise<boolean> {
  try {
    console.log("API: Criando tabela 'documents' com SQL simples");
    
    // SQL simples para criar a tabela
    const sql = `
      DROP TABLE IF EXISTS documents;
      
      CREATE TABLE documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        subcategory TEXT,
        file_path TEXT,
        file_url TEXT,
        file_type TEXT,
        file_size TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    // Fazer uma chamada direta para a API REST do Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: sql
      })
    });
    
    if (response.ok) {
      console.log("API: Tabela criada com sucesso via SQL simples");
      return true;
    } else {
      const errorData = await response.json();
      console.error("API: Erro ao criar tabela via SQL simples:", errorData);
      return false;
    }
  } catch (error) {
    console.error("API: Erro ao criar tabela com SQL simples:", error);
    return false;
  }
}

// Função para garantir que o bucket existe
async function ensureBucketExists(): Promise<boolean> {
  try {
    console.log("API: Verificando se o bucket 'Documents' existe");
    
    // Verificar se as credenciais do Supabase estão configuradas
    if (!supabaseUrl || !supabaseKey) {
      console.error("API: Credenciais do Supabase não configuradas");
      return false;
    }
    
    console.log(`API: Usando Supabase URL: ${supabaseUrl.substring(0, 20)}...`);
    
    // Listar os buckets existentes
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("API: Erro ao listar buckets:", bucketsError);
      return false;
    }
    
    console.log(`API: Buckets encontrados: ${buckets ? buckets.length : 0}`);
    
    // Verificar se o bucket já existe
    const bucketExists = buckets && buckets.some(bucket => bucket.name === DOCUMENTS_BUCKET);
    
    if (bucketExists) {
      console.log(`API: Bucket '${DOCUMENTS_BUCKET}' já existe`);
      return true;
    }
    
    console.log(`API: Bucket '${DOCUMENTS_BUCKET}' não existe, tentando usar...`);
    
    // Tentar usar o bucket mesmo que não esteja na lista
    // Isso pode funcionar se o bucket existir mas não estiver visível para o usuário atual
    try {
      const { data: testData, error: testError } = await supabase.storage
        .from(DOCUMENTS_BUCKET)
        .list();
      
      if (!testError) {
        console.log(`API: Bucket '${DOCUMENTS_BUCKET}' existe e está acessível`);
        return true;
      }
    } catch (testErr) {
      console.log(`API: Erro ao testar acesso ao bucket: ${testErr}`);
    }
    
    return false;
  } catch (error) {
    console.error("API: Erro ao verificar bucket:", error);
    return false;
  }
}

// Função para criar a tabela de documentos
async function createDocumentsTable(): Promise<boolean> {
  try {
    console.log("API: Criando tabela 'documents'");
    
    // Tentar criar a extensão uuid-ossp se não existir
    try {
      await supabase.rpc('exec_sql', { 
        query: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";' 
      });
      console.log("API: Extensão uuid-ossp verificada");
    } catch (extError) {
      console.log("API: Nota: Não foi possível verificar extensão uuid-ossp:", extError);
      // Continuar mesmo se falhar
    }
    
    // SQL para criar a tabela
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        subcategory TEXT,
        file_path TEXT,
        file_url TEXT,
        file_type TEXT,
        file_size TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    // Método 1: Tentar usar a função RPC exec_sql
    console.log("API: Tentando criar tabela via RPC exec_sql");
    try {
      const { error: rpcError } = await supabase.rpc('exec_sql', { query: createTableSQL });
      
      if (!rpcError) {
        console.log("API: Tabela 'documents' criada com sucesso via RPC");
        return true;
      } else {
        console.log("API: Erro ao criar tabela via RPC:", rpcError);
      }
    } catch (rpcError) {
      console.log("API: Erro ao executar RPC:", rpcError);
    }
    
    // Método 2: Tentar usar SQL direto
    console.log("API: Tentando criar tabela via SQL direto");
    try {
      const { error: sqlError } = await supabase.from('_exec_sql').select('*').eq('query', createTableSQL).single();
      
      if (!sqlError) {
        console.log("API: Tabela 'documents' criada com sucesso via SQL direto");
        return true;
      } else {
        console.log("API: Erro ao criar tabela via SQL direto:", sqlError);
      }
    } catch (sqlError) {
      console.log("API: Erro ao executar SQL direto:", sqlError);
    }
    
    // Método 3: Tentar criar via REST API
    console.log("API: Tentando criar tabela via REST API");
    try {
      // Criar a tabela usando a API REST
      const { error: restError } = await supabase.from('documents').insert({
        title: 'Documento Inicial',
        description: 'Documento inicial para criar a tabela',
        category: 'Sistema',
        subcategory: 'Inicialização',
        file_path: '',
        file_url: '',
        file_type: 'TXT',
        file_size: '0 KB',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (!restError) {
        console.log("API: Tabela 'documents' criada com sucesso via REST API");
        return true;
      } else {
        console.log("API: Erro ao criar tabela via REST API:", restError);
      }
    } catch (restError) {
      console.log("API: Erro ao usar REST API:", restError);
    }
    
    // Método 4: Tentar criar via SQL direto no banco
    console.log("API: Tentando criar tabela via SQL no banco");
    try {
      // Executar SQL direto no banco
      await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          query: createTableSQL
        })
      });
      
      console.log("API: Tabela 'documents' possivelmente criada via SQL no banco");
      return true;
    } catch (fetchError) {
      console.log("API: Erro ao executar SQL via fetch:", fetchError);
    }
    
    // Método 5: Tentar criar diretamente via SQL
    const directCreated = await createDocumentsTableSimple();
    if (directCreated) {
      return true;
    }
    
    console.log("API: Não foi possível criar a tabela 'documents' por nenhum método");
    return false;
  } catch (error) {
    console.error("API: Erro ao criar tabela 'documents':", error);
    return false;
  }
}

// Função para obter a URL pública de um arquivo
async function getPublicUrl(filePath: string): Promise<string | null> {
  try {
    console.log(`API: Obtendo URL pública para: ${filePath}`);
    
    if (!filePath) {
      console.error("API: Caminho do arquivo não fornecido");
      return null;
    }
    
    // Verificar se o bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error(`API: Erro ao listar buckets:`, listError);
      return null;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === DOCUMENTS_BUCKET);
    
    if (!bucketExists) {
      console.error(`API: Bucket '${DOCUMENTS_BUCKET}' não existe`);
      return null;
    }
    
    // Obter a URL pública
    const { data } = supabase
      .storage
      .from(DOCUMENTS_BUCKET)
      .getPublicUrl(filePath);
    
    if (data && data.publicUrl) {
      console.log(`API: URL pública obtida: ${data.publicUrl}`);
      return data.publicUrl;
    }
    
    console.error("API: Não foi possível obter a URL pública");
    return null;
  } catch (error) {
    console.error("API: Erro ao obter URL pública:", error);
    return null;
  }
}

// Função para verificar e corrigir a estrutura da tabela documents
async function fixDocumentsTableStructure(): Promise<boolean> {
  try {
    console.log("API: Verificando e corrigindo a estrutura da tabela 'documents'");
    
    // Verificar se a tabela existe
    const { error: tableError } = await supabase.from('documents').select('id').limit(1);
    
    if (tableError && tableError.message.includes("does not exist")) {
      console.log("API: Tabela 'documents' não existe, criando do zero");
      return await createDocumentsTableSimple();
    }
    
    // Verificar a estrutura atual da tabela
    console.log("API: Verificando colunas da tabela 'documents'");
    
    // Tentar adicionar a coluna 'category' se não existir
    try {
      const alterTableSQL = `
        DO $$
        BEGIN
          -- Verificar se a coluna 'category' existe
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'documents'
            AND column_name = 'category'
          ) THEN
            -- Adicionar a coluna 'category'
            ALTER TABLE documents ADD COLUMN category TEXT;
            RAISE NOTICE 'Coluna category adicionada';
          END IF;
          
          -- Verificar se a coluna 'subcategory' existe
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'documents'
            AND column_name = 'subcategory'
          ) THEN
            -- Adicionar a coluna 'subcategory'
            ALTER TABLE documents ADD COLUMN subcategory TEXT;
            RAISE NOTICE 'Coluna subcategory adicionada';
          END IF;
          
          -- Verificar se a coluna 'file_path' existe
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'documents'
            AND column_name = 'file_path'
          ) THEN
            -- Adicionar a coluna 'file_path'
            ALTER TABLE documents ADD COLUMN file_path TEXT;
            RAISE NOTICE 'Coluna file_path adicionada';
          END IF;
          
          -- Verificar se a coluna 'file_url' existe
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'documents'
            AND column_name = 'file_url'
          ) THEN
            -- Adicionar a coluna 'file_url'
            ALTER TABLE documents ADD COLUMN file_url TEXT;
            RAISE NOTICE 'Coluna file_url adicionada';
          END IF;
          
          -- Verificar se a coluna 'file_type' existe
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'documents'
            AND column_name = 'file_type'
          ) THEN
            -- Adicionar a coluna 'file_type'
            ALTER TABLE documents ADD COLUMN file_type TEXT;
            RAISE NOTICE 'Coluna file_type adicionada';
          END IF;
          
          -- Verificar se a coluna 'file_size' existe
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'documents'
            AND column_name = 'file_size'
          ) THEN
            -- Adicionar a coluna 'file_size'
            ALTER TABLE documents ADD COLUMN file_size TEXT;
            RAISE NOTICE 'Coluna file_size adicionada';
          END IF;
        END $$;
      `;
      
      // Tentar executar o SQL via RPC
      try {
        const { error: rpcError } = await supabase.rpc('exec_sql', { query: alterTableSQL });
        
        if (rpcError) {
          console.log("API: Erro ao alterar tabela via RPC:", rpcError);
        } else {
          console.log("API: Tabela alterada com sucesso via RPC");
          return true;
        }
      } catch (rpcError) {
        console.log("API: Erro ao executar RPC para alterar tabela:", rpcError);
      }
      
      // Tentar executar o SQL diretamente
      try {
        // Executar SQL direto no banco
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            query: alterTableSQL
          })
        });
        
        if (response.ok) {
          console.log("API: Tabela alterada com sucesso via SQL direto");
          return true;
        } else {
          const errorData = await response.json();
          console.error("API: Erro ao alterar tabela via SQL direto:", errorData);
        }
      } catch (fetchError) {
        console.log("API: Erro ao executar SQL via fetch para alterar tabela:", fetchError);
      }
      
      // Método alternativo: Tentar criar a tabela do zero com SQL simples
      console.log("API: Tentando recriar a tabela 'documents' com SQL simples");
      return await createDocumentsTableSimple();
      
    } catch (alterError) {
      console.error("API: Erro ao alterar tabela 'documents':", alterError);
      // Último recurso: tentar criar a tabela do zero com SQL simples
      return await createDocumentsTableSimple();
    }
  } catch (error) {
    console.error("API: Erro ao verificar e corrigir tabela 'documents':", error);
    // Último recurso: tentar criar a tabela do zero com SQL simples
    return await createDocumentsTableSimple();
  }
}

// Função para sanitizar nomes de arquivos
function sanitizeFileName(fileName: string): string {
  // Extrair a extensão do arquivo
  const lastDotIndex = fileName.lastIndexOf('.');
  const extension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex) : '';
  const nameWithoutExtension = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;
  
  // Remover caracteres especiais e acentos
  let sanitized = nameWithoutExtension
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-zA-Z0-9]/g, '_') // Substitui caracteres especiais por underscore
    .replace(/_+/g, '_') // Substitui múltiplos underscores por um único
    .replace(/^_|_$/g, ''); // Remove underscores no início e fim
  
  // Limitar o tamanho do nome do arquivo (máximo 50 caracteres + extensão)
  const maxLength = 50;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // Adicionar a extensão de volta, também sanitizada
  const sanitizedExtension = extension.toLowerCase().replace(/[^a-z0-9.]/g, '');
  
  return sanitized + sanitizedExtension;
}

// GET - Listar documentos
export async function GET(request: NextRequest) {
  try {
    console.log("API: Iniciando busca de documentos");
    
    // Verificar se o bucket existe
    const bucketExists = await ensureBucketExists();
    
    if (!bucketExists) {
      console.log(`API: Bucket '${DOCUMENTS_BUCKET}' não existe. Continuando sem verificar URLs de arquivos.`);
      // Continuar mesmo sem o bucket, apenas não teremos URLs de arquivos
    }
    
    // Buscar documentos no banco de dados
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("API: Erro ao buscar documentos:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Transformar os dados para o formato esperado pelo frontend
    const documents = data.map(doc => {
      // Obter a data de atualização (pode ser last_updated ou created_at)
      const updateDate = doc.last_updated || doc.created_at || new Date().toISOString();
      
      return {
        id: doc.id,
        title: doc.title,
        description: doc.description || '',
        category: doc.category || 'Sem Categoria',
        subcategory: doc.subcategory_id ? 'Subcategoria' : 'Todas Subcategorias',
        lastUpdated: new Date(updateDate).toLocaleDateString('pt-BR'),
        fileType: doc.file_type || 'Desconhecido',
        fileSize: doc.file_size || '0 KB',
        fileUrl: doc.file_url || null,
        filePath: doc.file_path || null
      };
    });
    
    console.log(`API: ${documents.length} documentos encontrados`);
    return NextResponse.json(documents);
  } catch (error) {
    console.error("API: Erro ao buscar documentos:", error);
    return NextResponse.json({ error: "Erro ao buscar documentos" }, { status: 500 });
  }
}

// POST - Adicionar documento
export async function POST(request: NextRequest) {
  try {
    console.log("API: Iniciando processamento de POST para adicionar documento");
    
    // Verificar se é um multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      console.log("API: Processando multipart/form-data");
      
      // Processar o form data
      const formData = await request.formData();
      console.log("API: Form data recebido");
      
      // Extrair os campos
      const title = formData.get('title') as string;
      const description = formData.get('description') as string || '';
      const category = formData.get('category') as string;
      const subcategory = formData.get('subcategory') as string;
      const file = formData.get('file') as File;
      
      console.log(`API: Dados do formulário: title=${title}, category=${category}, subcategory=${subcategory}`);
      console.log(`API: Arquivo: ${file ? `${file.name} (${file.size} bytes)` : 'Nenhum arquivo'}`);
      
      if (!title) {
        console.error("API: Título não fornecido");
        return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
      }
      
      if (!file) {
        console.error("API: Nenhum arquivo fornecido");
        return NextResponse.json({ error: "Arquivo é obrigatório" }, { status: 400 });
      }
      
      // Gerar um ID único para o arquivo
      const fileId = generateUniqueId().substring(0, 10);
      const fileName = file.name;
      const sanitizedFileName = sanitizeFileName(fileName);
      const filePath = `${fileId}_${sanitizedFileName}`;
      
      console.log(`API: Fazendo upload do arquivo: ${fileName} para ${filePath}`);
      
      try {
        // Verificar se o bucket existe
        const bucketExists = await ensureBucketExists();
        
        if (!bucketExists) {
          console.error(`API: Bucket '${DOCUMENTS_BUCKET}' não existe ou não está acessível`);
          return NextResponse.json({ 
            error: `O bucket '${DOCUMENTS_BUCKET}' não existe ou você não tem permissão para acessá-lo. Verifique as configurações no painel do Supabase.` 
          }, { status: 500 });
        }
        
        // Converter o arquivo para um ArrayBuffer para garantir compatibilidade
        const arrayBuffer = await file.arrayBuffer();
        
        // Fazer upload do arquivo para o bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(DOCUMENTS_BUCKET)
          .upload(filePath, arrayBuffer, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type
          });
        
        if (uploadError) {
          console.error("API: Erro ao fazer upload do arquivo:", uploadError);
          
          // Mensagens de erro mais específicas
          if (uploadError.message && uploadError.message.includes("Invalid key")) {
            return NextResponse.json({ 
              error: `Nome de arquivo inválido: ${filePath}. Por favor, use um nome mais curto e sem caracteres especiais.` 
            }, { status: 400 });
          } else if (uploadError.message && uploadError.message.includes("row-level security policy")) {
            return NextResponse.json({ 
              error: "Erro de permissão. Verifique as políticas de acesso do bucket no Supabase." 
            }, { status: 403 });
          } else {
            return NextResponse.json({ 
              error: `Erro ao fazer upload do arquivo: ${JSON.stringify(uploadError)}` 
            }, { status: 500 });
          }
        }
        
        console.log("API: Upload concluído com sucesso");
        
        // Obter a URL pública do arquivo
        let fileUrl = null;
        try {
          const { data } = supabase.storage.from(DOCUMENTS_BUCKET).getPublicUrl(filePath);
          if (data && data.publicUrl) {
            fileUrl = data.publicUrl;
            console.log(`API: URL pública obtida: ${fileUrl}`);
          }
        } catch (urlError) {
          console.error("API: Erro ao obter URL pública:", urlError);
          // Continuar mesmo sem a URL
        }
        
        // Calcular o tipo e tamanho do arquivo
        const fileType = sanitizedFileName.split('.').pop() || '';
        const fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
        
        console.log(`API: Tipo de arquivo: ${fileType}, Tamanho: ${fileSize}`);
        
        // Verificar quais colunas existem na tabela documents
        console.log("API: Verificando estrutura da tabela 'documents'");
        
        // Tentar inserir com diferentes conjuntos de colunas, adaptando-se à estrutura da tabela
        
        // 1. Tentar com a estrutura correta (category e subcategory_id como UUID)
        try {
          // Preparar dados básicos que são comuns a todas as tentativas
          const baseData = {
            title,
            description,
            file_type: fileType,
            file_size: fileSize,
            file_path: filePath,
            file_url: fileUrl,
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString()
          };
          
          // Tentar inserir apenas com os dados básicos primeiro
          console.log("API: Tentando inserir documento com campos básicos:", baseData);
          
          const { data: baseResult, error: baseError } = await supabase
            .from('documents')
            .insert(baseData)
            .select();
          
          if (!baseError) {
            console.log("API: Documento criado com sucesso (campos básicos):", baseResult);
            return NextResponse.json(baseResult[0]);
          }
          
          console.log("API: Erro ao inserir com campos básicos:", baseError);
          
          // Se o erro for relacionado a colunas ausentes, tentar com menos campos
          const minimalData = {
            title,
            description,
            file_path: filePath,
            file_url: fileUrl
          };
          
          console.log("API: Tentando inserir documento com campos mínimos:", minimalData);
          
          const { data: minimalResult, error: minimalError } = await supabase
            .from('documents')
            .insert(minimalData)
            .select();
          
          if (!minimalError) {
            console.log("API: Documento criado com sucesso (campos mínimos):", minimalResult);
            return NextResponse.json(minimalResult[0]);
          }
          
          console.log("API: Erro ao inserir com campos mínimos:", minimalError);
          
          // Última tentativa: apenas título
          const titleOnlyData = {
            title
          };
          
          console.log("API: Tentando inserir documento apenas com título:", titleOnlyData);
          
          const { data: titleResult, error: titleError } = await supabase
            .from('documents')
            .insert(titleOnlyData)
            .select();
          
          if (!titleError) {
            console.log("API: Documento criado com sucesso (apenas título):", titleResult);
            return NextResponse.json(titleResult[0]);
          }
          
          console.log("API: Erro ao inserir apenas com título:", titleError);
          
          // Se chegou aqui, nenhuma tentativa funcionou
          return NextResponse.json({ 
            error: "Não foi possível inserir o documento. Por favor, verifique a estrutura da tabela 'documents' no Supabase." 
          }, { status: 500 });
          
        } catch (dbError) {
          console.error("API: Erro ao acessar o banco de dados:", dbError);
          return NextResponse.json({ 
            error: "Erro ao acessar o banco de dados. Por favor, verifique as configurações do Supabase." 
          }, { status: 500 });
        }
      } catch (uploadError) {
        console.error("API: Erro durante o processo de upload:", uploadError);
        return NextResponse.json({ 
          error: "Erro durante o processo de upload. Verifique se o bucket 'Documents' existe no Supabase." 
        }, { status: 500 });
      }
    } else {
      // Processar JSON
      console.log("API: Processando JSON");
      
      const body = await request.json();
      
      if (!body.title) {
        console.error("API: Título não fornecido");
        return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
      }
      
      console.log("API: Inserindo documento no banco de dados:", body);
      
      // Inserir o documento no banco de dados
      const { data, error } = await supabase
        .from('documents')
        .insert(body)
        .select();
      
      if (error) {
        console.error("API: Erro ao inserir documento:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      console.log("API: Documento criado com sucesso:", data);
      return NextResponse.json(data[0]);
    }
  } catch (error) {
    console.error("API: Erro ao processar requisição:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// PUT - Atualizar documento
export async function PUT(request: NextRequest) {
  try {
    console.log("API: Iniciando atualização de documento");
    
    // Obter os dados da requisição
    const body = await request.json();
    const { id, ...updates } = body;
    
    console.log(`API: Atualizando documento com ID: ${id}`);
    console.log("API: Atualizações:", updates);
    
    if (!id) {
      console.error("API: ID do documento não fornecido");
      return NextResponse.json({ error: "ID do documento é obrigatório" }, { status: 400 });
    }
    
    // Verificar se o documento existe
    const { data: existingDoc, error: checkError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error("API: Erro ao verificar documento:", checkError);
      
      // Verificar se o erro é de documento não encontrado
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
      }
      
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }
    
    // Adicionar timestamp de atualização
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    console.log("API: Dados atualizados:", updatedData);
    
    // Atualizar o documento
    const { data, error } = await supabase
      .from('documents')
      .update(updatedData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error("API: Erro ao atualizar documento:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      console.error("API: Nenhum dado retornado após atualização");
      return NextResponse.json({ error: "Erro ao recuperar documento atualizado" }, { status: 500 });
    }
    
    // Adicionar URL pública ao documento atualizado
    if (data[0].file_path) {
      data[0].file_url = await getPublicUrl(data[0].file_path);
    }
    
    console.log("API: Documento atualizado com sucesso:", data[0]);
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("API: Erro ao atualizar documento:", error);
    return NextResponse.json({ error: "Erro ao atualizar documento" }, { status: 500 });
  }
}

// DELETE - Excluir documento
export async function DELETE(request: NextRequest) {
  try {
    console.log("API: Iniciando exclusão de documento");
    
    // Obter o ID do documento da URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log(`API: Excluindo documento com ID: ${id}`);
    
    if (!id) {
      console.error("API: ID do documento não fornecido");
      return NextResponse.json({ error: "ID do documento é obrigatório" }, { status: 400 });
    }
    
    // Buscar o documento para obter o caminho do arquivo
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error("API: Erro ao buscar documento:", fetchError);
      
      // Verificar se o erro é de documento não encontrado
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
      }
      
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    
    // Se o documento tiver um arquivo associado, excluí-lo
    if (document && document.file_path) {
      console.log(`API: Excluindo arquivo: ${document.file_path}`);
      
      // Verificar se o bucket existe
      const bucketExists = await ensureBucketExists();
      if (!bucketExists) {
        console.error("API: Bucket não existe e não foi possível criá-lo");
        // Continuar mesmo sem excluir o arquivo
      } else {
        // Excluir o arquivo
        const { error: deleteFileError } = await supabase.storage
          .from(DOCUMENTS_BUCKET)
          .remove([document.file_path]);
        
        if (deleteFileError) {
          console.error("API: Erro ao excluir arquivo:", deleteFileError);
          // Continuar mesmo com erro na exclusão do arquivo
        } else {
          console.log("API: Arquivo excluído com sucesso");
        }
      }
    }
    
    // Excluir o documento
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error("API: Erro ao excluir documento:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
    
    console.log("API: Documento excluído com sucesso");
    return NextResponse.json({ success: true, message: "Documento excluído com sucesso" });
  } catch (error) {
    console.error("API: Erro ao excluir documento:", error);
    return NextResponse.json({ error: "Erro ao excluir documento" }, { status: 500 });
  }
}
