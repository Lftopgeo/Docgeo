import { 
  taskRepository, 
  Task, 
  TaskCreate, 
  TaskUpdate,
  TaskComment,
  TaskAttachment
} from '@/repositories';

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    return taskRepository.getAll();
  },

  async getTaskById(id: string): Promise<Task | null> {
    return taskRepository.getById(id);
  },

  async createTask(task: TaskCreate): Promise<Task> {
    // Validar tarefa
    if (!task.title) {
      throw new Error('O título da tarefa é obrigatório');
    }

    return taskRepository.create(task);
  },

  async updateTask(id: string, task: TaskUpdate): Promise<Task> {
    // Validar tarefa
    if (task.title === '') {
      throw new Error('O título da tarefa não pode ser vazio');
    }

    return taskRepository.update(id, task);
  },

  async deleteTask(id: string): Promise<void> {
    return taskRepository.delete(id);
  },

  async updateTaskTags(taskId: string, tags: string[]): Promise<void> {
    return taskRepository.updateTags(taskId, tags);
  },

  async completeTask(id: string): Promise<Task> {
    return taskRepository.update(id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      progress: 100,
    });
  },

  async startTask(id: string): Promise<Task> {
    return taskRepository.update(id, {
      status: 'in_progress',
      progress: 0,
    });
  },

  async cancelTask(id: string): Promise<Task> {
    return taskRepository.update(id, {
      status: 'canceled',
    });
  },

  async updateTaskProgress(id: string, progress: number): Promise<Task> {
    if (progress < 0 || progress > 100) {
      throw new Error('O progresso deve estar entre 0 e 100');
    }

    return taskRepository.update(id, {
      progress,
      status: progress === 100 ? 'completed' : 'in_progress',
      completed_at: progress === 100 ? new Date().toISOString() : undefined,
    });
  },

  // Comentários
  comment: {
    async create(comment: Omit<TaskComment, "id" | "created_at" | "updated_at">): Promise<TaskComment> {
      // Validar comentário
      if (!comment.task_id) {
        throw new Error('O ID da tarefa é obrigatório');
      }

      if (!comment.comment) {
        throw new Error('O comentário é obrigatório');
      }

      return taskRepository.comment.create(comment);
    },

    async update(id: string, comment: { comment: string }): Promise<TaskComment> {
      // Validar comentário
      if (!comment.comment) {
        throw new Error('O comentário é obrigatório');
      }

      return taskRepository.comment.update(id, comment);
    },

    async delete(id: string): Promise<void> {
      return taskRepository.comment.delete(id);
    },
  },

  // Anexos
  attachment: {
    async create(attachment: Omit<TaskAttachment, "id" | "created_at">): Promise<TaskAttachment> {
      // Validar anexo
      if (!attachment.task_id) {
        throw new Error('O ID da tarefa é obrigatório');
      }

      if (!attachment.file_name) {
        throw new Error('O nome do arquivo é obrigatório');
      }

      if (!attachment.file_url) {
        throw new Error('A URL do arquivo é obrigatória');
      }

      return taskRepository.attachment.create(attachment);
    },

    async delete(id: string): Promise<void> {
      return taskRepository.attachment.delete(id);
    },
  },

  // Métodos para o servidor
  server: {
    async getAllTasks() {
      return taskRepository.server.getAll();
    },

    async getTaskById(id: string) {
      return taskRepository.server.getById(id);
    },

    async createTask(task: TaskCreate) {
      // Validar tarefa
      if (!task.title) {
        throw new Error('O título da tarefa é obrigatório');
      }

      return taskRepository.server.create(task);
    },

    async updateTask(id: string, task: TaskUpdate) {
      // Validar tarefa
      if (task.title === '') {
        throw new Error('O título da tarefa não pode ser vazio');
      }

      return taskRepository.server.update(id, task);
    },

    async deleteTask(id: string) {
      return taskRepository.server.delete(id);
    },

    async completeTask(id: string) {
      return taskRepository.server.update(id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress: 100,
      });
    },

    async startTask(id: string) {
      return taskRepository.server.update(id, {
        status: 'in_progress',
        progress: 0,
      });
    },

    async cancelTask(id: string) {
      return taskRepository.server.update(id, {
        status: 'canceled',
      });
    },

    async updateTaskProgress(id: string, progress: number) {
      if (progress < 0 || progress > 100) {
        throw new Error('O progresso deve estar entre 0 e 100');
      }

      return taskRepository.server.update(id, {
        progress,
        status: progress === 100 ? 'completed' : 'in_progress',
        completed_at: progress === 100 ? new Date().toISOString() : undefined,
      });
    },
  },
}; 