import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Plus, Trash2, Edit2, CheckCircle2, Circle, Calendar, Tag, X, ListTodo, AlertTriangle, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../lib/utils';
import { getSubjectIcon, PRIORITY_COLORS } from '../lib/constants';

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setSubject(task.subject);
      setDeadline(task.deadline);
      setPriority(task.priority || 'medium');
    } else {
      setEditingTask(null);
      setTitle('');
      setSubject('');
      setDeadline(new Date().toISOString().split('T')[0]); // today as default
      setPriority('medium');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !deadline) return;

    if (editingTask) {
      updateTask(editingTask.id, { title, subject, deadline, priority });
    } else {
      addTask({ title, subject, deadline, priority });
    }
    closeModal();
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1;
    }
    return new Date(a.deadline) - new Date(b.deadline);
  });

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto pb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground p-2.5 rounded-xl shadow-md transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-foreground/50 h-64 border-2 border-dashed border-border rounded-3xl p-6 mt-4">
          <div className="bg-secondary p-4 rounded-full mb-4">
            <ListTodo className="w-8 h-8 opacity-50" />
          </div>
          <p className="font-medium text-lg text-foreground/80">No tasks yet</p>
          <p className="text-sm mt-1">Click the + button to add one</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sortedTasks.map(task => (
            <div 
              key={task.id} 
              className={cn(
                "bg-card border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3 transition-opacity duration-300",
                task.status === 'completed' && "opacity-60"
              )}
            >
              <button 
                onClick={() => toggleTaskStatus(task.id)}
                className="mt-1 flex-shrink-0 text-primary transition-transform active:scale-75"
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-foreground/30 hover:text-primary transition-colors" />
                )}
              </button>
              
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={cn(
                    "font-bold text-foreground truncate text-sm sm:text-base transition-colors",
                    task.status === 'completed' && "line-through text-foreground/60"
                  )}>
                    {task.title}
                  </h3>
                  {task.priority === 'high' && (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-foreground/70 font-semibold">
                  <span className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">
                    {(() => {
                      const Icon = getSubjectIcon(task.subject);
                      return <Icon className="w-3 h-3" />;
                    })()}
                    {task.subject}
                  </span>
                  <span className={cn(
                    "flex items-center gap-1",
                    task.status === 'pending' && new Date(task.deadline) < new Date(new Date().setHours(0,0,0,0)) && "text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md"
                  )}>
                    <Calendar className="w-3 h-3" />
                    {task.deadline ? format(parseISO(task.deadline), 'MMM d') : 'No date'}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-md border uppercase tracking-wider text-[9px] font-black",
                    PRIORITY_COLORS[task.priority || 'medium']
                  )}>
                    {task.priority || 'medium'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 items-end">
                <button 
                  onClick={() => openModal(task)}
                  className="p-2 text-foreground/40 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200 p-0 sm:p-4">
          <div className="bg-card w-full sm:w-96 rounded-t-3xl sm:rounded-3xl border-t sm:border border-border shadow-2xl p-6 animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold">{editingTask ? 'Edit Task' : 'New Task'}</h3>
              <button 
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-secondary text-foreground/60 transition-colors bg-secondary/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1.5 ml-1">Task Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Read chapter 4"
                  className="w-full bg-secondary text-foreground placeholder-foreground/30 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-shadow font-medium"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1.5 ml-1">Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g., History"
                  className="w-full bg-secondary text-foreground placeholder-foreground/30 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-shadow font-medium"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1.5 ml-1">Deadline</label>
                <input 
                  type="date" 
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full bg-secondary text-foreground border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-shadow font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1.5 ml-1">Priority</label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all",
                        priority === p 
                          ? PRIORITY_COLORS[p] + " border-current scale-105" 
                          : "bg-secondary text-foreground/40 border-transparent hover:bg-secondary/80"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-primary text-primary-foreground font-bold py-3.5 mt-2 rounded-xl shadow-md hover:bg-primary/90 transition-all active:scale-95 text-sm"
              >
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
