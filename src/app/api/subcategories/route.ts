import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicializar o cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    
    let query = supabase.from("document_subcategories").select("*");
    
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }
    
    const { data, error } = await query.order("name");
    
    if (error) {
      throw error;
    }
    
    // Adicionar uma opção "Todas" para facilitar a filtragem
    const formattedData = [
      { id: "all", name: "Todas Subcategorias", category_id: categoryId || "all" },
      ...data,
    ];
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category_id } = body;
    
    if (!name || !category_id) {
      return NextResponse.json(
        { error: "Subcategory name and category ID are required" },
        { status: 400 }
      );
    }
    
    // Verificar se a categoria existe
    const { data: category, error: categoryError } = await supabase
      .from("document_categories")
      .select("id")
      .eq("id", category_id)
      .single();
    
    if (categoryError) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    // Inserir a nova subcategoria
    const { data, error } = await supabase
      .from("document_subcategories")
      .insert({ name, category_id })
      .select();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, category_id } = body;
    
    if (!id || !name) {
      return NextResponse.json(
        { error: "Subcategory ID and name are required" },
        { status: 400 }
      );
    }
    
    // Preparar os dados para atualização
    const updates: { name: string; category_id?: string } = { name };
    
    if (category_id) {
      // Verificar se a categoria existe
      const { data: category, error: categoryError } = await supabase
        .from("document_categories")
        .select("id")
        .eq("id", category_id)
        .single();
      
      if (categoryError) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      
      updates.category_id = category_id;
    }
    
    // Atualizar a subcategoria
    const { data, error } = await supabase
      .from("document_subcategories")
      .update(updates)
      .eq("id", id)
      .select();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return NextResponse.json({ error: "Failed to update subcategory" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Subcategory ID is required" },
        { status: 400 }
      );
    }
    
    // Verificar se existem documentos associados a esta subcategoria
    const { data: documents, error: documentsError } = await supabase
      .from("documents")
      .select("id")
      .eq("subcategory", id);
    
    if (documentsError) {
      throw documentsError;
    }
    
    // Se houver documentos, atualizar para subcategoria "Geral" ou similar
    if (documents.length > 0) {
      const documentIds = documents.map((doc) => doc.id);
      const { error: updateError } = await supabase
        .from("documents")
        .update({ subcategory: "Geral" })
        .in("id", documentIds);
      
      if (updateError) {
        throw updateError;
      }
    }
    
    // Excluir a subcategoria
    const { error } = await supabase
      .from("document_subcategories")
      .delete()
      .eq("id", id);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json({ error: "Failed to delete subcategory" }, { status: 500 });
  }
}
