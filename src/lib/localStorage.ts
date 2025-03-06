// Type definitions for stored data
export interface Tool {
  id: string;
  name: string;
  description: string;
  status: "active" | "maintenance";
  category: string;
  lastUpdated: string;
  imageUrl: string;
  apiEndpoint?: string;
  documentation?: string;
  isPublic?: boolean;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  lastUpdated: string;
  fileType: string;
  fileSize: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

export interface Task {
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

// Default data
const defaultTools: Tool[] = [
  {
    id: "tool-1",
    name: "AI Assistant",
    description:
      "Powerful AI assistant for answering questions and completing tasks with natural language processing capabilities.",
    status: "active",
    category: "Fast Processing",
    lastUpdated: "2 days ago",
    imageUrl:
      "https://images.unsplash.com/photo-1677442135968-6bd241f26c68?w=300&q=80",
  },
  {
    id: "tool-2",
    name: "Image Generator",
    description:
      "Create stunning images from text descriptions using advanced AI models.",
    status: "active",
    category: "Creative Suite",
    lastUpdated: "1 week ago",
    imageUrl:
      "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=300&q=80",
  },
  {
    id: "tool-3",
    name: "Code Analyzer",
    description:
      "Analyze and optimize your code with AI-powered suggestions and bug detection.",
    status: "maintenance",
    category: "Smart Coding",
    lastUpdated: "3 days ago",
    imageUrl:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300&q=80",
  },
  {
    id: "tool-4",
    name: "Data Visualizer",
    description:
      "Transform complex data into intuitive visualizations with AI assistance.",
    status: "active",
    category: "Fast Processing",
    lastUpdated: "5 days ago",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=80",
  },
  {
    id: "tool-5",
    name: "Content Writer",
    description:
      "Generate high-quality content for blogs, articles, and marketing materials.",
    status: "active",
    category: "Creative Suite",
    lastUpdated: "2 weeks ago",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&q=80",
  },
  {
    id: "tool-6",
    name: "Voice Transcriber",
    description:
      "Convert audio to text with high accuracy using advanced speech recognition.",
    status: "maintenance",
    category: "Fast Processing",
    lastUpdated: "1 day ago",
    imageUrl:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&q=80",
  },
];

const defaultDocuments: Document[] = [
  {
    id: "doc-1",
    title: "Project Requirements",
    description: "Detailed requirements for the AI assistant project",
    category: "Projects",
    subcategory: "Requirements",
    lastUpdated: "2 days ago",
    fileType: "PDF",
    fileSize: "2.4 MB",
  },
  {
    id: "doc-2",
    title: "User Research",
    description: "User research findings for the new dashboard",
    category: "Research",
    subcategory: "User Studies",
    lastUpdated: "1 week ago",
    fileType: "DOCX",
    fileSize: "1.8 MB",
  },
  {
    id: "doc-3",
    title: "API Documentation",
    description: "Complete API documentation for the platform",
    category: "Technical",
    subcategory: "API",
    lastUpdated: "3 days ago",
    fileType: "HTML",
    fileSize: "5.2 MB",
  },
  {
    id: "doc-4",
    title: "Marketing Plan",
    description: "Q3 marketing strategy and execution plan",
    category: "Marketing",
    subcategory: "Strategy",
    lastUpdated: "5 days ago",
    fileType: "PPTX",
    fileSize: "4.7 MB",
  },
];

const defaultCategories: Category[] = [
  {
    id: "cat-1",
    name: "Projects",
    subcategories: [
      { id: "subcat-1", name: "Requirements" },
      { id: "subcat-2", name: "Proposals" },
      { id: "subcat-3", name: "Timelines" },
    ],
  },
  {
    id: "cat-2",
    name: "Research",
    subcategories: [
      { id: "subcat-4", name: "User Studies" },
      { id: "subcat-5", name: "Market Analysis" },
      { id: "subcat-6", name: "Competitive Research" },
    ],
  },
  {
    id: "cat-3",
    name: "Technical",
    subcategories: [
      { id: "subcat-7", name: "API" },
      { id: "subcat-8", name: "Architecture" },
      { id: "subcat-9", name: "Security" },
    ],
  },
  {
    id: "cat-4",
    name: "Marketing",
    subcategories: [
      { id: "subcat-10", name: "Strategy" },
      { id: "subcat-11", name: "Content" },
      { id: "subcat-12", name: "Analytics" },
    ],
  },
];

const defaultTasks: Task[] = [
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
];

// Storage keys
const TOOLS_STORAGE_KEY = "ai_tools_dashboard_tools";
const DOCUMENTS_STORAGE_KEY = "ai_tools_dashboard_documents";
const CATEGORIES_STORAGE_KEY = "ai_tools_dashboard_categories";
const TASKS_STORAGE_KEY = "ai_tools_dashboard_tasks";
const THEME_STORAGE_KEY = "ai_tools_dashboard_theme";

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
};

// Storage functions
export const getTools = (): Tool[] => {
  const storedTools = safeLocalStorage.getItem(TOOLS_STORAGE_KEY);
  return storedTools ? JSON.parse(storedTools) : defaultTools;
};

export const saveTools = (tools: Tool[]): void => {
  safeLocalStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(tools));
};

export const getDocuments = (): Document[] => {
  const storedDocuments = safeLocalStorage.getItem(DOCUMENTS_STORAGE_KEY);
  return storedDocuments ? JSON.parse(storedDocuments) : defaultDocuments;
};

export const saveDocuments = (documents: Document[]): void => {
  safeLocalStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
};

export const getCategories = (): Category[] => {
  const storedCategories = safeLocalStorage.getItem(CATEGORIES_STORAGE_KEY);
  return storedCategories ? JSON.parse(storedCategories) : defaultCategories;
};

export const saveCategories = (categories: Category[]): void => {
  safeLocalStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
};

export const getTasks = (): Task[] => {
  const storedTasks = safeLocalStorage.getItem(TASKS_STORAGE_KEY);
  return storedTasks ? JSON.parse(storedTasks) : defaultTasks;
};

export const saveTasks = (tasks: Task[]): void => {
  safeLocalStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

export const getThemePreference = (): boolean => {
  const storedTheme = safeLocalStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme ? JSON.parse(storedTheme) : true; // Default to dark mode
};

export const saveThemePreference = (isDarkMode: boolean): void => {
  safeLocalStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkMode));
};
