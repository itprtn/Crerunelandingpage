import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../utils/supabase";
import {
  Users,
  Mail,
  TrendingUp,
  FileText,
  Settings,
  Zap,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router";
import AdminLayout from "../../components/AdminLayout";

export default function Admin() {
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/signin");
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch leads directly from Supabase
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("[v0] Error fetching leads:", error);
        throw error;
      }
      return data || [];
    },
  });

  const newLeads = leads.filter((l: any) => l.status === "new").length;
  const contactedLeads = leads.filter((l: any) => l.status === "contacted").length;
  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 ? Math.round((contactedLeads / totalLeads) * 100) : 0;

  // Get leads from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentLeads = leads.filter((l: any) => new Date(l.created_at) > sevenDaysAgo).length;

  return (
    <AdminLayout title="Dashboard" subtitle="Vue d'ensemble de votre activite">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center">
              <Users className="text-[#F79E1B]" size={24} />
            </div>
            <span className="text-3xl font-bold text-slate-900">{totalLeads}</span>
          </div>
          <h3 className="text-slate-600 font-medium">Total Leads</h3>
          <p className="text-xs text-slate-400 mt-1">Tous les prospects</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center">
              <Mail className="text-[#EE3B33]" size={24} />
            </div>
            <span className="text-3xl font-bold text-slate-900">{newLeads}</span>
          </div>
          <h3 className="text-slate-600 font-medium">Nouveaux</h3>
          <p className="text-xs text-slate-400 mt-1">A contacter</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-slate-900">{conversionRate}%</span>
          </div>
          <h3 className="text-slate-600 font-medium">Taux de contact</h3>
          <p className="text-xs text-slate-400 mt-1">Leads contactes</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-slate-900">{recentLeads}</span>
          </div>
          <h3 className="text-slate-600 font-medium">Cette semaine</h3>
          <p className="text-xs text-slate-400 mt-1">7 derniers jours</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => navigate("/admin/leads")}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-orange-200 transition-all group text-left"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <FileText className="text-white" size={28} />
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-orange-500 transition-colors" size={24} />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">Gerer les Leads</h3>
          <p className="text-sm text-slate-500">
            Voir, editer et suivre tous vos prospects
          </p>
          {newLeads > 0 && (
            <span className="inline-block mt-3 px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
              {newLeads} nouveau{newLeads > 1 ? "x" : ""}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate("/admin/settings")}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-red-200 transition-all group text-left"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#EE3B33] to-[#880E4F] rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <Settings className="text-white" size={28} />
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-red-500 transition-colors" size={24} />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">Parametres</h3>
          <p className="text-sm text-slate-500">
            Configurer le site et les informations
          </p>
        </button>

        <button
          onClick={() => navigate("/admin/automation")}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-purple-200 transition-all group text-left"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap className="text-white" size={28} />
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-purple-500 transition-colors" size={24} />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">Automatisation</h3>
          <p className="text-sm text-slate-500">
            Emails et workflows automatiques
          </p>
        </button>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Derniers leads</h2>
            <p className="text-sm text-slate-500 mt-1">Les 5 derniers prospects recus</p>
          </div>
          <button
            onClick={() => navigate("/admin/leads")}
            className="text-sm font-semibold text-[#EE3B33] hover:underline flex items-center gap-1"
          >
            Voir tout
            <ArrowUpRight size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-slate-200 border-t-[#EE3B33] rounded-full mx-auto"></div>
            <p className="text-slate-400 mt-4">Chargement...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">Aucun lead pour le moment</p>
            <p className="text-slate-400 text-sm mt-1">Les nouveaux prospects apparaitront ici</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Nom</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Profession</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Statut</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map((lead: any) => (
                  <tr
                    key={lead.id}
                    className="border-t border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate("/admin/leads")}
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">
                        {lead.first_name} {lead.last_name}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{lead.email}</td>
                    <td className="py-4 px-6 text-slate-600">{lead.profession}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          lead.status === "new"
                            ? "bg-orange-100 text-orange-600"
                            : lead.status === "contacted"
                            ? "bg-blue-100 text-blue-600"
                            : lead.status === "converted"
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {lead.status === "new"
                          ? "Nouveau"
                          : lead.status === "contacted"
                          ? "Contacte"
                          : lead.status === "converted"
                          ? "Converti"
                          : lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-sm">
                      {new Date(lead.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
