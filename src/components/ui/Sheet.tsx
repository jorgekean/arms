import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, title, children }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/10 dark:bg-black/50 backdrop-blur-sm z-50 transition-all duration-300" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl shadow-2xl border-l border-white/20 dark:border-white/5 p-6 flex flex-col focus:outline-none overflow-y-auto animate-slide-in-right">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100/50 dark:border-slate-800/50">
            <Dialog.Title className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
