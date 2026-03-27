import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { Moon, Sun, Monitor, Bell, Trash2, Github, Calendar as CalendarIcon } from 'lucide-react';
import localforage from 'localforage';
import { cn } from '../lib/utils';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { notificationSettings, setNotificationSettings } = useTasks();

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
        setNotificationSettings(prev => ({ ...prev, enabled: true }));
        new Notification("Notifications enabled!", {
          body: "You'll receive study reminders here.",
          icon: '/pwa-192x192.png'
        });
      } else {
        setNotificationSettings(prev => ({ ...prev, enabled: false }));
      }
    } else {
      alert("Notifications are not supported in your browser.");
    }
  };

  const toggleNotifSetting = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto pb-6">
      <h2 className="text-2xl font-bold mb-2">Settings</h2>

      {/* Appearance */}
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
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </span>
            <div className="w-12 h-6 bg-secondary/80 rounded-full p-1 flex items-center cursor-pointer shadow-inner">
              <div className={`w-4 h-4 rounded-full bg-primary transform transition-transform shadow-sm ${theme === 'dark' ? 'translate-x-6' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-card font-bold text-sm uppercase tracking-wider text-foreground/50 flex items-center gap-2">
          <Bell className="w-4 h-4" /> Notifications
        </div>
        <div className="p-2 flex flex-col gap-1">
          {!notificationSettings.enabled ? (
            <button
              onClick={requestNotifications}
              className="w-full flex items-center gap-4 p-4 hover:bg-primary/5 rounded-xl transition-colors text-left"
            >
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Enable Browser Notifications</p>
                <p className="text-[10px] font-medium text-foreground/50">Get alerts for timers and tasks</p>
              </div>
            </button>
          ) : (
            <>
              {/* Timer Alerts */}
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary p-2 rounded-lg text-foreground/40">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">Timer Alerts</span>
                </div>
                <button
                  onClick={() => toggleNotifSetting('timer')}
                  className={cn("w-10 h-5 rounded-full transition-colors relative", notificationSettings.timer ? "bg-primary" : "bg-secondary/80")}
                >
                  <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm", notificationSettings.timer ? "left-6" : "left-1")} />
                </button>
              </div>
              {/* Task Reminders */}
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary p-2 rounded-lg text-foreground/40">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">Task Reminders</span>
                </div>
                <button
                  onClick={() => toggleNotifSetting('tasks')}
                  className={cn("w-10 h-5 rounded-full transition-colors relative", notificationSettings.tasks ? "bg-primary" : "bg-secondary/80")}
                >
                  <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm", notificationSettings.tasks ? "left-6" : "left-1")} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-card font-bold text-sm uppercase tracking-wider text-foreground/50 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Data
        </div>
        <div className="p-2">
          <button
            onClick={handleClearData}
            className="w-full flex items-center gap-4 p-4 hover:bg-red-500/5 rounded-xl transition-colors text-left"
          >
            <div className="bg-red-500/10 p-2 rounded-lg text-red-500">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-red-500">Clear All Data</p>
              <p className="text-[10px] font-medium text-red-500/50">Reset tasks, sessions and settings</p>
            </div>
          </button>
        </div>
      </div>

      <div className="text-center mt-2 text-sm text-foreground/40 font-medium">
        <p className="flex items-center justify-center gap-1.5 mb-1">
          Smart Student Planner <Github className="w-4 h-4" />
        </p>
        <p>Version 2.0.0 • React Vite PWA</p>
      </div>
    </div>
  );
}
