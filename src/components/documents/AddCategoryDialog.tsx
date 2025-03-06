import React from "react";
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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Folder, Plus } from "lucide-react";

interface AddCategoryDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: { name: string }) => void;
  isDarkMode?: boolean;
}

const AddCategoryDialog = ({
  open = false,
  onOpenChange = () => {},
  onSubmit = () => {},
  isDarkMode = true,
}: AddCategoryDialogProps) => {
  const form = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (data: { name: string }) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[425px] ${isDarkMode ? "bg-black border-blue-700" : "bg-white border-[#B0BEC5]"}`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Folder className="h-5 w-5 text-blue-400" />
            Add New Category
          </DialogTitle>
          <DialogDescription className="text-white">
            Create a new category to organize your documents.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Category name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      {...field}
                      className={
                        isDarkMode
                          ? "bg-[#0F172A] border-blue-700"
                          : "bg-white border-[#B0BEC5]"
                      }
                    />
                  </FormControl>
                  <FormDescription
                    className={isDarkMode ? "text-white" : "text-[#757575]"}
                  >
                    Choose a descriptive name for your category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                className={isDarkMode ? "border-blue-700" : "border-[#B0BEC5]"}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#FF6B00] hover:bg-[#FF8C3F] text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
