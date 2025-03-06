import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();

  // Get task
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", params.id)
    .single();

  if (taskError) {
    return NextResponse.json({ error: taskError.message }, { status: 500 });
  }

  // Get tags
  const { data: tags, error: tagsError } = await supabase
    .from("task_tags")
    .select("tag")
    .eq("task_id", params.id);

  if (tagsError) {
    return NextResponse.json({ error: tagsError.message }, { status: 500 });
  }

  // Get comments
  const { data: comments, error: commentsError } = await supabase
    .from("task_comments")
    .select("*")
    .eq("task_id", params.id)
    .order("created_at", { ascending: false });

  if (commentsError) {
    return NextResponse.json({ error: commentsError.message }, { status: 500 });
  }

  return NextResponse.json({
    ...task,
    tags: tags.map((t) => t.tag),
    comments,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { tags, ...taskData } = body;

  // Update task
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .update(taskData)
    .eq("id", params.id)
    .select()
    .single();

  if (taskError) {
    return NextResponse.json({ error: taskError.message }, { status: 500 });
  }

  // Update tags if provided
  if (tags !== undefined) {
    // First delete existing tags
    const { error: deleteError } = await supabase
      .from("task_tags")
      .delete()
      .eq("task_id", params.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Then insert new tags
    if (tags.length > 0) {
      const tagInserts = tags.map((tag) => ({
        task_id: params.id,
        tag,
      }));

      const { error: tagsError } = await supabase
        .from("task_tags")
        .insert(tagInserts);

      if (tagsError) {
        return NextResponse.json({ error: tagsError.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ ...task, tags: tags || [] });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete task (cascade will handle tags and comments)
  const { error } = await supabase.from("tasks").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
