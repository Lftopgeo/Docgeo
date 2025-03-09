import { loadEnv } from './loadEnv';
// Carregar variáveis de ambiente antes de importar outros módulos
loadEnv();

import { supabase } from './supabaseClient';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script para executar o seed do banco de dados
 * Este script lê o arquivo de seed e executa as queries SQL
 */
async function seedDatabase() {
  try {
    console.log('Executando seed do banco de dados...');
    
    // Caminho para o arquivo de seed
    const seedFilePath = path.join(process.cwd(), 'migrations', 'seed-data.sql');
    
    // Ler o arquivo de seed
    const seedSQL = fs.readFileSync(seedFilePath, 'utf8');
    
    // Executar o seed
    const { error } = await supabase.rpc('exec_sql', { sql: seedSQL });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Seed executado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
  }
}

// Executar o script
seedDatabase(); 