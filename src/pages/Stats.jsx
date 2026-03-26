import { useTasks } from '../context/TaskContext';
import { TrendingUp, Clock, Target, Calendar, ChevronLeft, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Stats() {
  const { getStats, getWeeklyCompletionStats, sessions } = useTasks();
  const stats = getStats();
  const weeklyData = getWeeklyCompletionStats();

  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const maxCount = Math.max(...weeklyData.map(d => d.count), 1);

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto pb-6 animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Study Insights</h2>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
          <Clock className="w-5 h-5 text-primary mb-3" />
          <p className="text-2xl font-black">{totalHours}h</p>
          <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Total Focused</p>
        </div>
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
          <Target className="w-5 h-5 text-green-500 mb-3" />
          <p className="text-2xl font-black">{stats.completed}</p>
          <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Completed</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-sm">Task Completion</h3>
          <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Last 7 Days</span>
        </div>
        
        <div className="flex items-end justify-between h-32 gap-2">
          {weeklyData.map((day, i) => {
            const height = (day.count / maxCount) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div className="relative w-full flex flex-col items-center justify-end h-full">
                  {day.count > 0 && (
                    <span className="absolute -top-6 text-[10px] font-bold text-primary animate-in fade-in slide-in-from-bottom-2">
                      {day.count}
                    </span>
                  )}
                  <div 
                    className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-all duration-1000 ease-out"
                    style={{ height: `${height}%` }}
                  >
                    <div 
                      className="w-full bg-primary rounded-t-lg transition-all"
                      style={{ height: day.count > 0 ? '100%' : '0%' }}
                    ></div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-foreground/40 uppercase">{day.dayLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-20">
            <Award className="w-32 h-32 rotate-12" />
         </div>
         <div className="relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-80">Current Goal Progress</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="white" 
                    strokeWidth="10" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 * (1 - stats.progress / 100)} 
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-lg">
                  {stats.progress}%
                </div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm mb-1">Consistency King</p>
                <p className="text-[10px] opacity-70 leading-relaxed">
                  You've maintained a {stats.streak} day streak! Keep going to reach your weekly targets.
                </p>
              </div>
            </div>
         </div>
      </div>

      <Link to="/" className="w-full py-4 rounded-2xl bg-secondary text-foreground/60 text-center text-sm font-bold hover:bg-secondary/80 transition-all active:scale-95">
        Back to Dashboard
      </Link>
    </div>
  );
}
