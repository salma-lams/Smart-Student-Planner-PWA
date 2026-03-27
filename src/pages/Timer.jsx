import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTasks } from '../context/TaskContext';

const MODES = {
  FOCUS: { mode: 'focus', minutes: 25, label: 'Focus Time', icon: Brain, color: 'text-primary' },
  BREAK: { mode: 'break', minutes: 5, label: 'Short Break', icon: Coffee, color: 'text-green-500' }
};

export default function Timer() {
  const { addSession, notificationSettings } = useTasks();
  const [currentMode, setCurrentMode] = useState(MODES.FOCUS);
  const [timeLeft, setTimeLeft] = useState(MODES.FOCUS.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      
      if (currentMode.mode === 'focus') {
        addSession({ duration: currentMode.minutes });
      }

      if (notificationSettings.enabled && notificationSettings.timer && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(`${currentMode.label} Finished!`, {
          body: currentMode.mode === 'focus' ? 'Time for a break.' : 'Time to focus again.',
          icon: '/pwa-192x192.png'
        });
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentMode.label, currentMode.mode, currentMode.minutes, addSession, notificationSettings]);

  const toggleTimer = () => {
    if (!isRunning && 'Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    setIsRunning(!isRunning);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentMode.minutes * 60);
  };

  const switchMode = (modeObj) => {
    setIsRunning(false);
    setCurrentMode(modeObj);
    setTimeLeft(modeObj.minutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const percentage = 100 - ((timeLeft / (currentMode.minutes * 60)) * 100);

  const ModeIcon = currentMode.icon;

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] w-full max-w-md mx-auto relative animate-in zoom-in-95 duration-500">
      <div className="flex bg-secondary p-1.5 rounded-full mb-10 shadow-inner">
        <button 
          onClick={() => switchMode(MODES.FOCUS)}
          className={cn(
            "px-8 py-2.5 rounded-full text-sm font-bold transition-all",
            currentMode.mode === 'focus' ? "bg-card shadow-sm text-foreground scale-105" : "text-foreground/50 hover:text-foreground/80"
          )}
        >
          Study
        </button>
        <button 
          onClick={() => switchMode(MODES.BREAK)}
          className={cn(
            "px-8 py-2.5 rounded-full text-sm font-bold transition-all",
            currentMode.mode === 'break' ? "bg-card shadow-sm text-foreground scale-105" : "text-foreground/50 hover:text-foreground/80"
          )}
        >
          Break
        </button>
      </div>

      <div className="relative flex items-center justify-center mb-12 w-72 h-72">
        {/* Progress Circle Base */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="46" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-secondary"
          />
          {/* Progress Indictor */}
          <circle 
            cx="50" cy="50" r="46" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="5" 
            strokeLinecap="round"
            className={cn("transition-all duration-1000 ease-linear", currentMode.color, "drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]")}
            strokeDasharray={`${2 * Math.PI * 46}`}
            strokeDashoffset={`${2 * Math.PI * 46 * (1 - percentage / 100)}`}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <ModeIcon className={cn("w-8 h-8 mb-3 opacity-80", currentMode.color)} />
          <span className="text-6xl font-black tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {minutes}:{seconds}
          </span>
          <span className="text-sm font-bold text-foreground/40 mt-2 uppercase tracking-widest">
            {currentMode.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button 
          onClick={resetTimer}
          className="p-4 bg-secondary text-foreground/70 rounded-full hover:bg-secondary/80 transition-all hover:text-foreground active:rotate-180 duration-500"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        
        <button 
          onClick={toggleTimer}
          className={cn(
            "p-6 rounded-full shadow-xl transition-all active:scale-95 text-white",
            isRunning ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" : "bg-primary hover:bg-primary/90 shadow-primary/30"
          )}
        >
          {isRunning ? (
            <Pause className="w-10 h-10 fill-current" />
          ) : (
            <Play className="w-10 h-10 fill-current translate-x-1" />
          )}
        </button>
      </div>
    </div>
  );
}
