'use client';

import React, { useState, useEffect } from "react";
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
import { FolderOpen, Plus } from "lucide-react";

interface AddSubcategoryDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: { name: string }) => void;
  categoryName: string;
  isDarkMode?: boolean;
}

const AddSubcategoryDialog = ({
  open = false,
  onOpenChange = () => {},
  onSubmit = () => {},
  categoryName = "",
  isDarkMode = true,
}: AddSubcategoryDialogProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (data: { name: string }) => {
    onSubmit(data);
    form.reset();
  };

  if (!mounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[425px] ${isDarkMode ? "bg-black border-blue-700" : "bg-white border-[#B0BEC5]"}`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-blue-400" />
            Add New Subcategory
          </DialogTitle>
          <DialogDescription className="text-white">
            Create a new subcategory in{" "}
            <span className="font-medium text-blue-400">{categoryName}</span> to
            further organize your documents.
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
              rules={{ required: "Subcategory name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter subcategory name"
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
                    Choose a descriptive name for your subcategory.
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
                <Plus className="mr-2 h-4 w-4" /> Add Subcategory
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubcategoryDialog;
