// components/ui/BaseDialog.tsx
"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";

interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  showSubmitButton?: boolean;
  footer?: boolean;
  maxWidth?: number; // in px
  maxHeight?: number; // in px
}

export function BaseDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  trigger,
  className,
  onCancel,
  onSubmit,
  submitLabel = "Save",
  showSubmitButton = false,
  footer = true,
  maxWidth = 500,
  maxHeight = 600,
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn("w-full", className)}
        style={{ maxWidth: `${maxWidth}px` }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div
          style={{ maxHeight: `${maxHeight}px`, overflowY: "auto" }}
          className="py-4"
        >
          {children}
        </div>

        {footer && (
          <DialogFooter className="flex justify-end gap-2">
            <Button variant={"outline"} size="sm" onClick={onCancel}>
              Cancel
            </Button>
            {showSubmitButton && (
              <Button variant={"default"} size="sm" onClick={onSubmit}>
                {submitLabel}
              </Button>
            )}
          </DialogFooter>
        )}

        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X className="w-4 h-4" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
