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
    <aside className={`bg-pnp-navy dark:bg-[#060a16] text-white transition-all duration-300 flex flex-col shrink-0 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className={`h-16 flex items-center px-4 border-b border-white/10 shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 text-pnp-gold">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 shrink-0">
              <path d="M4 8h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3v5a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-6H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zm14 2h-2v2h2v-2z" />
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
