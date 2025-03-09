import { STORAGE_BUCKETS } from '@/services/storageService';
import { supabase } from './supabaseClient';

/**
 * Script para inicializar os buckets do Supabase
 * Este script deve ser executado uma vez para criar os buckets necessários
 */
async function initializeBuckets() {
  try {
    console.log('Inicializando buckets do Supabase...');
    
    // Criar bucket de avatares (público)
    await createBucketIfNotExists(STORAGE_BUCKETS.AVATARS, true);
    console.log(`✅ Bucket ${STORAGE_BUCKETS.AVATARS} criado ou já existente`);
    
    // Criar bucket de documentos (privado)
    await createBucketIfNotExists(STORAGE_BUCKETS.DOCUMENTS, false);
    console.log(`✅ Bucket ${STORAGE_BUCKETS.DOCUMENTS} criado ou já existente`);
    
    // Criar bucket de imagens de ferramentas (público)
    await createBucketIfNotExists(STORAGE_BUCKETS.TOOL_IMAGES, true);
    console.log(`✅ Bucket ${STORAGE_BUCKETS.TOOL_IMAGES} criado ou já existente`);
    
    console.log('✅ Todos os buckets foram inicializados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar buckets:', error);
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
initializeBuckets(); 