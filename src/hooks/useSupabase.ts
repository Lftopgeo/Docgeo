import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";

// Hook for tools
export function useTools() {
  const [tools, setTools] = useState<
    Database["public"]["Tables"]["tools"]["Row"][]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTools() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("tools").select("*");

        if (error) throw error;
        setTools(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTools();
  }, []);

  async function addTool(
    tool: Omit<
      Database["public"]["Tables"]["tools"]["Insert"],
      "id" | "created_by" | "created_at"
    >,
  ) {
    try {
      const { data, error } = await supabase
        .from("tools")
        .insert(tool)
        .select();

      if (error) throw error;
      setTools((prev) => [...prev, data[0]]);
      return data[0];
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
      throw err;
    }
  }

  async function updateTool(
    id: string,
    updates: Partial<Database["public"]["Tables"]["tools"]["Update"]>,
  ) {
    try {
      const { data, error } = await supabase
        .from("tools")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      setTools((prev) => prev.map((tool) => (tool.id === id ? data[0] : tool)));
      return data[0];
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
      throw err;
    }
  }

  async function deleteTool(id: string) {
    try {
      const { error } = await supabase.from("tools").delete().eq("id", id);

      if (error) throw error;
      setTools((prev) => prev.filter((tool) => tool.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
      throw err;
    }
  }

  return { tools, loading, error, addTool, updateTool, deleteTool };
}

// Hook for documents and categories
export function useDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch categories with subcategories
        const { data: categoriesData, error: categoriesError } =
          await supabase.from("document_categories").select(`
            *,
            document_subcategories(*)
          `);

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Fetch documents
        const { data: documentsData, error: documentsError } =
          await supabase.from("documents").select(`
            *,
            document_categories(*),
            document_subcategories(*)
          `);

        if (documentsError) throw documentsError;
        setDocuments(documentsData || []);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function addCategory(category: { name: string }) {
    try {
      const { data, error } = await supabase
        .from("document_categories")
        .insert(category)
        .select();

      if (error) throw error;
      const newCategory = { ...data[0], document_subcategories: [] };
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
      throw err;
    }
  }

  async function addSubcategory(
    categoryId: string,
    subcategory: { name: string },
  ) {
    try {
      const { data, error } = await supabase
        .from("document_subcategories")
        .insert({ ...subcategory, category_id: categoryId })
        .select();

      if (error) throw error;

      setCategories((prev) =>
        prev.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              document_subcategories: [
                ...category.document_subcategories,
                data[0],
              ],
            };
          }
          return category;
        }),
      );

      return data[0];
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
      throw err;
    }
  }

  async function addDocument(document: any) {
    try {
      const { data, error } = await supabase
        .from("documents")
        .insert(document)
        .select();

      if (error) throw error;
      setDocuments((prev) => [...prev, data[0]]);
      return data[0];
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
      throw err;
    }
  }

  return {
    documents,
    categories,
    loading,
    error,
    addCategory,
    addSubcategory,
    addDocument,
  };
}

// Hook for tasks
export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);

        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("*, assignee_id")
          .order("due_date", { ascending: true });

        if (tasksError) throw tasksError;

        // Get all task IDs
        const taskIds = tasksData.map((task) => task.id);

        // Fetch tags for all tasks
        const { data: tagsData, error: tagsError } = await supabase
          .from("task_tags")
          .select("*")
          .in("task_id", taskIds);

        if (tagsError) throw tagsError;

        // Fetch user profiles for assignees
        const assigneeIds = tasksData
          .map((task) => task.assignee_id)
          .filter(Boolean); // Remove null/undefined values

        let assigneeProfiles: any[] = [];
        if (assigneeIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .in("id", assigneeIds);

          if (profilesError) throw profilesError;
          assigneeProfiles = profilesData || [];
        }

        // Combine tasks with their tags and assignee info
        const tasksWithDetails = tasksData.map((task) => {
          const taskTags = tagsData
            ? tagsData
                .filter((tag) => tag.task_id === task.id)
                .map((tag) => tag.tag)
            : [];

          // Find assignee profile
          const assigneeProfile = task.assignee_id
            ? assigneeProfiles.find((profile) => profile.id === task.assignee_id)
            : null;

          // Create assignee object
          const assignee = assigneeProfile
            ? {
                name: assigneeProfile.full_name || "Usuário",
                avatar: assigneeProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${assigneeProfile.id}`,
              }
            : {
                name: "Não atribuído",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
              };

          return {
            ...task,
            tags: taskTags,
            assignee,
            // Format date for frontend
            dueDate: task.due_date || new Date().toISOString(),
          };
        });

        setTasks(tasksWithDetails);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  async function addTask(task: any) {
    try {
      const { tags, assignee, ...taskData } = task;

      // Convert assignee object to assignee_id if needed
      const taskToInsert = {
        ...taskData,
        // If assignee is an object with an id property, use that id
        assignee_id: assignee?.id || null,
      };

      // Insert task
      const { data: newTask, error: taskError } = await supabase
        .from("tasks")
        .insert(taskToInsert)
        .select()
        .single();

      if (taskError) throw taskError;

      // Insert tags if provided
      if (tags && tags.length > 0) {
        const tagInserts = tags.map((tag: string) => ({
          task_id: newTask.id,
          tag,
        }));

        const { error: tagsError } = await supabase
          .from("task_tags")
          .insert(tagInserts);

        if (tagsError) throw tagsError;
      }

      const taskWithDetails = { 
        ...newTask, 
        tags: tags || [],
        assignee: assignee || {
          name: "Não atribuído",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
        },
        dueDate: newTask.due_date || new Date().toISOString(),
      };
      
      setTasks((prev) => [...prev, taskWithDetails]);
      return taskWithDetails;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
      throw err;
    }
  }

  async function updateTask(id: string, updates: any) {
    try {
      const { tags, assignee, ...taskData } = updates;

      // Convert assignee object to assignee_id if needed
      const taskToUpdate = {
        ...taskData,
        // If assignee is an object with an id property, use that id
        assignee_id: assignee?.id || null,
      };

      // Update task
      const { data: updatedTask, error: taskError } = await supabase
        .from("tasks")
        .update(taskToUpdate)
        .eq("id", id)
        .select()
        .single();

      if (taskError) throw taskError;

      // Update tags if provided
      if (tags !== undefined) {
        // First delete existing tags
        const { error: deleteError } = await supabase
          .from("task_tags")
          .delete()
          .eq("task_id", id);

        if (deleteError) throw deleteError;

        // Then insert new tags
        if (tags.length > 0) {
          const tagInserts = tags.map((tag: string) => ({
            task_id: id,
            tag,
          }));

          const { error: tagsError } = await supabase
            .from("task_tags")
            .insert(tagInserts);

          if (tagsError) throw tagsError;
        }
      }

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id) {
            return {
              ...task,
              ...taskData,
              tags: tags !== undefined ? tags : task.tags,
              assignee: assignee || task.assignee,
            };
          }
          return task;
        }),
      );

      return { 
        ...updatedTask, 
        tags: tags !== undefined ? tags : [], 
        assignee: assignee || {
          name: "Não atribuído",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
        },
        dueDate: updatedTask.due_date || new Date().toISOString(),
      };
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
      throw err;
    }
  }

  async function deleteTask(id: string) {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) throw error;
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
      throw err;
    }
  }

  async function addComment(taskId: string, comment: string) {
    try {
      const { data, error } = await supabase
        .from("task_comments")
        .insert({
          task_id: taskId,
          comment,
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
      throw err;
    }
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    addComment,
  };
}
