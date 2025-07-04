import { taskService } from "@/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const data = await taskService.server.getAllTasks();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await taskService.server.createTask(body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }
    
    // Verificar se é uma atualização de progresso
    if (updates.progress !== undefined) {
      const data = await taskService.server.updateTaskProgress(id, updates.progress);
      return NextResponse.json(data);
    }
    
    // Verificar se é uma atualização de status
    if (updates.status) {
      switch (updates.status) {
        case 'completed':
          const completedTask = await taskService.server.completeTask(id);
          return NextResponse.json(completedTask);
        case 'in_progress':
          const startedTask = await taskService.server.startTask(id);
          return NextResponse.json(startedTask);
        case 'canceled':
          const canceledTask = await taskService.server.cancelTask(id);
          return NextResponse.json(canceledTask);
      }
    }
    
    // Atualização normal
    const data = await taskService.server.updateTask(id, updates);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }
    
    await taskService.server.deleteTask(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
