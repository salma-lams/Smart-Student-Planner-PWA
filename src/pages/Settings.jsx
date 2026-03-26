import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Monitor, Bell, Trash2, Github, Smartphone } from 'lucide-react';
import localforage from 'localforage';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  const handleClearData = async () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      await localforage.clear();
      window.location.reload();
    }
  };

  const requestNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification("Notifications enabled!", {
          body: "You'll receive study reminders here.",
          icon: '/pwa-192x192.png'
        });
      }
    } else {
      alert("Notifications are not supported in your browser.");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto pb-6">
      <h2 className="text-2xl font-bold mb-2">Settings</h2>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-card font-bold text-sm uppercase tracking-wider text-foreground/50 flex items-center gap-2">
          <Monitor className="w-4 h-4" /> Appearance
        </div>
        
        <div className="p-2">
          <button 
            onClick={toggleTheme}
            className="w-full flex justify-between items-center p-4 hover:bg-secondary rounded-xl transition-colors text-left font-semibold text-foreground/80"
          >
            <span className="flex items-center gap-3">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-foreground/50" /> : <Moon className="w-5 h-5 text-foreground/50" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
            <div className="w-12 h-6 bg-secondary/80 rounded-full p-1 flex items-center cursor-pointer shadow-inner">
              <div className={`w-4 h-4 rounded-full bg-primary transform transition-transform shadow-sm ${theme === 'dark' ? 'translate-x-6' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-card font-bold text-sm uppercase tracking-wider text-foreground/50 flex items-center gap-2">
          <Smartphone className="w-4 h-4" /> App Settings
        </div>
        
        <div className="p-2 flex flex-col gap-1">
          <button 
            onClick={requestNotifications}
            className="w-full flex justify-between items-center p-4 hover:bg-secondary rounded-xl transition-colors text-left font-semibold text-foreground/80"
          >
            <span className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-foreground/50" />
              Enable Notifications
            </span>
          </button>
          
          <button 
            onClick={handleClearData}
            className="w-full flex justify-between items-center p-4 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors text-left font-semibold text-red-500/80"
          >
            <span className="flex items-center gap-3">
              <Trash2 className="w-5 h-5" />
              Clear All Data
            </span>
          </button>
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-foreground/40 font-medium">
        <p className="flex items-center justify-center gap-1.5 mb-1">
          Smart Student Planner <Github className="w-4 h-4" />
        </p>
        <p>Version 1.0.0 • React Vite PWA</p>
      </div>
    </div>
  );
}
