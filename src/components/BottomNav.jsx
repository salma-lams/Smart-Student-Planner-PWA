import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Timer, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export function BottomNav() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dash' },
    { to: '/tasks', icon: ListTodo, label: 'Tasks' },
    { to: '/timer', icon: Timer, label: 'Focus' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-background/80 backdrop-blur-md border-t border-secondary z-50">
      <ul className="flex justify-around items-center p-2 max-w-md mx-auto">
        {navItems.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ease-out",
                isActive 
                  ? "text-primary scale-110 font-semibold" 
                  : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              )}
            >
              <item.icon className={cn("w-6 h-6 mb-1 transition-transform", "active:scale-95")} strokeWidth={2.5} />
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
