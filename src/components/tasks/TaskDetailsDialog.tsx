import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "../../lib/utils";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  History,
  Plus,
  X,
  Save,
} from "lucide-react";

interface TaskDetailsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  task?: {
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
  };
  onEdit?: (id: string, updates: any) => void;
  onDelete?: (id: string) => void;
  availableTags?: string[];
}

const TaskDetailsDialog = ({
  open = false,
  onOpenChange = () => {},
  task = {
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
  onEdit = () => {},
  onDelete = () => {},
  availableTags = [],
}: TaskDetailsDialogProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [newTag, setNewTag] = useState("");

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "todo":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "bg-blue-600",
          label: "To Do",
        };
      case "in-progress":
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "bg-yellow-600",
          label: "In Progress",
        };
      case "completed":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-600",
          label: "Completed",
        };
      case "blocked":
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: "bg-red-600",
          label: "Blocked",
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "bg-gray-600",
          label: "Unknown",
        };
    }
  };

  // Function to get priority color and label
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case "low":
        return { color: "bg-green-600", label: "Low" };
      case "medium":
        return { color: "bg-blue-600", label: "Medium" };
      case "high":
        return { color: "bg-orange-600", label: "High" };
      case "urgent":
        return { color: "bg-red-600", label: "Urgent" };
      default:
        return { color: "bg-gray-600", label: "Unknown" };
    }
  };

  const statusInfo = getStatusInfo(task.status);
  const priorityInfo = getPriorityInfo(task.priority);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTask(task);
  };

  const handleSaveClick = () => {
    onEdit(task.id, editedTask);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTask(task);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedTask({
      ...editedTask,
      [field]: value,
    });
  };

  const handleAssigneeChange = (name: string) => {
    setEditedTask({
      ...editedTask,
      assignee: {
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      },
    });
  };

  const handleAddTag = () => {
    if (newTag && !editedTask.tags.includes(newTag)) {
      setEditedTask({
        ...editedTask,
        tags: [...editedTask.tags, newTag],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags.filter((t) => t !== tag),
    });
  };

  const handleSelectExistingTag = (tag: string) => {
    if (!editedTask.tags.includes(tag)) {
      setEditedTask({
        ...editedTask,
        tags: [...editedTask.tags, tag],
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              {isEditing ? (
                <Input
                  value={editedTask.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="text-xl font-bold bg-gray-800 border-gray-700 text-white"
                />
              ) : (
                <DialogTitle className="text-2xl font-bold">
                  {task.title}
                </DialogTitle>
              )}
              <DialogDescription className="text-gray-400 flex items-center gap-2 mt-1">
                <span>Created on {formatDate(task.createdAt)}</span>
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="border-gray-700 text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveClick}
                    className="bg-[#FF6B00] hover:bg-[#FF8C3F] text-white"
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Badge className={`${statusInfo.color} px-3 py-1`}>
                    <span className="flex items-center gap-1">
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                  </Badge>
                  <Badge className={`${priorityInfo.color} px-3 py-1`}>
                    {priorityInfo.label}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <Tabs
            defaultValue="details"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start border-b border-gray-800 bg-transparent p-0 h-12">
              <TabsTrigger
                value="details"
                className={cn(
                  "data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B00] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12",
                  "px-6",
                )}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className={cn(
                  "data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B00] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12",
                  "px-6",
                )}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Comments
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className={cn(
                  "data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B00] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12",
                  "px-6",
                )}
              >
                <History className="mr-2 h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-white">
                      Description
                    </h3>
                    {isEditing ? (
                      <Textarea
                        value={editedTask.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="bg-gray-800 border-gray-700 text-white min-h-[150px]"
                      />
                    ) : (
                      <p className="text-gray-300">{task.description}</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2 text-white">
                      Tags
                    </h3>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editedTask.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-blue-900/30 text-blue-400 border-blue-700 flex items-center gap-1"
                            >
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddTag}
                            className="border-gray-700 text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {availableTags.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">
                              Existing tags:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {availableTags
                                .filter((tag) => !editedTask.tags.includes(tag))
                                .map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="bg-gray-800 text-gray-300 border-gray-700 cursor-pointer hover:bg-gray-700"
                                    onClick={() => handleSelectExistingTag(tag)}
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-blue-900/30 text-blue-400 border-blue-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3 text-white">
                      Task Details
                    </h3>
                    <div className="space-y-4">
                      {isEditing ? (
                        <>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Status</p>
                            <Select
                              value={editedTask.status}
                              onValueChange={(value) =>
                                handleInputChange("status", value)
                              }
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in-progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                                <SelectItem value="blocked">Blocked</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">
                              Priority
                            </p>
                            <Select
                              value={editedTask.priority}
                              onValueChange={(value) =>
                                handleInputChange("priority", value)
                              }
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">
                              Due Date
                            </p>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="date"
                                value={editedTask.dueDate}
                                onChange={(e) =>
                                  handleInputChange("dueDate", e.target.value)
                                }
                                className="bg-gray-800 border-gray-700 text-white pl-10"
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">
                              Assignee
                            </p>
                            <Select
                              value={editedTask.assignee.name}
                              onValueChange={handleAssigneeChange}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                <SelectItem value="Alex Johnson">
                                  Alex Johnson
                                </SelectItem>
                                <SelectItem value="Sarah Miller">
                                  Sarah Miller
                                </SelectItem>
                                <SelectItem value="Michael Chen">
                                  Michael Chen
                                </SelectItem>
                                <SelectItem value="Jessica Lee">
                                  Jessica Lee
                                </SelectItem>
                                <SelectItem value="David Wilson">
                                  David Wilson
                                </SelectItem>
                                <SelectItem value="Emily Rodriguez">
                                  Emily Rodriguez
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-center">
                            <p className="text-gray-300">Status</p>
                            <Badge className={`${statusInfo.color}`}>
                              <span className="flex items-center gap-1">
                                {statusInfo.icon}
                                {statusInfo.label}
                              </span>
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-gray-300">Priority</p>
                            <Badge className={`${priorityInfo.color}`}>
                              {priorityInfo.label}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-gray-300">Due Date</p>
                            <p className="text-gray-300 flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(task.dueDate)}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-gray-300">Assignee</p>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={task.assignee.avatar}
                                  alt={task.assignee.name}
                                />
                                <AvatarFallback>
                                  {task.assignee.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-gray-300">
                                {task.assignee.name}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="p-6">
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3 text-white">
                    Comments
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                          alt="Sarah Miller"
                        />
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">Sarah Miller</p>
                          <p className="text-xs text-gray-400">2 days ago</p>
                        </div>
                        <p className="text-gray-300 mt-1">
                          I've started working on the API integration. Should be
                          ready for testing by tomorrow.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
                          alt="Michael Chen"
                        />
                        <AvatarFallback>MC</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">Michael Chen</p>
                          <p className="text-xs text-gray-400">1 day ago</p>
                        </div>
                        <p className="text-gray-300 mt-1">
                          I've reviewed the API documentation. Let me know if
                          you need any help with the implementation.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Textarea
                      placeholder="Add a comment..."
                      className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                    />
                    <div className="flex justify-end mt-2">
                      <Button className="bg-[#FF6B00] hover:bg-[#FF8C3F] text-white">
                        <MessageSquare className="mr-2 h-4 w-4" /> Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="p-6">
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3 text-white">
                    Activity History
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-900/30 flex items-center justify-center">
                        <Plus className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">Task Created</p>
                          <p className="text-xs text-gray-400">
                            {formatDate(task.createdAt)}
                          </p>
                        </div>
                        <p className="text-gray-300 mt-1">
                          Alex Johnson created this task
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-yellow-900/30 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">
                            Status Updated
                          </p>
                          <p className="text-xs text-gray-400">3 days ago</p>
                        </div>
                        <p className="text-gray-300 mt-1">
                          Status changed from{" "}
                          <Badge className="bg-blue-600 ml-1 mr-1">To Do</Badge>{" "}
                          to{" "}
                          <Badge className="bg-yellow-600 ml-1">
                            In Progress
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-900/30 flex items-center justify-center">
                        <Edit className="h-4 w-4 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">
                            Description Updated
                          </p>
                          <p className="text-xs text-gray-400">2 days ago</p>
                        </div>
                        <p className="text-gray-300 mt-1">
                          Alex Johnson updated the task description
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="border-t border-gray-800 pt-4 mt-4">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-white"
            >
              Close
            </Button>
            <div className="flex gap-2">
              {!isEditing && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => onDelete(task.id)}
                    className="border-red-700 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                  <Button
                    onClick={handleEditClick}
                    className="bg-[#FF6B00] hover:bg-[#FF8C3F] text-white"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit Task
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
