import { toolService } from "@/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const toolId = searchParams.get("toolId");
    
    if (!toolId) {
      return NextResponse.json({ error: "ID da ferramenta é obrigatório" }, { status: 400 });
    }
    
    const data = await toolService.usageStat.getByToolId(toolId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { toolId, userId } = await req.json();
    
    if (!toolId) {
      return NextResponse.json({ error: "ID da ferramenta é obrigatório" }, { status: 400 });
    }
    
    await toolService.usageStat.recordUsage(toolId, userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 