import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*");

  if (tasksError) {
    return NextResponse.json({ error: tasksError.message }, { status: 500 });
  }

  // Get tags for all tasks
  const taskIds = tasks.map((task) => task.id);
  const { data: tags, error: tagsError } = await supabase
    .from("task_tags")
    .select("*")
    .in("task_id", taskIds);

  if (tagsError) {
    return NextResponse.json({ error: tagsError.message }, { status: 500 });
  }

  // Combine tasks with their tags
  const tasksWithTags = tasks.map((task) => {
    const taskTags = tags
      .filter((tag) => tag.task_id === task.id)
      .map((tag) => tag.tag);
    return {
      ...task,
      tags: taskTags,
    };
  });

  return NextResponse.json(tasksWithTags);
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = sessionData.session.user.id;
  const body = await req.json();
  const { tags, ...taskData } = body;

  // Insert task
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .insert({
      ...taskData,
      created_by: userId,
    })
    .select()
    .single();

  if (taskError) {
    return NextResponse.json({ error: taskError.message }, { status: 500 });
  }

  // Insert tags if provided
  if (tags && tags.length > 0) {
    const tagInserts = tags.map((tag) => ({
      task_id: task.id,
      tag,
    }));

    const { error: tagsError } = await supabase
      .from("task_tags")
      .insert(tagInserts);

    if (tagsError) {
      return NextResponse.json({ error: tagsError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ...task, tags: tags || [] });
}
