import React, { useState } from "react";
import TasksFilter from "./TasksFilter";
import TasksGrid from "./TasksGrid";
import TaskStatusTabs from "./TaskStatusTabs";
import AddTaskDialog from "./AddTaskDialog";
import TaskDetailsDialog from "./TaskDetailsDialog";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
  };
  tags: string[];
  createdAt: string;
}

interface TasksOverviewProps {
  tasks?: Task[];
  onTaskAdd?: (task: Omit<Task, "id">) => void;
  onTaskEdit?: (id: string, updates: Partial<Task>) => void;
  onTaskDelete?: (id: string) => void;
  isDarkMode?: boolean;
}

const TasksOverview = ({
  tasks = [
    {
      id: "task-1",
      title: "Implement AI Assistant Integration",
      description:
        "Connect the AI Assistant API to the dashboard and implement basic query functionality.",
      status: "in-progress",
      priority: "high",
      dueDate: "2023-07-15",
      assignee: {
        name: "Alex Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      },
      tags: ["AI", "Integration", "API"],
      createdAt: "2023-06-28",
    },
    {
      id: "task-2",
      title: "Design User Onboarding Flow",
      description:
        "Create wireframes and mockups for the new user onboarding experience.",
      status: "todo",
      priority: "medium",
      dueDate: "2023-07-20",
      assignee: {
        name: "Sarah Miller",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      tags: ["Design", "UX", "Onboarding"],
      createdAt: "2023-07-01",
    },
    {
      id: "task-3",
      title: "Fix Authentication Bug",
      description:
        "Resolve the issue with token refresh causing occasional logouts.",
      status: "completed",
      priority: "urgent",
      dueDate: "2023-07-05",
      assignee: {
        name: "Michael Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
      tags: ["Bug", "Authentication", "Security"],
      createdAt: "2023-06-25",
    },
    {
      id: "task-4",
      title: "Optimize Image Processing Pipeline",
      description:
        "Improve performance of the image processing service to handle larger volumes.",
      status: "blocked",
      priority: "high",
      dueDate: "2023-07-18",
      assignee: {
        name: "Jessica Lee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
      },
      tags: ["Performance", "Optimization", "Images"],
      createdAt: "2023-06-30",
    },
    {
      id: "task-5",
      title: "Update Documentation",
      description:
        "Update the API documentation with new endpoints and examples.",
      status: "todo",
      priority: "low",
      dueDate: "2023-07-25",
      assignee: {
        name: "David Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      },
      tags: ["Documentation", "API"],
      createdAt: "2023-07-02",
    },
    {
      id: "task-6",
      title: "Implement Dark Mode",
      description: "Add dark mode support to the dashboard and all components.",
      status: "in-progress",
      priority: "medium",
      dueDate: "2023-07-22",
      assignee: {
        name: "Emily Rodriguez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      },
      tags: ["UI", "Theme", "Accessibility"],
      createdAt: "2023-06-29",
    },
  ],
  onTaskAdd = () => {},
  onTaskEdit = () => {},
  onTaskDelete = () => {},
  isDarkMode = true,
}: TasksOverviewProps) => {
  // State for filtering and viewing tasks
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Filter tasks based on search query, status, priority, and tag
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || task.status === selectedStatus;

    const matchesPriority =
      selectedPriority === "all" || task.priority === selectedPriority;

    const matchesTag = selectedTag === "all" || task.tags.includes(selectedTag);

    return matchesSearch && matchesStatus && matchesPriority && matchesTag;
  });

  // Get the selected task details
  const selectedTask = selectedTaskId
    ? tasks.find((task) => task.id === selectedTaskId)
    : null;

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(priority);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleAddNewTask = () => {
    setIsAddTaskDialogOpen(true);
  };

  const handleTaskClick = (id: string) => {
    setSelectedTaskId(id);
  };

  const handleCloseTaskDetails = () => {
    setSelectedTaskId(null);
  };

  const handleCloseAddTaskDialog = () => {
    setIsAddTaskDialogOpen(false);
  };

  const handleTaskSubmit = (task: Omit<Task, "id">) => {
    // Adicionar a nova tarefa ao estado local
    const newTask = {
      ...task,
      id: `task-${tasks.length + 1}`,
    };

    // Chamar o callback para adicionar a tarefa
    onTaskAdd(task);

    // Atualizar o estado local
    tasks.push(newTask);

    // Fechar o diálogo
    setIsAddTaskDialogOpen(false);
  };

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags)));

  // Count tasks by status
  const taskCounts = {
    all: tasks.length,
    todo: tasks.filter((task) => task.status === "todo").length,
    "in-progress": tasks.filter((task) => task.status === "in-progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    blocked: tasks.filter((task) => task.status === "blocked").length,
  };

  return (
    <div
      className={`w-full h-full flex flex-col ${isDarkMode ? "bg-[#0F172A]" : "bg-[#FAFAFA]"}`}
    >
      {/* Filter bar */}
      <TasksFilter
        onSearch={handleSearch}
        onPriorityChange={handlePriorityChange}
        onTagChange={handleTagChange}
        onAddNewTask={handleAddNewTask}
        searchQuery={searchQuery}
        selectedPriority={selectedPriority}
        selectedTag={selectedTag}
        availableTags={allTags}
        isDarkMode={isDarkMode}
      />
      {/* Status tabs */}
      <TaskStatusTabs
        activeStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        taskCounts={taskCounts}
        isDarkMode={isDarkMode}
      />
      {/* Tasks grid */}
      <div className="flex-1 overflow-auto p-4 w-[90]">
        <TasksGrid
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onTaskEdit={(id) => {
            setSelectedTaskId(id);
          }}
          onTaskDelete={onTaskDelete}
          isDarkMode={isDarkMode}
        />
      </div>
      {/* Add Task Dialog */}
      <AddTaskDialog
        open={isAddTaskDialogOpen}
        onOpenChange={setIsAddTaskDialogOpen}
        onSubmit={handleTaskSubmit}
        onCancel={handleCloseAddTaskDialog}
        availableTags={allTags}
      />
      {/* Task Details Dialog */}
      {selectedTask && (
        <TaskDetailsDialog
          open={!!selectedTaskId}
          onOpenChange={(open) => {
            if (!open) setSelectedTaskId(null);
          }}
          task={selectedTask}
          onEdit={(id, updates) => {
            onTaskEdit(id, updates);
            setSelectedTaskId(null);
          }}
          onDelete={(id) => {
            onTaskDelete(id);
            setSelectedTaskId(null);
          }}
          availableTags={allTags}
        />
      )}
    </div>
  );
};

export default TasksOverview;
