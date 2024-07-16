"use client"
import React, { useState, useEffect, ReactNode } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import LoginModal from "@/components/LoginModal";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      setIsSidebarVisible(!newIsMobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Add event listener for login modal
    const handleShowLoginModal = () => setShowLoginModal(true);
    window.addEventListener('showLoginModal', handleShowLoginModal);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('showLoginModal', handleShowLoginModal);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {isSidebarVisible && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      )}
      <div className={`flex flex-col flex-1 ${!isMobile && (isSidebarCollapsed ? 'ml-58' : 'ml-58')} transition-all duration-300`}>
        {isMobile && (
          <header className="bg-white shadow-sm p-4 flex items-center">
            <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} className="p-2">
              <Menu size={24} />
            </button>
          </header>
        )}
        <main className="flex-1 overflow-y-auto bg-slate-100">
          {children}
        </main>
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}