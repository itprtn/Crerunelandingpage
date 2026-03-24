import React from "react";
import { useNavigate, useLocation } from "react-router";
import { supabase } from "../utils/supabase";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  Settings,
  Zap,
  LogOut,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    label: "Leads",
    icon: Users,
    path: "/admin/leads",
  },
  {
    label: "Parametres",
    icon: Settings,
    path: "/admin/settings",
  },
  {
    label: "Automatisation",
    icon: Zap,
    path: "/admin/automation",
  },
];

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Deconnexion reussie");
    navigate("/signin");
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <img
            src="https://ucarecdn.com/8796d3aa-4089-4859-87df-1772ce670f61/-/format/auto/"
            alt="Premunia Logo"
            className="h-8 w-auto"
          />
          <p className="text-xs text-slate-400 mt-2">Administration</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active
                        ? "bg-gradient-to-r from-[#EE3B33] to-[#F79E1B] text-white shadow-lg shadow-red-500/20"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                    {active && <ChevronRight size={16} className="ml-auto" />}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="my-6 border-t border-slate-100" />

          {/* External Link */}
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <ExternalLink size={20} />
            <span className="font-medium">Voir le site</span>
          </button>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Deconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
