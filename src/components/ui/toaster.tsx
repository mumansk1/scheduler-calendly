'use client';

import React from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';

export function Toaster() {
  const { toasts = [], dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, onOpenChange, open, ...props }) => {
        return (
          <Toast
            key={id}
            {...props}
            open={open ?? true}
            onOpenChange={(isOpen) => {
              // Let the hook manage dismissal when the toast is closed.
              if (!isOpen) {
                dismiss?.(id);
              }
              // Call any provided onOpenChange handler from the toast payload as well.
              if (typeof onOpenChange === 'function') {
                try {
                  onOpenChange(isOpen);
                } catch (err) {
                  // swallow errors from user-provided handlers
                  // (optional: you can log if desired)
                }
              }
            }}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>

            {action}

            <ToastClose aria-label="Close" />
          </Toast>
        );
      })}

      <ToastViewport />
    </ToastProvider>
  );
}