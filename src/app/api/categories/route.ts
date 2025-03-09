import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicializar o cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    // Buscar todas as categorias
    const { data: categories, error: categoriesError } = await supabase
      .from("document_categories")
      .select("*")
      .order("name");
    
    if (categoriesError) {
      throw categoriesError;
    }
    
    // Buscar todas as subcategorias
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from("document_subcategories")
      .select("*")
      .order("name");
    
    if (subcategoriesError) {
      throw subcategoriesError;
    }
    
    // Mapear as categorias e subcategorias para o formato esperado pelo frontend
    const formattedCategories = [
      {
        id: "all",
        name: "Todas Categorias",
        subcategories: [{ id: "all", name: "Todas Subcategorias" }],
      },
      ...categories.map((category) => ({
        id: category.id,
        name: category.name,
        subcategories: [
          { id: "all", name: "Todas Subcategorias" },
          ...subcategories
            .filter((subcategory) => subcategory.category_id === category.id)
            .map((subcategory) => ({
              id: subcategory.id,
              name: subcategory.name,
            })),
        ],
      })),
    ];
    
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }
    
    // Inserir a nova categoria
    const { data, error } = await supabase
      .from("document_categories")
      .insert({ name })
      .select();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name } = body;
    
    if (!id || !name) {
      return NextResponse.json(
        { error: "Category ID and name are required" },
        { status: 400 }
      );
    }
    
    // Atualizar a categoria
    const { data, error } = await supabase
      .from("document_categories")
      .update({ name })
      .eq("id", id)
      .select();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }
    
    // Verificar se existem subcategorias associadas
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from("document_subcategories")
      .select("id")
      .eq("category_id", id);
    
    if (subcategoriesError) {
      throw subcategoriesError;
    }
    
    // Se houver subcategorias, excluí-las primeiro
    if (subcategories.length > 0) {
      const subcategoryIds = subcategories.map((subcategory) => subcategory.id);
      const { error: deleteSubcategoriesError } = await supabase
        .from("document_subcategories")
        .delete()
        .in("id", subcategoryIds);
      
      if (deleteSubcategoriesError) {
        throw deleteSubcategoriesError;
      }
    }
    
    // Excluir a categoria
    const { error } = await supabase
      .from("document_categories")
      .delete()
      .eq("id", id);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
