import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Carrega as variáveis de ambiente dos arquivos .env
 */
export function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  const envLocalPath = path.join(process.cwd(), '.env.local');
  const envDevPath = path.join(process.cwd(), '.env.development');
  
  // Carregar .env se existir
  if (fs.existsSync(envPath)) {
    console.log('Carregando variáveis de ambiente de .env');
    dotenv.config({ path: envPath });
  }
  
  // Carregar .env.local se existir
  if (fs.existsSync(envLocalPath)) {
    console.log('Carregando variáveis de ambiente de .env.local');
    dotenv.config({ path: envLocalPath });
  }
  
  // Carregar .env.development se existir
  if (fs.existsSync(envDevPath)) {
    console.log('Carregando variáveis de ambiente de .env.development');
    dotenv.config({ path: envDevPath });
  }
  
  // Verificar se as variáveis necessárias foram carregadas
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias');
  }
  
  console.log('Variáveis de ambiente carregadas com sucesso');
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
} 