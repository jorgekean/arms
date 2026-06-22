import React from 'react';
import { Bell, User } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Header() {
  return (
    <header className="h-16 bg-white/70 dark:bg-[#060a16]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2 text-pnp-navy dark:text-blue-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 shrink-0">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="font-black text-xl tracking-widest mt-0.5">ARMS</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-pnp-navy dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors cursor-pointer outline-none">
              <div className="w-8 h-8 rounded-full bg-pnp-navy dark:bg-blue-600 text-pnp-gold flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-white leading-none">Admin User</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Superintendent</p>
              </div>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              className="min-w-[200px] bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 p-1 mt-2 z-50 animate-in fade-in zoom-in-95"
              align="end"
            >
              <DropdownMenu.Item className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-pnp-navy dark:hover:text-blue-400 cursor-pointer rounded-md">
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-pnp-navy dark:hover:text-blue-400 cursor-pointer rounded-md">
                Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
              <DropdownMenu.Item className="px-3 py-2 text-sm text-red-600 dark:text-red-400 outline-none hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer rounded-md">
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
