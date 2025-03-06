import React from "react";
import TaskCard from "./TaskCard";

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

interface TasksGridProps {
  tasks: Task[];
  onTaskClick?: (id: string) => void;
  onTaskEdit?: (id: string) => void;
  onTaskDelete?: (id: string) => void;
  isDarkMode?: boolean;
}

const TasksGrid = ({
  tasks,
  onTaskClick = () => {},
  onTaskEdit = () => {},
  onTaskDelete = () => {},
  isDarkMode = true,
}: TasksGridProps) => {
  return (
    <div
      className={
        `p-8 rounded-lg w-full ${isDarkMode ? "bg-black" : "bg-[#FAFAFA]"}` +
        " w-[304] h-56"
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-16 gap-y-14 justify-items-center h-0">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            status={task.status}
            priority={task.priority}
            dueDate={task.dueDate}
            assignee={task.assignee}
            tags={task.tags}
            isDarkMode={isDarkMode}
            onClick={() => onTaskClick(task.id)}
            onEdit={() => onTaskEdit(task.id)}
            onDelete={() => onTaskDelete(task.id)}
          />
        ))}
      </div>
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p
            className={`text-xl mb-4 ${isDarkMode ? "text-white" : "text-[#212121]"}`}
          >
            No tasks found
          </p>
          <p className={isDarkMode ? "text-white" : "text-[#212121]"}>
            Try adjusting your filters or add a new task to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default TasksGrid;
