"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { logout } from '@/utils/api';
import LogoutButton from '@/components/LogoutButton';

import {
  Home,
  Calendar,
  Users,
  FileText,
  Settings,
  FlaskConical,
  Clipboard,
  Menu,
  LogOut,
  Activity,
  ChevronLeft,
  ChevronRight,
  Building,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, text: "Dashboard", href: "/home/dashboard" },
  { icon: Users, text: "Patients", href: "/home/patients" },
  { icon: Calendar, text: "Appointments", href: "/home/appointments" },
  { icon: Clipboard, text: "Medical Records", href: "/home/records" },
  { icon: Activity, text: "Vitals Monitoring", href: "/home/vitals" },
  {
    icon: FlaskConical,
    text: "Laboratory Setup",
    href: "/home/laboratory",
  },
  { icon: FileText, text: "Reports", href: "/home/reports" },
  { icon: Settings, text: "Administration", href: "/home/administration" },
  { icon: Building, text: "Staff Management", href: "/home/hr" },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const router = useRouter();

  // const handleLogout = () => {
  //   if (window.confirm("Are you sure you want to log out?")) {
  //     logout();
  //     router.push("/auth/login");
  //   }
  // };

  return (
    <div
      className={`
        ${isCollapsed ? "w-20" : "w-56"} 
        ${isMobile ? "absolute" : "relative"} 
        h-screen bg-white text-gray-700 flex flex-col shadow-lg 
        transition-all duration-300 ease-in-out
      `}
    >
      <Link
        href="/dashboard"
        className="bg-blue-600 hover:bg-blue-700 flex items-center py-4 px-4 transition-colors"
      >
        <Activity className="w-8 h-8 text-white" />
        {!isCollapsed && (
          <span className="text-xl font-bold text-white ml-2">MediCare</span>
        )}
      </Link>
      <nav className="flex-grow overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = isLinkActive(item.href);
          return (
            <Link
              key={index}
              href={item.href}
              className={`
                flex items-center px-4 py-3 transition-colors
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }
                ${isCollapsed ? "justify-center" : ""}
              `}
              title={item.text}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`} />
              {!isCollapsed && <span className="font-medium">{item.text}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-200">
        <a
          href="#"
          className={`flex items-center px-4 py-3 w-full text-left hover:bg-blue-50 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
         
        >
          <Menu
            className={`w-5 h-5 text-gray-600 ${isCollapsed ? "" : "mr-3"}`}
          />
          {!isCollapsed && <span className="font-medium">Menu</span>}
        </a>
        <LogoutButton isCollapsed={isCollapsed} />
      </div>
      {!isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 bg-white p-1 rounded-full shadow-md"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      )}
    </div>
  );
}