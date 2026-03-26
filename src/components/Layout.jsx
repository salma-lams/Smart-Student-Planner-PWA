import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative pb-[76px] transition-colors duration-300">
      <Header />
      <main className="flex-1 w-full max-w-md mx-auto p-4 animate-in fade-in zoom-in-95 duration-300">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
