import { taskService } from "@/services";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { taskId, tags } = await req.json();
    
    if (!taskId) {
      return NextResponse.json({ error: "ID da tarefa é obrigatório" }, { status: 400 });
    }
    
    if (!Array.isArray(tags)) {
      return NextResponse.json({ error: "Tags deve ser um array" }, { status: 400 });
    }
    
    await taskService.updateTaskTags(taskId, tags);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 