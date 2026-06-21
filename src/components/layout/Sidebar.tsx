import React from 'react';
import { LayoutDashboard, ShieldAlert, FileText, Settings, Menu, Server, Sun, Moon, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (val: boolean) => void }) {
  const { theme, toggleTheme } = useThemeStore();
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Registry', icon: Server, path: '/registry' },
    { name: 'Personnel', icon: Users, path: '/personnel' },
    { name: 'Operations', icon: ShieldAlert, path: '/operations' },
    { name: 'Reports', icon: FileText, path: '/reports' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className={`bg-pnp-navy dark:bg-[#060a16] text-white transition-all duration-300 hidden md:flex flex-col shrink-0 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className={`h-16 flex items-center px-4 border-b border-white/10 shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 text-pnp-gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 shrink-0">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="font-black text-2xl tracking-widest whitespace-nowrap overflow-hidden mt-1">ARMS</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-white/10 rounded-md transition-colors text-white shrink-0 cursor-pointer">
          <Menu size={20} />
        </button>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group ${isActive ? 'bg-white/15 dark:bg-[#10182b] backdrop-blur-md text-pnp-gold shadow-sm' : 'hover:bg-white/10 dark:hover:bg-[#10182b] hover:backdrop-blur-sm hover:text-pnp-gold'}`}
                >
                  <Icon size={20} className="shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap overflow-hidden">{item.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10 shrink-0 flex flex-col gap-4">
        <button 
          onClick={toggleTheme}
          className={`flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-white/10 text-white ${collapsed ? 'justify-center' : 'w-full'}`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} className="shrink-0" /> : <Sun size={20} className="shrink-0 text-pnp-gold" />}
          {!collapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden">Dark Mode</span>}
        </button>
        {!collapsed && (
          <div className="text-xs text-white/50 text-center whitespace-nowrap overflow-hidden">
            Camp Crame Admin
          </div>
        )}
      </div>
    </aside>
  );
}
