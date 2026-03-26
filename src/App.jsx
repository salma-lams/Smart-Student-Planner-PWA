import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Timer from './pages/Timer';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="timer" element={<Timer />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </TaskProvider>
    </ThemeProvider>
  );
}
