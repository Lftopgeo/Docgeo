"use client"

import React, { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

interface ConfirmDeleteDialogProps {
  title?: string
  description?: string
  itemName?: string
  itemType?: string
  onConfirm: () => void
  trigger?: React.ReactNode
  isDarkMode?: boolean
}

export function ConfirmDeleteDialog({
  title = "Confirmar exclusão",
  description = "Esta ação não pode ser desfeita. O item será permanentemente removido.",
  itemName = "este item",
  itemType = "item",
  onConfirm,
  trigger,
  isDarkMode = true,
}: ConfirmDeleteDialogProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <div onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}>
          {trigger}
        </div>
      )}
      <AlertDialogContent className={isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}>
        <AlertDialogHeader>
          <AlertDialogTitle className={isDarkMode ? "text-white" : "text-gray-900"}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
            {description}
            <div className="mt-2 font-medium">
              Tem certeza que deseja excluir <span className="font-bold text-destructive">{itemName}</span>?
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className={isDarkMode ? "bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-700" : "bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-300"}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir {itemType}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 