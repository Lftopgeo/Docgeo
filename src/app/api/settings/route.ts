import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicializa o cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    console.log("API: Iniciando salvamento de configurações");
    
    // Obter os dados do corpo da requisição
    const settings = await request.json();
    console.log("API: Dados recebidos:", settings);
    
    // Verificar se o usuário está autenticado (opcional, dependendo dos requisitos)
    // const userId = settings.userId || "default-user"; // Em um sistema real, você obteria isso da sessão
    const userId = "default-user"; // Usando um ID padrão para demonstração
    
    // Verificar se já existe um registro para este usuário
    const { data: existingSettings, error: fetchError } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    let result;
    
    if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 = not found, que é esperado se não houver configurações
      console.log("API: Erro ao verificar configurações existentes:", fetchError);
      return NextResponse.json(
        { error: "Erro ao verificar configurações existentes" },
        { status: 500 }
      );
    }
    
    // Se já existir um registro, atualiza; caso contrário, insere
    if (existingSettings) {
      console.log("API: Atualizando configurações existentes");
      const { data, error } = await supabase
        .from("user_settings")
        .update({
          general_settings: settings.general,
          account_settings: settings.account,
          appearance_settings: settings.appearance,
          security_settings: settings.security,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .select();
      
      result = { data, error };
    } else {
      console.log("API: Criando novas configurações");
      // Tenta criar a tabela se ela não existir
      try {
        await supabase.rpc("create_settings_table_if_not_exists");
      } catch (error) {
        console.log("API: Erro ao criar tabela (pode já existir):", error);
      }
      
      const { data, error } = await supabase
        .from("user_settings")
        .insert({
          user_id: userId,
          general_settings: settings.general,
          account_settings: settings.account,
          appearance_settings: settings.appearance,
          security_settings: settings.security,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      result = { data, error };
    }
    
    if (result.error) {
      console.log("API: Erro ao salvar configurações:", result.error);
      return NextResponse.json(
        { error: "Erro ao salvar configurações" },
        { status: 500 }
      );
    }
    
    console.log("API: Configurações salvas com sucesso:", result.data);
    return NextResponse.json(
      { message: "Configurações salvas com sucesso", data: result.data },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("API: Erro ao processar requisição:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("API: Iniciando busca de configurações");
    
    // Em um sistema real, você obteria o ID do usuário da sessão
    const userId = "default-user";
    
    // Buscar as configurações do usuário
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (error) {
      console.log("API: Erro ao buscar configurações:", error);
      // Se o erro for "not found", retornamos um objeto vazio em vez de erro
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { message: "Nenhuma configuração encontrada", data: {} },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { error: "Erro ao buscar configurações" },
        { status: 500 }
      );
    }
    
    console.log("API: Configurações encontradas:", data);
    return NextResponse.json(
      { message: "Configurações encontradas com sucesso", data },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("API: Erro ao processar requisição:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
} 