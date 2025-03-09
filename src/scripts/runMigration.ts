import { loadEnv } from './loadEnv';
// Carregar variáveis de ambiente antes de importar outros módulos
loadEnv();

import { supabase } from './supabaseClient';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script para executar a migração do banco de dados
 * Este script lê o arquivo de migração e executa as queries SQL
 */
async function runMigration() {
  try {
    console.log('Executando migração do banco de dados...');
    
    // Caminho para o arquivo de migração
    const migrationFilePath = path.join(process.cwd(), 'migrations', 'supabase-schema.sql');
    
    // Ler o arquivo de migração
    const migrationSQL = fs.readFileSync(migrationFilePath, 'utf8');
    
    // Executar a migração
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Migração executada com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error);
  }
}

// Executar o script
runMigration(); 