import { loadEnv } from './loadEnv';
// Carregar variáveis de ambiente antes de importar outros módulos
loadEnv();

import * as fs from 'fs';
import * as path from 'path';
import { supabase } from './supabaseClient';
import { STORAGE_BUCKETS } from '@/services/storageService';

/**
 * Script para inicializar o banco de dados e os buckets
 * Este script executa a migração, o seed e cria os buckets
 */
async function initializeAll() {
  try {
    console.log('🚀 Iniciando inicialização completa do sistema...');
    
    // 1. Inicializar buckets
    console.log('\n📦 Inicializando buckets do Supabase...');
    
    // Criar bucket de avatares (público)
    await createBucketIfNotExists(STORAGE_BUCKETS.AVATARS, true);
    console.log(`✅ Bucket ${STORAGE_BUCKETS.AVATARS} criado ou já existente`);
    
    // Criar bucket de documentos (privado)
    await createBucketIfNotExists(STORAGE_BUCKETS.DOCUMENTS, false);
    console.log(`✅ Bucket ${STORAGE_BUCKETS.DOCUMENTS} criado ou já existente`);
    
    // Criar bucket de imagens de ferramentas (público)
    await createBucketIfNotExists(STORAGE_BUCKETS.TOOL_IMAGES, true);
    console.log(`✅ Bucket ${STORAGE_BUCKETS.TOOL_IMAGES} criado ou já existente`);
    
    console.log('\n🎉 Inicialização do sistema concluída com sucesso!');
    console.log('\n⚠️ Nota: A migração e o seed do banco de dados devem ser executados manualmente no Supabase.');
    console.log('Acesse o painel do Supabase, vá para SQL Editor e execute os scripts:');
    console.log('- migrations/supabase-schema.sql');
    console.log('- migrations/seed-data.sql');
  } catch (error) {
    console.error('❌ Erro durante a inicialização:', error);
  }
}

/**
 * Cria um bucket se ele não existir
 */
async function createBucketIfNotExists(bucket: string, isPublic: boolean = false): Promise<void> {
  const { data, error } = await supabase.storage.getBucket(bucket);
  
  if (error && error.message.includes('not found')) {
    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: isPublic,
    });
    
    if (createError) {
      console.error(`Erro ao criar bucket ${bucket}:`, createError);
      throw createError;
    }
  } else if (error) {
    console.error(`Erro ao verificar bucket ${bucket}:`, error);
    throw error;
  }
}

// Executar o script
initializeAll(); 