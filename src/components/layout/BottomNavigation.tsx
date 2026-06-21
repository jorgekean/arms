import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Server, Users, ShieldAlert, Menu, FileText, Settings, Moon, Sun } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useThemeStore } from '../../store/useThemeStore';

export function BottomNavigation() {
  const { theme, toggleTheme } = useThemeStore();

  const mainLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Registry', icon: Server, path: '/registry' },
    { name: 'Personnel', icon: Users, path: '/personnel' },
    { name: 'Operations', icon: ShieldAlert, path: '/operations' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#060a16] border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-16 px-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      {mainLinks.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                isActive
                  ? 'text-pnp-navy dark:text-pnp-gold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
          </NavLink>
        );
      })}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="flex flex-col items-center justify-center w-16 h-full gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors outline-none cursor-pointer">
          <Menu size={20} />
          <span className="text-[10px] font-medium tracking-wide">Manage</span>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[180px] bg-white dark:bg-slate-800 rounded-xl p-1 shadow-lg border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 z-50 mb-2 mr-2"
            sideOffset={5}
            align="end"
          >
            <DropdownMenu.Item className="outline-none">
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-700 text-pnp-navy dark:text-pnp-gold font-medium'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`
                }
              >
                <FileText size={16} /> Reports
              </NavLink>
            </DropdownMenu.Item>
            
            <DropdownMenu.Item className="outline-none">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-700 text-pnp-navy dark:text-pnp-gold font-medium'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`
                }
              >
                <Settings size={16} /> Settings
              </NavLink>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1 mx-2" />

            <DropdownMenu.Item 
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer outline-none w-full text-left"
            >
              {theme === 'light' ? (
                <>
                  <Moon size={16} /> Dark Mode
                </>
              ) : (
                <>
                  <Sun size={16} className="text-pnp-gold" /> Light Mode
                </>
              )}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
