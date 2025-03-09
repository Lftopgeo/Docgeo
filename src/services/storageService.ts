import { supabase } from '@/lib/supabase/client';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

// Definição dos buckets disponíveis
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  DOCUMENTS: 'documents',
  TOOL_IMAGES: 'tool_images'
};

export interface UploadOptions {
  bucket: string;
  file: File;
  path?: string;
  contentType?: string;
  upsert?: boolean;
}

export interface DownloadOptions {
  bucket: string;
  path: string;
  transform?: {
    width?: number;
    height?: number;
    resize?: 'cover' | 'contain' | 'fill';
    format?: 'origin' | 'webp' | 'avif' | 'jpeg';
    quality?: number;
  };
}

// Serviço para o cliente (browser)
export const storageService = {
  /**
   * Faz upload de um arquivo para um bucket do Supabase
   */
  async uploadFile({ bucket, file, path, contentType, upsert = false }: UploadOptions): Promise<string> {
    // Gera um caminho único se não for fornecido
    const filePath = path || `${uuidv4()}-${file.name.replace(/\s+/g, '_')}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: contentType || file.type,
        upsert: upsert,
      });

    if (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      throw error;
    }

    return filePath;
  },

  /**
   * Obtém a URL pública de um arquivo
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  /**
   * Obtém a URL de download de um arquivo
   */
  async getSignedUrl(bucket: string, path: string, expiresIn = 60): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Erro ao gerar URL assinada:', error);
      throw error;
    }

    return data.signedUrl;
  },

  /**
   * Remove um arquivo do storage
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('Erro ao excluir arquivo:', error);
      throw error;
    }
  },

  /**
   * Lista arquivos em um bucket/pasta
   */
  async listFiles(bucket: string, path?: string): Promise<any[]> {
    const { data, error } = await supabase.storage.from(bucket).list(path || '');

    if (error) {
      console.error('Erro ao listar arquivos:', error);
      throw error;
    }

    return data;
  },

  /**
   * Cria um bucket se ele não existir
   */
  async createBucketIfNotExists(bucket: string, isPublic: boolean = false): Promise<void> {
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
};

// Serviço para o servidor
export const serverStorageService = {
  /**
   * Obtém a URL pública de um arquivo (servidor)
   */
  getPublicUrl(bucket: string, path: string): string {
    const supabase = createClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  /**
   * Lista arquivos em um bucket/pasta (servidor)
   */
  async listFiles(bucket: string, path?: string): Promise<any[]> {
    const supabase = createClient();
    const { data, error } = await supabase.storage.from(bucket).list(path || '');

    if (error) {
      console.error('Erro ao listar arquivos (servidor):', error);
      throw error;
    }

    return data;
  },

  /**
   * Remove um arquivo do storage (servidor)
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('Erro ao excluir arquivo (servidor):', error);
      throw error;
    }
  }
}; 