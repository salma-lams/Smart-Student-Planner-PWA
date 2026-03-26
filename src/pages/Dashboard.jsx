import { useTasks } from '../context/TaskContext';
import { CheckCircle2, ListTodo, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { tasks, getStats, toggleTaskStatus } = useTasks();
  const stats = getStats();

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  pendingTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
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
      <div className="bg-primary/10 rounded-3xl p-6 text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-primary/20 w-24 h-24 rounded-full blur-2xl"></div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back! 👋</h2>
        <p className="text-foreground/70 text-sm">
          {stats.pending > 0 ? `You have ${stats.pending} tasks scheduled.` : "All caught up! Time to relax."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm transition-transform hover:scale-105">
          <div className="bg-primary/20 p-3 rounded-full mb-3 text-primary">
            <ListTodo className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-[10px] text-foreground/60 font-bold uppercase tracking-wider mt-1">Total Tasks</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm transition-transform hover:scale-105">
          <div className="bg-green-500/20 p-3 rounded-full mb-3 text-green-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">{stats.completed}</p>
          <p className="text-[10px] text-foreground/60 font-bold uppercase tracking-wider mt-1">Completed</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-primary" /> 
            Progress
          </h3>
          <span className="text-sm font-bold text-primary">{stats.progress}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${stats.progress}%` }}
          ></div>
        </div>
      </div>

      {nextTask ? (
        <div className="bg-gradient-to-br from-indigo-500 to-primary text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-50">
            <BookOpen className="w-24 h-24 transform rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 opacity-90 pb-3 border-b border-white/20">
              <AlertCircle className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Suggested Next Task</h3>
            </div>
            <h4 className="text-2xl font-bold mb-1">{nextTask.title}</h4>
            <p className="text-sm opacity-80 mb-6 flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{nextTask.subject}</span>
              <span>Due: {formatDeadline(nextTask.deadline)}</span>
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => toggleTaskStatus(nextTask.id)}
                className="flex-1 bg-white text-primary hover:bg-white/90 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-sm shadow-md"
              >
                Complete
              </button>
              <Link 
                to="/timer"
                className="flex-1 bg-black/20 hover:bg-black/30 backdrop-blur-sm border border-white/20 py-2.5 rounded-xl font-bold text-center transition-all active:scale-95 text-sm"
              >
                Focus Now
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border border-dashed rounded-3xl p-8 text-center text-foreground/50">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No pending tasks. You're all caught up!</p>
          <Link to="/tasks" className="text-primary font-medium text-sm mt-3 inline-block hover:underline">
            Add a new task
          </Link>
        </div>
      )}
    </div>
  );
}
