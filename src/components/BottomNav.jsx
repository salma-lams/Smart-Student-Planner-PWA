import { Home, ListTodo, Timer as TimerIcon, Settings as SettingsIcon, BarChart3 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/tasks', icon: ListTodo, label: 'Tasks' },
    { to: '/timer', icon: TimerIcon, label: 'Focus' },
    { to: '/stats', icon: BarChart3, label: 'Insights' },
    { to: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4">
      <div className="max-w-md mx-auto bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl flex items-center justify-between px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 p-2 transition-all duration-300 relative group",
                isActive ? "text-primary scale-110" : "text-foreground/40 hover:text-foreground/70"
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn(
                    "w-6 h-6 transition-all duration-500",
                    isActive && "animate-bounce-slow"
                  )} />
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-tighter transition-all duration-300",
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                  )}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
