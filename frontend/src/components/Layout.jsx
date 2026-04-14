import { useState } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] w-full overflow-x-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className="flex-1 flex flex-col relative transition-all duration-300 ease-in-out"
        style={{ marginLeft: collapsed ? '72px' : '256px' }}
      >
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
