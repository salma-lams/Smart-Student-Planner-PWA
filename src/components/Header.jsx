import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const routeTitles = {
  '/': 'Dashboard',
  '/tasks': 'My Tasks',
  '/timer': 'Focus Timer',
  '/settings': 'Settings'
};

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'Smart Planner';

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-secondary/50 px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent transform transition-all">
        {title}
      </h1>
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 active:scale-95 transition-all shadow-sm"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
      </button>
    </header>
  );
}
