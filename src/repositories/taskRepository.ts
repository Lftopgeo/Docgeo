import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  assigned_to?: string;
  project_id?: string;
  parent_task_id?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  estimated_hours?: number;
  actual_hours?: number;
  progress?: number;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
  tags?: string[];
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
}

export interface TaskCreate {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  assigned_to?: string;
  project_id?: string;
  parent_task_id?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  estimated_hours?: number;
  actual_hours?: number;
  progress?: number;
  created_by?: string;
  tags?: string[];
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  assigned_to?: string;
  project_id?: string;
  parent_task_id?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  estimated_hours?: number;
  actual_hours?: number;
  progress?: number;
  completed_at?: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  comment: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  created_by?: string;
  created_at?: string;
}

export const taskRepository = {
  // Cliente
  async getAll(): Promise<Task[]> {
    // Buscar todas as tarefas
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true });

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      throw tasksError;
    }

    if (!tasks || tasks.length === 0) {
      return [];
    }

    // Buscar tags para todas as tarefas
    const taskIds = tasks.map((task) => task.id);
    const { data: tags, error: tagsError } = await supabase
      .from("task_tags")
      .select("*")
      .in("task_id", taskIds);

    if (tagsError) {
      console.error("Error fetching task tags:", tagsError);
      throw tagsError;
    }

    // Combinar tarefas com suas tags
    const tasksWithTags = tasks.map((task) => {
      const taskTags = tags
        ? tags
            .filter((tag) => tag.task_id === task.id)
            .map((tag) => tag.tag)
        : [];
      return {
        ...task,
        tags: taskTags,
      };
    });

    return tasksWithTags;
  },

  async getById(id: string): Promise<Task | null> {
    // Buscar a tarefa
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (taskError) {
      console.error(`Error fetching task with id ${id}:`, taskError);
      throw taskError;
    }

    if (!task) {
      return null;
    }

    // Buscar tags da tarefa
    const { data: tags, error: tagsError } = await supabase
      .from("task_tags")
      .select("*")
      .eq("task_id", id);

    if (tagsError) {
      console.error(`Error fetching tags for task ${id}:`, tagsError);
      throw tagsError;
    }

    // Buscar comentários da tarefa
    const { data: comments, error: commentsError } = await supabase
      .from("task_comments")
      .select("*")
      .eq("task_id", id)
      .order("created_at", { ascending: false });

    if (commentsError) {
      console.error(`Error fetching comments for task ${id}:`, commentsError);
      throw commentsError;
    }

    // Buscar anexos da tarefa
    const { data: attachments, error: attachmentsError } = await supabase
      .from("task_attachments")
      .select("*")
      .eq("task_id", id);

    if (attachmentsError) {
      console.error(`Error fetching attachments for task ${id}:`, attachmentsError);
      throw attachmentsError;
    }

    // Combinar tarefa com tags, comentários e anexos
    return {
      ...task,
      tags: tags ? tags.map((tag) => tag.tag) : [],
      comments: comments || [],
      attachments: attachments || [],
    };
  },

  async create(task: TaskCreate): Promise<Task> {
    const { tags, ...taskData } = task;

    // Inserir tarefa
    const { data: createdTask, error: taskError } = await supabase
      .from("tasks")
      .insert(taskData)
      .select()
      .single();

    if (taskError) {
      console.error("Error creating task:", taskError);
      throw taskError;
    }

    // Inserir tags se fornecidas
    if (tags && tags.length > 0) {
      const tagInserts = tags.map((tag) => ({
        task_id: createdTask.id,
        tag,
      }));

      const { error: tagsError } = await supabase
        .from("task_tags")
        .insert(tagInserts);

      if (tagsError) {
        console.error("Error creating task tags:", tagsError);
        throw tagsError;
      }
    }

    return {
      ...createdTask,
      tags: tags || [],
    };
  },

  async update(id: string, task: TaskUpdate): Promise<Task> {
    const { data: updatedTask, error: taskError } = await supabase
      .from("tasks")
      .update(task)
      .eq("id", id)
      .select()
      .single();

    if (taskError) {
      console.error(`Error updating task with id ${id}:`, taskError);
      throw taskError;
    }

    return updatedTask;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting task with id ${id}:`, error);
      throw error;
    }
  },

  async updateTags(taskId: string, tags: string[]): Promise<void> {
    // Primeiro, excluir todas as tags existentes
    const { error: deleteError } = await supabase
      .from("task_tags")
      .delete()
      .eq("task_id", taskId);

    if (deleteError) {
      console.error(`Error deleting existing tags for task ${taskId}:`, deleteError);
      throw deleteError;
    }

    // Inserir novas tags
    if (tags && tags.length > 0) {
      const tagInserts = tags.map((tag) => ({
        task_id: taskId,
        tag,
      }));

      const { error: insertError } = await supabase
        .from("task_tags")
        .insert(tagInserts);

      if (insertError) {
        console.error(`Error inserting new tags for task ${taskId}:`, insertError);
        throw insertError;
      }
    }
  },

  // Comentários
  comment: {
    async create(comment: Omit<TaskComment, "id" | "created_at" | "updated_at">): Promise<TaskComment> {
      const { data, error } = await supabase
        .from("task_comments")
        .insert(comment)
        .select()
        .single();

      if (error) {
        console.error("Error creating task comment:", error);
        throw error;
      }

      return data;
    },

    async update(id: string, comment: { comment: string }): Promise<TaskComment> {
      const { data, error } = await supabase
        .from("task_comments")
        .update(comment)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating task comment with id ${id}:`, error);
        throw error;
      }

      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from("task_comments")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(`Error deleting task comment with id ${id}:`, error);
        throw error;
      }
    },
  },

  // Anexos
  attachment: {
    async create(attachment: Omit<TaskAttachment, "id" | "created_at">): Promise<TaskAttachment> {
      const { data, error } = await supabase
        .from("task_attachments")
        .insert(attachment)
        .select()
        .single();

      if (error) {
        console.error("Error creating task attachment:", error);
        throw error;
      }

      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from("task_attachments")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(`Error deleting task attachment with id ${id}:`, error);
        throw error;
      }
    },
  },

  // Servidor
  server: {
    async getAll() {
      const supabase = createClient();
      
      // Buscar todas as tarefas
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true });

      if (tasksError) {
        console.error("Error fetching tasks:", tasksError);
        throw tasksError;
      }

      if (!tasks || tasks.length === 0) {
        return [];
      }

      // Buscar tags para todas as tarefas
      const taskIds = tasks.map((task) => task.id);
      const { data: tags, error: tagsError } = await supabase
        .from("task_tags")
        .select("*")
        .in("task_id", taskIds);

      if (tagsError) {
        console.error("Error fetching task tags:", tagsError);
        throw tagsError;
      }

      // Combinar tarefas com suas tags
      const tasksWithTags = tasks.map((task) => {
        const taskTags = tags
          ? tags
              .filter((tag) => tag.task_id === task.id)
              .map((tag) => tag.tag)
          : [];
        return {
          ...task,
          tags: taskTags,
        };
      });

      return tasksWithTags;
    },

    async getById(id: string) {
      const supabase = createClient();
      
      // Buscar a tarefa
      const { data: task, error: taskError } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (taskError) {
        console.error(`Error fetching task with id ${id}:`, taskError);
        throw taskError;
      }

      if (!task) {
        return null;
      }

      // Buscar tags da tarefa
      const { data: tags, error: tagsError } = await supabase
        .from("task_tags")
        .select("*")
        .eq("task_id", id);

      if (tagsError) {
        console.error(`Error fetching tags for task ${id}:`, tagsError);
        throw tagsError;
      }

      // Buscar comentários da tarefa
      const { data: comments, error: commentsError } = await supabase
        .from("task_comments")
        .select("*")
        .eq("task_id", id)
        .order("created_at", { ascending: false });

      if (commentsError) {
        console.error(`Error fetching comments for task ${id}:`, commentsError);
        throw commentsError;
      }

      // Buscar anexos da tarefa
      const { data: attachments, error: attachmentsError } = await supabase
        .from("task_attachments")
        .select("*")
        .eq("task_id", id);

      if (attachmentsError) {
        console.error(`Error fetching attachments for task ${id}:`, attachmentsError);
        throw attachmentsError;
      }

      // Combinar tarefa com tags, comentários e anexos
      return {
        ...task,
        tags: tags ? tags.map((tag) => tag.tag) : [],
        comments: comments || [],
        attachments: attachments || [],
      };
    },

    async create(task: TaskCreate) {
      const supabase = createClient();
      const { tags, ...taskData } = task;

      // Inserir tarefa
      const { data: createdTask, error: taskError } = await supabase
        .from("tasks")
        .insert(taskData)
        .select()
        .single();

      if (taskError) {
        console.error("Error creating task:", taskError);
        throw taskError;
      }

      // Inserir tags se fornecidas
      if (tags && tags.length > 0) {
        const tagInserts = tags.map((tag) => ({
          task_id: createdTask.id,
          tag,
        }));

        const { error: tagsError } = await supabase
          .from("task_tags")
          .insert(tagInserts);

        if (tagsError) {
          console.error("Error creating task tags:", tagsError);
          throw tagsError;
        }
      }

      return {
        ...createdTask,
        tags: tags || [],
      };
    },

    async update(id: string, task: TaskUpdate) {
      const supabase = createClient();
      const { data: updatedTask, error: taskError } = await supabase
        .from("tasks")
        .update(task)
        .eq("id", id)
        .select()
        .single();

      if (taskError) {
        console.error(`Error updating task with id ${id}:`, taskError);
        throw taskError;
      }

      return updatedTask;
    },

    async delete(id: string) {
      const supabase = createClient();
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(`Error deleting task with id ${id}:`, error);
        throw error;
      }
    },
  },
}; 