import { createContext, useContext, useEffect, useState } from 'react';

const UIContext = createContext(undefined);

export const UIProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const toggleSidebarCollapsed = () => setIsSidebarCollapsed((s) => !s);

  useEffect(() => {
    // Prevent body scroll when sidebar (mobile) is open
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <UIContext.Provider value={{ isSidebarOpen, isSidebarCollapsed, openSidebar, closeSidebar, toggleSidebar, toggleSidebarCollapsed }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
};
