import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { startOfDay, subDays, format, isSameDay, parseISO } from 'date-fns';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]); // Array of { id, duration, completedAt, taskId? }
  const [loading, setLoading] = useState(true);

  // Initialize from storage
  useEffect(() => {
    async function loadData() {
      try {
        const [storedTasks, storedSessions] = await Promise.all([
          localforage.getItem('student-planner-tasks'),
          localforage.getItem('student-planner-sessions')
        ]);
        if (storedTasks) setTasks(storedTasks);
        if (storedSessions) setSessions(storedSessions);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save to storage on update
  useEffect(() => {
    if (!loading) {
      localforage.setItem('student-planner-tasks', tasks).catch(console.error);
      localforage.setItem('student-planner-sessions', sessions).catch(console.error);
    }
  }, [tasks, sessions, loading]);

  const addTask = (taskData) => {
    const newTask = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      priority: 'medium', // low, medium, high
      ...taskData,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isCompleting = t.status !== 'completed';
        return { 
          ...t, 
          status: isCompleting ? 'completed' : 'pending',
          completedAt: isCompleting ? new Date().toISOString() : null
        };
      }
      return t;
    }));
  };

  const addSession = (sessionData) => {
    const newSession = {
      id: uuidv4(),
      completedAt: new Date().toISOString(),
      ...sessionData // duration in minutes, taskId (optional)
    };
    setSessions(prev => [...prev, newSession]);
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    // Calculate streak (consecutive days with at least one completed task)
    // Simplified: check if tasks were completed today, yesterday, etc.
    let streak = 0;
    const today = startOfDay(new Date());
    
    const completedDates = tasks
      .filter(t => t.status === 'completed' && t.completedAt)
      .map(t => startOfDay(parseISO(t.completedAt)).getTime());
    
    const uniqueDates = Array.from(new Set(completedDates)).sort((a,b) => b - a);
    
    let checkDate = today;
    if (uniqueDates.includes(checkDate.getTime())) {
      streak = 1;
      let i = 1;
      while (uniqueDates.includes(subDays(checkDate, i).getTime())) {
        streak++;
        i++;
      }
    } else if (uniqueDates.includes(subDays(today, 1).getTime())) {
      // If none today, but yes yesterday, streak is still alive
      streak = 1;
      let i = 2;
      while (uniqueDates.includes(subDays(today, i).getTime())) {
        streak++;
        i++;
      }
    }

    return { total, completed, progress, streak };
  };

  const getWeeklyCompletionStats = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayLabel = format(date, 'EEE');
      const count = tasks.filter(t => 
        t.status === 'completed' && 
        t.completedAt && 
        isSameDay(parseISO(t.completedAt), date)
      ).length;
      return { dayLabel, count, date };
    });
    return last7Days;
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      sessions,
      loading,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      addSession,
      getStats,
      getWeeklyCompletionStats
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
