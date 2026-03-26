import { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { CheckCircle2, ListTodo, TrendingUp, AlertCircle, BookOpen, Flame, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { format, isToday, isTomorrow, parseISO, startOfToday, addDays, isSameDay } from 'date-fns';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { getSubjectIcon } from '../lib/constants';

export default function Dashboard() {
  const { tasks, getStats, toggleTaskStatus } = useTasks();
  const stats = getStats();
  const [selectedDate, setSelectedDate] = useState(startOfToday());

  // Generate 14 days for the scroller
  const weekDays = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => isSameDay(parseISO(t.deadline), selectedDate));
  }, [tasks, selectedDate]);

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  pendingTasks.sort((a, b) => {
    // Priority weight: high=0, medium=1, low=2
    const priorityWeight = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return (priorityWeight[a.priority] ?? 1) - (priorityWeight[b.priority] ?? 1);
    }
    return new Date(a.deadline) - new Date(b.deadline);
  });
  const nextTask = pendingTasks[0];

  const formatDeadline = (dateString) => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      if (isToday(date)) return 'Today';
      if (isTomorrow(date)) return 'Tomorrow';
      return format(date, 'MMM d');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto pb-6">
      {/* Hero / Greeting */}
      <div className="bg-primary/10 rounded-3xl p-6 shadow-sm relative overflow-hidden flex justify-between items-center group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-primary/20 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Hi, Student! 👋</h2>
          <p className="text-foreground/70 text-sm">
            Ready to crush your goals?
          </p>
        </div>
        <div className="bg-card px-4 py-2 rounded-2xl border border-border flex items-center gap-2 shadow-sm animate-bounce-slow">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          <span className="font-bold text-lg">{stats.streak}</span>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm transition-transform hover:scale-105">
          <div className="bg-primary/10 p-3 rounded-full mb-3 text-primary">
            <ListTodo className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-[10px] text-foreground/60 font-bold uppercase tracking-wider mt-1">Total</p>
        </div>
        <Link to="/stats" className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm transition-transform hover:scale-105">
          <div className="bg-green-500/10 p-3 rounded-full mb-3 text-green-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">{stats.progress}%</p>
          <p className="text-[10px] text-foreground/60 font-bold uppercase tracking-wider mt-1">Consistency</p>
        </Link>
      </div>

      {/* Date Scroller */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-sm flex items-center gap-2 text-foreground/80">
            <CalendarIcon className="w-4 h-4 text-primary" />
            Schedule
          </h3>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE')}
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x mask-fade-right">
          {weekDays.map((date) => {
            const active = isSameDay(date, selectedDate);
            return (
              <button
                key={date.toString()}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center transition-all snap-center",
                  active 
                    ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105" 
                    : "bg-card border border-border text-foreground/40 hover:bg-secondary"
                )}
              >
                <span className="text-[10px] font-bold uppercase opacity-60 mb-1">{format(date, 'EEE')}</span>
                <span className="text-lg font-black">{format(date, 'd')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task List for Selected Date */}
      <div className="flex flex-col gap-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const Icon = getSubjectIcon(task.subject);
            return (
              <div 
                key={task.id}
                className={cn(
                  "bg-card border border-border rounded-2xl p-4 flex items-center gap-4 transition-all shadow-sm",
                  task.status === 'completed' && "opacity-50"
                )}
              >
                <div className="bg-secondary p-2 rounded-xl text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={cn("font-bold text-sm truncate", task.status === 'completed' && "line-through")}>
                    {task.title}
                  </h4>
                  <p className="text-[10px] font-semibold text-foreground/50">{task.subject}</p>
                </div>
                <button 
                  onClick={() => toggleTaskStatus(task.id)}
                  className={cn(
                    "p-2 rounded-full transition-all",
                    task.status === 'completed' ? "text-green-500 bg-green-500/10" : "text-foreground/20 bg-secondary"
                  )}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="bg-secondary/30 rounded-3xl p-8 border border-dashed border-border text-center text-foreground/40">
            <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm font-medium">Nothing scheduled for this day</p>
          </div>
        )}
      </div>

      {/* Smart Suggestion - Fixed at Bottom of scroll if present */}
      {nextTask && (
        <div className="bg-gradient-to-br from-indigo-500 to-primary text-white rounded-3xl p-6 shadow-xl relative overflow-hidden mt-2">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BookOpen className="w-24 h-24 transform rotate-12" />
          </div>
          <div className="relative z-10 text-center">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-80">Up Next</h3>
            <h4 className="text-xl font-bold mb-4">{nextTask.title}</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => toggleTaskStatus(nextTask.id)}
                className="flex-1 bg-white text-primary py-2.5 rounded-xl font-bold text-xs transition-transform active:scale-95"
              >
                Done
              </button>
              <Link 
                to="/timer"
                className="flex-1 bg-black/20 backdrop-blur-sm border border-white/20 py-2.5 rounded-xl font-bold text-xs active:scale-95 text-center"
              >
                Focus
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
