import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Plus, Upload } from "lucide-react";

interface AddToolDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: ToolFormData) => void;
  onCancel?: () => void;
}

interface ToolFormData {
  name: string;
  description: string;
  category: string;
  status: "active" | "maintenance";
  imageUrl?: string;
  apiEndpoint?: string;
  isPublic: boolean;
}

const AddToolDialog = ({
  open = true,
  onOpenChange = () => {},
  onSubmit = () => {},
  onCancel = () => {},
}: AddToolDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ToolFormData>({
    defaultValues: {
      name: "",
      description: "",
      category: "fast-processing",
      status: "active",
      apiEndpoint: "",
      isPublic: true,
    },
  });

  const handleSubmit = (data: ToolFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    form.reset();
    onCancel();
    onOpenChange(false);
  };

  const simulateImageUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      form.setValue(
        "imageUrl",
        "https://images.unsplash.com/photo-1677442135968-6bd241f26c68?w=300&q=80",
      );
      setIsUploading(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Add New AI Tool
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details to add a new AI tool to your collection.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Tool name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Tool Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter tool name"
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    A descriptive name for your AI tool.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this tool does"
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    Provide a clear description of the tool's capabilities.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="fast-processing">
                          Fast Processing
                        </SelectItem>
                        <SelectItem value="creative-suite">
                          Creative Suite
                        </SelectItem>
                        <SelectItem value="smart-coding">
                          Smart Coding
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-gray-500">
                      Select the most appropriate category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-gray-500">
                      Set the current operational status.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="apiEndpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    API Endpoint (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://api.example.com/v1/tool"
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    The API endpoint for this tool if available.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Tool Image</FormLabel>
                    <div className="flex items-center gap-2">
                      {field.value ? (
                        <div className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-700">
                          <img
                            src={field.value}
                            alt="Tool preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70"
                            onClick={() => form.setValue("imageUrl", "")}
                          >
                            <span className="sr-only">Remove image</span>×
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={simulateImageUpload}
                          disabled={isUploading}
                          className="h-24 w-24 border-dashed border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                        >
                          {isUploading ? (
                            <div className="flex flex-col items-center justify-center">
                              <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-white mb-1"></div>
                              <span className="text-xs">Uploading...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <Upload className="h-5 w-5 mb-1" />
                              <span className="text-xs">Upload</span>
                            </div>
                          )}
                        </Button>
                      )}
                    </div>
                    <FormDescription className="text-gray-500">
                      Upload an image to represent this tool.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-800 p-4 bg-gray-800/30">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-white">Public Tool</FormLabel>
                      <FormDescription className="text-gray-500">
                        Make this tool available to all users.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#FF6B00] hover:bg-[#FF8C3F] text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Tool
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToolDialog;
